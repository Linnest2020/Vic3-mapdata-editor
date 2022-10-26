const dump_to = async (src,data_branches) => { await fetch("./upload",{
    method:"POST",body:JSON.stringify({"src":src,"data":data_branches})
})}

const get_file_dict = async (src) => {
    let list = await fetch(`./upload?src=${src}`).then(resp => resp.json())
    let dict = {}
    for (let i=0,len=list.length;i<len;i++){
        dict[list[i]] = await fetch(`./data/${src}/${list[i]}`).then(resp => resp.text())
    }
    return dict
}