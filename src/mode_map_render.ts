import { full_data,full_map_data } from "./index.js";
import { do_draw } from './drawing_little.js';
import {get_text_dict} from "./init_utils.js"
import { localization } from "./i18n/i18n.js";

let canvas = document.getElementById("canvas") as HTMLCanvasElement
let pannelboard = document.getElementById("pannelboard") as HTMLDivElement

const strategic_mode = () => {
    // console.log(jomini.parseText("color = hsv{ 0.99  0.7  0.9 }"))
    full_data.mode = "strategic"
    pannelboard.style.display = "block"
    if (!full_data.strategic_data || !full_map_data.strategic_data_lock){
        full_data.ctx.putImageData(full_data.state_data, 0, 0)
        let imgdata = full_data.ctx.getImageData(0, 0, canvas.width, canvas.height)
        for (let i = 0,keys=Object.keys(full_map_data.strategic_regions_map),len=keys.length; i < len;i++){
            
            let map_color:[number,number,number]
            if (full_map_data.strategic_regions_map[keys[i]]["map_color"]){
                map_color = full_map_data.strategic_regions_map[keys[i]]["map_color"]
                if (map_color[0] <= 1 ) 
                    map_color = [Math.ceil(map_color[0]*255),Math.ceil(map_color[1]*255),Math.ceil(map_color[2]*255)]
            } else map_color = [0,0,255]
    
            let colorful_states:string[] = []
            for (let j=0,map_key=full_map_data.strategic_regions_map[keys[i]]["states"],map_len=map_key.length;j<map_len;j++){
                if (full_map_data.histroy_state_dict["STATES"]["s:"+map_key[j]]) {
                    if (!(full_map_data.histroy_state_dict["STATES"]["s:"+map_key[j]]["create_state"] instanceof Array)){
                        // @ts-ignore
                        colorful_states.push(`s:${map_key[j]}.region_state:${full_map_data.histroy_state_dict["STATES"]["s:"+map_key[j]]["create_state"]["country"]}`)
                    } else {
                        // @ts-ignore
                        for (let k=0;k<full_map_data.histroy_state_dict["STATES"]["s:"+map_key[j]]["create_state"].length;k++){
                            // @ts-ignore
                            colorful_states.push(`s:${map_key[j]}.region_state:${full_map_data.histroy_state_dict["STATES"]["s:"+map_key[j]]["create_state"][k]["country"]}`)
                        }
                    }
                }
    
            }

            let state_data = full_data.state_data as any
    
            for (let m=0;m<colorful_states.length;m++) {
                let points = full_data.statepointmap[colorful_states[m]] as number[]
                for (let n=0;n<points.length;n++){
                    if (((state_data.data[points[n]]<<16)+(state_data.data[points[n]+1]<<8)+state_data.data[points[n]+2])>0){
                        imgdata.data[points[n]] = map_color[0]
                        imgdata.data[points[n]+1] = map_color[1]
                        imgdata.data[points[n]+2] = map_color[2]
                    }
                }
            }
        }
        full_data.strategic_data = imgdata
        full_map_data.strategic_data_lock = true
    }

    full_data.ctx.putImageData(full_data.strategic_data, 0, 0)
}



let country_color:{[key:string]:[number,number,number]} = {}

const country_mode = () => {
    pannelboard.style.display = "block"
    full_data.ctx.putImageData(full_data.state_data, 0, 0)
    let img_data = full_data.ctx.getImageData(0,0,canvas.width,canvas.height)

    for ( let u=0,len=Object.keys(full_data.statepointmap).length;u<len;u++){
        let statepoint = Object.keys(full_data.statepointmap)[u]
        let country = statepoint.split(".region_state:")[1]
        if (!country_color[country]){
             country_color[country] = [Math.ceil(Math.random()*255),Math.ceil(Math.random()*255),Math.ceil(Math.random()*255)]     
        }
        for (let n = 0,nlen=full_data.statepointmap[statepoint].length;n < nlen;n++){
            if (img_data.data[full_data.statepointmap[statepoint][n]]+img_data.data[full_data.statepointmap[statepoint][n]+1]+img_data.data[full_data.statepointmap[statepoint][n]+2]==0) continue
            img_data.data[full_data.statepointmap[statepoint][n]] = country_color[country][0]
            img_data.data[full_data.statepointmap[statepoint][n]+1] = country_color[country][1]
            img_data.data[full_data.statepointmap[statepoint][n]+2] = country_color[country][2]
        }
    }


    full_data.ctx.putImageData(img_data, 0, 0)
}

const state_mode = () => {
    pannelboard.style.display = "block"
    full_data.ctx.putImageData(full_data.state_data, 0, 0)
    do_draw()
}

let terrain_worker = new Worker("src/workers/terrain_workers.js")
let progress = document.getElementById('progress') as HTMLDivElement
let mask = document.getElementById("mask") as HTMLDivElement


terrain_worker.onmessage = function(e) {
    if(e.data["localiztion"]) {console.log(e.data["localiztion"])}
    else if (!e.data["ok"]) { progress.textContent = e.data["data"] }
    else {
        mask.style.display = "none"

        full_map_data.terrain_map = e.data.terrain_map
        full_data.terrain_data = e.data.terrain_data
        
        mask.style.display = "none"
        full_data.ctx.putImageData(full_data.terrain_data, 0, 0)
        console.log("传递完毕")
        terrain_worker.terminate()
    }
}

let terrain_map

const terrain_mode = () => {
    pannelboard.style.display = "block"
    if (!full_data.terrain_data || !full_map_data.terrain_data_lock){
        mask.style.display = "block"
        progress.style.display = "block"
        if (!full_map_data.terrain_map){
            progress.textContent = localization.reading_terrain_map
            get_text_dict("./data/province_terrains.txt").then(res => {full_map_data.terrain_map = res})
            progress.textContent = localization.read_terrain_map_finnish
        }
        

        terrain_worker.postMessage({localization})
        terrain_worker.postMessage({
            colormap:full_data.colormap,
            img_data:full_data.state_data,
            terrain_map:full_map_data.terrain_map

        })

    
        full_data.ctx.putImageData(full_data.state_data, 0, 0)
        
        full_map_data.terrain_data_lock = true
    }
    if (full_data.terrain_data){
        full_data.ctx.putImageData(full_data.terrain_data, 0, 0)
    }
    
}



export {strategic_mode,country_mode,state_mode,terrain_mode}