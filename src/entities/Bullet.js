class Bullet extends Entity {
  static bulletCount = 0
  constructor(pos_x, pos_y, xSpeed, ySpeed) {
    super(pos_x, pos_y, 44, 28)

    this.hitboxOffset = {
      xOffset: 23,
      yOffset: 13
    }

    this.hitbox = {
      position: {
        x: this.position.x + this.hitboxOffset.xOffset,
        y: this.position.y + this.hitboxOffset.yOffset
      },
      width: 12,
      height: 12
    }

    this.animations = animation.BULLET

    this.currentAnimation = this.animations.idle

    this.frames = {
      elapsedFrames: 0,
      currentFrame: 0
    }

    this.speed = 10 // Скорость полета пули

    // Устанавливаем начальную скорость ядра
    this.velocity = {
      x: xSpeed * this.speed,
      y: ySpeed * this.speed
    }
  }

  draw() {
    spriteManager.drawSprite(c, this, this.position.x, this.position.y)
  }

  update() {
    physicManager.update(this)
    const entity = physicManager.entityAtXY(this)
    if (entity !== null || physicManager.checkCollisionWithSurface(this)) {
      if (entity instanceof Player) entity.onTouch(this)
      this.kill()
    }
  }

  onTouch(obj) {
    if (obj instanceof Player) {
      obj.onTouch(this)
      this.kill()
    }
  }

  kill() {
    gameManager.kill(this)
  }
}
