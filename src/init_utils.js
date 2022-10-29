import {jomini} from "./index.js"

const check_debug = async () =>{
    return fetch("./debug").then(resp => resp.json()).then(res => res["debug"])
}

const get_text_dict = async (src) => { return fetch (src)
    .then(resp => resp.text()).then(buffer => jomini.parseText(buffer))}
const get_file_dict = async (src) => {
    return fetch(`./upload?src=${src}`).then(resp => resp.json())
    .then(
        async(list) =>{
            let dict = {}
            for (let i=0,len=list.length;i<len;i++){
                dict[list[i]] = await fetch(`./data/${src}/${list[i]}`).then(resp => resp.text()).then(buffer => jomini.parseText(buffer))
            }
            return dict
        }
    )
}

const get_dict_map = (dict,header=null) => {
    let map = {}
    if (!header){
        for (let i=0,values=Object.values(dict),len=values.length;i<len;i++) {map = {...map,...values[i]}}
        return map
    } else {
        for (let i=0,values=Object.values(dict),len=values.length;i<len;i++) {map = {...map,...values[i][header]}}
        return {[header]:map}
    }

}

const get_csv = async (csv) =>{
    let csvarr = csv.split("\n");let data = []
    let headers = csvarr[0].split(";");let csvwidith = headers.length
    for (let i=1,len=csvarr.length;i<len;i++){
        let line = {}
        let linearr = csvarr[i].split(";")
        for (let j=0;j<csvwidith;j++) {
            if (isNaN(parseInt(linearr[j]))) line[headers[j]] = linearr[j]
            else line[headers[j]] = parseInt(linearr[j])
        }
        data.push(line)
    }
    return data
}

const get_terrain_dict = (buffer) => {
        let terrainarr = buffer.split("\n")
        let data = {}
        let provid = []
        for (let i=1,len=terrainarr.length;i<len;i++){
            let [provname,terrain] = terrainarr[i].split("=")
            if (provname) {
                provname = provname.replaceAll("\"","")
                terrain = terrain.replaceAll("\"","")
                provid.push(provname)
                if (data[terrain]) data[terrain].push(provname)
                else data[terrain] = [provname]
            }

        }
        return [data,provid]
    }




export {get_dict_map,get_text_dict,get_file_dict,get_csv,check_debug,get_terrain_dict}