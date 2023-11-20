class Factory {
  constructor() {
    this.factory = {}
  }

  registerType(type, classReference) {
    this.factory[type] = classReference
  }

  create(type) {
    const ClassReference = this.factory[type]
    if (!ClassReference) {
      throw new Error('Unsupported type')
    }
    return new ClassReference()
  }
}
