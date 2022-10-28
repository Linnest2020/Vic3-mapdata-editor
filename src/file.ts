const dump_to = async (src:string,data_branches:string[]) => { await fetch("./upload",{
    method:"POST",body:JSON.stringify({"src":src,"data":data_branches})
})}

const get_file_dict = async (src:string) => {
    let list = await fetch(`./upload?src=${src}`).then(resp => resp.json())
    let dict:{[key:string]:string} = {}
    for (let i=0,len=list.length;i<len;i++){
        dict[list[i]] = await fetch(`./data/${src}/${list[i]}`).then(resp => resp.text())
    }
    return dict
}