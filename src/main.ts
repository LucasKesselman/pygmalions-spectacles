// * import Babylon modules
import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import * as MAT from '@babylonjs/materials';

// * import zappar babylon module
import * as ZapparBabylon from '@zappar/zappar-babylonjs';

// * import core modules (made by us)
import Engine from './core/Engine.ts';
import LevelManager from './core/LevelManager.ts';

// * Import Firebase
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getDatabase, ref, set } from 'firebase/database';
// ------------------------------------------------------------------------------------------------------

/**
 * ~ Load and initialize Firebase SDKs
 * @returns void
 */
function initFirebase() : void {
  console.log("initFirebase()");

  // Firebase configuration object (sensitive info redacted/example values used)
  const firebaseConfig = {
    apiKey: "AIzaSyD4W0y8dpLvTQ0VFNniFJJtqVzGjbdpfjg",
    authDomain: "pygmalions-specs.firebaseapp.com",
    projectId: "pygmalions-specs",
    storageBucket: "pygmalions-specs.firebasestorage.app",
    messagingSenderId: "988189221716",
    appId: "1:988189221716:web:7ce2741a3be5558ba51ec1",
    databaseURL: "https://pygmalions-specs-default-rtdb.firebaseio.com/"
  };

  // Initialize Firebase App
  const app = initializeApp(firebaseConfig);

  // Initialize Realtime Database and get a reference to the service
  const database = getDatabase();

  // Initialize Authentication 
  const auth = getAuth();

  // Now we can use the auth instance to monitor auth state changesand sign in anonymously, Listen for authentication state changes
  onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed, user:");
    console.log(user);

    if (user) {
      console.log("User is signed in");
      // User is signed in, see docs for a list of available properties: https://firebase.google.com/docs/reference/js/auth.user

      // Write user data to Realtime Database
      console.log("Writing user data to Realtime Database for user ID: " + user.uid);
      set(ref(database, 'users/' + user.uid), {
        anonymous: true,
        lastModified: Date.now(),
        name: "Anonymous Artie User"
      })
      .catch((error) => {
        console.error("Error writing user data to database:", error);
      });



    } else {
      console.log("User is signed out");
      // User is signed out
      // ...
    }
    });

  // Sign in anonymously
  signInAnonymously(auth)
    .then(() => {
      console.log("Signed in anonymously");
      // Signed in..
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
      // ...
    });
  } 


  /**
   * ~ Initialize base HTML elements and setup initial state
   * @returns void
   */
  function initHTML(): void {
      console.log("initHTML()");
      // Crucial step: Hide the canvas initially so only the modal is visible on load.
      const canvas = document.getElementById("canvas-background");
      if(canvas) canvas.style.display = "none";
  }

// ------------------------------------------------------------------------------------------------------

/**
 * ~ Creates the Modal UI to select the experience type and controls the subsequent initialization.
 */
function setupSelectionUI(): void {
    // 1. Inject Styles for the modal overlay and buttons
    const style = document.createElement('style');
    style.innerHTML = `
        #intro-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(20, 20, 25, 0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 9999; color: white; font-family: sans-serif; }
        .mode-btn { background-color: #4CAF50; border: none; color: white; padding: 20px 40px; font-size: 18px; margin: 15px; cursor: pointer; border-radius: 8px; min-width: 250px; }
        .mode-btn:hover { background-color: #45a049; }
        .mode-btn.zappar { background-color: #ff3366; }
        .mode-btn.zappar:hover { background-color: #e62e5c; }
    `;
    document.head.appendChild(style);

    // 2. Create Modal Structure (Title, Buttons)
    const modal = document.createElement('div');
    modal.id = 'intro-modal';
    
    const title = document.createElement('h2');
    title.innerText = "Select AR Experience";
    modal.appendChild(title);

    const btnBabylon = document.createElement('button');
    btnBabylon.className = 'mode-btn';
    btnBabylon.innerText = "Launch Babylon WebXR";
    
    const btnZappar = document.createElement('button');
    btnZappar.className = 'mode-btn zappar';
    btnZappar.innerText = "Launch Zappar (Image Track)";

    modal.appendChild(btnBabylon);
    modal.appendChild(btnZappar);
    document.body.appendChild(modal);

    // 3. Logic helper to hide modal and show canvas
    const revealCanvas = () => {
        const canvas = document.getElementById("canvas-background");
        if(canvas) canvas.style.display = "block"; // Display the canvas
        modal.remove(); // Remove the modal from the DOM
    };

    // --- Button Actions ---
    
    // WebXR Launch: Calls the combined initialization function
    btnBabylon.onclick = () => {
        revealCanvas();
        startBabylonXR(); 
    };

    // Zappar Launch: Calls the separate Zappar initialization function
    btnZappar.onclick = () => {
        revealCanvas();
        initZappar(); 
    };
}

// ------------------------------------------------------------------------------------------------------

/**
 * ~ Combined Function: Initializes Babylon Standard Scene AND WebXR AR capabilities.
 * @returns Promise<void>
 */
