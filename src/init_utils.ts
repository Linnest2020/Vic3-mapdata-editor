import {jomini} from "./index.js"

const check_debug = async () =>{
    return fetch("./debug").then(resp => resp.json()).then(res => res["debug"])
}

const get_text_dict = async (src:string) => { return fetch (src)
    .then(resp => resp.text()).then(buffer => jomini.parseText(buffer))}
const get_file_dict = async (src:string) => {
    return fetch(`./upload?src=${src}`).then(resp => resp.json())
    .then(
        async(list) =>{
            let dict:{[key:string]:any} = {}
            for (let i=0,len=list.length;i<len;i++){
                dict[list[i]] = await fetch(`./data/${src}/${list[i]}`).then(resp => resp.text()).then(buffer => jomini.parseText(buffer))
            }
            return dict
        }
    )
}

const get_dict_map = (dict:{[key:string]:any},header:string|null=null) => {
    let map = {}
    if (!header){
        for (let i=0,values:{[key: string]:string}[]=Object.values(dict),len=values.length;i<len;i++) {map = {...map,...values[i]}}
        return map
    } else {
        for (let i=0,values:{[key: string]:{[key: string]:string}}[]=Object.values(dict),len=values.length;i<len;i++) {map = {...map,...values[i][header]}}
        return {[header]:map}
    }

}

const get_csv = async (csv:string) =>{
    let csvarr = csv.split("\n");
    let data:{[key:string]:Number|string}[] = []
    let headers:string[] = csvarr[0].split(";");
    let csvwidith = headers.length
    for (let i=1,len=csvarr.length;i<len;i++){
        let line:{[key:string]:Number|string} = {}
        let linearr = csvarr[i].split(";")
        for (let j=0;j<csvwidith;j++) {
            if (isNaN(parseInt(linearr[j]))) line[headers[j]] = linearr[j]
            else line[headers[j]] = parseInt(linearr[j])
        }
        data.push(line)
    }
    return data
}

export {get_dict_map,get_text_dict,get_file_dict,get_csv,check_debug}