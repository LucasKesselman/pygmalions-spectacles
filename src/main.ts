import * as BABYLON from '@babylonjs/core';
import Engine from './core/Engine.ts';
import LevelManager from './core/LevelManager.ts';
//import * as ZapparBabylon from '@zappar/zappar-babylonjs';
import * as MAT from '@babylonjs/materials';
//import "@babylonjs/core/Materials/Node/Blocks";












// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyD4W0y8dpLvTQ0VFNniFJJtqVzGjbdpfjg",
  authDomain: "pygmalions-specs.firebaseapp.com",
  projectId: "pygmalions-specs",
  storageBucket: "pygmalions-specs.firebasestorage.app",
  messagingSenderId: "988189221716",
  appId: "1:988189221716:web:7ce2741a3be5558ba51ec1"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);













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
    






  // 3rd attempt


    const canvas = document.getElementById("canvas-background") as HTMLCanvasElement;
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = async () => {
      const scene = new BABYLON.Scene(engine);
      const camera = new BABYLON.ArcRotateCamera("camera", (Math.PI / 4)*3, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
      camera.attachControl(canvas, true);
      const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
      light.intensity = 0.7;

      const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
      sphere.position.y = 1;

      const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
      ground.position = new BABYLON.Vector3(0, 0, 0);

      
      // --- AR Support Check and Integration ---
      const AR_SESSION_MODE = 'immersive-ar';

      const isARSupported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync(AR_SESSION_MODE);

      if (isARSupported) {
          console.log("WebXR AR is supported. Attempting to create AR experience.");
          try {
              // Initialize the AR experience
              const xr = await scene.createDefaultXRExperienceAsync({
                  uiOptions: {
                      sessionMode: AR_SESSION_MODE // Request AR mode
                  },
                  floorMeshes: [ground], // Use the ground mesh for hit-testing
                  optionalFeatures: ['hit-test'] // Explicitly request essential AR features
              });

              console.log("Default AR Experience created successfully.");

              // Example: What to do when AR starts
              xr.baseExperience.onStateChangedObservable.add((state) => {
                  if (state === BABYLON.WebXRState.IN_XR) {
                      console.log("User entered AR mode.");
                      // You might want to hide the sphere here until it's placed
                      // sphere.isVisible = false; 
                  } else if (state === BABYLON.WebXRState.NOT_IN_XR) {
                      console.log("User exited AR mode.");
                  }
              });


          } catch (error) {
              console.error("Failed to initialize WebXR AR experience:", error);
              // Alert the user that AR failed to start despite support detection
              const message = "AR is supported but failed to start. Ensure your device is up-to-date and AR services are active.";
              alert(message);
          }
      } else {
          console.warn(`WebXR session mode "${AR_SESSION_MODE}" not supported in this browser/device. Proceeding with standard 3D view.`);
          // You can add a visible message to the user here if you like
          // e.g., show a text block on the canvas saying "AR Not Supported"
      }
      // --- End AR Support Check ---

      return scene;
    }


    createScene().then(scene => {
        engine.runRenderLoop(() => {
            scene.render();
        });
    });

    window.addEventListener("resize", () => {
        engine.resize();
    });
}





    // new code to set up basic babyon scene here

    /*


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

    */

    // start engine and
    

    // create the game engine
    //let engine = new Engine();
    
    // create the game level manager
    //let levelManager = new LevelManager();

    // Load the first level
    //levelManager.LoadLevel(1, engine);

    // start the game engine
    //engine.Start(1280, 720, levelManager);
//}
    
    
// function initHTML(): void {
//     console.log("initHTML()");

// }