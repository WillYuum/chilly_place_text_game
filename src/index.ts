import { Application } from 'pixi.js';
import { PlayOneLifeCycle } from '@willyuum/pixi-gameobject-system';
import { startGame } from './Game';

// Extend globalThis to include __PIXI_APP__
declare global {
  var __PIXI_APP__: Application | undefined;
}




export const PixiApp = new Application();



const onAppInit = PixiApp.init({
  width: 1920,
  height: 1080,
  backgroundColor: 0x1099bb,
  resizeTo: window,
});


onAppInit.then(() => {
  document.body.appendChild(PixiApp.canvas);
  console.log('PixiJS application initialized and added to the DOM.');

  PixiApp.ticker.add((delta) => {
    // Update logic for the application can go here
    // For example, you can update game objects or handle animations
    const deltaTime = delta.deltaTime
    PlayOneLifeCycle(deltaTime);
  });



  startGame();


  globalThis.__PIXI_APP__ = PixiApp;
}).catch((error) => {
  console.error('Error initializing PixiJS application:', error);
});
