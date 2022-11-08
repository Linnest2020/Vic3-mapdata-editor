import {jomini,full_map_data,full_data} from "./index.js"
import {justwrite} from "./write.js"

let dump_button = document.getElementById("save")
let convert_button = document.getElementById("convert")


const preprocess = (map,header) => {
    let data = map[header]
    for (let state=Object.keys(data),i=state.length;i--;){
        let name = state[i]
        for (let state_region=Object.keys(data[name]),j=state_region.length;j--;){
            let full_name = name +"." +state_region[j].replace(":",":c:")
            if (!full_data.statepointmap[full_name]){
                console.log("delete empty scope",header,full_name)
                delete map[header][name][state_region[j]]
            }
        }
        if (!Object.keys(data[name])){
            delete map[header][name]
        }
    }
    return map

}



dump_button.onclick = async function(e) {

    let pops_map = preprocess(full_map_data.pops_map,"POPS")
    let buildings_map = preprocess(full_map_data.buildings_map,"BUILDINGS")
    
    let history_state_write = jomini.write(
        (writer) => {
            justwrite(writer,full_map_data.history_state_dict,["add_claim","create_state","state_type","add_homeland"],[])
        }
    )
    
    let state_regions_map_write = jomini.write(
        (writer) => {
            justwrite(writer,full_map_data.state_regions_map,["resource"],[
                "subsistence_building","provinces",
                "city","port","farm","mine","wood",
                "type","depleted_type"])
        }
    )

    let strategic_regions_map_write = jomini.write(
        (writer) => {
            justwrite(writer,full_map_data.strategic_regions_map,[],["graphical_culture"])
        }
    )

    let buildings_map_write = jomini.write(
        (writer) => {
            justwrite(writer,buildings_map,["create_building"],["building","activate_production_methods"])
        }
    )

    let pops_map_write = jomini.write(
        (writer) => {
            justwrite(writer,pops_map,["create_pop"])
        }
    )




    await fetch(
        "./upload",{
            method:"POST",
            body: JSON.stringify({
                "src":"outputs",
                "data":{
                    "00_states.txt":new TextDecoder().decode(history_state_write),
                    "01_state_regions.txt":new TextDecoder().decode(state_regions_map_write),
                    "02_strategic_regions.txt":new TextDecoder().decode(strategic_regions_map_write),
                    "04_buildings.txt":new TextDecoder().decode(buildings_map_write),
                    "05_pops.txt":new TextDecoder().decode(pops_map_write)
                }
            })
        }
    )
}