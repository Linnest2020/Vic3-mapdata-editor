import {jomini} from "./index.js"
import {justwrite} from "./write.js"

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
			position:[ x.toString() + ".000000",".000000","0.000000",y.toString() ],
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

        console.log(this.obj.game_object_locator.instances)
        console.log(this.obj.game_object_locator)
        console.log(this.obj)
    
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


let example = {
    "name": "city",
    "clamp_to_water_level": false,
    "render_under_water": false,
    "generated_content": false,
    "layer": "locators",
    "instances": [
        {
            "id": "10001",
            "position": [
                "545.000000",
                ".000000",
                "0.000000",
                "737"
            ],
            "rotation": [
                "0.000000",
                "0.000000",
                "0.000000",
                "0.000000"
            ],
            "scale": [
                "0.000000",
                "0.000000",
                "0.000000"
            ]
        },
        {
            "id": "10002",
            "position": [
                "374.000000",
                ".000000",
                "0.000000",
                "850"
            ],
            "rotation": [
                "0.000000",
                "0.000000",
                "0.000000",
                "0.000000"
            ],
            "scale": [
                "0.000000",
                "0.000000",
                "0.000000"
            ]
        }
    ]
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
    glctx.fillStyle="rgba(255,255,255,0.1)"
    glctx.fillRect(0,0,gl.width,gl.height)
    if (canvasbg.lastChild != gl){
        canvasbg.appendChild(glbk)
        canvasbg.appendChild(gl)
        board.appendChild(btn)
    }
}

export {open_locator}


const close_locator = function(e) {
    if (canvasbg.lastChild == gl){
        canvasbg.removeChild(gl)
        canvasbg.removeChild(glbk)
    }
    if (board.lastChild == btn){
        board.removeChild(btn)
    }
    console.log(locator_handle[type].dump())
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
    

    let glbk_data = glbkctx.getImageData(0,0,main_canvas.width,main_canvas.height)
    let r = glbk_data.data[(y*main_canvas.width + x)*4]
    let g = glbk_data.data[(y*main_canvas.width + x)*4 + 1]
    let b = glbk_data.data[(y*main_canvas.width + x)*4 + 2]
    console.log("thisrgb",r,g,b)
    let color = r<<16+g<<8+b<<0
    console.log(color)
    let ins = locator_handle[type].instances

    
    glctx.clearRect(0,0,main_canvas.width,main_canvas.height)

    glctx.fillStyle="rgba(255,255,255,0.1)"
    glctx.fillRect(0,0,gl.width,gl.height)

    console.log(color)
    if (color == 0 || color == 255<<16+255<<8+255){
        console.log("0","nocolor",color)
        locator_handle[type].append(x,y) // add
    } else {
        console.log("1",color)
        locator_handle[type].remove(color)// remove
    }

    glbkctx.clearRect(0,0,main_canvas.width,main_canvas.height)

    console.log(ins)
    
    for (let i=0,len=Object.keys(ins).length;i<len;i++){
        let key = Object.keys(ins)[i]

        glbkctx.beginPath();
        glctx.beginPath();
        let r=0,g=0,b=0
        r = ( 0xFF0000 & key ) >> 16
        g = ( 0x00FF00 & key ) >> 8
        b = ( 0x0000FF & key ) >> 0
        console.log("rgb:",r,g,b)
        glbkctx.fillStyle = "#"+ r.toString(16).padStart(2, '0').toUpperCase() + g.toString(16).padStart(2, '0').toUpperCase() + b.toString(16).padStart(2, '0').toUpperCase()
        // glbkctx.fillStyle = `rgb(${r},${g},${b})`
        glctx.fillStyle = "pink" //typecolor[type];

        let dx,dy

        dx = ins[key][0]
        dy = ins[key][1]
        // circles[ins[0].id] = [parseInt(dx),parseInt(dy)]

        glbkctx.arc(dx,dy,5,0,2*Math.PI)
        // glctx.arc(dx,dy,5,0,2*Math.PI)
        glbkctx.closePath();
        glbkctx.fill()
        glctx.closePath();
        
        glctx.fill()
    }    
}