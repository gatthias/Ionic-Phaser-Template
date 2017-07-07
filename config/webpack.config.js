var path = require('path');

// Get references to respective file paths to keep clean syntax
var phaserModule = path.join(__dirname, '../node_modules/phaser-ce/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  	pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  	p2 = path.join(phaserModule, 'build/custom/p2.js');

// Access our regular Ionic project's webpack configuration
var webpackConfig = require('../node_modules/@ionic/app-scripts/config/webpack.config');

/**
 * From now, only change our webpackConfig rather that replacing any entry
 * We need to make our change safely not to disturb our project's current lifecycle more than we want
 */

// Add aliases for respective modules, pointing to their respective files
// This is so we can use ```import 'phaser'``` DI syntax
webpackConfig.resolve = webpackConfig.resolve || {};
webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};
webpackConfig.resolve.alias['phaser'] = phaser;
webpackConfig.resolve.alias['pixi'] = pixi;
webpackConfig.resolve.alias['p2'] = p2;

// Use the expose-loader for Phaser and it's dependencies files to expose each of these modules as global variables,
// as required by Phaser & PIXI code.
// This is so Phaser, PIXI and p2, imported separately, know about each other and don't access undefined values trying to cross reference.
webpackConfig.module = webpackConfig.module || {};
webpackConfig.module.loaders = webpackConfig.module.loaders || [];
webpackConfig.module.loaders.push({ test: pixi, use: ['expose-loader?PIXI'] })
webpackConfig.module.loaders.push({ test: phaser, use: ['expose-loader?Phaser'] })
webpackConfig.module.loaders.push({ test: p2, use: ['expose-loader?p2'] })