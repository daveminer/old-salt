import { forwardRef, useEffect, useLayoutEffect, useRef, type ForwardedRef } from 'react';
import Phaser from 'phaser';

//const EventBus = new Phaser.Events.EventEmitter();

const getGameConfig = (parent: string) => {
    const container = document.getElementById(parent);
    const width = container ? container.clientWidth : window.innerWidth;
    const height = container ? container.clientHeight : window.innerHeight;
    
    return {
        type: Phaser.AUTO,
        width,
        height,
        parent,
        backgroundColor: '#028af8',
        scene: [],
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    };
};

const StartGame = (parent: any) => {
    return new Phaser.Game(getGameConfig(parent));
}

export const PhaserGame = forwardRef(function PhaserGame ({ currentActiveScene }: { currentActiveScene: any }, ref: ForwardedRef<any>)
{
    const game = useRef<Phaser.Game | null>(null);

    // Create the game inside a useLayoutEffect hook to avoid the game being created outside the DOM
    useLayoutEffect(() => {    
        if (game.current === null) {
            game.current = StartGame("game-container");    
            if (ref && typeof ref === 'object' && ref.current !== undefined)
            {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = null;
            }
        }
    }, [ref]);

    return (
        <div id="game-container"></div>
    );
});