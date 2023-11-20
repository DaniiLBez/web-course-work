function printHist() {
  let table1 = JSON.parse(localStorage.getItem('records1'))
  let table2 = JSON.parse(localStorage.getItem('records2'))

  const tables = [table1, table2]

  for (let i = 0; i < tables.length; i++) {
    tables[i] = Array.from(Object.entries(tables[i]), ([key, value]) => [
      key,
      value
    ]).sort((a, b) => {
      if (b[1] === a[1]) {
        return a[0] < b[0] ? -1 : 1
      }
      return b[1] - a[1]
    })
  }

  console.log(tables)

  for (let j = 0; j < tables.length; j++) {
    let scoresDiv = document.querySelector('.scores-line')
    let line = document.createElement(`h1`)
    line.textContent = `Уровень ${j + 1}`
    scoresDiv.appendChild(line)

    for (let i = 0; i < Math.min(3, tables[j].length); i++) {
      let scoresDiv = document.querySelector('.scores-line')
      let line = document.createElement(`h2`)
      line.id = `line${i}`
      scoresDiv.appendChild(line)

      let el = tables[j][i]
      if (el !== undefined) {
        line.textContent = tables[j][i][0] + '. . . . . . . ' + tables[j][i][1]
      }
    }
  }
}

function restart() {
  window.location.href = 'https://localhost/'
}

setData = () => {
  let name = document.getElementById('playerId')
  name.textContent = 'Игрок: ' + localStorage.getItem('game.username')
}

saveResult = (score, lvl) => {
  let name = localStorage.getItem('game.username')
  let highscore = localStorage.getItem(`records${lvl}`)
  let table

  if (highscore) {
    table = JSON.parse(localStorage.getItem(`records${lvl}`))
  } else {
    table = {}
  }

  let element = [name, score]

  if (!table[element[0]] || Number(table[element[0]]) < Number(element[1])) {
    table[element[0]] = element[1]
  }

  localStorage.setItem(`records${lvl}`, JSON.stringify(table))
}

Array.prototype.parse2D = function (len) {
  const rows = []
  for (let i = 0; i < this.length; i += len) {
    rows.push(this.slice(i, i + len))
  }

  return rows
}

Array.prototype.createObjectsFrom2D = function () {
  const objects = []
  this.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        const block = new CollisionBlock({
          position: {
            x: x * 32,
            y: y * 32
          }
        })

        if ([16, 17, 18, 19, 20, 264, 265, 266, 267].includes(symbol))
          block.height = 14

        objects.push(block)
      }
    })
  })

  return objects
}

calculateInitialVelocity = ({ pos_x, pos_y }, target, gravity = 1) => {
  const deltaX = target.x - pos_x
  const deltaY = target.y - pos_y
  const time = 50 // Примерное время движения в миллисекундах

  const vx = deltaX / time / 1000

  // Вертикальная составляющая скорости с учетом гравитации
  const vy = deltaY / time + gravity * (time / 1000)

  return { vx, vy }
}

