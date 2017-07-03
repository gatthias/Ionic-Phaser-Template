import 'pixi'
import 'p2'
import Phaser from 'phaser'

export var MrHop = MrHop || {};

// get game dimensions based on world maxWidth & height
// MrHop.dim = MrHop.getGameLandscapeDimensions(700, 350);

// MrHop.game = new Phaser.Game(MrHop.dim.w, MrHop.dim.h, Phaser.CANVAS);

// MrHop.game.state.add('Boot', MrHop.BootState);
// MrHop.game.state.add('Preload', MrHop.PreloadState);
// MrHop.game.state.add('Game', MrHop.GameState);

// MrHop.game.state.start('Boot');

import { BootState } from './states/Boot';
import { PreloadState } from './states/Preload';
import { GameState } from './states/Game';

import { getGameLandscapeDimensions } from './scaler';

MrHop.BootState = BootState;
MrHop.PreloadState = PreloadState;
MrHop.GameState = GameState;
MrHop.getGameLandscapeDimensions = getGameLandscapeDimensions;

MrHop.start = function(elId){
	MrHop.dim = MrHop.getGameLandscapeDimensions(700, 350);
	MrHop.game = new Phaser.Game(/*MrHop.dim.w, MrHop.dim.h, */ 640, 480, Phaser.CANVAS, elId);

	MrHop.game.state.add('Boot', MrHop.BootState);
	MrHop.game.state.add('Preload', MrHop.PreloadState);
	MrHop.game.state.add('Game', MrHop.GameState);

	MrHop.game.state.start('Boot');
}