import React, { useContext, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import WorldContext from '../WorldContext';

export default function Sprite({ url, x, y }) {

    const world = useContext(WorldContext);
    console.log('world', world, 'st====>', world.stage);





    useEffect(() => {
        const image = PIXI.Sprite.from(url);
        image.anchor.set(0.5);
        image.x = x;
        image.y = y;
        world.stage.addChild(image);

    }, [world.stage]);

    return null;
}