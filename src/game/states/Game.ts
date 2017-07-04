import Phaser from 'phaser'

import { Platform } from '../prefabs/Platform';

export class GameState extends Phaser.State {
  // Objects Pools
  floorPool: Phaser.Group;
  platformPool: Phaser.Group;
  coinsPool: Phaser.Group;

  // Game stats
  maxJumpDistance: number;
  myCoins: number;
  levelSpeed: number;
  highScore: number;

  // Inputs
  cursors: any;

  // Game objects
  background: Phaser.TileSprite;
  player: Phaser.Sprite;
  currentPlatform: Platform;
  coinSound: Phaser.Audio;
  water: Phaser.Sprite;
  coinsCountLabel: Phaser.Text;

  // Jumping
  startJumpY: number;
  isJumping: boolean;
  jumpPeaked: boolean;
  isFalling: boolean;
  hasDoubleJumped: boolean;

  // Game Over
  overlay: Phaser.BitmapData;
  panel: Phaser.Sprite;
  

  init() {
    
    //pool of floors
    this.floorPool = this.add.group();
    
    // Pool of platforms
    this.platformPool = this.add.group();

    // Pool of coins
    this.coinsPool = this.add.group();
    this.coinsPool.enableBody = true;

    //gravity
    this.game.physics.arcade.gravity.y = 1000;    
    
    //max jump distance
    this.maxJumpDistance = 120;
    
    //move player with up key
    this.cursors = this.game.input.keyboard.createCursorKeys();

    //coins 
    this.myCoins = 0;

    // Level Speed
    this.levelSpeed = 200;
  }

  create() {
    // Create moving background
    this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background');
    this.background.tileScale.y = 2;
    this.background.autoScroll(-this.levelSpeed / 7, 0);
    this.game.world.sendToBack(this.background);

    //create the player
    this.player = this.add.sprite(50, 50, 'player');
    this.player.anchor.setTo(0.5);
    this.player.animations.add('running', [0, 1, 2, 3, 2, 1], 15, true);
    this.game.physics.arcade.enable(this.player);

    // Change player bounding box
    this.player.body.setSize(38, 60, 0, 0);
    this.player.play('running');


    
    //hard-code first platform
    this.currentPlatform = new /*MrHop.*/Platform(this.game, this.floorPool, 12, 0, 200, this.levelSpeed, this.coinsPool);
    this.platformPool.add(this.currentPlatform);

    // Coin sound
    this.coinSound = this.add.audio('coin');

    this.loadLevel();

    // Create moving water
    this.water = this.add.tileSprite(0, this.game.world.height - 30, this.game.world.width, 30, 'water');
    this.water.autoScroll(-this.levelSpeed * 1.2, 0);

    // Show number of coins
    var textStyle = { font: '30px Arial', fill: 'white' };
    this.coinsCountLabel = this.add.text(10, 20, '0', textStyle);
  }

  update() {    
    if(this.player.alive){
      // PlatformPool is a group of groups, we need to iterate through 'em
      this.platformPool.forEachAlive(function(platform, index){
        this.game.physics.arcade.collide(this.player, platform);  

        // As soon as the last tile of a platform is out screen (left), we kill it
        if(platform.length && platform.children[platform.length - 1].right < 0){
          platform.kill();
        }
      }, this);


      // Check collisions with coins
      this.game.physics.arcade.overlap(this.player, this.coinsPool, this.collectCoin, null, this);

      // The level is moving around, if the player is on ground we need to move it at the same speed, reverse
      if(this.player.body.touching.down){
        this.player.body.velocity.x = this.levelSpeed;  
      }else{
        this.player.body.velocity.x = 0;
      }
      
      // As soon as the last created platform is entirely on screen, create the next
      if(this.currentPlatform.length && this.currentPlatform.children[this.currentPlatform.length - 1].right < this.game.world.width){
        this.createPlatform();
      }

      //kill coins that leave the screen
      this.coinsPool.forEachAlive(function(coin){
        if(coin.right <= 0){
          coin.kill();
        }
      }, this);

      // Jump managment
      if(this.cursors.up.isDown || this.game.input.activePointer.isDown){
        this.playerJump();
      }else if(this.cursors.up.isUp || this.game.input.activePointer.isUp){
        this.isJumping = false;
      }
      
      // Check if player needs to die
      if(this.player.top >= this.game.world.height || this.player.right <= 0){
        this.gameOver();
      }  
    }
    
  }

