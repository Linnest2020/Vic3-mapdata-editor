import { full_data } from "../index.js"

let prov_panelboard = document.getElementById("prov_panelboard")

const getrandomhexname = () => "x" + (Math.ceil(Math.random() * 255).toString(16).padStart(2, '0') + Math.ceil(Math.random() * 255).toString(16).padStart(2, '0') + Math.ceil(Math.random() * 255).toString(16).padStart(2, '0')).toUpperCase()

prov_panelboard.querySelector("button").onclick = function (e) {
    let color = getrandomhexname()
    while (Object.keys(full_data.colormap).indexOf(color) > -1) color = getrandomhexname()
    prov_panelboard.querySelector("input").value = color
    e.target.style.background = "#" + color.replace("x", "")
}