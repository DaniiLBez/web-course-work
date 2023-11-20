class Enemy extends EnemyBase {
  constructor() {
    super()

    this.lastAttack = 0
    this.lifetimes = 3

    this.velocity = {
      x: 0,
      y: 0
    }

    this.hitboxOffset = {
      xOffset: 8,
      yOffset: 12
    }

    this.hitbox = {
      position: {
        x: this.position.x + this.hitboxOffset.xOffset,
        y: this.position.y + this.hitboxOffset.yOffset
      },
      width: 20,
      height: 14
    }

    this.animations = animation.ENEMY

    this.frames = {
      elapsedFrames: 0,
      currentFrame: 0
    }

    this.currentAnimation = this.animations.idleLeft

    this.direction = 'left'
  }

  draw() {
    spriteManager.drawSprite(c, this, this.position.x, this.position.y)
    if (this.currentAnimation.finished) {
      this.switchAnimation(
        this.direction === 'right' ? 'idleRight' : 'idleLeft'
      )
    }
  }

  onTouch(obj) {
    if (obj instanceof Player) {
      this.switchAnimation('hit')
      this.lifetimes--
    }
    if (this.lifetimes === 0) {
      gameManager.score += 150
      this.kill()
    }
  }

  kill() {
    if (this.name.match(/Enemy[\-*)]/)) gameManager.player.canOut = true
    gameManager.kill(this)
  }

  update() {
    physicManager.update(this)
  }

  move(player) {
    const speed = 2 // Скорость движения врага

    // Вычисляем вектор направления от врага к игроку
    const directionX = player.hitbox.position.x - this.hitbox.position.x
    const directionY =
      player.hitbox.position.y -
      (this.hitbox.position.y + player.hitbox.height - this.hitbox.height)

    // Нормализуем вектор, чтобы получить единичный вектор направления
    const length = Math.sqrt(directionX ** 2 + directionY ** 2)

    if (this.name.match(/Enemy[\-*)]/) ? length > 60 : length > 100) {
      this.switchAnimation(
        this.direction === 'right' ? 'idleRight' : 'idleLeft'
      )
      return
    }

    const normalizedDirectionX = directionX / length
    const normalizedDirectionY = directionY / length

    // Обновляем позицию врага, двигая его в направлении игрока
    this.position.x += normalizedDirectionX * speed
    this.position.y += normalizedDirectionY * speed

    // Определяем направление врага в зависимости от движения по координате X
    this.direction = normalizedDirectionX > 0 ? 'right' : 'left'

    // Переключаем анимацию на бег в нужную сторону
    this.switchAnimation(this.direction === 'right' ? 'runRight' : 'runLeft')

    const entity = physicManager.entityAtXY(
      this,
      this.position.x,
      this.position.y
    )
    if (entity instanceof Player) {
      this.attack(entity)
    }
  }

  switchAnimation(type) {
    if (this.currentAnimation.imageSrc === this.animations[type].imageSrc)
      return
    this.currentAnimation = this.animations[type]
    this.currentFrame = 0
  }

  attack(obj) {
    const elFrames = this.frames.elapsedFrames
    if (elFrames - this.lastAttack < 150) {
      return
    }
    this.lastAttack = elFrames
    this.switchAnimation(
      this.direction === 'right' ? 'attackRight' : 'attackLeft'
    )
    obj.onTouch(this)
  }
}
