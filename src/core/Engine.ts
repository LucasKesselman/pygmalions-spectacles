
import * as BABYLON from '@babylonjs/core';
import LevelManager from './LevelManager.ts';


export default class Engine {

    private _canvas: HTMLCanvasElement = document.getElementById('canvas-background') as HTMLCanvasElement;
    private _gameArea: HTMLDivElement = document.getElementById('game-area') as HTMLDivElement;
    private _babylonEngine: BABYLON.Engine;
    private _aspectRatio: number|undefined;
    private _gamepadManager: BABYLON.GamepadManager;


    private _engineOptions: BABYLON.EngineOptions = {
 
        antialias: true,
        alpha: true,
        stencil: true,
        deterministicLockstep: false,
        lockstepMaxSteps: 4,
        audioEngine: true,
        useHighPrecisionFloats: false,
        // audioEngineOptions: this._audioOptions,

    }


    constructor() {

        this._babylonEngine = new BABYLON.Engine(
            this._canvas,
            false,
            this._engineOptions,
            true
        );

        //init the Gampad Manager
        this._gamepadManager = new BABYLON.GamepadManager();
        

        console.log(this._babylonEngine);

    }

    /**
     * @returns {BABYLON.Engine}
     */
    public GetEngine(): BABYLON.Engine {
        return this._babylonEngine;
    }

    /**
     * @param  {number} width
     * @param  {number} height
     * @returns void
     */
    public Start(width: number, height: number, levelManager:LevelManager): void {
        console.log("Start()");
    
        this._canvas.width = width;
        this._canvas.height = height;

        // ensure the game area initially matches the window width and
        // leaves 50px at the top and bottom of the window
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const areaHeight = Math.max(0, winH - 100); // 50px top + 50px bottom
        this._gameArea.style.width = winW + "px";
        this._gameArea.style.height = areaHeight + "px";
        this._gameArea.style.marginLeft = "0px";
        this._gameArea.style.marginTop = "50px";
        this._canvas.width = winW;
        this._canvas.height = areaHeight;

        //set the aspect ratio
        if(width > height){
            this._aspectRatio = width / height;
        }
        else{
            this._aspectRatio = height / width;
        }

        // bind window resize event callback and call onWindowResize() once manually
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.onWindowResize();


        // start the render loop
        this._babylonEngine.runRenderLoop(() => {
            if (levelManager.GetCurrentScene() != undefined) {
                levelManager.GetCurrentScene()!.render();
            }
        });
    }

    /**
     * ### onWindowResize()
     * @returns void
     */
    private onWindowResize(): void {
        console.log("%cWindow Resized", "color:green");
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const areaHeight = Math.max(0, winH - 100); // 50px top + 50px bottom

        this._gameArea.style.width = winW + "px";
        this._gameArea.style.height = areaHeight + "px";
        this._gameArea.style.marginLeft = "0px";
        this._gameArea.style.marginTop = "50px";

        // keep canvas synced with game area
        this._canvas.width = winW;
        this._canvas.height = areaHeight;

        this._babylonEngine.resize();
        
    }


    /**
     * ### GetCanvas()
     * @returns HTMLCanvasElement
     */
    public GetCanvas(): HTMLCanvasElement {
        return this._canvas;
    }

}