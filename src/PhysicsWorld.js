//@ts-check
import React, { useLayoutEffect, useImperativeHandle, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
//@ts-ignore
import { b2World, b2Vec2, b2BodyDef, b2FixtureDef, b2Body, b2PolygonShape, b2CircleShape, b2BodyType } from "@flyover/box2d";
import * as Utils from './Utils';
import * as PIXI from 'pixi.js';
import worldContext from './WorldContext';
const { Provider } = worldContext;


export function UsePhysicsWorld({ width, height, shape, gravity = { x: 0, y: 9.8 }, enclosed = true, enclosureThickness = 3, children, scaleFactor = 60, allowSleep = true, backgroundColor = 0x000, antialias = true, ...restProps }) {

    const renderer = useRef(new PIXI.Renderer({ width, height, backgroundColor, antialias }));
    const stage = useRef(new PIXI.Container());
    const domRef = useRef();

    const world = useRef(new b2World(new b2Vec2(gravity.x, gravity.y)));
    //@ts-ignore
    world.current.scaleFactor = scaleFactor;
    //@ts-ignore
    world.current.stage = stage.current;

    useLayoutEffect(() => {


        //@ts-ignore
        domRef.current.append(renderer.current.view);
        world.current.SetAllowSleeping(allowSleep);
        Utils.makeEnclosedBox(width, height, enclosureThickness, world.current, scaleFactor);

    }, []);




    Utils.useAnimationFrame(function (deltaTime) {
        world.current.Step(
            1 / 60,  //frame-rate (just hoping typical 60hz. in future, planning to use webworkers for uninterrupted physics simulation)
            10,       //velocity iterations
            10,       //position iterations
        );
        world.current.ClearForces();
        for (let b = world.current.m_bodyList; b; b = b.m_next) {
            if (!b.IsAwake()) {
                continue;
            }

            let userData = b.GetUserData();

            if (userData && userData.hostRef && userData.hostRef.current) {
                if (userData.removed) {
                    world.current.DestroyBody(b);
                } else {

                    let { x, y } = b.GetPosition();
                    let angle = b.GetAngle();

                    Object.assign(userData.hostRef.current, { x: Utils.fromPhysicsToCanvas(x, scaleFactor), y: Utils.fromPhysicsToCanvas(y, scaleFactor), rotation: angle });

                }
            }
        }


        renderer.current.render(stage.current);
    });

    return { world: world.current, domRef };

}


export default function PhysicsWorld({ children, ...props }) {

    //@ts-ignore
    const { world: worldRef, domRef } = UsePhysicsWorld(props);

    return (<Provider value={worldRef}>
        <div ref={domRef}>

        </div>
        {children}
    </Provider>);
}

export { worldContext };