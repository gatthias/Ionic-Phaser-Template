declare var Phaser: any;

var MrHop = MrHop || {};

MrHop.Platform = function(game, floorPool, numTiles, x, y, levelSpeed, coinsPool) {
  Phaser.Group.call(this, game);
  
  this.tileSize = 40;
  this.game = game;
  this.enableBody = true;
  this.floorPool = floorPool;
  this.coinsPool = coinsPool;
  
  this.prepare(numTiles, x, y, levelSpeed);  
};

MrHop.Platform.prototype = Object.create(Phaser.Group.prototype);
MrHop.Platform.prototype.constructor = MrHop.Platform;

MrHop.Platform.prototype.prepare = function(numTiles, x, y, levelSpeed) {
  // Make alive
  this.alive = true;

  var i = 0;
  while(i < numTiles){
    
    var floorTile = this.floorPool.getFirstExists(false);
    
    if(!floorTile) {
      floorTile = new Phaser.Sprite(this.game, x + i * this.tileSize, y, 'floor');
    }
    else {
      floorTile.reset(x + i * this.tileSize, y);
    }
      
    this.add(floorTile);    
    i++;
  }
  
  //set physics properties
  this.setAll('body.immovable', true);
  this.setAll('body.allowGravity', false);
  this.setAll('body.velocity.x', -levelSpeed);

  this.addCoins(levelSpeed);
}
MrHop.Platform.prototype.addCoins = function(levelSpeed){
  var coinsY = 90 + 110 * Math.random();
  
  var hasCoin;
  this.forEach(function(tile){
    hasCoin = Math.random() <= 0.4;

    if(hasCoin){
      // Create coin
      var coin = this.coinsPool.getFirstExists(false);

      if(!coin){
        coin = new Phaser.Sprite(this.game, tile.x, tile.y - coinsY, 'coin');
        this.coinsPool.add(coin);
      }else{
        coin.reset(tile.x, tile.y - coinsY);
      }

      coin.body.velocity.x = -levelSpeed;
      coin.body.allowGravity = false;
    }
  }, this);
}
MrHop.Platform.prototype.kill = function(){
  // Set the group dead
  this.alive = false;

  // Set all sprites dead
  this.callAll('kill');

  // Send back to floorPool
  for(var i=this.children.length - 1; i >= 0; i--){
    this.floorPool.add(this.children[i]);
  }
}

export const Platform = MrHop.Platform;