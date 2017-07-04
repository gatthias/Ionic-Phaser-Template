import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { MrHop } from '../../game/main';

@Component({
  selector: 'page-game-screen',
  templateUrl: 'game-screen.html',
})
export class GameScreen {
	MrHop: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameScreen');

    this.MrHop = new MrHop.Game('game-screen');
  }

}
