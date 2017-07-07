import Phaser from 'phaser'

export class BootState extends Phaser.State {
  public state: Phaser.State;
  
  init(){

  }

  preload(){
    
  }

  create(){
    this.state.start('Preload');
  }
}