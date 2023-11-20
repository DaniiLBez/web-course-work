class PhysicManager {
  update = obj => {
    obj.position.x += obj.velocity.x

    this.updateHitbox(obj)

    this.checkForHorizontalCollision(obj)
    this.applyGravity(obj)
    this.updateHitbox(obj)

    this.checkForVerticalCollisions(obj)
  }

  checkForHorizontalCollision(obj) {
    for (let i = 0; i < mapManager.collision.length; i++) {
      const collisionBlock = mapManager.collision[i]

      // if a collision exists
      if (
        obj.hitbox.position.x <=
          collisionBlock.position.x + collisionBlock.width &&
        obj.hitbox.position.x + obj.hitbox.width >= collisionBlock.position.x &&
        obj.hitbox.position.y + obj.hitbox.height >=
          collisionBlock.position.y &&
        obj.hitbox.position.y <=
          collisionBlock.position.y + collisionBlock.height
      ) {
        // collision on x axis going to the left
        if (obj.velocity.x < -0) {
          const offset = obj.hitbox.position.x - obj.position.x
          obj.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01
          break
        }

        if (obj.velocity.x > 0) {
          const offset =
            obj.hitbox.position.x - obj.position.x + obj.hitbox.width
          obj.position.x = collisionBlock.position.x - offset - 0.01
          break
        }
      }
    }
  }

  checkForVerticalCollisions(obj) {
    for (let i = 0; i < mapManager.collision.length; i++) {
      const collisionBlock = mapManager.collision[i]

      // if a collision exists
      if (
        obj.hitbox.position.x <=
          collisionBlock.position.x + collisionBlock.width &&
        obj.hitbox.position.x + obj.hitbox.width >= collisionBlock.position.x &&
        obj.hitbox.position.y + obj.hitbox.height >=
          collisionBlock.position.y &&
        obj.hitbox.position.y <=
          collisionBlock.position.y + collisionBlock.height
      ) {
        if (obj.velocity.y < 0) {
          obj.velocity.y = 0
          const offset = obj.hitbox.position.y - obj.position.y
          obj.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01
          break
        }

        if (obj.velocity.y > 0) {
          obj.velocity.y = 0
          const offset =
            obj.hitbox.position.y - obj.position.y + obj.hitbox.height
          obj.position.y = collisionBlock.position.y - offset - 0.1
          break
        }
      }
    }
  }

  applyGravity(obj) {
    obj.velocity.y += obj.gravity
    obj.position.y += obj.velocity.y
  }

  updateHitbox(obj) {
    obj.hitbox = {
      position: {
        x: obj.position.x + obj.hitboxOffset.xOffset,
        y: obj.position.y + obj.hitboxOffset.yOffset
      },
      width: obj.hitbox.width,
      height: obj.hitbox.height
    }
  }

  intersects = (obj1, obj2) => {
    return (
      obj1.hitbox.position.x < obj2.hitbox.position.x + obj2.hitbox.width &&
      obj1.hitbox.position.x + obj1.hitbox.width > obj2.hitbox.position.x &&
      obj1.hitbox.position.y < obj2.hitbox.position.y + obj2.hitbox.height &&
      obj1.hitbox.position.y + obj1.hitbox.height > obj2.hitbox.position.y
    )
  }

  entityAtXY = (obj, x, y) => {
    for (let i = 0; i < gameManager.entities.length; i++) {
      let e = gameManager.entities[i]
      if (e.name !== obj.name && physicManager.intersects(obj, e)) {
        return e
      }
    }
    return null
  }

  checkCollisionWithSurface(obj) {
    for (let i = 0; i < mapManager.collision.length; i++) {
      const collisionBlock = mapManager.collision[i]

      if (
        obj.hitbox.position.x <
          collisionBlock.position.x + collisionBlock.width &&
        obj.hitbox.position.x + obj.hitbox.width > collisionBlock.position.x &&
        obj.hitbox.position.y <
          collisionBlock.position.y + collisionBlock.height &&
        obj.hitbox.position.y + obj.hitbox.height > collisionBlock.position.y
      ) {
        return true
      }
    }
    return false
  }
}

const physicManager = new PhysicManager()
