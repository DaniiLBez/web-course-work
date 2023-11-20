class Entity {
  constructor(pos_x = 0, pos_y = 0, size_x = 0, size_y = 0) {
    this.position = { x: pos_x, y: pos_y }
    this.width = size_x
    this.height = size_y
    this.gravity = 1
  }
}
