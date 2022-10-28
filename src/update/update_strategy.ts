import { full_map_data,state_detail } from "../index.js"
import { strategic_mode } from "../mode_map_render.js"
import {do_draw} from "../drawing_little.js"

let strategic_name_input = document.getElementById("strategic_name_input") as HTMLInputElement
let culture_name_input = document.getElementById("culture_name_input") as HTMLInputElement
let capital_name_input = document.getElementById("capital_name_input") as HTMLInputElement

const update_strategy = (state_name:Set<number>) => {
    let strategic_name,culture,capital
    strategic_name = strategic_name_input.value
    culture = culture_name_input.value
    capital = capital_name_input.value
    console.log(state_name)
    for (let i of state_name){
        let detail = state_detail(i)[0]
        if (!detail) return
        let name = detail.replace("s:","")

        console.log(i)
        for(let j=0,keys=Object.keys(full_map_data.strategic_regions_map),len=keys.length;j<len;j++){
            let region = keys[j]
            if (full_map_data.strategic_regions_map[region]["states"].indexOf(name)>-1 && strategic_name!=region ){
                full_map_data.strategic_regions_map[region]["states"] = full_map_data.strategic_regions_map[region]["states"].filter((item:string)=> item!=name)
                break
            }
            
            if (full_map_data.strategic_regions_map[region]["states"].length<1){
                delete full_map_data.strategic_regions_map[region]
            }
        }

        if (full_map_data.strategic_regions_map[strategic_name]){
            if(culture) full_map_data.strategic_regions_map[strategic_name]["graphical_culture"]=culture
            if(capital) full_map_data.strategic_regions_map[strategic_name]["capital_province"]=capital
            if (full_map_data.strategic_regions_map[strategic_name]["states"].indexOf(name)<=-1){
                full_map_data.strategic_regions_map[strategic_name]["states"].push(name)
            }
    
        } else {
            let color = [Math.ceil(Math.random()*255),Math.ceil(Math.random()*255),Math.ceil(Math.random()*255)]
            full_map_data.strategic_regions_map[strategic_name] = {}
            if(culture) full_map_data.strategic_regions_map[strategic_name]["graphical_culture"]=culture
            if(capital) full_map_data.strategic_regions_map[strategic_name]["capital_province"]=capital
            full_map_data.strategic_regions_map[strategic_name]["map_color"]=color
            full_map_data.strategic_regions_map[strategic_name]["states"] = []
            full_map_data.strategic_regions_map[strategic_name]["states"].push(name)
        }

    }
    state_name.clear()
    full_map_data.strategic_data_lock = false
    strategic_mode()
    do_draw()
}

export {update_strategy}