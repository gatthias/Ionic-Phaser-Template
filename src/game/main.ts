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

import { getGameLandscapeDimensions } from './scaler';


export module MrHop {

	export class Game extends Phaser.Game {
		private dim: { w: number, h: number };

		constructor(elId: string) {
			// get game dimensions based on world maxWidth & height
			let dim = getGameLandscapeDimensions(700, 350);

			// Create Phaser Game instance
			super(dim.w, dim.h, Phaser.CANVAS, elId);

			this.dim = dim;

			// Define game states
			this.state.add('Boot', BootState);
			this.state.add('Preload', PreloadState);
			this.state.add('Game', GameState);

			// Start
			this.state.start('Boot');
		}

	}
	
}