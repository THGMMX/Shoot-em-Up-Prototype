gameData.Game = {

  preload: function () {

    this.load.image('sea', 'assets/sea.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32);
    this.load.spritesheet('explosion', 'assets/explosion.png', 32, 32);
    this.load.spritesheet('player', 'assets/player.png', 64, 64);

  },

  create: function () {

    this.setupBackground();
    this.setupPlayer();
    this.setupEnemies();
    this.setupBullets();
    this.setupExplosions();
    this.setupText();

    this.cursors = this.input.keyboard.createCursorKeys();

  },

  update: function () {

    this.checkCollisions();
    this.spawnEnemies();
    this.playerInput();
    this.clearText(); 

  },

  fire: function() {
      
    if (!this.player.alive || this.nextShotAt > this.time.now) {
      return;
    };

    if (this.bulletPool.countDead() === 0) {
      return;
    };

    this.nextShotAt = this.time.now + this.shotDelay;
    let bullet = this.bulletPool.getFirstExists(false);
    bullet.reset(this.player.x, this.player.y - 20);
    bullet.body.velocity.y = -gameData.bulletVelocity;

  },

  enemyHit: function (bullet, enemy) {

    bullet.kill();
    this.damageEnemy(enemy, gameData.bulletDamage);

  },

  playerHit: function (player, enemy) {

    this.damageEnemy(enemy, gameData.crashDamage);
    this.explode(player);
    player.kill();

    this.displayEnd(false);

  },

  explode: function (sprite) {

    if (this.explosionPool.countDead() === 0) {
      return;
    }

    let explosion = this.explosionPool.getFirstExists(false);
    explosion.reset(sprite.x, sprite.y);
    explosion.play('boom', 15, false, true);

    explosion.body.velocity.x = sprite.body.velocity.x;
    explosion.body.velocity.y = sprite.body.velocity.y;

  },

  render: function() {
    
    // Método de debug que adiciona uma cor verde ao sprite para melhor visualização
    //this.game.debug.body(this.bullet);
    //this.game.debug.body(this.enemy);
    //this.game.debug.body(this.player);
  },

  setupBackground: function () {
   
    this.sea = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'sea');
    this.sea.autoScroll(0, gameData.seaScrollSpeed);

  },

  setupPlayer: function () {
    
    this.player = this.add.sprite(this.game.width / 2, this.game.height - 50, 'player');
    this.player.anchor.setTo(0.5, 0.5);

    this.player.animations.add('fly', [ 0, 1, 2 ], 20, true);
    this.player.play('fly');

    this.physics.enable(this.player, Phaser.Physics.ARCADE);

    this.player.speed = gameData.playerSpeed;

    this.player.body.collideWorldBounds = true;

    this.player.body.setSize(20, 20, 0, -5);

  },

  setupEnemies: function () {

    this.enemyPool = this.add.group();
    this.enemyPool.enableBody = true;
    this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;

    this.enemyPool.createMultiple(50, 'greenEnemy');
    this.enemyPool.setAll('anchor.x', 0.5);
    this.enemyPool.setAll('anchor.y', 0.5);
    this.enemyPool.setAll('outOfBoundsKill', true);
    this.enemyPool.setAll('checkWorldBounds', true);
    
    this.enemyPool.setAll('reward', gameData.enemyReward, false, false, 0, true);

    this.enemyPool.forEach(function (enemy) {
      enemy.animations.add('fly', [ 0, 1, 2 ], 20, true);
    });

    this.nextEnemyAt = 0;
    this.enemyDelay = gameData.spawnEnemyDelay;

  },

  setupBullets: function () {
    
    this.bulletPool = this.add.group();
    this.bulletPool.enableBody = true;
    this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;

    this.bulletPool.createMultiple(100, 'bullet');
    this.bulletPool.setAll('anchor.x', 0.5);
    this.bulletPool.setAll('anchor.y', 0.5);
    this.bulletPool.setAll('outOfBoundsKill', true);
    this.bulletPool.setAll('checkWorldBounds', true);

    this.nextShotAt = 0;
    this.shotDelay = gameData.shootDelay;

  },

  setupExplosions: function () {

    this.explosionPool = this.add.group();
    this.explosionPool.enableBody = true;
    this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;

    this.explosionPool.createMultiple(100, 'explosion');
    this.explosionPool.setAll('anchor.x', 0.5);
    this.explosionPool.setAll('anchor.y', 0.5);

    this.explosionPool.forEach(function (explosion) {
      explosion.animations.add('boom');
    });

  },

  setupText: function () {

    this.instructions = this.add.text(
      this.game.width / 2, this.game.height - 100,
      'Use as Setas para se mover e Espaço para atirar',
      { font: '20px Verdana', fill: '#fff', align: 'center' }
    );
    this.instructions.anchor.setTo(0.5, 0.5);
    this.instExpire = this.time.now + gameData.instructionExpire;
    this.score = 0;
    this.scoreText = this.add.text(
      this.game.width / 2, 30, '' + this.score, 
      { font: '20px monospace', fill: '#fff', align: 'center' }
    );
    this.scoreText.anchor.setTo(0.5, 0.5);

  },

  checkCollisions: function () {

    this.physics.arcade.overlap(
      this.bulletPool, this.enemyPool, this.enemyHit, null, this
    );

    this.physics.arcade.overlap(
      this.player, this.enemyPool, this.playerHit, null, this
    );

  },

  spawnEnemies: function () {

    if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {

      this.nextEnemyAt = this.time.now + this.enemyDelay;

      let enemy = this.enemyPool.getFirstExists(false);
      enemy.reset(
        this.rnd.integerInRange(20, this.game.width - 20), 0,
        gameData.enemyHealth,
      );

      enemy.body.velocity.y = this.rnd.integerInRange(gameData.enemyMinYVelocity, gameData.enemyMaxYVelocity);
      enemy.play('fly');
    };

  },

  damageEnemy: function (enemy, damage) {
    
    enemy.damage(damage);
    if (enemy.alive) {
      enemy.play('hit');
    } else {
      this.explode(enemy);
      this.addToScore(enemy.reward);
    }

  },

  addToScore: function (score) {

    this.score += score;
    this.scoreText.text = this.score;
    if (this.score >= 2000) {
      this.enemyPool.destroy();
      this.displayEnd(true);
    }

  },

  playerInput: function () {

    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -this.player.speed;
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = this.player.speed;
    };

    if (this.cursors.up.isDown) {
      this.player.body.velocity.y = -this.player.speed;
    } else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = this.player.speed;
    };

    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {

      if (this.returnText && this.returnText.exists) {
        this.quitGame();
      } else {
        this.fire();
      }
    };

  },

  clearText: function () {

     if (this.instructions.exists && this.time.now > this.instExpire) {
      this.instructions.destroy();
    };

    if (this.showReturn && this.time.now > this.showReturn) {
      this.returnText = this.add.text(
        this.game.width / 2, this.game.height / 2 + 20, 
        'Aperte espaço para reiniciar', 
        { font: '16px sans-serif', fill: '#fff'}
      );
      this.returnText.anchor.setTo(0.5, 0.5);
      this.showReturn = false;
    }

  },

  displayEnd: function (win) {

    if (this.endText && this.endText.exists) {
    return;
    }
    
    let msg = win ? 'Você venceu!!!' : 'Game Over!';

    this.endText = this.add.text( 
      this.game.width / 2, this.game.height / 2 - 60, msg, 
      { font: '72px serif', fill: '#fff' }
    );

    this.endText.anchor.setTo(0.5, 0);
    this.showReturn = this.time.now + gameData.returnMessageDelay;

  },
  
  quitGame: function (pointer) {

    this.sea.destroy();
    this.player.destroy();
    this.enemyPool.destroy();
    this.bulletPool.destroy();
    this.explosionPool.destroy();
    this.instructions.destroy();
    this.scoreText.destroy();
    this.endText.destroy();
    this.returnText.destroy();

    this.state.start('Game');
  }
};

window.onload = function() {

  const game = new Phaser.Game(800, 600, Phaser.CANVAS, document.canvas);

  game.state.add('Boot', gameData.Boot);
  game.state.add('Game', gameData.Game);
  
  game.state.start('Game');

};
