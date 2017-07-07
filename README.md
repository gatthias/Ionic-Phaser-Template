# Ionic Phaser Template

Closely reflecting the name, Ionic Phaser Template is a project template using both the [Ionic 2](http://ionicframework.com/) and [Phaser 2](http://phaser.io/) frameworks.
Freely use this repo as a starting point for any project you might have involving both these awesome open-source librairies.

* [Getting Started](#getting-started)
	* [Installation](#installation)
	* [Prerequisites](#prerequisites)
	* [Project Structure](#project-structure)
* [Presentation](#presentation)
	* [What](#what)
	* [Why](#why)
	* [How](#how)
* [Known Issues](#known-issues)
* [TODO](#todo)

## Getting Started

Follow these few steps to get started using this template. You'll get a fresh Ionic project with Phaser already linked, ready to move forward.

If you prefer to reproduce this on an existing project, you can either start from here as well and replace game files with your own (minor adjustments might be needed in your code), or gain some knowledge and follow resolution presented in [How](#how).

### Installation

Fairly straightforward, just :

```git clone GIT_REPO```

and don't forget to do a little ```npm install``` right after.

You should then be able to use regular Ionic tools, eg: starting with a simple ```ionic serve```.

### Prerequisites

The only prerequisite for this project to work is to have Ionic toolbelt installed. If you already developped apps with Ionic 2 you're good to go, if you don't, please follow [Ionic Framework instructions](http://ionicframework.com/getting-started/) before going further.

At the end of it, you should know (at least a little) about node, npm and Ionic itself, as well as Typescript and it's import standards if you don't already.

### Project structure

All app files are in ```/app``` and ```/pages```, that is, regular Ionic project structure.

All game files are in ```/game```, then following simple usual Typescript Phaser project structure.

Assets are shared in ```/assets```.


## Presentation

In this section you will find more informations about this starter, mainly what it is, why we did it and created this public repo, as well as how it was made, through a tutorial-like you can follow if you want to reproduce.

If you are just here to use the project as a starter, don't be intimidated by the rather dry [How](#how) section which only concerns what was achieved in this repo, and how. You don't need this information if you only want to use this template.

### What

As stated, this simple project can be a starting point for any development using both Ionic 2 and Phaser 2. While Ionic might be the go-to framework to create multiplateform html5 applications, with a strong favor to mobiles, Phaser is one of the most used html5 game engines at the moment. Having both offers great dimensions of possibilities, and can constitute a strong base for any game development involving complex UI, or app project needing a top-notch engine to do canvas or webgl rendering.

One could argue about using both Phaser and Ionic, and truth be told, this is far from being the simplest way of using Phaser on mobile plateforms. If you just want to go that way, you will probably find yourself more at ease looking for integrating your Phaser game with [Cordova](https://cordova.apache.org/).


Though, as I found plenty of questions on the subject, it would look like we are not the only ones finding interest in such a stack.

If you just stumbled upon this you might not need it, for simple projects in can quickly be a bulldozer to pin a nail. Yet, you might find interest if you want to :
- Use Ionic mobile development workflow and associated tools while developping your Phaser project
- Benefit from both having a strong game engine, as well as every Ionic components / providers / plugins you might think of to ease app-like interactions.
- Converge your programming paradigms between Phaser and Ionic projects if you already use both in different projects.


There is probably much more that I didn't think about, but you get the point. Anyway, if using such a stack is something you want, I really hope this repo can provide you with some help and information.


### Why

Combining two frameworks in one project doesn't always raise issues, but depending on how they were structured and how they handle their own dependencies, it can sometimes turn into a little nightmare of it's own.

This is the case for Ionic 2 and Phaser 2, which tackle module structure in very different ways from each other; Ionic 2 harnesses the power of ES-6 transpiled from Typescript as required by Angular >2, making it all about fine-grained imports. It also 'forces' us to use Webpack to do all the compilation thingies. Phaser 2 on the other hand is known to be rather monolithic (from a dependency point of view), and while it's Community Edition offers some instructions to use it with Webpack, it is still a hassle if you're not ready to dig deep enough in the matter. And if you do, it can still take you unnecessary time to figure it out.

I had a real look on the web on this journey I had to help me get those two working together, and as sure as I read a great deal of questions on the subject, the answer hose was a bit dry.

So here it is, working project starter ready to be used by anyone to create some awesome stuff.
For the learners, I'll lay details on the resolution in the next section.

### How

As said, main issues rises from incompatibilities between each framework coding style and structure.
- Ionic 2 uses Typescript modules definitions and derives a highly class based structure, all wrapped via Webpack compilations *each time you change your app code (if live reload)*.
- Phaser 2 main import strategy is to inject it's bundle javascript file directly in the DOM, typically in your index


Assuming our 'main' framework will be Ionic and choosing to stick to it's coding style, we'll try to adapt Phaser (and related code) as much as we can towards a more modular use.


First things first, you'll need an Ionic project. This one is based on Ionic Blank starter template : ```ionic start MyProject blank --v2```


After that we need to install Phaser, but we'll choose the Community Edition which offers some Webpack goodness and use instructions : ```npm i phaser-ce --save```


In this Community Edition, you will find usual phaser.js file which would be used as default. We don't want that, what we need is to import Phaser and it's dependencies seperately (PIXI and p2, but importantly, as needed). The files we're looking for are in ```phaser-ce/build/custom/```, respectively ```phaser-split.js```, ```pixi.js``` and ```p2.js```.


In files in which need these librairies, we would like to use :
```
import 'pixi'
import 'p2'
import Phaser from 'phaser'
```


That's the first goal we are trying to achieve here.

To do that, we need to tell Webpack how to handle these modules. Indeed, 'pixi' and 'p2' don't exist in Webpack's scope yet, and 'phaser' would point to the default ```phaser.js``` file.

So we need to change our Webpack configuration. But as it is rooted in Ionic projects lifecycle, we can't just create a ```webpack.config.js``` as we usually would. We need to access our Ionic project's own internal Webpack configuration object, and preferably hook onto it rather than rewriting or copying it. Here's the way.


First, we need to create a Webpack configuration file. Here we will create it in ```config/webpack.config.js```.

To keep things clean, we reference our files respectives paths because we will need them in two places later as we will see.
```
// Get references to respective file paths to keep clean syntax
var phaserModule = path.join(__dirname, '../node_modules/phaser-ce/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  	pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  	p2 = path.join(phaserModule, 'build/custom/p2.js');
```

Then we need access to Ionic's Webpack config object located in ```node_modules/@ionic/app-scripts/config/webpack.config```:
```
// Access our regular Ionic project's webpack configuration
var webpackConfig = require('../node_modules/@ionic/app-scripts/config/webpack.config');
```

From now on, we just want to change our webpackConfig rather that replacing any entry, and we need to make our changes safely in order not to disturb our project's current lifecycle more than we want. As we don't have late ES syntax goodies here, we do it the old way by using protected assignations. As a bonus, this should allow us to update Ionic later on without disrupting everything.

So for Webpack to know about our modules and letting us using the aforementioned importing syntax, we will reference them as aliases.
```
// Add aliases for respective modules, pointing to their respective files
// This is so we can use ```import 'phaser'``` DI syntax
webpackConfig.resolve = webpackConfig.resolve || {};
webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};
webpackConfig.resolve.alias['phaser'] = phaser;
webpackConfig.resolve.alias['pixi'] = pixi;
webpackConfig.resolve.alias['p2'] = p2;
```

At this point, should our Webpack config be correctly referenced, we would be able to import Phaser and it's dependencies in any ts file we have in our ```/src``` folder. Webpack would indeed find our files and correctly import, but we would have immediate runtime errors. Why so ? Because even in this 'splitted' variant, both Phaser and PIXI own code assume to find each other as global references. That is, in the browser both expect to have Phaser and PIXI definitions in our window object (window.Phaser = Phaser, window.PIXI = PIXI). As it is not the case here, both will fail to reference each other, and both will fail to do anything further (or, to be fair, very little).

Remember that the goal here is to make everything work without having to do a single change in our npm modules files. So in order for this to work, we have to define those global variables. To do this "bad practice", we will lean on a Webpack loader to do the work for us, namely the ```expose-loader```. So go ```npm i expose-loader --save-dev```, and this is how we use it (Ionic 2 uses Webpack 2) :

```
// Use the expose-loader for Phaser and it's dependencies files to expose each of these modules as global variables,
// as required by Phaser & PIXI code.
// This is so Phaser, PIXI and p2, imported separately, know about each other and don't access undefined values trying to cross reference.
webpackConfig.module = webpackConfig.module || {};
webpackConfig.module.loaders = webpackConfig.module.loaders || [];
webpackConfig.module.loaders.push({ test: pixi, use: ['expose-loader?PIXI'] })
webpackConfig.module.loaders.push({ test: phaser, use: ['expose-loader?Phaser'] })
webpackConfig.module.loaders.push({ test: p2, use: ['expose-loader?p2'] })
```


These few lines will ask the expose-loader to create three global variables PIXI, Phaser and p2, referenced in the ```global``` object which in browser will be ```window```, and initialized via their respective code files.

Now we should be good, we just finally need to tell node about our new Webpack configuration. To do this, we need to add the following statement to our ```package.json```, actively referencing our configuration-hook file as the Webpack config to use for all Ionic App Scripts :
```
	"config": {
    "ionic_webpack": "./config/webpack.config.js"
  }
```


With all of this done, we can import our sesame in any file we want. 

But for it to work (haha! again), there is a last little glitch: For the expose loader to actually load the files and expose them, we need to import them somewhere (or it might be because Ionic App Scripts using some kind of tree shaking ? I didn't look).

So we'll make sure that somewhere in our game files, we import all needed code. As our main.ts surely is our main game file, we will do these required imports there, using the above syntax :
```
import 'pixi'
import 'p2'
import Phaser from 'phaser'
```


Do this in the top of your file, preferably with some comments indicating why these should be kept.

And mind the ordering, as requiring Phaser before the other two would not work either.



Alrighty ! From now, our project should compile and load Phaser at runtime without errors. Congrats, now we can use both Phaser and Ionic freely and wire them as wanted. 

If you came from an existing Phaser project using JS, there's still a little work to do, as you'll need to either add .js files compilation in Webpack config or change your .js extensions to .ts. And of course some adjustments will probably be needed in the existing code, but it will probably stick to minor changes. You can then progressively turn your code to full Typescript (not required but strongly recommended at least if it is still a wip).


For the rest of your game code, you can rely on Phaser usage with Typescript information, it should now work seamelessly.

## Known Issues

- Typescript doesn't seem to follow our definitions for inherited class properties. It works at runtime but the compilation process gives errors. It can be bypassed by declaring needed properties in our own classes, see in game files.

## TODO

- Resolve inherited properties not being resolved by Typescript compiler.
