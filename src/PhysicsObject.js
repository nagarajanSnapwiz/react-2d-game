//@ts-check
import React, { useEffect, useImperativeHandle, useRef, useContext, forwardRef } from 'react';
//@ts-ignore
import { b2World, b2Vec2, b2BodyDef, b2FixtureDef, b2Body, b2PolygonShape, b2CircleShape, b2BodyType } from "@flyover/box2d";
import * as Utils from './Utils';
import * as PIXI from 'pixi.js';
import worldContext from './WorldContext';



export function usePhysicsObject({ fixed = false, restitution = 0.1, friction = 0.5, density = 1, shape = 'box', category = null, data, width, height, x, y, initialForce, initialImpulse, bullet, radius }) {

    const world = useContext(worldContext);
    const SCALE = world.scaleFactor;
    const physObjectRef = useRef();
    const hostRef = useRef()
    useEffect(() => {
        const bodyDef = new b2BodyDef;
        bodyDef.type = (fixed) ? b2BodyType.b2_staticBody : b2BodyType.b2_dynamicBody;
        const fixDef = new b2FixtureDef;
        fixDef.shape = new b2PolygonShape;
        Object.assign(fixDef, { density, friction, restitution });
        bodyDef.position.x = Utils.fromCanvasToPhysics(x, SCALE);
        bodyDef.position.y = Utils.fromCanvasToPhysics(y, SCALE);
        const body = world.CreateBody(bodyDef);
        if (shape === "box") {
            fixDef.shape = new b2PolygonShape;
            //@ts-ignore
            fixDef.shape.SetAsBox(Utils.fromCanvasToPhysics(width / 2, SCALE), Utils.fromCanvasToPhysics(height / 2, SCALE));
            body.CreateFixture(fixDef);
        } else if (shape === "circle") {
            fixDef.shape = new b2CircleShape(Utils.fromCanvasToPhysics(radius, SCALE));
            body.CreateFixture(fixDef);
        } else {
            throw new Error(`Unknown shape ${shape}, only box and circle supported for now`);
        }
        const userData = { category, hostRef };
        if (data) {
            userData.data = data;
        }
        body.SetUserData(userData);
        if (bullet) {
            body.SetBullet(bullet);
        }
        if (initialForce) {
            body.ApplyForce(new b2Vec2(initialForce.x, initialForce.y), body.GetWorldCenter());
        }
        if (initialImpulse) {
            body.ApplyLinearImpulse(new b2Vec2(initialImpulse.x, initialImpulse.y), body.GetWorldCenter());

        }

        physObjectRef.current = body;

        return () => {
            let userData = body.GetUserData();
            userData.removed = true;
            body.SetUserData(userData);
            body.SetAwake(true);
        }
    }, []);


    useEffect(() => {
        if (fixed && physObjectRef.current) {
            //@ts-ignore
            physObjectRef.current.SetPositionXY(Utils.fromCanvasToPhysics(x, SCALE), Utils.fromCanvasToPhysics(y, SCALE));
        }
    }, [x, y]);

    return { physObjectRef, hostRef };
}

function createTextureFromCanvas({ width, height, shape, radius, quality = 500, fill = "grey", stroke = "lime", strokeWidth = 0 }) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    console.log('canvinhjjh props', { fill, shape });
    ctx.fillStyle = fill;


    if (shape === "box") {
        const ratio = width / height;//1.5
        canvas.width = ratio * quality;
        canvas.height = quality;
        ctx.fillStyle = fill;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

    } else if (shape === "circle") {
        canvas.width = quality * 2;
        canvas.height = quality * 2;
        ctx.beginPath();
        ctx.arc(quality, quality, quality, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = 'red';
        ctx.fill();



    } else {
        throw new Error(`Unknow Shape ${shape}`);
    }

    console.log('canvas', canvas);

    return PIXI.Texture.from(canvas);

}


function PhysicsObject({ url, texture, fromCanvas = false, ...props }, ref) {

    const world = useContext(worldContext);
    //@ts-ignore
    const { physObjectRef, hostRef } = usePhysicsObject(props);

    useImperativeHandle(ref, () => ({
        body: physObjectRef,
        applyForce: ({ x, y }) => {
            const body = physObjectRef.current;
            body.ApplyForce(new b2Vec2(x, y), body.GetWorldCenter());
        },
        applyImpulse: ({ x, y }) => {
            const body = physObjectRef.current;
            body.ApplyLinearImpulse(new b2Vec2(x, y), body.GetWorldCenter());
        }
    }));

    useEffect(() => {
        let image;
        if (url) {
            image = PIXI.Sprite.from(url);
        } else if (fromCanvas) {
            //@ts-ignore

            image = PIXI.Sprite.from(createTextureFromCanvas(props));
        } else if (texture) {
            image = PIXI.Sprite.from(texture);
        }

        console.log('image', image);

        if (props.shape === "circle") {
            image.width = props.radius * 2;
            image.height = props.radius * 2;
        } else {
            image.width = props.width;
            image.height = props.height;
        }

        image.anchor.set(0.5);
        //@ts-ignore
        hostRef.current = image;
        world.stage.addChild(image);

    }, []);

    return null;
}


export default forwardRef(PhysicsObject);