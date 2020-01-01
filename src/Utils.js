//I hate writing utils file. Typically that means don't know how to group your utilities
//for now this will have to do
import { b2BodyDef, b2FixtureDef, b2Body, b2PolygonShape, b2BodyType } from "@flyover/box2d";
import React from 'react';

//some utilities to deal with co-ordinate systems variations with some sanity intact
//seems simple enough. But without these , I get very easily confused

//Box2d typically deals with meters(realworld) and not pixels(our canvas on screen) 
export function fromPhysicsToCanvas(n, SCALE) {
    return n * SCALE;
}

export function fromCanvasToPhysics(n, SCALE) {
    return n / SCALE;
}


//without this , beginners (and almost everybody) will go mad
//this creates a box fence of static bodies to prevent the objects falling out of the visible area and continuing to fall infinitely like Alice in rabbit hole
export function makeEnclosedBox(width, height, thickness, world, SCALE) {
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2BodyType.b2_staticBody;
    var fixDef = new b2FixtureDef;
    fixDef.shape = new b2PolygonShape;
    // half width, half height.
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0;

    //left 
    fixDef.shape.SetAsBox(fromCanvasToPhysics(thickness / 2, SCALE), fromCanvasToPhysics(height / 2, SCALE))
    bodyDef.position.x = fromCanvasToPhysics(thickness / 2, SCALE);
    bodyDef.position.y = fromCanvasToPhysics(height / 2, SCALE);
    let fixt = world.CreateBody(bodyDef).CreateFixture(fixDef);
    fixt.m_body.SetUserData({ category: '_LEFT_WALL_' });
    //bottom
    //half width,half height
    fixDef.shape.SetAsBox(fromCanvasToPhysics(width / 2, SCALE), fromCanvasToPhysics(thickness / 2, SCALE));
    bodyDef.position.x = fromCanvasToPhysics(width / 2, SCALE);
    bodyDef.position.y = fromCanvasToPhysics(height, SCALE);
    fixt = world.CreateBody(bodyDef).CreateFixture(fixDef);
    fixt.m_body.SetUserData({ category: '_BOTTOM_WALL_' });

    //top
    fixDef.shape.SetAsBox(fromCanvasToPhysics(width / 2, SCALE), fromCanvasToPhysics(thickness / 2, SCALE));
    bodyDef.position.x = fromCanvasToPhysics(width / 2, SCALE);
    bodyDef.position.y = fromCanvasToPhysics(thickness / 2, SCALE);
    fixt = world.CreateBody(bodyDef).CreateFixture(fixDef);
    fixt.m_body.SetUserData({ category: '_TOP_WALL_' });

    //right
    fixDef.shape.SetAsBox(fromCanvasToPhysics(thickness / 2, SCALE), fromCanvasToPhysics(height / 2, SCALE));
    bodyDef.position.x = fromCanvasToPhysics(width, SCALE);
    bodyDef.position.y = fromCanvasToPhysics(height / 2, SCALE);
    fixt = world.CreateBody(bodyDef).CreateFixture(fixDef);
    fixt.m_body.SetUserData({ category: '_RIGHT_WALL_' });

}

export function delay(millis) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), millis);
    });
}


//https://css-tricks.com/using-requestanimationframe-with-react-hooks
export function useAnimationFrame(callback) {
    const requestRef = React.useRef();
    const previousTimeRef = React.useRef();

    const animate = time => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current;
            callback(deltaTime)
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    }

    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []); // Make sure the effect runs only once
}
