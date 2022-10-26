import { canvas, full_data } from "./index.js";
import { do_draw } from "./drawing_little.js"

let muti_select = false


const gethexname = (r,g,b) => "x" + (r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0')).toUpperCase()

const select_states = (imgdata,reset_data,x,y,state_name,e) => {
    full_data.ctx.putImageData(reset_data, 0, 0)
    let state_index = (y*canvas.width + x)*4
    if (state_name.has(state_index)){
        state_name.delete(state_index)
    } else if(e.ctrlKey) {
        state_name.add(state_index)
    } else {
        state_name.clear()
        state_name.add(state_index)
    }
    if (state_name.size > 0 ){
        canvas_reset(imgdata,reset_data)
        for (let state of state_name){
            select_states_color(state,imgdata)
        }
        full_data.ctx.putImageData(imgdata, 0, 0);
        do_draw()
    } 
}

const select_states_color = (sindex,imgdata) => {
    for (let statepoint in full_data.statepointmap){
        if (full_data.statepointmap[statepoint].indexOf(sindex) >=0){
            for (let i=0;i<full_data.statepointmap[statepoint].length;i++){ imgdata.data[full_data.statepointmap[statepoint][i]+3] -= 100}
            break
        }
    }
}


const muti_selection = (provs_name,start_x,start_y,end_x,end_y,e) => {
    for (let x=Math.min(start_x,end_x);x<=Math.max(start_x,end_x);x++){
        for (let y=Math.min(start_y,end_y);y<=Math.max(start_y,end_y);y++){
            let sindex = (y*canvas.width + x)*4
            let color = (full_data.reset_data.data[sindex]<<16)+(full_data.reset_data.data[sindex+1]<<8)+(full_data.reset_data.data[sindex+2])
            provs_name.add("x"+ color.toString(16).padStart(6, '0').toUpperCase())
        }
    }
}


const select_prov_pure = (imgdata,reset_data,label,sindex,provs_name,e) => {
    console.log(provs_name)
    console.log(label)
    full_data.ctx.putImageData(full_data.reset_data, 0, 0)
    if (provs_name.has(label)){
        provs_name.delete(label)
    } else if(e.ctrlKey) {
        provs_name.add(label)
    }  else {
        provs_name.clear()
        provs_name.add(label)
    }

    if (provs_name.size > 0 ){
        canvas_reset(imgdata,full_data.reset_data)
        for (let prov of provs_name){
            select_provs_color(prov,imgdata)
        }
        full_data.ctx.putImageData(imgdata, 0, 0);
    }
}




const select_provs = (imgdata,state_data,label,sindex,provs_name,e) => {
    console.log(provs_name)
    full_data.ctx.putImageData(state_data, 0, 0)
    if (provs_name.has(label)){
        provs_name.delete(label)
    } else if(e.ctrlKey) {
        provs_name.add(label)
    } else if(e.shiftKey){
        for (let j = 0,statepointkey=Object.keys(full_data.statepointmap),len=statepointkey.length;j<len;j++){
            let statepoint = statepointkey[j]
            if (full_data.statepointmap[statepoint].indexOf(sindex) >=0){
                for (let i=0;i < full_data.statepointmap[statepoint].length;i++){ 
                    provs_name.add(gethexname(
                        full_data.reset_data.data[full_data.statepointmap[statepoint][i]],
                        full_data.reset_data.data[full_data.statepointmap[statepoint][i]+1],
                        full_data.reset_data.data[full_data.statepointmap[statepoint][i]+2]
                    ))
                }
                break
            }
        }
    } else {
        provs_name.clear()
        provs_name.add(label)
    }

    if (provs_name.size > 0 ){
        canvas_reset(imgdata,full_data.state_data)
        for (let prov of provs_name){
            select_provs_color(prov,imgdata)
        }
        full_data.ctx.putImageData(imgdata, 0, 0);
        do_draw()
    }
}

const select_provs_color = (hexname,imgdata) => {
    let points = full_data.colormap[hexname]
    for(let i = 0; i < points.length; i++){
        imgdata.data[points[i]+3] -= 100
    }
}

const canvas_reset = (imgdata,reset_data) => {
    for (let i = 0; i < imgdata.data.length;i++){
            imgdata.data[i] = reset_data.data[i]
        }
}

export { select_provs ,select_states,muti_selection,select_prov_pure }