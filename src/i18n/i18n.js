let lang = navigator.systemLanguage || navigator.language;

import * as zh_loc  from "./zh_cn.js" 
import * as default_loc from "./default.js";

let localization

if (lang.indexOf("zh")>-1){
    localization = zh_loc.localization
} else {
    localization = default_loc.localization
}

export {localization}

document.getElementById("progress").innerText = localization.init_load
document.getElementById("save").innerText = localization.save
document.getElementById("convert").innerText = localization.convert
document.getElementById("convert_strategy").innerText = localization.convert
document.getElementById("state_panelboard").querySelector("button").innerText = localization.start_edit
document.querySelector("span.panel_top").innerText = localization.paneltop

document.querySelector("[for=city_draw]").innerText = localization.city_draw
document.querySelector("[for=river_draw]").innerText = localization.river_draw
document.querySelector("[for=adj_draw]").innerText = localization.adj_draw

document.querySelector("option[value=prov]").innerText = localization.provs
document.querySelector("option[value=state]").innerText = localization.states
document.querySelector("option[value=edit]").innerText = localization.edit
document.querySelector("option[value=strategic]").innerText = localization.strategic
document.querySelector("option[value=terrain]").innerText = localization.terrain
document.querySelector("option[value=country]").innerText = localization.country

document.querySelector("option[value=city]").innerText = localization.city
document.querySelector("option[value=port]").innerText = localization.port
document.querySelector("option[value=wood]").innerText = localization.wood
document.querySelector("option[value=mine]").innerText = localization.mine
document.querySelector("option[value=farm]").innerText = localization.farm

document.querySelector("option[value=detail]").innerText = localization.detail
document.querySelector("option[value=pops]").innerText = localization.pops
document.querySelector("option[value=building]").innerText = localization.building
document.querySelector("option[value=aresource]").innerText = localization.aresource
document.querySelector("option[value=cresource]").innerText = localization.cresource
document.querySelector("option[value=resource]").innerText = localization.resource