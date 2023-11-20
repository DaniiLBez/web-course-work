class Player extends Entity {
  constructor() {
    super()

    this.lifetimes = 3

    this.velocity = {
      x: 0,
      y: 0
    }

    this.hitboxOffset = {
      xOffset: 18,
      yOffset: 18
    }

    this.hitbox = {
      position: {
        x: this.position.x + this.hitboxOffset.xOffset,
        y: this.position.y + this.hitboxOffset.yOffset
      },
      width: 40,
      height: 26
    }

    this.animations = animation.PLAYER

    this.frames = {
      elapsedFrames: 0,
      currentFrame: 0
    }

    this.currentAnimation = this.animations.idleRight

    this.direction = 'right'
  }

  draw() {
    spriteManager.drawSprite(c, this, this.position.x, this.position.y)
    if (this.currentAnimation.finished) {
      this.switchAnimation(
        this.direction === 'right' ? 'idleRight' : 'idleLeft'
      )
    }
  }

  update() {
    physicManager.update(this)
  }

  switchAnimation(type) {
    if (this.currentAnimation.imageSrc === this.animations[type].imageSrc)
      return
    this.currentAnimation = this.animations[type]
    this.currentFrame = 0
  }

  attack() {
    const entity = physicManager.entityAtXY(
      this,
      this.position.x,
      this.position.y
    )
    if (entity && entity instanceof EnemyBase) {
      entity.onTouch(this) // Допустим, что у врага есть метод takeDamage()
    }
  }

  onTouch(obj) {
    if (obj instanceof EnemyBase) {
      this.switchAnimation(this.direction === 'right' ? 'hitRight' : 'hitLeft')
      this.lifetimes--
    }
    if (obj instanceof Bullet) {
      this.switchAnimation(this.direction === 'right' ? 'hitRight' : 'hitLeft')
      this.lifetimes--
    }

    if (obj instanceof Door) {
      if (eventManager.keys.spacePressed) {
        eventManager.preventInput = true
        eventManager.keys.spacePressed = false
        this.position.x = obj.position.x - 15
        this.switchAnimation('doorIn')
        gameManager.newLVL()
      }
    }

    if (obj instanceof Heal) {
      this.lifetimes++
      gameManager.score += 50
    }

    if (obj instanceof Coin) {
      gameManager.score += 200
    }

    if (this.lifetimes === 0) {
      gameManager.gameOver()
    }
  }
}
