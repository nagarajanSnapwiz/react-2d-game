import React, { useRef, useEffect, Fragment } from 'react';
import { b2RevoluteJoint, b2RevoluteJointDef } from '@flyover/box2d';
import PropTypes from 'prop-types';


export default function RevoluteJoint({ children, anchors, collideConected = false, enableLimit = false, enableMotor = false, motorSpeed = 0, maxMotorTorque = 0 }) {
    const ref1 = useRef();
    const ref2 = useRef();

    useEffect(() => {
        const jointDef = new b2RevoluteJointDef();
        jointDef.bodyA = ref1.current.body.current;
        jointDef.bodyB = ref2.current.body.current;
        const { x: x1, y: y1 } = anchors[0];
        const { x: x2, y: y2 } = anchors[1];
        //get world and scaleFactor
        jointDef.localAnchorA = 

    }, [anchors, ref1.current, ref2.current]);

    return (<Fragment>
        {React.cloneElement(children[0], { ref: ref1 })}
        {React.cloneElement(children[0], { ref: ref2 })}
    </Fragment>)
}
