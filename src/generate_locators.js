import {jomini,full_data} from "./index.js"
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

    rawappend(x,y){
        this.id += 1
        this.obj.game_object_locator.instances.push({
			id:this.id,
			position:[ x.toString() + ".000000",".000000","0.000000",y.toString() ],
			rotation:["0.000000","0.000000","0.000000","0.000000"],
			scale:["0.000000","0.000000","0.000000"],
		})
    }

    dump(){
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
let _width,_height
[_width,_height] = [main_canvas.width,main_canvas.height]
[glbk.width,glbk.height] = [_width,_height]
[gl.width,gl.height] = [_width,_height]

let canvasbg = document.getElementById("canvasbg")

const open_locator = () => {
    if (canvasbg.lastChild != gl){
        canvasbg.appendChild(glbk)
        canvasbg.appendChild(gl)
        board.appendChild(btn)
    }
}

btn.onclick = close_locator
const close_locator = function(e) {
    if (canvasbg.lastChild == gl){
        canvasbg.removeChild(gl)
        canvasbg.removeChild(glbk)
    }
    if (board.lastChild == btn){
        board.removeChild(btn)
    }
}

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
    

    let glbk_data = glbkctx.getImageData(0,0,_width,_height)
    let r = glbk_data.data[(y*_width + x)*4]
    let g = glbk_data.data[(y*_width + x)*4 + 1]
    let b = glbk_data.data[(y*_width + x)*4 + 2]

    let color = r<<16+g<<8+b<<0
    let ins = locator_handle[type].obj.game_object_locator.instances

    
    glctx.clearRect(0,0,_width,_height)
    glbkctx.clearRect(0,0,_width,_height)
    glctx.fillStyle="rgba(255,255,255,0.1)"
    glctx.fillRect(0,0,gl.width,gl.height)

    if (color == 0){
        locator_handle[type].append(x,y) // add
    } else {
        locator_handle[type].remove(color)// remove
    }

    console.log(ins)
    
    for (let i=0,len=ins.length;i<len;i++){
        glbkctx.beginPath();
        glctx.beginPath();
        let r=0,g=0,b=0
        r = (0xFF0000 & ins[i].id ) >> 16
        g = (0x00FF00 & ins[i].id ) >> 8
        b = (0x0000FF & ins[i].id ) >> 0
        glbkctx.fillStyle = `rgb(${r},${g},${b})`
        glctx.fillStyle = typecolor[type];

        let dx,dy,_dz
        [dx,_dz,dy] = ins[i].position
        circles[ins[0].id] = [parseInt(dx),parseInt(dy)]

        glbkctx.arc(parseInt(dx),parseInt(dy),5,0,2*Math.PI)
        glctx.arc(parseInt(dx),parseInt(dy),5,0,2*Math.PI)
        glbkctx.closePath();
        glctx.closePath();
        glctx.fill()
    }    
}