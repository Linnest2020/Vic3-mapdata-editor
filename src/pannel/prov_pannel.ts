import {full_data} from "../index.js"

let prov_pannelboard = document.getElementById("prov_pannelboard") as HTMLDivElement
let btn = prov_pannelboard.querySelector("button") as HTMLButtonElement
let inp = prov_pannelboard.querySelector("input") as HTMLInputElement

const getrandomhexname = () => "x"+(Math.ceil(Math.random()*255).toString(16).padStart(2, '0') + Math.ceil(Math.random()*255).toString(16).padStart(2, '0') + Math.ceil(Math.random()*255).toString(16).padStart(2, '0')).toUpperCase()

btn.onclick = function(e) {
    let color = getrandomhexname()
    while (Object.keys(full_data.colormap).indexOf(color)>-1) color = getrandomhexname()
    inp.value = color
    let tar = e.target as HTMLButtonElement
    tar.style.background = "#" + color.replace("x","")
}