declare var Phaser: any;

//setting game configuration and loading the assets for the loading screen
export class BootState extends Phaser.State {
  init(){
    //loading screen will have a white background
    this.game.stage.backgroundColor = '#fff';  
    
    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);  
  }

  preload(){
    //assets we'll use in the loading screen
    this.load.image('preloadbar', 'assets/images/preloader-bar.png');
  }

  create(){
    this.state.start('Preload');
  }
}