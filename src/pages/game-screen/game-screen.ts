import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { MyGame } from '../../game/main';

@Component({
  selector: 'page-game-screen',
  templateUrl: 'game-screen.html',
})
export class GameScreen {
	MyGame: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameScreen');

    this.MyGame = new MyGame.Game('game-screen');
  }

}
