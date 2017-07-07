import Phaser from 'phaser'

export class PreloadState extends Phaser.State {
  public state: Phaser.State;
  
  preload() {

  }

  create() {
    this.state.start('Game');
  }
}