// @ts-ignore
import { Jomini } from './jomini/jomini_slim.js' 

const wasmUrl = '/src/jomini/jomini.wasm';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
let progress_text = document.getElementById('progress') as HTMLDivElement;
let prov_pannelboard = document.getElementById("prov_pannelboard") as HTMLDivElement;
let strategic_pannelboard = document.getElementById("strategic_pannelboard") as HTMLDivElement;
let tip = document.getElementById('output') as HTMLSpanElement
let pannelboard = document.getElementById('pannelboard') as HTMLDivElement
let select_info = pannelboard.querySelector(".pannel_top_right") as HTMLSpanElement
let state_display_name = pannelboard.querySelector("#state_id") as HTMLInputElement
let country_display_name = pannelboard.querySelector("#country_id") as HTMLInputElement
let edit_pannelboard = document.getElementById('edit_pannelboard') as HTMLDivElement
let state_pannelboard = document.getElementById('state_pannelboard') as HTMLDivElement
let mask = document.getElementById("mask") as HTMLDivElement

let strategic_name_input = document.getElementById("strategic_name_input") as HTMLInputElement
let culture_name_input  = document.getElementById("culture_name_input") as HTMLInputElement
let capital_name_input = document.getElementById("capital_name_input") as HTMLInputElement

canvas.style.cursor = "crosshair"

var ctx = canvas.getContext('2d',{colorSpace: "srgb"}) as CanvasRenderingContext2D;

type sindex = number
type hexid = string
type State_name = string
type hexnamer = (arg0: number,arg1: number,arg2: number) =>string 
type nameset = Set<string>

var provs:nameset = new Set();
var provs_name:nameset = new Set();
var state_name:Set<number> = new Set()

var reset_data = ctx.getImageData(0, 0, canvas.width, canvas.height) as ImageData;
var state_data:ImageData = new ImageData(0,0)
var strategic_data:ImageData = new ImageData(0,0)
var terrain_data:ImageData = new ImageData(0,0)



var colormap:{[key:hexid]:sindex[]} = {}
var statecolormap:{[key:State_name]:hexid[]} = {}
var statepointmap:{[key:State_name]:sindex[]} = {}
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