  playerJump(){
    if(this.player.body.touching.down || (this.isFalling && !this.hasDoubleJumped)){
      // Starting point of the jump
      this.startJumpY = this.player.y;

      this.isJumping = true;
      this.jumpPeaked = false;
      this.isFalling = false;

      this.player.body.velocity.y = -300;

      if(this.player.body.touching.down){
        this.hasDoubleJumped = false;
      }else{
        this.hasDoubleJumped = true;
      }
    }else if(this.isJumping && !this.jumpPeaked){
      // Accumulate jump if still pressed
      var distanceJumped = this.startJumpY - this.player.y;

      if(distanceJumped <= this.maxJumpDistance){
        this.player.body.velocity.y = -300;
      }else{
        this.jumpPeaked = true;
      }
    }else if(!this.isJumping){
      this.isFalling = true;
    }
  }

  loadLevel(){

    this.createPlatform();
  }

  createPlatform(){
    var nextPlatformData = this.generateRandomPlatform();

    if(nextPlatformData){

      this.currentPlatform = this.platformPool.getFirstDead();

      if(!this.currentPlatform){
        this.currentPlatform = new /*MrHop.*/Platform(this.game, this.floorPool, nextPlatformData.numTiles, this.game.world.width + nextPlatformData.separation, nextPlatformData.y, this.levelSpeed, this.coinsPool);  
      }else{
        this.currentPlatform.prepare(nextPlatformData.numTiles, this.game.world.width + nextPlatformData.separation, nextPlatformData.y, this.levelSpeed);
      }

      

      this.platformPool.add(this.currentPlatform);
    }
  }

  generateRandomPlatform(){
    var data: any = {};

    // Distance from previous platform
    var minSeparation = 60, maxSeparation = 200;
    data.separation = (maxSeparation-minSeparation) * Math.random() + minSeparation;

    // Y
    var minDifY = -120, maxDifY = 120;
    data.y = this.currentPlatform.children[0].y + (maxDifY - minDifY) * Math.random() + minDifY;
    data.y = Math.max(150, data.y);
    data.y = Math.min(this.game.world.height - 50, data.y);
    
    // number of tiles
    var minTiles = 1, maxTiles = 6;
    data.numTiles = (maxTiles-minTiles) * Math.random() + minTiles;

    return data;
  }

  collectCoin(player, coin){
    coin.kill();

    this.myCoins++;

    this.coinsCountLabel.text = this.myCoins;

    this.coinSound.play();

    this.updateLevelSpeed();
  }

  gameOver(){
    this.player.kill();

    this.updateHighscore();

    // Game over overlay
    this.overlay = this.add.bitmapData(this.game.width, this.game.height);
    this.overlay.ctx.fillStyle = '#000';
    this.overlay.ctx.fillRect(0, 0, this.game.width, this.game.height);

    // Sprite for the overlay
    this.panel = this.add.sprite(0, this.game.height, this.overlay);
    this.panel.alpha = .55;

    // Overlay raising tween animation
    var gameOverPanelAnim = this.add.tween(this.panel);
    gameOverPanelAnim.to({y: 0}, 500);

    // Stop all movements once overlay reaches the top
    gameOverPanelAnim.onComplete.add(function(){
      this.background.stopScroll();
      this.water.stopScroll();

      var textStyle = { font: '30px Arial', fill: 'white' };
      this.add.text(this.game.width / 2, this.game.height / 2, 'Game Over', textStyle)
          .anchor.setTo(.5);

      textStyle = { font: '20px Arial', fill: 'white' };
      this.add.text(this.game.width / 2, this.game.height / 2 + 50, 'High Score: '+this.highScore, textStyle)
          .anchor.setTo(.5);

      this.add.text(this.game.width / 2, this.game.height / 2 + 80, 'Score: '+this.myCoins, textStyle)
          .anchor.setTo(.5);

      textStyle = { font: '10px Arial', fill: 'white' };
      this.add.text(this.game.width / 2, this.game.height / 2 + 120, 'Tap to play again', textStyle)
          .anchor.setTo(.5);

      this.game.input.onDown.addOnce(this.restart, this);

    }, this);

    gameOverPanelAnim.start();
  }

  restart(){
    // Bug with tileSprite on v2.3, have to remove sprites before restart
    this.game.world.remove(this.background);
    this.game.world.remove(this.water);

    this.game.state.start('Game');
  }

  updateHighscore(){
    this.highScore = +localStorage.getItem('MrHop::highScore');

    // Do we have a new highScore ?
    if(this.highScore < this.myCoins){
      this.highScore = this.myCoins;

      // Save new highScore
      localStorage.setItem('MrHop::highScore', this.highScore.toString());
    }
  }

  updateLevelSpeed(){
    this.levelSpeed += 10;

    this.background.autoScroll(-this.levelSpeed / 7, 0);
    this.water.autoScroll(-this.levelSpeed * 1.2, 0);
  }

  // render(){
  //   this.game.debug.body(this.player);
  //   this.game.debug.bodyInfo(this.player, 0, 30);
  // }
};
