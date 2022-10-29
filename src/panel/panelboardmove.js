var panelboard = document.getElementById('panelboard')
var canvas = document.getElementById('canvas')
let panelboard_lock = true
let x = 0

const lock = () => {
    panelboard_lock = true
    panelboard.style.cursor = "default"
}

const unlock = () => {
    panelboard_lock = false
    panelboard.style.cursor = "move"
}

window.addEventListener("blur", () => { lock() })
panelboard.onmousedown = function (e) {
    x = e.pageX - panelboard.offsetLeft
    unlock()
}
panelboard.onmouseup = function (e) { lock() }
panelboard.onmousemove = function (e) {
    e.preventDefault()
    if (!panelboard_lock) {
        let left = e.pageX - x
        let max = window.innerWidth - panelboard.offsetWidth
        if (left < 0) left = 0
        if (left > max) left = max

        panelboard.style.left = left + "px"
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