const gethexname:hexnamer = (r,g,b) => "x" + (r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0')).toUpperCase()

const jomini = await Jomini.initialize({ wasm: wasmUrl })

export {canvas,jomini}
import {get_dict_map,get_file_dict,get_csv,check_debug,get_text_dict} from "./init_utils.js"
import { localization } from './i18n/i18n.js';

var debug = await check_debug()

var strategic_regions,state_regions,histroy_state,pops,buildings


type block = {[key:string]:string[]|number[]|string|number}
type pdxdict = {[key:string]:string[]|block|number[]|string|number|Date|Date[]}

type state_detail_private_type = {
    state_type:"corporated"|"incorporated"|"treaty_port"|("corporated"|"incorporated"|"treaty_port")[]
    country:string
    owned_provinces:string[]
}

type state_detail_type = {
    create_state:(state_detail_private_type|state_detail_private_type[])
    add_claim?:string|string[]
    add_homeland?:string|string[]
}

type history_dict_type = {
    STATES:{[key:string]:state_detail_type}
}


var histroy_state_dict: history_dict_type,
    state_regions_map,
    strategic_regions_map,
    pops_map,
    buildings_map

var terrain_map

if (!debug){
    strategic_regions = await get_file_dict("strategic_regions")
    state_regions = await get_file_dict("state_regions")
    histroy_state = await get_file_dict("states")
    pops = await get_file_dict("pops")
    buildings = await get_file_dict("buildings")

    //@ts-ignore
    histroy_state_dict = get_dict_map(histroy_state,"STATES")
    state_regions_map = get_dict_map(state_regions)
    strategic_regions_map = get_dict_map(strategic_regions)
    pops_map = get_dict_map(pops,"POPS")
    buildings_map = get_dict_map(buildings,"BUILDINGS")
} else {
    strategic_regions_map = await get_text_dict("./data/outputs/02_strategic_regions.txt")
    state_regions_map = await get_text_dict("./data/outputs/01_state_regions.txt")
    histroy_state_dict = await get_text_dict("./data/outputs/00_states.txt")
    pops_map = await get_text_dict("./data/outputs/05_pops.txt")
    buildings_map = await get_text_dict("./data/outputs/04_buildings.txt")
}



console.log(pops_map,buildings_map)

var strategic_data_lock = false
var terrain_data_lock = false

var adjacencies = await fetch("./data/adjacencies.csv").then(resp => resp.text()).then(buffer => get_csv(buffer))

var adj_pos:(Number|string)[][] = []
for (let i=0;i<adjacencies.length;i++){
    if (adjacencies[i]["start_x"]>0){
        adj_pos.push([adjacencies[i]["start_x"],
        adjacencies[i]["start_y"],adjacencies[i]["stop_x"],
        adjacencies[i]["stop_y"]
    ])
    }
}

var full_map_data = {histroy_state_dict,adj_pos,state_regions_map,strategic_regions_map,pops_map,buildings_map,terrain_map,
    strategic_data_lock,terrain_data_lock}
export {full_map_data}

const img = new Image()
img.src = "./data/provinces.png" /** 我也不知道为什么现在是onload在后面才行 **/
img.crossOrigin = ""
canvas.width = img.width;
canvas.height = img.height;

let init_worker = new Worker("src/workers/init_worker.js")
let string_worker = new Worker("src/workers/string_worker.js")

init_worker.onmessage = function(e) {
    if (e.data["correct_histroy_state_dict"]) full_map_data.histroy_state_dict = e.data["correct_histroy_state_dict"]
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
        mask.style.display = "none"

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
    init_worker.postMessage([reset_data,histroy_state_dict,canvas.width])
    river_map.src = "./data/rivers.png"

}
let river_data:ImageData = new ImageData(0,0)
const river_map = new Image()
const river_list = []
river_map.onload = function(e){
    ctx.drawImage(river_map,0,0)
    river_data = ctx.getImageData(0,0,canvas.width,canvas.height)
    little_data.river_data = river_data
    ctx.putImageData(reset_data, 0, 0)
}

let city_select = false
let city_select_type:string = ""

var little_data = {
    river_data,
    city_select,
    city_select_type
}
export {little_data}

import { strategic_mode,country_mode,state_mode,terrain_mode } from './mode_map_render.js';
import { do_draw } from './drawing_little.js';
import { select_provs ,select_states,select_prov_pure } from './canvas_selection.js';

const canvas_select = function(this:any, e:MouseEvent){
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

    let pannel_state_info = state_detail((y*canvas.width + x)*4)
    state_display_name.value = pannel_state_info[0]
    country_display_name.value = pannel_state_info[1]
    
    if(city_select){
        canvas_city_select(label,x,y)
        city_select = false
        city_select_type = ""
    } else if (mode == "prov" ) {
        select_prov_pure(imgdata,reset_data,label,(y*canvas.width + x)*4,provs_name,e)
        select_info.innerText = `${localization.select_provs}${provs_name.size}${localization.pieces}`
    } else if (mode == "state") {
        if (!pannel_state_info[0])return
        select_states(imgdata,state_data,x,y,state_name,e)
        select_info.innerText = `${localization.select_states}${state_name.size}${localization.pieces}`
        // state_detail_edit(pannel_state_info)
        // state_pops_edit(pannel_state_info)
        handle_state_edit(pannel_state_info)
    } else if (mode == "edit"){
        select_provs(imgdata,state_data,label,(y*canvas.width + x)*4,provs_name,e)
        select_info.innerText = `${localization.select_provs}${provs_name.size}${localization.pieces}`
    } else if (mode == "strategic"){
        if (!pannel_state_info[0])return
        for(let j=0,keys=Object.keys(full_map_data.strategic_regions_map),len=keys.length;j<len;j++){
            let region = keys[j]
            if (full_map_data.strategic_regions_map[region]["states"].indexOf(pannel_state_info[0].replace("s:",""))>-1){
                strategic_name_input.value = region
                if (full_map_data.strategic_regions_map[region]["graphical_culture"]) 
                    culture_name_input.value = full_map_data.strategic_regions_map[region]["graphical_culture"]
                if (full_map_data.strategic_regions_map[region]["capital_province"]) 
                    capital_name_input.value = full_map_data.strategic_regions_map[region]["capital_province"]
                break
            }
        }


        select_states(imgdata,full_data.strategic_data,x,y,state_name,e)
        select_info.innerText = `${localization.select_states}${state_name.size}${localization.pieces}`
    }
}

const canvas_city_select = (label: string,x: number,y: number) => {
    let state = state_detail((y*canvas.width + x)*4)[0]
    full_map_data.state_regions_map[state.replace("s:","")][city_select_type] = label
    do_draw()
}

const province_detail = function(this: any, e:MouseEvent){
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

const state_detail = (sindex:number,interfacer=()=>{}) =>{
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
    return ["null","null"]
    
}

export {state_detail}

import {handle_state_edit} from "./pannel/state_pannel.js"

canvas.onclick = canvas_select
canvas.onmouseover = province_detail
canvas.onmousemove = province_detail

import {update_map} from "./update/update_states.js"
import {update_strategy} from "./update/update_strategy.js"

let convert_button = document.getElementById("convert") as HTMLButtonElement
let convert_strategy_btn = document.getElementById("convert_strategy") as HTMLButtonElement

convert_button.onclick = function(e) {update_map(provs_name,state_display_name.value,country_display_name.value)}
convert_strategy_btn.addEventListener("click",function(e){
    update_strategy(state_name)
})



let pannelboards = [edit_pannelboard,state_pannelboard,prov_pannelboard,strategic_pannelboard]
const show_pannelboard = (e: HTMLDivElement | null) => {
    for (let i=0;i<pannelboards.length;i++){
        if (pannelboards[i] == e){
            pannelboards[i].style.display="block";
        } else pannelboards[i].style.display="none";
    }

}

let mode_selection = document.getElementById("mode_selection") as HTMLSelectElement

mode_selection.addEventListener("change",function(e){
    let tar = e.target as HTMLOptionElement
    mode = tar.value
    mode_render(mode)
})


const mode_render = (mode: string) => {
    switch (mode){
        case "prov":
            show_pannelboard(prov_pannelboard)
            ctx.putImageData(reset_data, 0, 0);
            break
        case "state":
            show_pannelboard(state_pannelboard)
            state_mode(); 
            break
        case "edit":
            show_pannelboard(edit_pannelboard)
            state_mode(); 
            break
        case "strategic":
            show_pannelboard(strategic_pannelboard)
            strategic_mode();
            break
        case "terrain":
            show_pannelboard(null)
            // terrain_mode();
            break
        case "country":
            show_pannelboard(null)
            country_mode();
            break
        
    }
}

let state_edit_city = document.getElementById('state_edit_city') as HTMLSelectElement
let state_edit_city_btn = state_pannelboard.querySelector("button") as HTMLButtonElement
state_edit_city .addEventListener("change",function(e){
    let tar = e.target as HTMLOptionElement
    city_select_type=tar.value
})
state_edit_city_btn.addEventListener("click",function(e){
    city_select=true
    city_select_type = state_edit_city.value
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