class Ship {
    constructor (x, y, width, height, health) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.health = health;
    this.hit = false;
    this.alive = true;
    this.vx = 0;
    this.vy = 0;
    }

    render() {
        context.fillStyle = '#666';
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    takeDamage() {
        this.health -= damage;
        if (this.health <= 0) {
          this.alive = false;
        }
    }


};

class Enemy (x, y) {
  Ship.call(this, x, y, 32, 32, Enemy.health);
  this.img = document.createElement('img');
  this.img.src = popCornSprite;
  this.frames = 12; 
  this.buffer = 4;
  this.speed = Enemy.SPEED;
  this.value = 5;
  this.healthMax = Enemy.health;
  this.reset();
}

    Enemy.prototype = new Ship(); 
    Enemy.SPEED = 5;
    Enemy.health = 80;

    Enemy.prototype.reset = function() {
        this.x = canvas.width;
        this.y = Math.random() * canvas.height - this.height;
        this.currentFrame = 0;
        this.currentBuffer = 0;
        this.alive = false;
        this.health = Enemy.health;
    }

    Enemy.prototype.update = function() {
    this.vx = -this.speed;
    this.x += this.vx;
    if (this.x + this.width <= 0) {
        this.reset();
    }
    }

    Enemy.prototype.render = function(context) {
    if (!this.alive) {
        return;
    }
    if (this.currentBuffer === this.buffer) {
        this.currentBuffer = 0;
        this.currentFrame ++;
        if (this.currentFrame === this.frames) {
        this.currentFrame = 0;
        }
    }
    context.drawImage(
        this.img, 0, this.currentFrame * 32, 32, 32,
        this.x, this.y, this.width, this.height
    )
    context.fillStyle = '#f00';
    context.fillRect(this.x, this.y - 2, this.width, 1);
    
    context.fillStyle = '#0f0';
    this.perc = this.health/ this.healthMax;
    
    context.fillRect(this.x, this.y - 2, this.width * this.perc , 1)
    
    if (this.hit) {
        let tmpOperation = context.globalCompositeOperation
        context.globalCompositeOperation = 'color-dodge';
        context.drawImage(
        this.img, 0, this.currentFrame * 32, 32, 32,
        this.x, this.y, this.width, this.height
        )
        context.drawImage(
        this.img, 0, this.currentFrame * 32, 32, 32,
        this.x, this.y, this.width, this.height
        )
        context.globalCompositeOperation = tmpOperation;
        this.hit = false;
    }
    
    this.currentBuffer++;
    }