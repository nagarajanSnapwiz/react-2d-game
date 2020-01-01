import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

import * as PIXI from 'pixi.js';
import PhysicsWorld from './PhysicsWorld';
import PhysicsObject from './PhysicsObject';
import RevoluteJoint from './Joints/SimpleRevoluteJoint';
import Sprite from './Pixi/Sprite';
import Application, { useAppTicker } from './Pixi/Application';
import wheel from './wheel.png';




function Bunny(props, ref) {
  return <PhysicsObject ref={ref} width={26} height={37} shape="box" {...props} />
}

function Wheel(props) {
  return <PhysicsObject radius={40} shape="circle" url='/wheel.png' {...props} />
}


const BunnyF = forwardRef(Bunny);

const options = { backgroundColor: 0x1099bb, height: 450, width: 600 };


export default function Game() {

  return (
    <PhysicsWorld {...options}>
      <RevoluteJoint>
        <BunnyF fromCanvas fill="limegreen" x={200} y={200} />
        <BunnyF fromCanvas fill="limegreen" x={180} y={350} />
      </RevoluteJoint>
      <Wheel x={250} y={100} restitution={0.7} />
      <PhysicsObject fromCanvas density={3} shape="circle" radius={30} x={160} y={270} fill="red" restitution={0.8} />

    </PhysicsWorld>
  );
}

