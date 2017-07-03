var path = require('path');
var webpack = require('webpack');


var phaserModule = path.join(__dirname, '../node_modules/phaser-ce/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js');

const webpackConfig = require('../node_modules/@ionic/app-scripts/config/webpack.config');

webpackConfig.resolve = webpackConfig.resolve || {};
webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};
webpackConfig.resolve.alias['phaser'] = phaser;
webpackConfig.resolve.alias['pixi'] = pixi;
webpackConfig.resolve.alias['p2'] = p2;

webpackConfig.module = webpackConfig.module || {};
webpackConfig.module.loaders = webpackConfig.module.loaders || [];
webpackConfig.module.loaders.push({ test: pixi, use: ['expose-loader?PIXI'] })
webpackConfig.module.loaders.push({ test: phaser, use: ['expose-loader?Phaser'] })
webpackConfig.module.loaders.push({ test: p2, use: ['expose-loader?p2'] })