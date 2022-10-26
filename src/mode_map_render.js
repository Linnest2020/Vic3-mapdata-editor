import { full_data,full_map_data } from "./index.js";
import { do_draw } from './drawing_little.js';

const strategic_mode = () => {
    // console.log(jomini.parseText("color = hsv{ 0.99  0.7  0.9 }"))
    full_data.mode = "strategic"
    pannelboard.style.display = "block"
    if (!full_data.strategic_data || !full_map_data.strategic_data_lock){
        full_data.ctx.putImageData(full_data.state_data, 0, 0)
        let imgdata = full_data.ctx.getImageData(0, 0, canvas.width, canvas.height)
        for (let i = 0,keys=Object.keys(full_map_data.strategic_regions_map),len=keys.length; i < len;i++){
            
            let map_color = []
            if (full_map_data.strategic_regions_map[keys[i]]["map_color"]){
                map_color = full_map_data.strategic_regions_map[keys[i]]["map_color"]
                if (map_color[0] <= 1 ) map_color = [Math.ceil(map_color[0]*255),Math.ceil(map_color[1]*255),Math.ceil(map_color[2]*255)]
            } else map_color = [0,0,255]
    
            let colorful_states = []
            for (let j=0,map_key=full_map_data.strategic_regions_map[keys[i]]["states"],map_len=map_key.length;j<map_len;j++){
                if (full_map_data.histroy_state_dict["STATES"]["s:"+map_key[j]]) {
                    if (!(full_map_data.histroy_state_dict["STATES"]["s:"+map_key[j]]["create_state"] instanceof Array)){
                        colorful_states.push(`s:${map_key[j]}.region_state:${full_map_data.histroy_state_dict["STATES"]["s:"+map_key[j]]["create_state"]["country"]}`)
                    } else {
                        for (let k=0;k<full_map_data.histroy_state_dict["STATES"]["s:"+map_key[j]]["create_state"].length;k++){
                            colorful_states.push(`s:${map_key[j]}.region_state:${full_map_data.histroy_state_dict["STATES"]["s:"+map_key[j]]["create_state"][k]["country"]}`)
                        }
                    }
                }
    
            }
    
            for (let m=0;m<colorful_states.length;m++) {
                let points = full_data.statepointmap[colorful_states[m]]
                for (let n=0;n<points.length;n++){
                    if (((full_data.state_data.data[points[n]]<<16)+(full_data.state_data.data[points[n]+1]<<8)+full_data.state_data.data[points[n]+2])>0){
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



let country_color = {}

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

export {strategic_mode,country_mode,state_mode}