const animation = {
  PLAYER: {
    idleRight: {
      frameRate: 11,
      frameBuffer: 1,
      loop: true,
      imageSrc: '01-King Human/IdleRight (78x58).png'
    },
    idleLeft: {
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: '01-King Human/IdleLeft (78x58).png'
    },
    runRight: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: '01-King Human/RunRight (78x58).png'
    },
    runLeft: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: '01-King Human/RunLeft (78x58).png'
    },
    attackRight: {
      frameRate: 3,
      frameBuffer: 2,
      loop: false,
      imageSrc: '01-King Human/AttackRight (78x58).png'
    },
    attackLeft: {
      frameRate: 3,
      frameBuffer: 15,
      loop: false,
      imageSrc: '01-King Human/AttackLeft (78x58).png'
    },
    hitRight: {
      frameRate: 2,
      frameBuffer: 8,
      loop: false,
      imageSrc: '01-King Human/HitRight (78x58).png'
    },
    hitLeft: {
      frameRate: 2,
      frameBuffer: 8,
      loop: false,
      imageSrc: '01-King Human/HitLeft (78x58).png'
    },
    doorIn: {
      frameRate: 8,
      frameBuffer: 4,
      loop: false,
      imageSrc: '01-King Human/Door In (78x58).png'
    }
  },
  ENEMY: {
    idleRight: {
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: '03-Pig/IdleRight (34x28).png'
    },
    idleLeft: {
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: '03-Pig/IdleLeft (34x28).png'
    },
    runRight: {
      frameRate: 6,
      frameBuffer: 4,
      loop: true,
      imageSrc: '03-Pig/RunRight (34x28).png'
    },
    runLeft: {
      frameRate: 6,
      frameBuffer: 4,
      loop: true,
      imageSrc: '03-Pig/RunLeft (34x28).png'
    },
    attackRight: {
      frameRate: 5,
      frameBuffer: 12,
      loop: false,
      imageSrc: '03-Pig/AttackRight (34x28).png'
    },
    attackLeft: {
      frameRate: 5,
      frameBuffer: 12,
      loop: false,
      imageSrc: '03-Pig/AttackLeft (34x28).png'
    },
    hit: {
      frameRate: 2,
      frameBuffer: 16,
      loop: false,
      imageSrc: '03-Pig/Hit (34x28).png'
    }
  },
  CANNON: {
    attack: {
      frameRate: 4,
      frameBuffer: 8,
      loop: false,
      imageSrc: '10-Cannon/Shoot (44x28).png'
    },
    idle: {
      frameRate: 1,
      frameBuffer: 1,
      loop: true,
      imageSrc: '10-Cannon/Idle.png'
    }
  },
  BULLET: {
    idle: {
      frameRate: 1,
      frameBuffer: 0,
      loop: true,
      imageSrc: '10-Cannon/Cannon Ball.png'
    }
  },
  KING: {
    idleRight: {
      frameRate: 12,
      frameBuffer: 2,
      loop: true,
      imageSrc: '02-King Pig/IdleRight (38x28).png'
    },
    idleLeft: {
      frameRate: 12,
      frameBuffer: 2,
      loop: true,
      imageSrc: '02-King Pig/Idle (38x28).png'
    },
    runRight: {
      frameRate: 6,
      frameBuffer: 4,
      loop: true,
      imageSrc: '02-King Pig/RunRight (38x28).png'
    },
    runLeft: {
      frameRate: 6,
      frameBuffer: 4,
      loop: true,
      imageSrc: '02-King Pig/Run (38x28).png'
    },
    attackRight: {
      frameRate: 5,
      frameBuffer: 12,
      loop: false,
      imageSrc: '02-King Pig/AttackRight (38x28).png'
    },
    attackLeft: {
      frameRate: 5,
      frameBuffer: 12,
      loop: false,
      imageSrc: '02-King Pig/Attack (38x28).png'
    },
    hit: {
      frameRate: 2,
      frameBuffer: 16,
      loop: false,
      imageSrc: '02-King Pig/Hit (38x28).png'
    }
  },
  HEAL: {
    idle: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: '12-Live and Coins/Big Heart Idle (18x14).png'
    },
    hit: {
      frameRate: 2,
      frameBuffer: 8,
      loop: false,
      imageSrc: '12-Live and Coins/Big Heart Hit (18x14).png'
    }
  },
  COIN: {
    idle: {
      frameRate: 10,
      frameBuffer: 4,
      loop: true,
      imageSrc: '12-Live and Coins/Big Diamond Idle (18x14).png'
    },
    hit: {
      frameRate: 2,
      frameBuffer: 8,
      loop: false,
      imageSrc: '12-Live and Coins/Big Diamond Hit (18x14).png'
    }
  },
  DOOR: {
    idle: {
      frameRate: 1,
      frameBuffer: 1,
      loop: true,
      imageSrc: '11-Door/Idle.png'
    },
    open: {
      frameRate: 5,
      frameBuffer: 15,
      loop: false,
      imageSrc: '11-Door/Opening (46x56).png'
    }
  }
}
