import { Jomini } from './jomini/jomini_slim.js';
const wasmUrl = '/src/jomini/jomini.wasm';

const canvas = document.getElementById('canvas');
canvas.style.cursor = "crosshair"

var ctx = canvas.getContext('2d',{colorSpace: "srgb"});

var tip = document.getElementById('output')


var progress_text = document.getElementById('progress');

var provs = new Set();
var provs_name = new Set();
var state_name = new Set()

var reset_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
var state_data = null
var strategic_data = null
var terrain_data = null

var colormap = null
var statecolormap = {}
var statepointmap = {}
var mode = "prov"

var full_data = {
    ctx,
    provs,
    provs_name,
    state_name,
    mode,
    colormap,
    statecolormap,
    statepointmap,
    reset_data,
    state_data,
    strategic_data,
    terrain_data,
}
export {full_data}

var zoom_size = [1/4,1/2,1,2,3,4,5]
var zoom_index = 2

var panelboard = document.getElementById('panelboard')
var select_info = panelboard.querySelector(".panel_top_right")
var state_display_name = panelboard.querySelector("#state_id")
var country_display_name = panelboard.querySelector("#country_id")
var edit_panelboard = document.getElementById('edit_panelboard')
var state_panelboard = document.getElementById('state_panelboard')

const gethexname = (r,g,b) => "x" + (r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0')).toUpperCase()

const jomini = await Jomini.initialize({ wasm: wasmUrl })

export {canvas,jomini}
import {get_dict_map,get_file_dict,get_csv,check_debug,get_text_dict,get_terrain_dict} from "./init_utils.js"
import { localization } from './i18n/i18n.js';

var debug = await check_debug()

var strategic_regions,state_regions,history_state,pops,buildings

var history_state_dict,state_regions_map,strategic_regions_map,pops_map,buildings_map
var terrain_map
if (!debug){
    strategic_regions = await get_file_dict("strategic_regions")
    state_regions = await get_file_dict("state_regions")
    history_state = await get_file_dict("states")
    pops = await get_file_dict("pops")
    buildings = await get_file_dict("buildings")

    history_state_dict = get_dict_map(history_state,"STATES")
    state_regions_map = get_dict_map(state_regions)
    strategic_regions_map = get_dict_map(strategic_regions)
    pops_map = get_dict_map(pops,"POPS")
    buildings_map = get_dict_map(buildings,"BUILDINGS")
} else {
    strategic_regions_map = await get_text_dict("./data/outputs/02_strategic_regions.txt")
    state_regions_map = await get_text_dict("./data/outputs/01_state_regions.txt")
    history_state_dict = await get_text_dict("./data/outputs/00_states.txt")
    pops_map = await get_text_dict("./data/outputs/05_pops.txt")
    buildings_map = await get_text_dict("./data/outputs/04_buildings.txt")
}



console.log(pops_map,buildings_map)

var strategic_data_lock = false
var terrain_data_lock = false

var adjacencies = await fetch("./data/adjacencies.csv").then(resp => resp.text()).then(buffer => get_csv(buffer))

var adj_pos = []
for (let i=0;i<adjacencies.length;i++){
    if (adjacencies[i]["start_x"]>0){
        adj_pos.push([adjacencies[i]["start_x"],
        adjacencies[i]["start_y"],adjacencies[i]["stop_x"],
        adjacencies[i]["stop_y"]
    ])
    }
}

var full_map_data = {history_state_dict,adj_pos,state_regions_map,strategic_regions_map,pops_map,buildings_map,terrain_map,
    strategic_data_lock,terrain_data_lock}
export {full_map_data}

const img = new Image()
img.src = "./data/provinces.png" /** 我也不知道为什么现在是onload在后面才行 **/
img.crossOrigin = ""
canvas.width = img.width;
canvas.height = img.height;

let init_worker = new Worker("src/workers/init_worker.js")
let string_worker = new Worker("src/workers/string_worker.js")

let provid = []

init_worker.onmessage = function(e) {
    if (e.data["correct_history_state_dict"]) full_map_data.history_state_dict = e.data["correct_history_state_dict"]
    else if(e.data["localiztion"]) {console.log(e.data["localiztion"])}
    else if (!e.data["ok"]) progress_text.textContent = e.data["data"]
    else {
        progress_text.style.display = "none"
        colormap = e.data["colormap"]
        statecolormap = e.data["statecolormap"]
        statepointmap = e.data["statepointmap"]
        
        state_data = e.data["state_data"]

        full_data.colormap = colormap
        full_data.statepointmap = statepointmap
        full_data.statecolormap = statecolormap
        full_data.state_data = state_data
        
        // get_text_dict("./data/province_terrains.txt").then(res => {full_map_data.terrain_map = res})

        fetch("./data/province_terrains.txt").then((resp) => {
            if (!resp.ok){
                throw new Error("404")
            } else {
                let get_text = resp.text()
                get_text.then(
                    buffer => {
                        [full_map_data.terrain_map,provid] = get_terrain_dict(buffer)
                    }
                )                
            }
        }).catch((err) => { 
            console.log("")
            mode_selection.querySelector("option[value='terrain']").disabled = true
        })

        document.getElementById("mask").style.display = "none"

        init_worker.terminate()
    }
}


img.onload =function(e){
    ctx.drawImage(img, 0, 0);
    try{
        reset_data = ctx.getImageData(0,0,canvas.width,canvas.height) 
        full_data.reset_data = reset_data
    }
    catch(err) {
        if (navigator.userAgent.indexOf("Firefox")>=0) alert(localization.ff_alert)
        else location.reload()
    }
    init_worker.postMessage({localization})
    init_worker.postMessage([reset_data,history_state_dict,canvas.width])
    river_map.src = "./data/rivers.png"

}
var river_data = null
const river_map = new Image()
const river_list = []
river_map.onload = function(e){
    ctx.drawImage(river_map,0,0)
    river_data = ctx.getImageData(0,0,canvas.width,canvas.height)
    little_data.river_data = river_data
    ctx.putImageData(reset_data, 0, 0)
}

let city_select = false
let city_select_type = null

var little_data = {
    river_data,
    city_select,
    city_select_type
}
export {little_data}

import { strategic_mode,country_mode,state_mode,terrain_mode } from './mode_map_render.js';
import { do_draw } from './drawing_little.js';
import { select_provs ,select_states,select_prov_pure } from './canvas_selection.js';

const canvas_select = function(e){
    let imgdata = ctx.getImageData(0,0,canvas.width,canvas.height)
    let label = ""
    let x = e.pageX - this.offsetLeft
    label += " "
    let y = e.pageY - this.offsetTop
    console.log(provs.size,e.ctrlKey,x,y)
    

    
    let r = reset_data.data[(y*canvas.width + x)*4]
    let g = reset_data.data[(y*canvas.width + x)*4 + 1]
    let b = reset_data.data[(y*canvas.width + x)*4 + 2]

    label = gethexname(r,g,b)

    let panel_state_info = state_detail((y*canvas.width + x)*4)
    state_display_name.value = panel_state_info[0]
    country_display_name.value = panel_state_info[1]
    
    if(city_select){
        canvas_city_select(label,x,y)
        city_select = false
        city_select_type = null
    } else if (mode == "prov" ) {
        select_prov_pure(imgdata,reset_data,label,(y*canvas.width + x)*4,provs_name,e)
        select_info.innerText = `${localization.select_provs}${provs_name.size}${localization.pieces}`
    } else if (mode == "state") {
        if (!panel_state_info[0])return
        select_states(imgdata,state_data,x,y,state_name,e)
        select_info.innerText = `${localization.select_states}${state_name.size}${localization.pieces}`
        // state_detail_edit(panel_state_info)
        // state_pops_edit(panel_state_info)
        handle_state_edit(panel_state_info)
    } else if (mode == "edit"){
        select_provs(imgdata,state_data,label,(y*canvas.width + x)*4,provs_name,e)
        select_info.innerText = `${localization.select_provs}${provs_name.size}${localization.pieces}`
    } else if (mode == "strategic"){
        if (!panel_state_info[0])return
        for(let j=0,keys=Object.keys(full_map_data.strategic_regions_map),len=keys.length;j<len;j++){
            let region = keys[j]
            if (full_map_data.strategic_regions_map[region]["states"].indexOf(panel_state_info[0].replace("s:",""))>-1){
                document.getElementById("strategic_name_input").value = region
                if (full_map_data.strategic_regions_map[region]["graphical_culture"]) 
                    document.getElementById("culture_name_input").value = full_map_data.strategic_regions_map[region]["graphical_culture"]
                if (full_map_data.strategic_regions_map[region]["capital_province"]) 
                    document.getElementById("capital_name_input").value = full_map_data.strategic_regions_map[region]["capital_province"]
                break
            }
        }


        select_states(imgdata,full_data.strategic_data,x,y,state_name,e)
        select_info.innerText = `${localization.select_states}${state_name.size}${localization.pieces}`
    }
}

const canvas_city_select = (label,x,y) => {
    let state = state_detail((y*canvas.width + x)*4)[0]
    full_map_data.state_regions_map[state.replace("s:","")][city_select_type] = label
    do_draw()
}

const province_detail = function(e){
    let label = " "
    let x = e.pageX - this.offsetLeft
    let y = e.pageY - this.offsetTop

    let r = reset_data.data[(y*canvas.width + x)*4]
    let g = reset_data.data[(y*canvas.width + x)*4 + 1]
    let b = reset_data.data[(y*canvas.width + x)*4 + 2]

    let name = gethexname(r,g,b)

    let state_name = localization.states +": "
    let country_name = localization.country+": "
    let the_detail = state_detail((y*canvas.width + x)*4)

    if (the_detail){
        canvas.title = `(${x},${canvas.height-y})\n${name}\n${state_name+the_detail[0]}\n${country_name+the_detail[1]}`

        tip.textContent = `(${x},${canvas.height-y})\n${name}\n${state_name+the_detail[0]}\n${country_name+the_detail[1]}`
    } else {
        canvas.title = `(${x},${canvas.height-y})\n${name}`
        tip.textContent = `(${x},${canvas.height-y})\n${name}`
    }

    
}

const state_detail = (sindex,interfacer=()=>{}) =>{
    let state = ""
    let country = ""
    for (let statepoint in statepointmap){
        if (statepointmap[statepoint].indexOf(sindex) >=0){
            state = statepoint.split(".region_state:")[0]
            country = statepoint.split(".region_state:")[1]
            return [state,country]
            break
        }
    }
    return [null,null]
    
}

export {state_detail}

import {handle_state_edit} from "./panel/state_panel.js"

canvas.onclick = canvas_select
canvas.onmouseover = province_detail
canvas.onmousemove = province_detail

import {update_map} from "./update/update_states.js"
import {update_strategy} from "./update/update_strategy.js"

let convert_button = document.getElementById("convert")
convert_button.onclick = function(e) {update_map(provs_name,state_display_name.value,country_display_name.value)}
document.getElementById("convert_strategy").addEventListener("click",function(e){
    update_strategy(state_name)
})


let prov_panelboard = document.getElementById("prov_panelboard")
let strategic_panelboard = document.getElementById("strategic_panelboard")
let panelboards = [edit_panelboard,state_panelboard,prov_panelboard,strategic_panelboard]
const show_panelboard = (e) => {
    for (let i=0;i<panelboards.length;i++){
        if (panelboards[i] == e){
            panelboards[i].style.display="block";
        } else panelboards[i].style.display="none";
    }

}

let mode_selection = document.getElementById("mode_selection")
mode_selection.addEventListener("change",function(e){
    mode = e.target.value
    mode_render(mode)
})


const mode_render = (mode) => {
    switch (mode){
        case "prov":
            show_panelboard(prov_panelboard)
            ctx.putImageData(reset_data, 0, 0);
            break
        case "state":
            show_panelboard(state_panelboard)
            state_mode(); 
            break
        case "edit":
            show_panelboard(edit_panelboard)
            state_mode(); 
            break
        case "strategic":
            show_panelboard(strategic_panelboard)
            strategic_mode();
            break
        case "terrain":
            show_panelboard(null)
            terrain_mode();
            break
        case "country":
            show_panelboard(null)
            country_mode();
            break
        
    }
}

document.getElementById('state_edit_city').addEventListener("change",function(e){city_select_type=e.target.value})
document.getElementById('state_panelboard').querySelector("button").addEventListener("click",function(e){
    city_select=true
    city_select_type = document.getElementById('state_edit_city').value
})


let start_x = 0
let start_y = 0
let end_x = 0
let end_y = 0

import { muti_selection } from './canvas_selection.js';

canvas.addEventListener("mousedown",function(e){
    if (mode == "edit"){
        start_x = e.pageX - this.offsetLeft
        start_y = e.pageY - this.offsetTop
        if (!e.ctrlKey){
            provs_name.clear()
        }
        canvas.addEventListener("mouseup",function(e){
            end_x = e.pageX - this.offsetLeft
            end_y = e.pageY - this.offsetTop
            if (mode == "edit"){
                if (start_x != end_x || start_y != end_y){
                    muti_selection(provs_name,start_x,start_y,end_x,end_y,e)
                }
            }
        })
    }


})

canvas.addEventListener("contextmenu",function(e){
    provs_name.clear();
    mode_render(mode)
    })