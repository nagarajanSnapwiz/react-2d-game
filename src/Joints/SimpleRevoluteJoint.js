
import React, { useRef, useEffect, Fragment, useContext } from 'react';
import { b2RevoluteJoint, b2RevoluteJointDef, b2Vec2, b2World } from '@flyover/box2d';
import PropTypes from 'prop-types';
import WorldContext from '../WorldContext';
import * as Utils from '../Utils';


export function useJoint({ anchors, collideConected, enableLimit, motorSpeed = 0, maxMotorTorque = 0, ref1, ref2, enableMotor }) {
    /**
     * @type {b2World & {scaleFactor:number}}
     */
    const world = useContext(WorldContext);
    const { scaleFactor: SCALE } = world;
    const jointRef = useRef();


    useEffect(() => {
        const jointDef = new b2RevoluteJointDef();
        jointDef.bodyA = ref1.current.body.current;
        jointDef.bodyB = ref2.current.body.current;
        const { x: x1, y: y1 } = anchors[0];
        const { x: x2, y: y2 } = anchors[1];
        //get world and scaleFactor
        //@ts-ignore
        jointDef.localAnchorA = new b2Vec2(Utils.fromCanvasToPhysics(x1, SCALE), Utils.fromCanvasToPhysics(y1, SCALE));
        //@ts-ignore
        jointDef.localAnchorB = new b2Vec2(Utils.fromCanvasToPhysics(x2, SCALE), Utils.fromCanvasToPhysics(y2, SCALE));
        jointDef.collideConnected = collideConected;
        const joint = world.CreateJoint(jointDef);
        //@ts-ignore
        jointRef.current = joint;
        return () => {
            world.DestroyJoint(joint);
        }

    }, [anchors, ref1.current, ref2.current]);

    useEffect(() => {
        /**
         * @type {b2RevoluteJoint}
         */
        const joint = jointRef.current;
        joint.EnableLimit(enableLimit);
        joint.EnableMotor(enableMotor);
        joint.SetMotorSpeed(motorSpeed);
        if (maxMotorTorque) {
            joint.SetMaxMotorTorque(maxMotorTorque);
        }
    }, [enableLimit, enableMotor, motorSpeed, maxMotorTorque]);
    return jointRef;
}

export default function RevoluteJoint({ children, ...props }) {
    const ref1 = useRef();
    const ref2 = useRef();
    //@ts-ignore
    useJoint({ ...props, ref1, ref2 })
    return (<Fragment>
        {React.cloneElement(children[0], { ref: ref1 })}
        {React.cloneElement(children[1], { ref: ref2 })}
    </Fragment>)
}
