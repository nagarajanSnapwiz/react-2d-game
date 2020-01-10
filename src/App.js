import React, { forwardRef, useState, useRef, Fragment } from 'react'
import PropTypes from 'prop-types'

import * as PIXI from 'pixi.js';
import PhysicsWorld from './PhysicsWorld';
import PhysicsObject from './PhysicsObject';
import { useJoint } from './Joints/SimpleRevoluteJoint';
import useHotKeys from '@reecelucas/react-use-hotkeys';
import Sprite from './Pixi/Sprite';
import Application, { useAppTicker } from './Pixi/Application';
import wheel from './wheel.png';



function Bunny(props, ref) {
  return <PhysicsObject ref={ref} width={26} height={37} shape="box" {...props} />
}

function Wheel(props, ref) {
  return <PhysicsObject ref={ref} radius={20} shape="circle" url='/wheel.png' {...props} />
}

const WheelF = forwardRef(Wheel);

const BunnyF = forwardRef(Bunny);

const options = { backgroundColor: 0x1099bb, height: 400, width: 1000 };

const anchors1 = [{ x: 0, y: 0 }, { x: -42, y: 15 }];

const anchors2 = [{ x: 42, y: 15 }, { x: 0, y: 0 }];

function Car() {

  const [speed, setSpeed] = useState(0);
  useHotKeys('ArrowRight', () => {
    setSpeed(360 * 15 * (Math.PI / 180) * (-1));

  });

  useHotKeys('ArrowLeft', () => {
    setSpeed(360 * 15 * (Math.PI / 180));

  });

  const frontWheelRef = useRef();
  const backWheelRef = useRef();
  const bodyRef = useRef();

  const joint1Ref = useJoint({
    enableMotor: true,
    motorSpeed: speed,
    maxMotorTorque: 4,
    anchors: anchors1,
    ref1: frontWheelRef,
    ref2: bodyRef
  });

  const joint2Ref = useJoint({
    enableMotor: false,
    anchors: anchors2,
    ref1: bodyRef,
    ref2: backWheelRef
  })

  return (<Fragment>
    <WheelF ref={frontWheelRef} x={30} y={100} density={3} />
    <WheelF ref={backWheelRef} x={30} y={100} density={3} />
    <PhysicsObject density={1.5} ref={bodyRef} fromCanvas width={100} height={35} x={160} y={270} fill="violet" />
    <PhysicsObject fixed angle={-15} density={1.5} fromCanvas width={200} height={18} x={400} y={380} fill="green" />
    <PhysicsObject density={1.5} fromCanvas width={40} height={60} x={500} y={200} fill="green" />
    <button onClick={() => setSpeed(360 * 15 * (Math.PI / 180) * (-1))}>go</button>
    <button onClick={() => setSpeed(360 * 15 * (Math.PI / 180))}>Reverse</button>
    <button onClick={() => setSpeed(0)}>Stop</button>
  </Fragment>)
}

export default function Game() {

  return (
    <PhysicsWorld {...options} >
      {/* <RevoluteJoint> */}

      {/* </RevoluteJoint> */}


      <Car />
    </PhysicsWorld>
  );
}

