/* LÓGICA DO JOGO:

1) Preload - Seção onde as imagens serão precarregadas para evitar perda de
perfomance devido ao carregamento durante o jogo;

2) Create - Depois de pré-carregar as imagens, irei começar a fazer o setup 
inicial do jogo;

Game Loop:

3) Update - Depois de 60FPSm essa função será chamada para fazer um update
do jogo. Coisas a serem implementadas aqui:
  a) colição com inimigos;
  b) criação de inimigos em pontos aleatórios;
  c) mover os personagens;

4) Render - é onde será implementado o Draw para que apareçam as coisas na
tela. */



gameData.Game = function (game) {

};

gameData.Game.prototype = {

  // Carrega as imagens - 
  preload: function () {
   
    /* Carrega o tile do background
    load.image(key, url, overwrite)
    key = string de ID do asset;
    url = local onte está a imagem;
    overwrite (opicional) = retorna um booleano que apaga outro asset com
    o mesmo key. O default é false.
    */
    this.load.image('sea', 'assets/sea.png');

    // Carrega a bala
    this.load.image('bullet', 'assets/bullet.png');

    /* Carrega os frames dos sprites dos inimigos -
    load.spritesheet(key, url, frameWidth, frameHeight, frameMax, margin, spacing)
    key = string de ID do asset;
    url = local onte está a imagem;
    frameWidth e frameHeight = dimensões de cada frame;
    frameMax (opicional) = em quantos frames a imagem será dividida;
    Se não especificado, dividirá a imagem inteira (default igual a -1);
    margin e spacing = especificam se existe uma margem ou espaço entre frames.
    */
    this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32);

    // Carrega a animação de explosão
    this.load.spritesheet('explosion', 'assets/explosion.png', 32, 32);

    // Carrega o sprite do jogador
    this.load.spritesheet('player', 'assets/player.png', 64, 64);
    
  },

  // Cria as imagens
  create: function () {

  // Este trecho foi adicionado após eu reorganizar o código
  this.setupBackground();
  this.setupPlayer();
  this.setupEnemies();
  this.setupBullets();
  this.setupExplosions();
  this.setupText();

  // retorna um objeto contento 4 keys - Setas para cima, baixo, esquera e direita
  this.cursors = this.input.keyboard.createCursorKeys();
  },

  update: function () {

    // Este trecho foi adicionado após eu reorganizar o código
    this.checkCollisions();
    this.spawnEnemies();
    this.playerInput();
    this.clearText(); 
  },

  // função para disparar balas à frente do sprite do jogador
  fire: function() {
    
    /* condição para checar a variável nextShotAt e, eventualmente, mudar ela 
    time.now acrescenta continuamente milesegundos a partir de um determinado momento */
    // Não será usado na versão final
    // if (this.nextShotAt > this.time.now) {
    
    if (!this.player.alive || this.nextShotAt > this.time.now) {
      return;
    };

    if (this.bulletPool.countDead() === 0) {
      return;
    };

    this.nextShotAt = this.time.now + this.shotDelay;

    /* Não será usado na versão final
    let bullet = this.add.sprite(this.player.x, this.player.y - 20, 'bullet');
    bullet.anchor.setTo(0.5, 0.5);
    this.physics.enable(bullet, Phaser.Physics.ARCADE);
    bullet.body.velocity.y = -500;
    this.bullets.push(bullet);*/

    // Acha o primeiro sprite de bala apagado no conjunto
    let bullet = this.bulletPool.getFirstExists(false);

    // Reseta o Sprite e o coloca em um outro lugar
    bullet.reset(this.player.x, this.player.y - 20);

    bullet.body.velocity.y = -gameData.bulletVelocity;

  },

  // Função para definir a consequência da colisão de sprites para o inimigo
  enemyHit: function (bullet, enemy) {

    // kill apaga um sprite
    bullet.kill();
    // this.explode(enemy);
    // enemy.kill();

    this.damageEnemy(enemy, gameData.bulletDamage);

    /* Define a animação de explosão no sprite do inimigo - Não será usado na versão final
    let explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
      
      // Indica o ponto de origem da imagem
      explosion.anchor.setTo(0.5, 0.5);*/

      /* Executa a animação de explosão do inimigo
      Sem outros argumentos, a animação irá usar todos os frames do tilesheet,
      rodará a 60FPS e não executará nenhum loop. As alteração serão setadas no play*/
      // explosion.animations.add('boom');

      /* Cria a animação de explosão do inimigo. 
      Com os argumentos, a explosão rodará a 15FPS, não terá loop e apagará o sprite depois 
      do final da sequeência de animação*/
      // explosion.play('boom', 15, false, true); 
  },

  // Função para definir a consequência da colisão de sprites para o jogador
  playerHit: function (player, enemy) {

    // apaga o sprite do inimigo
    // this.explode(enemy);
    // enemy.kill();

    this.damageEnemy(enemy, gameData.crashDamage);

    /* Define a animação de explosão no sprite do jogador - Não ser;a usado na versão final
    let explosion = this.add.sprite(player.x, player.y, 'explosion');

    // Indica o ponto de origem da imagem
    explosion.anchor.setTo(0.5, 0.5);

    // executa a animação de explosão do jogador
    explosion.animations.add('boom');
    explosion.play('boom', 15, false, true);*/

    // Apaga o Sprite do jogador
    this.explode(player);
    player.kill();

    this.displayEnd(false);
  },

  // Função para reutilizar os sprites de explosão gerados 
  explode: function (sprite) {
    if (this.explosionPool.countDead() === 0) {
      return;
    }

    // Acha o primeiro sprite apagado no conjunto
    let explosion = this.explosionPool.getFirstExists(false);

    // reseta o sprite e o adiciona de novo
    explosion.reset(sprite.x, sprite.y);
    explosion.play('boom', 15, false, true);

    // reseta a velocidade da animação
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
    /* Cria os tiles carregados acima - 
    add.tileSprite(x, y, width, height, key, frame, group)
    x e y = posições;
    key = string de ID do asset;
    frame (opicional) = ID (string ou número) do frame no tilesheet;
    group (opicional) = Adiciona a imagem a um grupo*/
    // this.sea = this.add.tileSprite(0, 0, 800, 600, 'sea');

    this.sea = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'sea');

    //autoScroll() -> Faz os tiles se moverem em determinada direção com base em posições x e y 
    this.sea.autoScroll(0, gameData.seaScrollSpeed);

    // executa a animação dos tiles do background - Não será usado na versão final
    //this.sea.tilePosition.y += 0.2;
  },

  setupPlayer: function () {
    
    /* Cria o sprite do jogador
    add.sprite(x, y, width, height, key, frame, group)
    x e y = posições;
    key = string de ID do asset;
    frame (opicional) = ID (string ou número) do frame no tilesheet;
    group (opicional) = Adiciona a imagem a um grupo*/
    // this.player = this.add.sprite(400, 550, 'player');

    this.player = this.add.sprite(this.game.width / 2, this.game.height - 50, 'player');

    // Indica o ponto de origem da imagem. 0.5, 0.5 move o ponto para o centro.
    this.player.anchor.setTo(0.5, 0.5);

    /*Cria a animação do jogador -
    animations.add(name, frames, frameRate, loop, useNumericIndex)
    name = o nome da animação para esse Sprite. Ex: "run", "fire", "walk"...
    frames (opicional) = um array de números ou strings que corresponde à
    sequência de animação. O Default é null;
    frameRate = a velocidade da animação em frames por segundo;
    loop = se a animação deve ou não fazer um loop. O default é false;
    userNumericIndex = se os frames são  indicados por números ou strings.
    O default é true.*/
    this.player.animations.add('fly', [ 0, 1, 2 ], 20, true);

    /* Executa a animação
    play(name, frameRate, loop, killOnComplete)
    name = o nome da animação para esse Sprite. Ex: "run", "fire", "walk"...
    frames (opicional) = um array de números ou strings que corresponde à
    sequência de animação. Se não for passado nada, usa o da animação.
    O Default é null;
    loop = se a animação deve ou não fazer um loop. 
    Se não for passado nada, usa o da animação.
    O default é false;
    killOnComplete = apaga o Sprite após o fim da animação se for true. 
    O default é false. Só funciona se o loop for false. */ 
    this.player.play('fly');

    /* Cria as físicas para esse objeto
    physics.enable(object, system, debug)
    object = objeto ou array que vai criar uma lógica de física para um único objeto ou para vários em um array;
    sysyem = número que indica qual o sistema de física vai ser usado;
    debug = booleno que habilita o debug. Default é false.*/
    this.physics.enable(this.player, Phaser.Physics.ARCADE);

    // declara a velocidade inicial do jogador
    this.player.speed = gameData.playerSpeed;

    // Declara como verdadeiro as boundaries do contorno da tela. 
    this.player.body.collideWorldBounds = true;

    /* Define o hitbox em 20 x 20 pixels, centralizando um pouco acima
    setSize(width, height, offsetX, offsetY) -> muda o tamanho do hitbox
    OffsetX e Y = define a posição da hitbox*/
    this.player.body.setSize(20, 20, 0, -5);
  },

  setupEnemies: function () {

    /* Cria o sprite do inimigo - Não será usado na versão final do código
    this.enemy = this.add.sprite(400, 200, 'greenEnemy');

    // Cria a animação do inimigo -
    this.enemy.animations.add('fly', [ 0, 1, 2 ], 20, true);
    
    // Executa a animação
    this.enemy.play('fly');

    // Indica o ponto de origem da imagem. 0.5, 0.5 move o ponto para o centro.
    this.enemy.anchor.setTo(0.5, 0.5);

    // Cria as físicas para esse objeto
    this.physics.enable(this.enemy, Phaser.Physics.ARCADE); */


    // Cria um grupo de sprites vazio
    this.enemyPool = this.add.group();

    // Cria regra de física para o grupo de sprites
    this.enemyPool.enableBody = true;
    this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;

    // Adiciona 50 sprites de inimigos no grupo criado.
    this.enemyPool.createMultiple(50, 'greenEnemy');
    
    // Cria anchors para todos os sprites de inimigos
    this.enemyPool.setAll('anchor.x', 0.5);
    this.enemyPool.setAll('anchor.y', 0.5);

    // Apaga os sprites quando eles saem da tela.
    this.enemyPool.setAll('outOfBoundsKill', true);
    this.enemyPool.setAll('checkWorldBounds', true);
    
    /* seta uma reward por cada kill no jogo. O último argumento (true) força a aplicação
    da propriedade reward para os filhos, mesmo que não esteja lá*/
    this.enemyPool.setAll('reward', gameData.enemyReward, false, false, 0, true);

    // Cria uma animação para cada sprite no array
    this.enemyPool.forEach(function (enemy) {
      enemy.animations.add('fly', [ 0, 1, 2 ], 20, true);
    });

    // Estipula o enemy rate 
    this.nextEnemyAt = 0;
    this.enemyDelay = gameData.spawnEnemyDelay;
  },

  

  setupBullets: function () {
    
    // Cria os sprites das balas - Não será usado na versão final
    //this.bullets = [];
  
    // Cria um grupo de sprites vazio
    this.bulletPool = this.add.group();

    // Cria regra de física para o grupo de sprites
    this.bulletPool.enableBody = true;
    this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;

    /* Adiciona 100 sprites de balas no grupo criado.
    createMultiple(quantity, key, frame, exists)
    quantity = número de sprites a serem criados;
    key = string de ID do asset;
    frame = Se o tilesheet possuir múltiplos frames, é possível especigicar quais usar. 
    Default é o primeiro frame.
    exists = booleano que retorna se o sprite existe ou não. Default é false.
    */
    this.bulletPool.createMultiple(100, 'bullet');

    /* Cria anchors para todos os sprites de balas 
    setAll(key, value, checkAlive, checkVisible, operation, force) -> 
    seta uma mesma propriedade para todos os elementos do grupo criado. 
    key = string de ID do asset;
    value = valor que será definido para todos. 
    checkAlive = se for true, apenas filhos com alive=true vão ser modificados; 
    checkVisible = se for true, apenas filhos com visible=true vão ser modificados; 
    operation = controla como o valor vai ser lançado. 0 substitui o valor, 1 adiciona, 
    2 subtrai, 3 multiplica e 4 divide;
    force = booleano que se for true irá aplicar o valor aos filhos, não importando se
    existem ou não*/
    this.bulletPool.setAll('anchor.x', 0.5);
    this.bulletPool.setAll('anchor.y', 0.5);

    // Apaga os sprites das balas quando eles saem da tela.
    this.bulletPool.setAll('outOfBoundsKill', true);
    this.bulletPool.setAll('checkWorldBounds', true);

    // Estipula o fire rate das balas
    this.nextShotAt = 0;
    this.shotDelay = gameData.shootDelay;

    // Cria o sprite da bala - Não usarei na versão final 
    /* this.bullet = this.add.sprite(400, 300, 'bullet');
    
    // Indica o ponto de origem da imagem. 
    this.bullet.anchor.setTo(0.5, 0.5); 

    // Cria as lógicas de física para esse objeto
    this.physics.enable(this.bullet, Phaser.Physics.ARCADE);

    //Seta a velocidade da bala em Y
    this.bullet.body.velocity.y = -500; */
  },

  setupExplosions: function () {

    // Cria um grupo de sprites vazio
    this.explosionPool = this.add.group();

    // Cria regra de física para o grupo de sprites
    this.explosionPool.enableBody = true;
    this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;

     // Adiciona 100 sprites de inimigos no grupo criado.
    this.explosionPool.createMultiple(100, 'explosion');

    // Cria anchors para todos os sprites de explosão
    this.explosionPool.setAll('anchor.x', 0.5);
    this.explosionPool.setAll('anchor.y', 0.5);

    // Cria uma animação para cada sprite no array
    this.explosionPool.forEach(function (explosion) {
      explosion.animations.add('boom');
    });
  },

  setupText: function () {

    // Cria o texto de instruções
    //this.instructions = this.add.text( 400, 500,

    this.instructions = this.add.text(
      this.game.width / 2, this.game.height - 100,
      'Use as Setas para se mover e Espaço para atirar',
      { font: '20px Verdana', fill: '#fff', align: 'center' }
    );
    this.instructions.anchor.setTo(0.5, 0.5);
    this.instExpire = this.time.now + gameData.instructionExpire;

    // Cria o texto do Score
    this.score = 0;
    this.scoreText = this.add.text(
      this.game.width / 2, 30, '' + this.score, 
      { font: '20px monospace', fill: '#fff', align: 'center' }
    );
    this.scoreText.anchor.setTo(0.5, 0.5);
  },

  checkCollisions: function () {

    /* Cria a lógica de colisão - Não será utilizado na versão final
    overlap(object1, object2, overlapCallback, processCallback, callbackContext) -> retorna um booleano
    object1 e object2 = testa o primeiro objeto (sprite, group ou array) com o segundo objeto;
    overlapCallback (opicional) = callback que testa se há sobreposição de imagens. O primeiro objeto passado 
    sempre vem antes do segundo, a não ser que o teste seja de sprite x grupo, onde o sprite vai primeiro. 
    Default é null;
    processCallback (opicional) = callbak que permite um segundo teste. Se for ativado, overlapCallback só será chamado 
    se processCallback for true. Default é null;
    callbackContext (opicional) = objeto que representa o contexto em que as callbacks serão chamadas.
    
    // this.physics.arcade.overlap(this.bullet, this.enemy, this.enemyHit, null, this);

    // loop que detcta a sobreposição das balas com o inimigo (bullets é um array)
    for (let i = 0; i < this.bullets.length; i++) {
      this.physics.arcade.overlap(
        this.bullets[i], this.enemy, this.enemyHit, null, this
      );
    }*/

    // Cria a lógica de colisão para os inimigos
    this.physics.arcade.overlap(
      //this.bulletPool, this.enemy, this.enemyHit, null, this
      this.bulletPool, this.enemyPool, this.enemyHit, null, this
    );

    // Cria a lógica de colisão para o jogador
    this.physics.arcade.overlap(
      this.player, this.enemyPool, this.playerHit, null, this
    );

  },

  spawnEnemies: function () {

    /* Cria inimigos aleatoriamente
    coutDead(): retorna o número de elementos mortos (sprites apagados)
    getFirstExists(): retorna o primeiro elemento achado no grupo (booleano)*/
    if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {

      this.nextEnemyAt = this.time.now + this.enemyDelay;

      let enemy = this.enemyPool.getFirstExists(false);

      /* Cria o inimigo em local aleatório no topo da tela
      integerInRange() -> retorna um número inteiro incluindo o min e o max */
      //enemy.reset(this.rnd.integerInRange(20, 780), 0);
      //enemy.reset(this.rnd.integerInRange(20, this.game.width - 20), 0);

      
      /* reset(x, y, health) ->
      reseta o objeto e o coloca na posição x e y designada.
      É possível passar um valor numérico de health*/ 
      enemy.reset(
        this.rnd.integerInRange(20, this.game.width - 20), 0,
        gameData.enemyHealth
      );

      // Cria velocidades aleatórias para os inimigos
      enemy.body.velocity.y = this.rnd.integerInRange(gameData.enemyMinYVelocity, gameData.enemyMaxYVelocity);
      enemy.play('fly');
    };

  },

  damageEnemy: function (enemy, damage) {
    
    // função que irá centralizar o dano e a animação de explosão dos inimigos
    enemy.damage(damage);
    if (enemy.alive) {
      enemy.play('hit');
    } else {
      this.explode(enemy);
      this.addToScore(enemy.reward);
    }
  },

  // função que irá implementar o score e a condição de vitória
  addToScore: function (score) {
    this.score += score;
    this.scoreText.text = this.score;
    if (this.score >= 2000) {
      this.enemyPool.destroy();
      this.displayEnd(true);
    }
  },

  playerInput: function () {

    /* Ajusta o movimento do jogador.
    Ao soltar os direcionais, a velocidade vai a zero e o jogador para */
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

    // define o botão do tiro no teclado
    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      //this.fire();

      if (this.returnText && this.returnText.exists) {
        this.quitGame();
      } else {
        this.fire();
      }
    };
  },

  clearText: function () {

     // Chama um método para apagar o texto de instruções
     if (this.instructions.exists && this.time.now > this.instExpire) {
      this.instructions.destroy();
    };

    // texto para reiniciar o jogo
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
