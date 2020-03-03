console.log("hello")


var stats = null
function getStats () {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        stats = JSON.parse(this.responseText)
        resolve()
      }
    }
    xhr.open('GET', '/stats/game/EUW1/5464564', true)
    xhr.send()
  })
}

getStats().then( () =>{
	console.log(stats)
})