import Phaser from 'phaser'

export class GameState extends Phaser.State {
  public add: any;
  public game: Phaser.Game;


  hello: Phaser.Text;

  init() {
    
  }

  create() {
    var textStyle = { font: '30px Arial', fill: 'white' };
    this.hello = this.add.text(this.game.width / 2, this.game.height / 2, 'Hello World !', textStyle)
                     .anchor.setTo(.5);
  }
};
