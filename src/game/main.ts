/**
 *  Needed to use Phaser through webpack compilation
 *  Don't remove
 */
import 'pixi'
import 'p2'
import Phaser from 'phaser'
/** End webpack required expressions */

import { BootState } from './states/Boot';
import { PreloadState } from './states/Preload';
import { GameState } from './states/Game';


export module MyGame {

	export class Game extends Phaser.Game {
		public state: Phaser.State;

		private dim: { w: number, h: number };

		constructor(elId: string) {
			// Create Phaser Game instance
			super(640, 480, Phaser.CANVAS, elId);

			// Define game states
			this.state.add('Boot', BootState);
			this.state.add('Preload', PreloadState);
			this.state.add('Game', GameState);

			// Start
			this.state.start('Boot');
		}

	}

}