var pannelboard = document.getElementById('pannelboard')
var canvas = document.getElementById('canvas')
let pannelboard_lock = true
let x = 0

const lock = () => {
    pannelboard_lock = true
    pannelboard.style.cursor = "default"
}

const unlock = () => {
    pannelboard_lock = false
    pannelboard.style.cursor = "move"
}

window.addEventListener("blur", () => { lock() })
pannelboard.onmousedown = function (e) {
    x = e.pageX - pannelboard.offsetLeft
    unlock()
}
pannelboard.onmouseup = function (e) { lock() }
pannelboard.onmousemove = function (e) {
    e.preventDefault()
    if (!pannelboard_lock) {
        let left = e.pageX - x
        let max = window.innerWidth - pannelboard.offsetWidth
        if (left < 0) left = 0
        if (left > max) left = max

        pannelboard.style.left = left + "px"
    }

}


// let canvas_lock = true
// window.addEventListener("blur", () => { canvas_lock = true })
// canvas.onmousedown = function (e) {
//     x = e.pageX - canvas.offsetLeft
//     canvas_lock = false
// }
// canvas.onmouseup = function (e) { canvas_lock = true }
// canvas.onmousemove = function (e) {
//     e.preventDefault()
//     if (!canvas_lock) {
//         let left = e.pageX - x
//         let max = window.innerWidth - canvas.offsetWidth
//         if (left < 0) left = 0
//         if (left > max) left = max

//         canvas.style.left = left + "px"
//     }

// }