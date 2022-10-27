onmessage = function(e) { postMessage(handle(e.data))}

const handle = (data) => {
    if (data.localization){
        localization = data.localization
        return {"localization":navigator.systemLanguage || navigator.language }
    }
    return initiate_terrain(data)
}

let terrain_map
let ok = true

const initiate_terrain = (data) => {
    terrain_map = data.terrain_map
    let terrain_data = render_terrain_data(data.img_data,data)
    return {
        ok,
        terrain_map,
        terrain_data,
    }

}

let terrain_color = {
    desert: [255,255,0],
    plains: [0,255,0],
    wetland: [218,112,214],
    mountain: [255,125,64],
    ocean:[0,0,255],
    lakes:[0,255,255],
    snow:[255,255,255],
    tundra:[255,192,203],
    savanna:[210,180,140],
    jungle:[0,255,127],
    hills:[188,143,143],
    forest:[61,145,64],
    
}

const render_terrain_data = (img_data,data) => {
    let nowprogress = 0
    let time = new Date().valueOf()
    for ( let u=0,len=Object.keys(terrain_map).length;u<len;u++){
        let progress = (u/len)*100
        if (progress >= nowprogress){
            nowprogress = progress + 0.1
            postMessage({"data":`${localization.loading_terrain}${nowprogress.toFixed(2)}%`})
            
            if (nowprogress >= 99.90){
                console.log(`${localization.load_terrian_fin}: ${new Date().valueOf() - time}s`)
            }
        }
        let provpoint = Object.keys(terrain_map)[u]
        let terrain = terrain_map[provpoint]
        if (!terrain_color[terrain]){
            terrain_color[terrain] = [Math.ceil(Math.random()*255),Math.ceil(Math.random()*255),Math.ceil(Math.random()*255)]     
            console.log(terrain,terrain_color[terrain])
        }
        for (let n = 0,nlen=data.colormap[provpoint].length;n < nlen;n++){
            if (img_data.data[data.colormap[provpoint][n]]+img_data.data[data.colormap[provpoint][n]+1]+img_data.data[data.colormap[provpoint][n]+2]==0) continue
            img_data.data[data.colormap[provpoint][n]] = terrain_color[terrain][0]
            img_data.data[data.colormap[provpoint][n]+1] = terrain_color[terrain][1]
            img_data.data[data.colormap[provpoint][n]+2] = terrain_color[terrain][2]
        }
    }

    return img_data
}
