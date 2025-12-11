import * as BABYLON from '@babylonjs/core';
import Engine from "./Engine.ts";
export default class LevelManager {
    private _currentScene;
    private _currentLevelID;
    constructor();
    LoadLevelEnvironment(levelScene: BABYLON.Scene, levelID: number): void;
    LoadLevelDebugTools(levelScene: BABYLON.Scene): void;
    LoadPlayerCharacter(levelScene: BABYLON.Scene): void;
    LoadLevelCamera(levelScene: BABYLON.Scene, engine: Engine, levelID: number): void;
    LoadLevel(levelID: number, engine: Engine): BABYLON.Scene | undefined;
    GetCurrentScene(): BABYLON.Scene | undefined;
}
//# sourceMappingURL=LevelManager.d.ts.map