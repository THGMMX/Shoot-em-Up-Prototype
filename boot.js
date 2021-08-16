const gameData = {
  
  seaScrollSpeed: 12,
  playerSpeed: 300,
  enemyMinYVelocity: 30,
  enemyMaxYVelocity: 60,
  shooterMinVelocity: 30,
  shooterMaxVelocity: 80,
  bossYVelocity: 15,
  bossXVelocity: 200,
  bulletVelocity: 500,
  enemyBulletVelocity: 150,
  powerUpVelocity: 100,

  spawnEnemyDelay: Phaser.Timer.SECOND,
  spawnShooterDelay: Phaser.Timer.SECOND * 3,

  shootDelay: Phaser.Timer.SECOND * 0.1,
  shooterShotDelay: Phaser.Timer.SECOND * 2,
  bossShotDelay: Phaser.Timer.SECOND,

  enemyHealth: 1,
  shooterHealth: 5,
  bossHealth: 500,

  bulletDamage: 1,
  crashDamage: 5,

  enemyReward: 100,
  shooterReward: 400,
  bossReward: 10000,
  powerUpReward: 100,

  enemyDropRate: 0.3,
  shooterDropRate: 0.5,
  bossDropRate: 0,

  playerLives: 3,
  playerGhostTime: Phaser.Timer.SECOND * 3,

  instructionExpire: Phaser.Timer.SECOND * 2,
  returnMessageDelay: Phaser.Timer.SECOND * 2
};

/*gameData.Boot = function (game) {

};

gameData.Boot.prototype = {

  init: function () {

    //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
    this.input.maxPointers = 1;

    //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
    // this.stage.disableVisibilityChange = true;

    if (this.game.device.desktop) {
      //  If you have any desktop specific settings, they can go in here
    } else {
      //  Same goes for mobile settings.
      //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(480, 260, 1024, 768);
      this.scale.forceLandscape = true;
    }
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  },

  preload: function () {

    //  Here we load the assets required for our preloader (in this case a loading bar)
    this.load.image('preloaderBar', 'assets/preloader-bar.png');

  },

  create: function () {

    //  By this point the preloader assets have loaded to the cache, we've set the game settings
    //  So now let's start the real preloader going
    this.state.start('Preloader');

  }

};*/