async function startBabylonXR(): Promise<void> {
    console.log("startBabylonXR() - Initializing Babylon Engine and WebXR");

    // * Basic Babylon Setup
    const canvas = document.getElementById("canvas-background") as HTMLCanvasElement;
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    // Standard Camera and Controls
    const camera = new BABYLON.ArcRotateCamera("camera", (Math.PI / 4)*5, (Math.PI / 4), 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Basic Scene Lighting
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Sample Meshes for scene content
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
    sphere.position.y = 1;

    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
    ground.position = new BABYLON.Vector3(0, 0, 0);


    // * WebXR Integration
    const AR_SESSION_MODE = 'immersive-ar';

    // Check if the browser/device supports the requested AR session mode
    const isARSupported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync(AR_SESSION_MODE);

    if (isARSupported) {
        console.log("WebXR AR is supported. Attempting to create AR experience.");
        try {
            // Create the default WebXR experience helper (handles UI button, controllers, etc.)
            const xr = await scene.createDefaultXRExperienceAsync({
                uiOptions: { sessionMode: AR_SESSION_MODE },
                // Request hit-test functionality for placing objects in the real world
                optionalFeatures: ['hit-test'] 
            });

            console.log("Default AR Experience created successfully.");

            // Optional: Listen to state changes (Entering/Exiting AR)
            xr.baseExperience.onStateChangedObservable.add((state) => {
                if (state === BABYLON.WebXRState.IN_XR) console.log("User entered AR mode.");
            });

        } catch (error) {
            console.error("Failed to initialize WebXR AR experience:", error);
            alert("AR is supported but failed to start. Check device settings.");
        }
    } else {
        console.warn(`WebXR session mode "${AR_SESSION_MODE}" not supported. Proceeding in standard 3D view.`);

        // Create a simple text billboard to inform the user
        // Create a plane mesh to serve as the text billboard
        const textPlane = BABYLON.MeshBuilder.CreatePlane("textPlane", { width: 4, height: 1 }, scene);
        textPlane.position = new BABYLON.Vector3(0, sphere.position.y + 2.0, 0); // Position it above the sphere
        textPlane.parent = sphere; // Anchor the text plane to the sphere

        // Create the Advanced Dynamic Texture (ADT)
        const adt = GUI.AdvancedDynamicTexture.CreateForMesh(textPlane, 600, 200);

        // Create the text block
        const textBlock = new GUI.TextBlock();
        textBlock.text = "AR not supported.\nThis is a default 3D scene.";
        textBlock.color = "white";
        textBlock.fontSize = 48; // Adjust size for better visibility on the 512x128 texture
        textBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        textBlock.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;


        adt.addControl(textBlock);

        // Create a material for the plane (to make it green)
        const textMaterial = new BABYLON.StandardMaterial("textMaterial", scene);
        textMaterial.diffuseColor = new BABYLON.Color3(0.0, 0.5, 0.0); // Dark Green color
        textMaterial.emissiveColor = new BABYLON.Color3(0.0, 0.5, 0.0);
        textMaterial.backFaceCulling = false; // Show text from both sides
        textMaterial.diffuseTexture = adt;

        // Apply the material (with the ADT) to the plane
        textPlane.material = textMaterial;
    }

    // * Render Loop
    // Handle engine resize on window resize
    window.addEventListener('resize', () => engine.resize());
    
    // Start the main render loop for Babylon
    engine.runRenderLoop(() => {
        scene.render();
    });
}

// ------------------------------------------------------------------------------------------------------

/**
 * ~ Independent Zappar Initialization: Sets up the Zappar AR engine and image tracking.
 * @returns void
 */
function initZappar(): void {
  console.log("initZappar() - Initializing Zappar Engine and Image Tracking");

  // URL to the target image file (.zpt) for computer vision tracking
  const target = new URL('./public/assets/computer-vision-assets/target1.zpt', import.meta.url).href;

  // Check for Zappar browser compatibility and show UI if incompatible
  if (ZapparBabylon.browserIncompatible()) {
    ZapparBabylon.browserIncompatibleUI();
    throw new Error('Unsupported browser');
  }

  // Setup standard Babylon engine components
  const canvas = document.getElementById("canvas-background") as HTMLCanvasElement;
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  
  // Zappar typically uses a DirectionalLight for AR lighting
  const light = new BABYLON.DirectionalLight('dir02', new BABYLON.Vector3(0, 0, -1), scene);
  light.position = new BABYLON.Vector3(0, 1, -10);

  // Use the Zappar-specific Camera for AR tracking
  const camera = new ZapparBabylon.Camera('ZapparCamera', scene as any);

  // Request camera access permission from the user
  ZapparBabylon.permissionRequestUI().then((granted) => {
    if (granted) camera.start(); // Start camera if permission granted
    else ZapparBabylon.permissionDeniedUI(); // Show permission denied message
  });

  // Load the Image Tracker and create its transformation node
  const imageTracker = new ZapparBabylon.ImageTrackerLoader().load(target);
  const trackerTransformNode = new ZapparBabylon.ImageAnchorTransformNode('tracker', camera, imageTracker, scene as any);

  // Toggle content visibility based on whether the image is visible
  trackerTransformNode.setEnabled(false);
  imageTracker.onVisible.bind(() => trackerTransformNode.setEnabled(true));
  imageTracker.onNotVisible.bind(() => trackerTransformNode.setEnabled(false));

  // Scene content (meshes)
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
  const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
  // Important: Parent content to the tracker so it moves with the detected image
  (sphere as any).parent = trackerTransformNode;
  (ground as any).parent = trackerTransformNode; // Add ground to tracker too

  // Handle engine resize
  window.addEventListener('resize', () => engine.resize());

  // Start the Zappar render loop, which requires camera.updateFrame()
  engine.runRenderLoop(() => {
    camera.updateFrame(); // Zappar specific update call
    scene.render();
  });
}

// ------------------------------------------------------------------------------------------------------

// ON DOMContentLoaded: The entry point for the application
window.addEventListener('DOMContentLoaded', () => {
    console.log("%cDOM Content Loaded", "color:green");
    
    // 1. Initialize HTML elements (hides canvas)
    initHTML();
    
    // 2. Initialize Firebase SDKs
    initFirebase();
    
    // 3. Setup the initial UI (Shows buttons and waits for user input)
    // This function will call the appropriate engine initialization (startBabylonXR or initZappar)
    setupSelectionUI();
});