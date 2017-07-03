import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GameScreen } from '../game-screen/game-screen';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  launchGame(){
  	this.navCtrl.push(GameScreen);
  }

}
