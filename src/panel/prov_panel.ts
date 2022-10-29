import { full_data } from "../index.js";

let prov_panelboard = document.getElementById(
    "prov_panelboard"
) as HTMLDivElement;
let btn = prov_panelboard.querySelector("button") as HTMLButtonElement;
let inp = prov_panelboard.querySelector("input") as HTMLInputElement;

const getrandomhexname = () =>
    "x" +
    (
        Math.ceil(Math.random() * 255)
            .toString(16)
            .padStart(2, "0") +
        Math.ceil(Math.random() * 255)
            .toString(16)
            .padStart(2, "0") +
        Math.ceil(Math.random() * 255)
            .toString(16)
            .padStart(2, "0")
    ).toUpperCase();

btn.onclick = function (e) {
    let color = getrandomhexname();
    while (Object.keys(full_data.colormap).indexOf(color) > -1)
        color = getrandomhexname();
    inp.value = color;
    let tar = e.target as HTMLButtonElement;
    tar.style.background = "#" + color.replace("x", "");
};
