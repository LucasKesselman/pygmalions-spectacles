import './style.css'
import Engine from './core/Engine';
import LevelManager from './core/LevelManager';





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
    
    // create the game engine
    let engine = new Engine();
    
    // create the game level manager
    let levelManager = new LevelManager();

    // Load the first level
    levelManager.LoadLevel(1, engine);

    // start the game engine
    engine.Start(1280, 720, levelManager);
        
}
    
    
function initHTML(): void {
    console.log("initHTML()");

}