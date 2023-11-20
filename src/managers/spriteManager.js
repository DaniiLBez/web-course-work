class SpriteManager {
  constructor() {
    this.image = new Image()
    this.sprites = []
    this.imgLoaded = false
    this.jsonLoaded = false
  }

  loadAtlas(atlasJson, atlasImg) {
    const request = new XMLHttpRequest()
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        this.parseAtlas(request.responseText)
      }
    }
    request.open('GET', atlasJson, true)
    request.send()
    this.loadImg(atlasImg)
  }

  loadImg(imgName) {
    this.image.onload = () => {
      this.imgLoaded = true
    }
    this.image.src = imgName
  }

  parseAtlas(atlasJSON) {
    const atlas = JSON.parse(atlasJSON)
    for (const obj of atlas.frames) {
      const frame = obj.frame
      this.sprites.push({
        filename: obj.filename,
        x: frame.x,
        y: frame.y,
        w: frame.w,
        h: frame.h
      })
    }
    this.jsonLoaded = true
  }

  drawSprite(ctx, obj, x, y) {
    if (!this.imgLoaded || !this.jsonLoaded) {
      setTimeout(() => this.drawSprite(ctx, obj, x, y), 100)
    } else {
      if (obj.currentAnimation.frameRate === 1) {
        const sprite = this.getSprite(obj.currentAnimation.imageSrc)
        ctx.drawImage(
          this.image,
          sprite.x,
          sprite.y,
          sprite.w,
          sprite.h,
          x,
          y,
          sprite.w,
          sprite.h
        )
        obj.frames.elapsedFrames++
      } else {
        const sprite = this.getSprite(obj.currentAnimation.imageSrc)

        const cropbox = {
          position: {
            x:
              sprite.x +
              (sprite.w / obj.currentAnimation.frameRate) *
                (obj.frames.currentFrame % obj.currentAnimation.frameRate),
            y: sprite.y
          },
          width: sprite.w / obj.currentAnimation.frameRate,
          height: sprite.h
        }

        ctx.drawImage(
          this.image,
          cropbox.position.x,
          cropbox.position.y,
          cropbox.width,
          cropbox.height,
          x,
          y,
          cropbox.width,
          sprite.h
        )
        this.updateFrames(obj)
      }
    }
  }

  getSprite(name) {
    for (let i = 0; i < this.sprites.length; i++) {
      const s = this.sprites[i]
      if (s.filename === name) {
        return s
      }
    }
    return null
  }

  updateFrames(obj) {
    obj.frames.elapsedFrames++

    if (obj.frames.elapsedFrames % obj.currentAnimation.frameBuffer === 0) {
      if (obj.frames.currentFrame < obj.currentAnimation.frameRate - 1)
        obj.frames.currentFrame++
      else if (obj.currentAnimation.loop === false)
        obj.currentAnimation.finished = true
      else obj.frames.currentFrame = 0
    }
  }
}

const spriteManager = new SpriteManager()
