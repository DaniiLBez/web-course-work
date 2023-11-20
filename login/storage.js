function store(source) {
  let username = document.getElementById(source).value
  if (username) {
    localStorage.setItem('game.username', username)
  }
}
function read(source) {
  let username = localStorage.getItem('game.username')
  if (username) {
    let name = document.getElementById(source)
    name.value = username
  }
}
