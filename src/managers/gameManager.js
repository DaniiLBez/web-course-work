class GameManager {
  constructor() {
    this.factory = new Factory()

    this.factory.registerType('Player', Player)
    this.factory.registerType('Enemy', Enemy)
    this.factory.registerType('Cannon', Cannon)
    this.factory.registerType('Heal', Heal)
    this.factory.registerType('Coin', Coin)
    this.factory.registerType('Door', Door)

    this.entities = []
    this.player = null
    this.laterKill = []
    this.score = 0
    this.gameOverFlag = false
    this.lvl = 1
    this.levels = ['../storage/map/level1.json', '../storage/map/level2.json']
  }

  initPlayer(obj) {
    this.player = obj
  }

  kill(obj) {
    this.laterKill.push(obj)
  }

  update() {
    if (this.player === null) {
      return
    }

    this.player.velocity.x = 0

    if (eventManager.keys.d.pressed) this.player.velocity.x = 3
    else if (eventManager.keys.a.pressed) this.player.velocity.x = -3

    this.entities.forEach(e => {
      try {
        if (e.name.match(/Enemy[(\d|\-*)]/)) e.move(this.player)
        if (e.name.match(/Cannon[\d]/))
          if (e.frames.elapsedFrames - e.lastAttack > 200) {
            e.attack(this.player)
          }
        e.update()
      } catch (ex) {
        console.log(ex)
      }
    })

    this.laterKill.forEach(killObj => {
      const idx = this.entities.indexOf(killObj)
      if (idx > -1) {
        this.entities.splice(idx, 1)
      }
    })

    if (this.laterKill.length > 0) {
      this.laterKill.length = 0
    }

    this.updateHeals()
    this.updateScore()

    mapManager.draw(c)
    this.draw(c)
  }

  draw(ctx) {
    this.entities.forEach(e => e.draw(ctx))
  }

  loadAll(ctx, lvl) {
    this.lvl = lvl
    mapManager.loadMap(this.levels[this.lvl - 1])
    spriteManager.loadAtlas(
      '../storage/sprites/atlas.json',
      '../storage/sprites/spritesheet.png'
    )

    mapManager.parseEntities()
    mapManager.draw(ctx)
  }

  play() {
    if (!gameManager.gameOverFlag) {
      window.requestAnimationFrame(gameManager.play)
      updateWorld()
    }
  }

  gameOver() {
    this.gameOverFlag = true
    saveResult(gameManager.score, gameManager.lvl)
    window.location.href = '/highscores/index.html'
  }

  win() {
    window.location.href = '/highscores/index.html'
  }

  newLVL() {
    gameManager.score += gameManager.player.lifetimes * 100
    saveResult(gameManager.score, gameManager.lvl)
    gameManager.lvl += 1
    if (gameManager.lvl > 2) {
      gameManager.win()
      return
    }
    window.location.href = `/level${gameManager.lvl}/index.html`
  }

  updateScore = () => {
    let score = document.getElementById('scoreId')
    score.textContent = 'Текущий счет: ' + gameManager.score
  }

  updateHeals = () => {
    let score = document.getElementById('levelId')
    score.textContent = 'Количество жизней: ' + this.player.lifetimes
  }
}

function updateWorld() {
  gameManager.update()
}

const gameManager = new GameManager()
