import { full_data,little_data,full_map_data } from "./index.js";


const do_draw = () => {
    if (document.getElementById("river_draw").checked) {
        draw_river()
    }
    if (document.getElementById("adj_draw").checked){
        canvas_map_adj()
    }
    if (document.getElementById("city_draw").checked) {
        speicail_city()
    }   
}


const draw_river = () => {
    let imgdata = full_data.ctx.getImageData(0, 0, canvas.width, canvas.height)
    for (let i = 0,len=little_data.river_data.data.length; i < len;i+=4){
        let the_color = (little_data.river_data.data[i]<<16)+(little_data.river_data.data[i+1]<<8)+little_data.river_data.data[i+2]
        if (the_color != 16777215 && the_color != 8026746){
            imgdata.data[i] = 255
            imgdata.data[i+1] = 255
            imgdata.data[i+2] = 255
        }
    }
    full_data.ctx.putImageData(imgdata, 0, 0)
}

const speicail_city = () =>{
    for (let i=0,len=Object.keys(full_map_data.state_regions_map).length;i<len;i++){
        let this_value = full_map_data.state_regions_map[Object.keys(full_map_data.state_regions_map)[i]]
        if (this_value["city"]){
            speicail_border(this_value["city"],"city")
            if (this_value["port"] && this_value["city"] == this_value["port"] ) speicail_border(this_value["city"],"cityport")
            
        }
        if (this_value["port"] && this_value["city"] != this_value["port"]) speicail_border(this_value["port"],"port")
        if (this_value["farm"]) speicail_border(this_value["farm"],"farm")
        if (this_value["mine"]) speicail_border(this_value["mine"],"mine")
        if (this_value["wood"]) speicail_border(this_value["wood"],"wood")
    }
}

const speicail_border = (colorname,type) => {
    full_data.ctx.fillStyle = "pink";
    full_data.ctx.strokeStyle = "black";
    if (type == "cityport") full_data.ctx.strokeStyle = "blue";
    if (type == "port") full_data.ctx.fillStyle = "blue";
    if (type == "farm") full_data.ctx.fillStyle = "green";
    if (type == "wood") full_data.ctx.fillStyle = "orange";
    if (type == "mine") full_data.ctx.fillStyle = "gold";
    if (!full_data.colormap[colorname]){
        console.warn("invaild color:" + colorname)
        return
    }
    let point = full_data.colormap[colorname][Math.ceil(full_data.colormap[colorname].length/2)]/4 
    full_data.ctx.fillRect((point%canvas.width)-3,Math.floor(point/canvas.width)-3,6,6)
    full_data.ctx.strokeRect((point%canvas.width)-3,Math.floor(point/canvas.width)-3,6,6)
}

const canvas_map_adj = ()=> {
    for (let i=0;i<full_map_data.adj_pos.length;i++) canvas_draw_adj(full_map_data.adj_pos[i][0],full_map_data.adj_pos[i][1],full_map_data.adj_pos[i][2],full_map_data.adj_pos[i][3])
}

const canvas_draw_adj = (sx,sy,ex,ey)=>{
    full_data.ctx.beginPath();
    full_data.ctx.moveTo(sx,canvas.height-sy)
    full_data.ctx.lineTo(ex,canvas.height-ey)
    full_data.ctx.lineWidth = 2
    full_data.ctx.strokeStyle = "red";
    full_data.ctx.stroke()
    full_data.ctx.closePath();
    full_data.ctx.save();
}

export { do_draw }