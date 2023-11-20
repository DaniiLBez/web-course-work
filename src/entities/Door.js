class Door extends Entity {
  constructor() {
    super()

    this.animations = animation.DOOR

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
      width: 46,
      height: 56
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

  update() {
    physicManager.update(this)
    const entity = physicManager.entityAtXY(this)
    if (gameManager.player.canOut) this.switchAnimation('open')
    if (entity !== null) {
      if (entity instanceof Player && gameManager.player.canOut) {
        entity.onTouch(this)
      }
    }
  }

  switchAnimation(type) {
    if (this.currentAnimation.imageSrc === this.animations[type].imageSrc)
      return
    this.currentAnimation = this.animations[type]
    this.currentFrame = 0
  }
}
