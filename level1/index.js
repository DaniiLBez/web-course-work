const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 32 * 16 // 1024
canvas.height = 32 * 10 // 576

setData()
gameManager.loadAll(c, 1)
gameManager.play()
