
onmessage = function(e) { postMessage(handle(e.data))}


let localization = ""

const handle = (data) => {
    if (data.localization){
        localization = data.localization
        return {"localization":navigator.systemLanguage || navigator.language }
    }
    return initiate(data[0],data[1],data[2])
}

var colormap = {}
var color_key_map = {}
var statepointmap = {}
var statecolormap = {}
var state_data = {}
var length = 0
var history_state_dictlength = 0
var the_length = 0
const initiate = (data,history_state_dict,width) => { 
    length = data.data.length
    history_state_dictlength = Object.keys(history_state_dict["STATES"]).length
    init_colormap(data)
    init_state_map(colormap,history_state_dict)
    the_length = Object.keys(statepointmap).length
    get_state_data(data,width)
    postMessage({"data":localization.loading})
    return {"ok":true,"colormap":colormap,"statepointmap":statepointmap,"statecolormap":statecolormap,"state_data":state_data}

}



const init_colormap = (img_data) => {
    let nowprogress = 0
    let color_key = ""
    let color = 0
    let time = new Date().valueOf()
    for(var i = 0; i < length; i+=4){
        let progress = (i/length)*100
        if (progress >= nowprogress){
            nowprogress = progress + 0.1
            postMessage({"data":`${localization.loading_color}${nowprogress.toFixed(2)}%`})
            
            if (nowprogress >= 100){
                console.log(`${localization.load_color_fin}${new Date().valueOf()-time}`)
            }
        } 
        color = (img_data.data[i]<<16)+(img_data.data[i+1]<<8)+(img_data.data[i+2])
        if (color_key_map[color]){
            color_key = color_key_map[color]
        } else {
            color_key = "x"+ color.toString(16).padStart(6, '0').toUpperCase()
            color_key_map[color] = color_key
        }
        if (colormap[color_key]){
            colormap[color_key].push(i)
            continue
        } else {
            colormap[color_key] = [i]
        }
        
    }
}

const init_state_map = (colormap,history_state_dict) => {
    let nowprogress = 0
    let time = new Date().valueOf()

    let state_region_block = history_state_dict["STATES"]
    let wrong_patt = /x[a-f0-9]{6}/

    for ( let len = Object.keys(state_region_block).length,uu=len;uu--;){
        u=Object.keys(state_region_block)[uu]
        let progress = (1-(uu/len))*100
        if (progress >= nowprogress){
            nowprogress = progress + 0.1
            postMessage({"data":`${localization.loading_states}${nowprogress.toFixed(2)}%`})
            
            if (uu==0){
                console.log(`${localization.load_states_fin}${new Date().valueOf() - time}`)
            }
        }

        let state_block = state_region_block[u]["create_state"]

        if (state_block instanceof Array){
            for (let n = 0;n < state_block.length;n++){
                let state_mark = `${u}.region_state:${state_block[n]["country"]}`
                statecolormap[state_mark] = [Math.ceil(Math.random()*255),Math.ceil(Math.random()*255),Math.ceil(Math.random()*255)]
                for ( let prov_block = state_block[n]["owned_provinces"],i=prov_block.length;i--;){
                    if (wrong_patt.exec(prov_block[i])) prov_block[i] = "x"+parseInt("0"+prov_block[i]).toString(16).padStart(6, '0').toUpperCase()
                    for (let jj = colormap[prov_block[i]].length;jj--;){
                        let j = colormap[prov_block[i]][jj]
                        if (statepointmap[state_mark]){
                            statepointmap[state_mark].push(j)
                        } else {statepointmap[state_mark] = [j]}
                    }
                }
            }
        } else{
            let state_mark = `${u}.region_state:${state_block["country"]}`
            statecolormap[state_mark] = [Math.ceil(Math.random()*255),Math.ceil(Math.random()*255),Math.ceil(Math.random()*255)]
            for (let prov_block = state_block["owned_provinces"],i=prov_block.length;i--;){
                if (wrong_patt.exec(prov_block[i])) prov_block[i] = "x"+parseInt("0"+prov_block[i]).toString(16).padStart(6, '0').toUpperCase()
                if (!colormap[prov_block[i]]){
                    console.warn("Can not find: "+prov_block[i]+" in map! deleted.")
                    prov_block = prov_block.filter((items,index) => ![i].includes(index))
                    continue
                }
                for (let jj = colormap[prov_block[i]].length;jj--;){
                    let j = colormap[prov_block[i]][jj]
                    if (statepointmap[state_mark]){
                        statepointmap[state_mark].push(j) 
                    } else {statepointmap[state_mark] = [j]}
                }
            }
        }
    }
    postMessage({"correct_history_state_dict":history_state_dict})
    console.log(localization.correct_invalid_text)
}

const get_state_data = (img_data,width) => {
    let nowprogress = 0

    let this_color = null
    let next_color = null
    let down_color = null
    for (var i = 0; i < length; i+=4){
        if (i+4*width >= length || (i+1)%width == 0 ){continue}
        let progress = (i/length)*100
        if (progress >= nowprogress){
            nowprogress = progress + 0.1
            postMessage({"data":`${localization.loading_border}${nowprogress.toFixed(2)}%`})
            
            if (nowprogress >= 99.90){
                console.log(localization.load_border_fin)
            }
        }
        
        this_color = (img_data.data[i]<<16)+(img_data.data[i+1]<<8)+img_data.data[i+2]
        next_color = (img_data.data[i+4]<<16)+(img_data.data[i+5]<<8)+img_data.data[i+6]
        down_color = (img_data.data[i+4*width]<<16)+(img_data.data[i+4*width+1]<<8)+img_data.data[i+4*width+2]      

        if (this_color == 0 ) continue
        if (this_color != next_color){
            img_data.data[i] = 0
            img_data.data[i+1] = 0
            img_data.data[i+2] = 0
            img_data.data[i+4] = 0
            img_data.data[i+5] = 0
            img_data.data[i+6] = 0
        }
        if (this_color  != down_color){
            img_data.data[i] = 0
            img_data.data[i+1] = 0
            img_data.data[i+2] = 0
            img_data.data[i+4*width] = 0
            img_data.data[i+1+4*width] = 0
            img_data.data[i+2+4*width] = 0
        }
    }
    nowprogress = 0
    let statepoint = ""

    for ( let u=0,len=Object.keys(statepointmap).length;u<len;u++){
        statepoint = Object.keys(statepointmap)[u]
        let progress = (u/len)*100
        if (progress >= nowprogress){
            nowprogress = progress + 0.1
            postMessage({"data":`${localization.rendering_states}${nowprogress.toFixed(2)}%`})
            
            if (nowprogress >= 99.90){
                console.log(localization.render_states_fin)
            }
        }
        for (let n = 0,nlen=statepointmap[statepoint].length;n < nlen;n++){
            if (img_data.data[statepointmap[statepoint][n]]+img_data.data[statepointmap[statepoint][n]+1]+img_data.data[statepointmap[statepoint][n]+2]==0) continue
            img_data.data[statepointmap[statepoint][n]] = statecolormap[statepoint][0]
            img_data.data[statepointmap[statepoint][n]+1] = statecolormap[statepoint][1]
            img_data.data[statepointmap[statepoint][n]+2] = statecolormap[statepoint][2]
        }
    }
    state_data = img_data
}