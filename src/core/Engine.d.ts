import * as BABYLON from '@babylonjs/core';
import LevelManager from './LevelManager.ts';
export default class Engine {
    private _canvas;
    private _gameArea;
    private _babylonEngine;
    private _aspectRatio;
    private _gamepadManager;
    private _engineOptions;
    constructor();
    /**
     * @returns {BABYLON.Engine}
     */
    GetEngine(): BABYLON.Engine;
    /**
     * @param  {number} width
     * @param  {number} height
     * @returns void
     */
    Start(width: number, height: number, levelManager: LevelManager): void;
    /**
     * ### onWindowResize()
     * @returns void
     */
    private onWindowResize;
    /**
     * ### GetCanvas()
     * @returns HTMLCanvasElement
     */
    GetCanvas(): HTMLCanvasElement;
}
//# sourceMappingURL=Engine.d.ts.map