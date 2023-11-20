class Coin extends Entity {
  constructor() {
    super()

    this.animations = animation.COIN

    this.velocity = {
      x: 0,
      y: 0
    }

    this.hitboxOffset = {
      xOffset: 0,
      yOffset: 0
    }

    this.hitbox = {
      position: {
        x: this.position.x + this.hitboxOffset.xOffset,
        y: this.position.y + this.hitboxOffset.yOffset
      },
      width: 18,
      height: 14
    }

    this.frames = {
      elapsedFrames: 0,
      currentFrame: 0
    }

    this.currentAnimation = this.animations.idle
  }

  draw() {
    spriteManager.drawSprite(c, this, this.position.x, this.position.y)
  }

  kill() {
    gameManager.kill(this)
  }

  update() {
    physicManager.update(this)
    const entity = physicManager.entityAtXY(this)
    if (entity !== null) {
      if (entity instanceof Player) entity.onTouch(this)
      this.kill()
    }
  }

  switchAnimation(type) {
    if (this.currentAnimation.imageSrc === this.animations[type].imageSrc)
      return
    this.currentAnimation = this.animations[type]
    this.currentFrame = 0
  }
}
