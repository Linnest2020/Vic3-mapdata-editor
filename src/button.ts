import { jomini, full_map_data } from "./index.js";
import { justwrite } from "./write.js";

let dump_button = document.getElementById("save") as HTMLButtonElement;
let convert_button = document.getElementById("convert");

dump_button.onclick = async function (e) {
    let history_state_write = jomini.write((writer: any) => {
        justwrite(
            writer,
            full_map_data.history_state_dict,
            ["add_claim", "create_state", "state_type", "add_homeland"],
            []
        );
    });

    let state_regions_map_write = jomini.write((writer: any) => {
        justwrite(
            writer,
            full_map_data.state_regions_map,
            ["resource"],
            [
                "subsistence_building",
                "provinces",
                "city",
                "port",
                "farm",
                "mine",
                "wood",
                "type",
                "depleted_type",
            ]
        );
    });

    let strategic_regions_map_write = jomini.write((writer: any) => {
        justwrite(
            writer,
            full_map_data.strategic_regions_map,
            [],
            ["graphical_culture"]
        );
    });

    let buildings_map_write = jomini.write((writer: any) => {
        justwrite(
            writer,
            full_map_data.buildings_map,
            ["create_building"],
            ["building", "activate_production_methods"]
        );
    });

    let pops_map_write = jomini.write((writer: any) => {
        justwrite(writer, full_map_data.pops_map, ["create_pop"]);
    });

    await fetch("./upload", {
        method: "POST",
        body: JSON.stringify({
            src: "outputs",
            data: {
                "00_states.txt": new TextDecoder().decode(history_state_write),
                "01_state_regions.txt": new TextDecoder().decode(
                    state_regions_map_write
                ),
                "02_strategic_regions.txt": new TextDecoder().decode(
                    strategic_regions_map_write
                ),
                "04_buildings.txt": new TextDecoder().decode(
                    buildings_map_write
                ),
                "05_pops.txt": new TextDecoder().decode(pops_map_write),
            },
        }),
    });
};
