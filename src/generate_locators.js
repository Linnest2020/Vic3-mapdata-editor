import {jomini} from "./index.js"
import {justwrite} from "./write.js"
import { localization } from './i18n/i18n.js';

class generate_locator {
    constructor(type,clamp_to_water_level=false,id=10000) {
        this.id = id
        this.instances = {}
        this.obj = {
            game_object_locator: {
                name: type,
                clamp_to_water_level:clamp_to_water_level,
                render_under_water: false,
                generated_content: false,
                layer: "locators",
                instances: []
            }
        };
    }

    append(x,y){
        this.id += 1
        this.instances[this.id] = [x,y]
    }

    remove(id) {
        delete this.instances[id]
    }

    rawappend(x,y,id){
        this.obj.game_object_locator.instances.push({
			id:id,
			position:[ x.toString() + ".000000","0.000000",y.toString() +".000000"],
			rotation:["0.000000","0.000000","0.000000","0.000000"],
			scale:["0.000000","0.000000","0.000000"],
		})
    }

    dump(){
        for (let i=0,len=Object.keys(this.instances).length;i<len;i++){
            let key = Object.keys(this.instances)[i]
            console.log(key,this.instances[key][0],this.instances[key][1])
            this.rawappend(this.instances[key][0],this.instances[key][1],key)
        }
    
        let write = jomini.write(
            (writer) => {
                justwrite(writer,this.obj)
            }
        )
        return {
            name:`generated_map_object_locators_${this.obj.game_object_locator.name}_supplement.txt`,
            data: new TextDecoder().decode(write)
        }
    }
}


let city_locator = new generate_locator("city")
let farm_locator = new generate_locator("farm")
let mine_locator = new generate_locator("mine")
let port_locator = new generate_locator("port",true)
let wood_locator = new generate_locator("wood")

let locator_handle = {
    city: city_locator,
    farm: farm_locator,
    mine: mine_locator,
    port: port_locator,
    wood: wood_locator
}

let back_locator = {

}

let main_canvas = document.getElementById("canvas")
let gl = document.createElement("canvas")
let glctx = gl.getContext("2d")
let glbk = document.createElement("canvas")
let glbkctx = gl.getContext("2d")

let board = document.getElementById("board")
let btn = document.createElement("button")

glbk.style.zIndex = 165
gl.style.zIndex = 170



let canvasbg = document.getElementById("canvasbg")

const open_locator = () => {
    [glbk.width,glbk.height] = [main_canvas.width,main_canvas.height]
    gl.width = main_canvas.width
    gl.height = main_canvas.height
    gl.onmousemove = main_canvas.onmousemove
    glctx.fillStyle="rgba(255,255,255,0.1)"
    glctx.fillRect(0,0,gl.width,gl.height)
    if (canvasbg.lastChild != gl){
        canvasbg.appendChild(glbk)
        canvasbg.appendChild(gl)
        btn.textContent = localization.save_locators
        board.appendChild(btn)
        document.getElementById("mode_selection").disabled = true
        document.getElementById("adj_draw").disabled = true
        document.getElementById("city_draw").disabled = true
        document.getElementById("river_draw").disabled = true
        document.getElementById("save").disabled = true
    }
}

export {open_locator}


const close_locator = async function(e) {
    let mode_selection = document.getElementById("mode_selection")
    mode_selection.disabled = false
    document.getElementById("adj_draw").disabled = false
    document.getElementById("city_draw").disabled = false
    document.getElementById("river_draw").disabled = false
    document.getElementById("save").disabled = false
    if (canvasbg.lastChild == gl){
        canvasbg.removeChild(gl)
        canvasbg.removeChild(glbk)
    }
    if (board.lastChild == btn){
        board.removeChild(btn)
    }

    mode_selection.value = "prov"
    mode_selection.dispatchEvent(new Event("change",{target:{value:"prov"}}))

    let dump_data = locator_handle[type].dump()
    await fetch(
        "./upload",{
            method:"POST",
            body: JSON.stringify({
                "src":"outputs",
                "data":{
                    [dump_data.name]:dump_data.data,
                }
            })
        }
    )
}
btn.onclick = close_locator

const circles = {}

const typecolor = {
    city:"pink",
    wood:"orange",
    port:"blue",
    farm:"green",
    mine:"gold",
}

let type = "city"

gl.onclick = function(e){
    let x = e.pageX - this.offsetLeft
    let y = e.pageY - this.offsetTop
    

    let glbk_data = glctx.getImageData(0,0,main_canvas.width,main_canvas.height)
    let r = glbk_data.data[(y*main_canvas.width + x)*4]
    let g = glbk_data.data[(y*main_canvas.width + x)*4 + 1]
    let b = glbk_data.data[(y*main_canvas.width + x)*4 + 2]
    console.log("thisrgb",r,g,b)
    let color = (r<<16)+(g<<8)+(b<<0)
    console.log(color)
    let ins = locator_handle[type].instances

    
    glctx.clearRect(0,0,main_canvas.width,main_canvas.height)

    glctx.fillStyle="rgba(255,255,255,0.1)"
    glctx.fillRect(0,0,gl.width,gl.height)

    console.log(color)
    if (color == 0 || color == 255<<16+255<<8+255){
        console.log("0","nocolor",color)
        locator_handle[type].append(x,main_canvas.height-y) // add
    } else {
        console.log("1",color)
        locator_handle[type].remove(color)// remove
    }

    glbkctx.clearRect(0,0,main_canvas.width,main_canvas.height)

    console.log(ins)
    
    for (let i=0,len=Object.keys(ins).length;i<len;i++){
        let key = Object.keys(ins)[i]

        
        
        let r=0,g=0,b=0
        r = ( 0xFF0000 & key ) >> 16
        g = ( 0x00FF00 & key ) >> 8
        b = ( 0x0000FF & key ) >> 0
        console.log("rgb:",r,g,b)

        let dx,dy
        dx = ins[key][0]
        dy = main_canvas.height - ins[key][1]

        // glbkctx.beginPath();
        // glbkctx.fillStyle = "#"+ r.toString(16).padStart(2, '0').toUpperCase() + g.toString(16).padStart(2, '0').toUpperCase() + b.toString(16).padStart(2, '0').toUpperCase()
        // glbkctx.arc(dx,dy,5,0,2*Math.PI)
        // glbkctx.closePath();
        // glbkctx.fill()
        // glbkctx.fillStyle = `rgb(${r},${g},${b})`

        glctx.beginPath();
        glctx.fillStyle = "#"+ r.toString(16).padStart(2, '0').toUpperCase() + g.toString(16).padStart(2, '0').toUpperCase() + b.toString(16).padStart(2, '0').toUpperCase() //typecolor[type];
        glctx.arc(dx,dy,5,0,2*Math.PI)
        glctx.closePath();
        glctx.fill()
    }    
}