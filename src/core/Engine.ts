
import * as BABYLON from '@babylonjs/core';
import LevelManager from './LevelManager.ts';


export default class Engine {

    private _canvas: HTMLCanvasElement = document.getElementById('canvas-background') as HTMLCanvasElement;
    private _gameArea: HTMLDivElement = document.getElementById('game-area') as HTMLDivElement;
    private _babylonEngine: BABYLON.Engine;
    private _aspectRatio: number|undefined;
    private _gamepadManager: BABYLON.GamepadManager;
    

    // private _audioOptions: BABYLON.IAudioEngineOptions = {
    //         outputAudio: true,
    //         spatialSound: true,
    //         maxSoundPointers: 8,
    //         disableAudioFocus: false,
    //         audioDevice: null,
    //         useHRTF: true,
    //         hrtfMaxAngle: Math.PI,
    //         audioContextInitialized: false,
    //         audioEnabled: true,
    //         useCustomHRTF: false,

    //         useAudioWorklet: true,
    //         audioWorkletModule: './audio-worklet.js',
    //         audioWorkletInputs: [
    //             'input'
    //         ],
    //         audioWorkletOutputs: [
    //             'output'
    //         ]
    // }

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

        let width: number;
        let height: number;
        let windowAspectRatio: number = window.innerWidth / window.innerHeight;

        //horizontal
        if(windowAspectRatio > this._aspectRatio!){
            height = window.innerHeight;
            width = height * this._aspectRatio!;
        }
        //vertical
        else{
            width = window.innerWidth;
            height = width / this._aspectRatio!;
        }

        this._gameArea.style.width = width + "px";
        this._gameArea.style.height = height + "px";

        this._gameArea.style.marginLeft = (-(width / 2)) + "px";
        this._gameArea.style.marginTop = (-(height / 2)) + "px";

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