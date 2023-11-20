class Cannon extends EnemyBase {
  constructor() {
    super()

    this.lastAttack = 0
    this.lifetimes = 3

    this.hitboxOffset = {
      xOffset: 15,
      yOffset: 6
    }

    this.velocity = {
      x: 0,
      y: 0
    }

    this.hitbox = {
      position: {
        x: this.position.x + this.hitboxOffset.xOffset,
        y: this.position.y + this.hitboxOffset.yOffset
      },
      width: 25,
      height: 20
    }

    this.animations = animation.CANNON

    this.frames = {
      elapsedFrames: 0,
      currentFrame: 0
    }

    this.currentAnimation = this.animations.idle

    this.direction = 'left'
  }

  draw() {
    spriteManager.drawSprite(c, this, this.position.x, this.position.y)
  }

  onTouch(obj) {
    if (obj instanceof Player) {
      this.lifetimes--
    }
    if (this.lifetimes === 0) {
      gameManager.score += 150
      this.kill()
    }
  }

  kill() {
    gameManager.kill(this)
  }

  update() {
    physicManager.update(this)
  }

  switchAnimation(type) {
    if (this.currentAnimation.imageSrc === this.animations[type].imageSrc) {
      this.frames.currentFrame = 0
      return
    }
    this.currentAnimation = this.animations[type]
    this.frames.currentFrame = 0
  }

  attack(obj) {
    this.lastAttack = this.frames.elapsedFrames
    const directionX = obj.position.x - this.position.x
    const directionY = obj.position.y - this.position.y

    if (directionX > 0) return

    this.switchAnimation('attack')

    const length = Math.sqrt(directionX ** 2 + directionY ** 2)
    const normalizedDirectionX = directionX / length
    const normalizedDirectionY = directionY / length

    const bullet = new Bullet(
      this.position.x - 40,
      this.position.y,
      normalizedDirectionX,
      normalizedDirectionY
    )
    bullet.name = `Bullet${++Bullet.bulletCount}`
    gameManager.entities.push(bullet)
  }
}
