class EventManager {
  keys = {
    w: {
      pressed: false
    },
    a: {
      pressed: false
    },
    d: {
      pressed: false
    }
  }

  preventInput = false

  constructor() {
    window.addEventListener('keydown', this.buttonPressedHandler)
    window.addEventListener('keyup', this.buttonReleasedHandler)
  }

  buttonPressedHandler = event => {
    if (this.preventInput) return
    switch (event.key) {
      case 'w':
        if (gameManager.player.velocity.y === 0)
          gameManager.player.velocity.y = -20
        break
      case 'a':
        this.keys.a.pressed = true
        gameManager.player.switchAnimation('runLeft')
        gameManager.player.direction = 'left'
        break
      case 'd':
        this.keys.d.pressed = true
        gameManager.player.switchAnimation('runRight')
        gameManager.player.direction = 'right'
        break
      case ' ':
        if (!this.keys.spacePressed) {
          this.keys.spacePressed = true
          gameManager.player.attack()
          gameManager.player.switchAnimation(
            gameManager.player.direction === 'right'
              ? 'attackRight'
              : 'attackLeft'
          )
        }
        break
    }
  }

  buttonReleasedHandler = event => {
    if (this.preventInput) return
    switch (event.key) {
      case 'a':
        this.keys.a.pressed = false
        gameManager.player.switchAnimation('idleLeft')
        break
      case 'd':
        this.keys.d.pressed = false
        gameManager.player.switchAnimation('idleRight')
        break
      case ' ':
        this.keys.spacePressed = false
        break
    }
  }
}

const eventManager = new EventManager()
