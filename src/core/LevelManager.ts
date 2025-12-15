import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
import Engine from "./Engine.ts";
//import * as ZapparBabylon from '@zappar/zappar-babylonjs';
// Register GLTF/loaders plugin so SceneLoader can handle .gltf/.glb files
import '@babylonjs/loaders';


export default class LevelManager {

    private _currentScene: BABYLON.Scene | undefined;
    private _currentLevelID: number | undefined;


    constructor() {
        this._currentScene = undefined;
        this._currentLevelID = undefined;
    }

    public LoadLevelEnvironment(levelScene: BABYLON.Scene, levelID: number): void {

        console.log(`Creating Level ${levelID} Environment...`)

        // ~ Parent Environment Node
        let environmentNode = new BABYLON.Node("environmentNode", levelScene);
        environmentNode._addToSceneRootNodes();

        // ~ Hemispheric Light
        // TODO replace this with something better import it from bender?? 
        const LevelLight1 = new BABYLON.HemisphericLight(`HemisphericLightfor levelID=${levelID}`, new BABYLON.Vector3(-1, 2, -1), levelScene);
        LevelLight1.intensity = 1;
        LevelLight1.diffuse = new BABYLON.Color3(1, 1, 1);
        LevelLight1.specular = new BABYLON.Color3(1, 1, 1);
        LevelLight1.groundColor = new BABYLON.Color3(0, 0, 0);
        LevelLight1.parent = environmentNode;

        // ~ Directional Light
        const LevelLight = new BABYLON.DirectionalLight(`DirectionalLightfor levelID=${levelID}`, new BABYLON.Vector3(1, -2, 1), levelScene);
        LevelLight.intensity = 3;
        LevelLight.position = new BABYLON.Vector3(-400, 800, -400);
        LevelLight.diffuse = new BABYLON.Color3(1, 1, 1);
        //LevelLight1.direction = new BABYLON.Vector3(0, -1, 0);
        LevelLight.parent = environmentNode;

        // ~ Skybox
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, levelScene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", levelScene);        
        skybox.infiniteDistance = true;
        skybox.isPickable = false;
        skybox.receiveShadows = false;
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../../assets/textures/skybox", levelScene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
        skybox.parent = environmentNode;

        // ~ Platform
        BABYLON.SceneLoader.ImportMeshAsync(["environment-ico-platform-mesh"], "../assets/babylon_blender_assets/", "platformv1.gltf", levelScene).then( (environmentMeshes) => {
            environmentMeshes.meshes.forEach(mesh => {
                mesh.isVisible = true;
                mesh.checkCollisions = true;
                mesh.receiveShadows = true;
                mesh.actionManager = new BABYLON.ActionManager(levelScene);
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (evt) => {
                    console.log(`Mesh picked:\n${mesh.name}\n\n`,`Pick Event:`, evt, `\n\n`, `Mesh:`, mesh);
                }));
                mesh.parent = environmentNode;
            });
        }).catch( (err) => { console.error(err);} );

    }

    public LoadLevelDebugTools(levelScene: BABYLON.Scene): void {
        
        console.log(`Showing Level Debug Tools...`)

        // ~ Show inspector
        levelScene!.debugLayer.show({
            embedMode: false,
            showExplorer: true,
            showInspector: true,
            enablePopup: true
        });
    }

    public LoadPlayerCharacter(levelScene: BABYLON.Scene): void {

        // ~ Player Character
        BABYLON.SceneLoader.Append('../assets/','KURENAI_lowpoly.gltf',levelScene, (characterMeshes) => {
            characterMeshes.meshes.forEach(mesh => {
                mesh.isVisible = true;
                mesh.checkCollisions = true;
                mesh.receiveShadows = true;
                mesh.actionManager = new BABYLON.ActionManager(levelScene);
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (evt) => {
                    console.log(`Mesh picked:\n${mesh.name}\n\n`,`Pick Event:`, evt, `\n\n`, `Mesh:`, mesh);
                }));
            });
        });
    }

    /*
    public LoadLevelCamera(levelScene: BABYLON.Scene, engine: Engine, levelID: number): void {
        // Use a Zappar camera anchored to an image target instead of a Babylon camera
        const camera = new ZapparBabylon.Camera('zapparCamera', levelScene as any);

        // Request permissions, then start camera if granted
        ZapparBabylon.permissionRequestUI().then((granted: boolean) => {
            if (granted) camera.start();
            else ZapparBabylon.permissionDeniedUI();
        });

        // Load the image tracker (target image has a space in its name)
        const imageTracker = new ZapparBabylon.ImageTrackerLoader().load('./assets/computer-vision-assets/Computer Vision Target.png');

        // Anchor transform node that follows the tracked image in AR space
        const trackerTransformNode = new ZapparBabylon.ImageAnchorTransformNode('tracker', camera, imageTracker, levelScene as any);

        // If the platform mesh is added later (ImportMeshAsync), parent it to the tracker
        const parentIfPlatform = (mesh: BABYLON.AbstractMesh) => {
            if (mesh.name === 'environment-ico-platform-mesh') {
                mesh.parent = trackerTransformNode as any;
                mesh.visibility = 1; // hide until target visible
            }
        };

        // Parent existing mesh if already present
        const existing = levelScene.getMeshByName('environment-ico-platform-mesh');
        if (existing) parentIfPlatform(existing);

        // Parent any newly added mesh matching the platform name
        levelScene.onNewMeshAddedObservable.add((mesh) => parentIfPlatform(mesh));

        // Toggle platform visibility based on tracker events
        imageTracker.onVisible.bind(() => {
            const m = levelScene.getMeshByName('environment-ico-platform-mesh');
            if (m) m.visibility = 1;
        });
        imageTracker.onNotVisible.bind(() => {
            const m = levelScene.getMeshByName('environment-ico-platform-mesh');
            if (m) m.visibility = 0;
        });

        // Ensure the Zappar camera updates each frame before the scene renders
        levelScene.onBeforeRenderObservable.add(() => {
            camera.updateFrame();
        });
    }
    */



    public LoadLevel(levelID: number, engine: Engine): BABYLON.Scene | undefined {
        console.log("loadLevel()");
        console.log(`level ID: ${levelID}`);

        this._currentLevelID = levelID;

        let newScene: BABYLON.Scene | undefined;

        switch (levelID) {
            case 0:
                // there is no level 0 yet
                break;
    
            case 1:

                // create new scene
                console.log("loading level 1..."); 
                newScene = new BABYLON.Scene(engine.GetEngine());

                // ~ Load Level Debug Tools
                //this.LoadLevelDebugTools(newScene);

                // ~ Load Level Environment
                this.LoadLevelEnvironment(newScene,1);

                // ~ Load Level Camera
                //this.LoadLevelCamera(newScene,engine,levelID);







                


 
                
                

                //maybe try to figure out a way to made a node in the scene explorer that is't __root__ ... call it "EnvironmentNode" and it has all the relevent meshes and stuff
                ////let environmentNode = new BABYLON.Node("environment", newScene);




                    







                break;

            case 2:
            
                newScene = new BABYLON.Scene(engine.GetEngine());
                break;

            case 3:

                newScene = new BABYLON.Scene(engine.GetEngine());
                break;
        
            default:

                console.error("Level ID not found");
                newScene = undefined;
                break;
        }

        this._currentScene = newScene;
        return this._currentScene;
    }



    public GetCurrentScene(): BABYLON.Scene | undefined {
        return this._currentScene;
    }

   

}