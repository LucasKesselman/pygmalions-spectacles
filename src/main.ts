import Engine from './core/Engine.ts';
import LevelManager from './core/LevelManager.ts';
import * as ZapparBabylon from '@zappar/zappar-babylonjs';
import * as MAT from '@babylonjs/materials';






//ON DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    console.log("%cDOM Conent Loaded", "color:green");
    init();
});






/**
* Initialize the game engine and start the game loop
* @returns void
*/
function init(): void {
    console.log("init()");
    
    //notes of what to do
    // initHTML();
    // initEngine();
    // initLevelManager();
    


    // new code to set up basic babyon scene here


    const target = './assets/computer-vision-assets/target1.png';

    const canvas = document.getElementById("canvas-background") as HTMLCanvasElement
    const engine = new BABYLON.Engine(canvas, true)


    const createScene = async () => {
      const scene = new BABYLON.Scene(engine)

      const camera = new BABYLON.FreeCamera(
        "camera",
        new BABYLON.Vector3(0, 1.6, 0),
        scene
      )
      camera.setTarget(BABYLON.Vector3.Zero())

      const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
      )

      const box = BABYLON.MeshBuilder.CreateBox(
        "trackedBox",
        { size: 0.1 },
        scene
      )
      box.isVisible = false

      const xr = await scene.createDefaultXRExperienceAsync({
        uiOptions: {
          sessionMode: "immersive-ar"
        },
        optionalFeatures: true
      })

      const imageTracking = xr.baseExperience.featuresManager.enableFeature(
        BABYLON.WebXRFeatureName.IMAGE_TRACKING,
        "latest",
        {
          images: [
            {
              src: "./assets/computer-vision-assets/target1.png",
              estimatedRealWorldWidth: 0.2
            }
          ]
        }
      )

      imageTracking.onTrackedImageUpdatedObservable.add((image) => {
        if (image.trackingState === "tracked") {
          box.isVisible = true

          image.transformationMatrix.decompose(
            box.scaling,
            box.rotationQuaternion,
            box.position
          )
        } else {
          box.isVisible = false
        }
      })

      return scene
    }

    createScene().then(scene => {
      engine.runRenderLoop(() => {
        scene.render()
      })
    })

    window.addEventListener("resize", () => {
      engine.resize()
    })


    createScene().then(scene => {
      engine.runRenderLoop(() => {
        scene.render()
      })
    })


    // start engine and
    

    // create the game engine
    //let engine = new Engine();
    
    // create the game level manager
    //let levelManager = new LevelManager();

    // Load the first level
    //levelManager.LoadLevel(1, engine);

    // start the game engine
    //engine.Start(1280, 720, levelManager);
        
}
    
    
function initHTML(): void {
    console.log("initHTML()");

}