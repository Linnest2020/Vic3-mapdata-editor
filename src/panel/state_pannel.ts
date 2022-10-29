//@ts-nocheck

import { full_map_data } from "../index.js";
import { localization } from "../i18n/i18n.js";

let state_public = document.getElementById("state_public") as HTMLDivElement;
let state_private = document.getElementById("state_private") as HTMLDivElement;
let panel = document.getElementById("panelboard") as HTMLDivElement;
let more_info = document.getElementById("state_more_info") as HTMLDivElement;

let mode = "detail";
let state_edit_mode_selection = document.getElementById(
    "state_edit_mode_selection"
) as HTMLInputElement;

state_edit_mode_selection.addEventListener("change", function (e) {
    let tar = e.target as HTMLOptionElement;
    mode = tar.value;
});

const handle_state_edit = (info) => {
    switch (mode) {
        case "detail":
            state_detail_edit(info);
            break;
        case "pops":
            state_pops_edit(info);
            break;
        case "building":
            state_building_edit(info);
            break;
        case "resource":
            state_resource_edit(info);
            break;
        case "aresource":
            state_aresource_edit(info);
            break;
        case "cresource":
            state_cresource_edit(info);
            break;
    }
};

export { handle_state_edit };

type state_public_detail_type = {
    add_claim?: string | string[];
    add_homeland?: string | string[];
};
type state_private_detail_type = {
    state_type?:
        | "corporated"
        | "incorporated"
        | "treaty_port"
        | ("corporated" | "incorporated" | "treaty_port")[];
};

const state_detail_edit = (info: [string, string]) => {
    let state_detail = full_map_data.history_state_dict["STATES"][info[0]];
    let state_public_detail: state_public_detail_type = {};
    let state_split_detail: state_private_detail_type = {};
    let state_private_detail: state_private_detail_type = {};

    let index = -1;
    state_public.innerHTML = `<p>${info[0]}.region_state:${info[1].replace(
        "c:",
        ""
    )}</p><p>${localization.state_detail_public}:<button>+</button></p>`;
    state_private.innerHTML = `<p>${localization.state_detail_private}:<button>+</button></p>`;
    if (state_public.classList.contains("state_property_flow"))
        state_public.classList.remove("state_property_flow");
    if (state_private.classList.contains("state_property_flow"))
        state_private.classList.remove("state_property_flow");

    if (state_detail["add_claim"]) {
        if (!(state_detail["add_claim"] instanceof Array))
            state_public_detail["add_claim"] = [state_detail["add_claim"]];
        else state_public_detail["add_claim"] = state_detail["add_claim"];
    }
    if (state_detail["add_homeland"]) {
        if (!(state_detail["add_homeland"] instanceof Array))
            state_public_detail["add_homeland"] = [
                state_detail["add_homeland"],
            ];
        else state_public_detail["add_homeland"] = state_detail["add_homeland"];
    }
    if (!(state_detail["create_state"] instanceof Array)) {
        state_split_detail = state_detail["create_state"];
    } else {
        for (let i = 0; i < state_detail["create_state"].length; i++) {
            let item = state_detail["create_state"][i];
            if (item["country"] == info[1]) {
                state_split_detail = item;
                index = i;
                break;
            }
        }
    }

    let spu_btn = state_public.querySelector("button") as HTMLButtonElement;
    let spr_btn = state_private.querySelector("button") as HTMLButtonElement;
    spu_btn.addEventListener("click", function (e) {
        state_public.appendChild(
            draw_state_detail("", "", state_detail, false)
        );
    });
    spr_btn.addEventListener("click", function (e) {
        state_private.appendChild(
            draw_state_detail("", "", state_split_detail, false)
        );
    });

    if (state_split_detail["state_type"]) {
        if (!(state_split_detail["state_type"] instanceof Array))
            state_private_detail["state_type"] = [
                state_split_detail["state_type"],
            ];
        else
            state_private_detail["state_type"] =
                state_split_detail["state_type"];
    }
    console.log(state_private_detail, state_public_detail);

    if (state_public_detail["add_homeland"]) {
        for (let i = 0; i < state_public_detail["add_homeland"].length; i++)
            state_public.appendChild(
                draw_state_detail(
                    "add_homeland",
                    state_public_detail["add_homeland"][i],
                    state_detail
                )
            );
    }

    if (state_public_detail["add_claim"]) {
        for (let i = 0; i < state_public_detail["add_claim"].length; i++)
            state_public.appendChild(
                draw_state_detail(
                    "add_claim",
                    state_public_detail["add_claim"][i],
                    state_detail
                )
            );
    }

    if (state_private_detail["state_type"]) {
        for (let i = 0; i < state_private_detail["state_type"].length; i++)
            state_private.appendChild(
                draw_state_detail(
                    "state_type",
                    state_private_detail["state_type"][i],
                    state_split_detail
                )
            );
    }
};

const btn_adjustment = (text, _class = "btn-adjustment") => {
    let btn = document.createElement("button");
    btn.textContent = text;
    btn.classList.add(_class);
    return btn;
};

const keyequalitem = (key, value) => {
    let key_input = document.createElement("input");
    key_input.value = key;
    key_input.type = "text";
    key_input.classList.add("key_input");
    let op = document.createTextNode("=");
    let value_input = document.createElement("input");
    value_input.value = value;
    value_input.type = "text";
    value_input.classList.add("value_input");
    return [key_input, op, value_input];
};

const draw_state_detail = (
    key: string,
    value: string,
    data: state_public_detail_type | state_private_detail_type,
    disabled = true
) => {
    let dom = document.createElement("div");
    let parentNode = dom.parentNode as HTMLDivElement;
    let key_input: HTMLInputElement, value_input: HTMLInputElement;
    let minus = btn_adjustment("-");
    dom.appendChild(minus);
    let middle = keyequalitem(key, value);
    for (let i = 0; i < middle.length; i++) dom.appendChild(middle[i]);
    key_input = middle[0];
    value_input = middle[2];
    key_input.disabled = disabled;
    console.log(value_input);
    let plus = btn_adjustment("+");
    dom.appendChild(plus);
    minus.onclick = function (e) {
        if (!key_input.value || !value_input.value) {
            if (!key && !value) parentNode.removeChild(dom);
            else return;
        }

        if (data[key] instanceof Array) {
            data[key] = data[key].filter((item: string) => item != value);
            if (data[key].length < 1) {
                delete data[key];
            }
        } else delete data[key];

        parentNode.removeChild(dom);
    };

    plus.onclick = function (e) {
        if (!key_input.value || !value_input.value) {
            return;
        }
        console.log(data);
        if (data[key] instanceof Array) {
            data[key] = data[key].filter((item: string) => item != value);
            if (data[key].length < 1) {
                delete data[key];
            }
        } else delete data[key];

        if (!data[key_input.value]) {
            data[key_input.value] = [value_input.value];
        } else {
            data[key_input.value].push(value_input.value);
        }
        key_input.disabled = true;
        parentNode.appendChild(draw_state_detail("", "", data, false));
    };

    return dom;
};

const state_pops_edit = (info) => {
    let info_detail = "region_state:" + info[1].replace("c:", "");
    panel.style.maxWidth = "45%";
    console.log(full_map_data.pops_map);
    if (!full_map_data.pops_map["POPS"][info[0]])
        full_map_data.pops_map["POPS"][info[0]] = {
            [info_detail]: { create_pop: {} },
        };
    if (!full_map_data.pops_map["POPS"][info[0]][info_detail])
        full_map_data.pops_map["POPS"][info[0]][info_detail] = {
            create_pop: {},
        };
    if (!full_map_data.pops_map["POPS"][info[0]][info_detail]["create_pop"])
        full_map_data.pops_map["POPS"][info[0]][info_detail]["create_pop"] = {};
    let pop_detail = full_map_data.pops_map["POPS"][info[0]][info_detail];
    state_public.innerHTML = "";
    state_private.innerHTML = `<p>${info[0]}.${info_detail}</p><p>${localization.pops}:<button>+</button></p>`;

    if (state_public.classList.contains("state_property_flow"))
        state_public.classList.remove("state_property_flow");
    if (!state_private.classList.contains("state_property_flow"))
        state_private.classList.add("state_property_flow");

    let spr_btn = state_private.querySelector("button") as HTMLButtonElement;
    spr_btn.addEventListener("click", function (e) {
        state_private.appendChild(
            draw_pop_detail("", "", 0, pop_detail, "", false)
        );
    });

    if (pop_detail["create_pop"] instanceof Array) {
        for (let i = 0; i < pop_detail["create_pop"].length; i++) {
            state_private.appendChild(
                draw_pop_detail(
                    pop_detail["create_pop"][i]["culture"],
                    pop_detail["create_pop"][i]["religion"],
                    pop_detail["create_pop"][i]["size"],
                    pop_detail,
                    pop_detail["create_pop"][i]["pop_type"]
                )
            );
        }
    } else {
        state_private.appendChild(
            draw_pop_detail(
                pop_detail["create_pop"]["culture"],
                pop_detail["create_pop"]["religion"],
                pop_detail["create_pop"]["size"],
                pop_detail,
                pop_detail["create_pop"]["pop_type"]
            )
        );
    }
};

interface pop_detail {
    culture: string;
    size: number;
    religion: string;
    pop_type: string;
}

const draw_pop_detail = (
    cu: string,
    religion: string,
    size: number,
    data: any,
    pop_type: string,
    disabled = true
) => {
    let dom = document.createElement("div");
    let parentNode = dom.parentNode as HTMLDivElement;
    let minus = btn_adjustment("-");
    dom.appendChild(minus);

    let lp = document.createTextNode("(");
    let rp = document.createTextNode(")");
    let r_input = document.createElement("input");
    if (religion) r_input.value = religion;
    r_input.type = "text";
    r_input.classList.add("r_input");
    dom.appendChild(lp);
    dom.appendChild(r_input);
    dom.appendChild(rp);

    let cu_input = document.createElement("input");
    cu_input.value = cu;
    if (!cu) cu_input.value = "";
    cu_input.type = "text";
    cu_input.classList.add("cu_input");
    let op = document.createTextNode("=");
    let value_input = document.createElement("input");
    value_input.value = size;
    if (!size) value_input.value = "0";
    value_input.type = "text";
    value_input.classList.add("value_input");
    dom.appendChild(cu_input);
    dom.appendChild(op);
    dom.appendChild(value_input);

    if (cu) cu_input.disabled = disabled;

    let plus = btn_adjustment("+");
    dom.appendChild(plus);

    let pt_input = document.createElement("input");
    console.log(pop_type);
    if (pop_type) pt_input.value = pop_type;
    pt_input.type = "text";
    pt_input.classList.add("pt_input");
    dom.appendChild(pt_input);

    minus.onclick = function (e) {
        if (!cu_input.value || !value_input.value) {
            if (!cu && !size) parentNode.removeChild(dom);
            else return;
        }

        if (data["create_pop"] instanceof Array) {
            for (let i = 0; i < data["create_pop"].length; i++) {
                if (
                    data["create_pop"][i]["culture"] == cu &&
                    data["create_pop"][i]["religion"] == religion &&
                    data["create_pop"][i]["pop_type"] == pop_type
                ) {
                    data["create_pop"] = data["create_pop"].filter(
                        (items, index) => ![i].includes(index)
                    );
                    break;
                }
            }
        } else delete data["create_pop"];

        parentNode.removeChild(dom);
    };

    plus.onclick = function (e) {
        if (!cu_input.value || !value_input.value) {
            return;
        }
        console.log(data);

        let push = false;
        let procees = false;

        let arr: pop_detail = {
            culture: "",
            size: 0,
            religion: "",
            pop_type: "",
        };
        arr["culture"] = cu_input.value;
        if ((data["create_pop"]["religion"] && r_input.value) || r_input.value)
            arr["religion"] = r_input.value;
        if (
            (data["create_pop"]["pop_type"] && pt_input.value) ||
            pt_input.value
        )
            arr["pop_type"] = pt_input.value;
        arr["size"] = parseInt(value_input.value);

        if (data["create_pop"] instanceof Array) {
            for (let i = 0; i < data["create_pop"].length; i++) {
                if (data["create_pop"][i]["culture"] == cu_input.value) {
                    procees = true;
                    if (
                        !data["create_pop"][i]["religion"] &&
                        !r_input.value &&
                        !pt_input.value &&
                        !data["create_pop"][i]["pop_type"]
                    ) {
                        push = false;
                        data["create_pop"][i] = arr;
                        cu = arr["culture"];
                        if (arr["religion"]) religion = arr["religion"];
                        if (arr["pop_type"]) pop_type = arr["pop_type"];
                        size = arr["size"];
                        break;
                    }
                    if (
                        data["create_pop"][i]["religion"] != r_input.value ||
                        data["create_pop"][i]["pop_type"] != pt_input.value
                    ) {
                        push = true;
                        continue;
                    }
                    if (
                        data["create_pop"][i]["religion"] == r_input.value &&
                        data["create_pop"][i]["pop_type"] == pt_input.value
                    ) {
                        push = false;
                        data["create_pop"][i] = arr;
                        cu = arr["culture"];
                        if (arr["religion"]) religion = arr["religion"];
                        if (arr["pop_type"]) pop_type = arr["pop_type"];
                        size = arr["size"];
                        break;
                    }
                }
            }
        } else {
            procees = true;
            data["create_pop"] = [arr];
            cu = arr["culture"];
            if (arr["religion"]) religion = arr["religion"];
            if (arr["pop_type"]) pop_type = arr["pop_type"];
            size = arr["size"];
        }

        if (!procees || push) {
            cu = arr["culture"];
            if (arr["religion"]) religion = arr["religion"];
            if (arr["pop_type"]) pop_type = arr["pop_type"];
            data["create_pop"].push(arr);
        }

        if (cu) cu_input.disabled = true;
        parentNode.appendChild(draw_pop_detail("", "", "", data, "", false));
    };

    return dom;
};

const state_building_edit = (info) => {
    let info_detail = "region_state:" + info[1].replace("c:", "");
    panel.style.maxWidth = "45%";
    console.log(full_map_data.buildings_map["BUILDINGS"]);
    if (!full_map_data.buildings_map["BUILDINGS"][info[0]])
        full_map_data.buildings_map["BUILDINGS"][info[0]] = {
            [info_detail]: { create_building: {} },
        };
    if (!full_map_data.buildings_map["BUILDINGS"][info[0]][info_detail])
        full_map_data.buildings_map["BUILDINGS"][info[0]][info_detail] = {
            create_building: {},
        };
    if (
        !full_map_data.buildings_map["BUILDINGS"][info[0]][info_detail][
            "create_building"
        ]
    )
        full_map_data.buildings_map["BUILDINGS"][info[0]][info_detail][
            "create_building"
        ] = {};
    let building_detail =
        full_map_data.buildings_map["BUILDINGS"][info[0]][info_detail];
    state_public.innerHTML = "";
    state_private.innerHTML = `<p>${info[0]}.${info_detail}</p><p>${localization.building}:<button>+</button></p>`;
    console.log(building_detail);

    let spr_btn = state_private.querySelector("button") as HTMLButtonElement;
    spr_btn.addEventListener("click", function (e) {
        state_private.appendChild(
            draw_building_detail("", "", "", [], building_detail, false)
        );
    });
    if (state_public.classList.contains("state_property_flow"))
        state_public.classList.remove("state_property_flow");
    if (!state_private.classList.contains("state_property_flow"))
        state_private.classList.add("state_property_flow");

    if (building_detail["create_building"] instanceof Array) {
        for (let i = 0; i < building_detail["create_building"].length; i++) {
            state_private.appendChild(
                draw_building_detail(
                    building_detail["create_building"][i]["building"],
                    building_detail["create_building"][i]["level"],
                    building_detail["create_building"][i]["reserves"],
                    building_detail["create_building"][i],
                    building_detail
                )
            );
        }
    } else {
        state_private.appendChild(
            draw_building_detail(
                building_detail["create_building"]["building"],
                building_detail["create_building"]["level"],
                building_detail["create_building"]["reserves"],
                building_detail["create_building"],
                building_detail
            )
        );
    }
    more_info.style.display = "none";
};

const draw_building_detail = (
    key: string,
    lv: string,
    re: string,
    pm: string,
    data: any,
    disabled = true
) => {
    let is_more = false;

    let dom = document.createElement("div");
    let parentNode = dom.parentNode as HTMLDivElement;
    let minus = btn_adjustment("-");
    dom.appendChild(minus);

    let key_input = document.createElement("input");
    key_input.value = key;
    if (!key) key_input.value = "";
    key_input.type = "text";
    key_input.classList.add("key_input");
    let op = document.createTextNode("×");
    let value_input = document.createElement("input");
    value_input.value = lv;
    if (!lv) value_input.value = "";
    value_input.type = "text";
    value_input.classList.add("lv_input");

    let opplus = document.createTextNode("+");
    let re_input = document.createElement("input");
    re_input.value = re;
    if (!re) re_input.value = "";
    re_input.type = "text";
    re_input.classList.add("lv_input");

    dom.appendChild(key_input);
    dom.appendChild(op);
    dom.appendChild(value_input);
    dom.appendChild(opplus);
    dom.appendChild(re_input);

    if (key) key_input.disabled = disabled;

    let plus = btn_adjustment("+");
    dom.appendChild(plus);
    let more = btn_adjustment(">");
    dom.appendChild(more);

    minus.onclick = function (e) {
        if (!key_input.value || !value_input.value) {
            if (!key && !lv) parentNode.removeChild(dom);
            else return;
        }

        if (data["create_building"] instanceof Array) {
            for (let i = 0; i < data["create_building"].length; i++) {
                if (data["create_building"][i]["building"] == key) {
                    data["create_building"] = data["create_building"].filter(
                        (items, index) => ![i].includes(index)
                    );
                    break;
                }
            }
        } else delete data["create_building"];

        parentNode.removeChild(dom);
    };

    plus.onclick = function (e) {
        if (!key_input.value || !value_input.value || !re_input.value) {
            return;
        }
        console.log(data);

        let arr = {};
        let push = false;
        arr["building"] = key_input.value;
        arr["level"] = parseInt(value_input.value);
        arr["reservse"] = parseInt(re_input.value);
        arr["activate_production_methods"] = [];
        key = arr["building"];
        lv = arr["level"];
        re = arr["reservse"];

        if (key) key_input.disabled = true;

        if (data["create_building"] instanceof Array) {
            for (let i = 0; i < data["create_building"].length; i++) {
                push = true;
                if (data["create_building"][i]["building"] == key_input.value) {
                    push = false;
                    if (
                        data["create_building"][i][
                            "activate_production_methods"
                        ]
                    ) {
                        arr["activate_production_methods"] =
                            data["create_building"][i][
                                "activate_production_methods"
                            ];
                    }
                    data["create_building"][i] = arr;
                    parentNode.appendChild(
                        draw_building_detail(
                            "",
                            "",
                            "",
                            data["create_building"][i],
                            data,
                            false
                        )
                    );
                    return;
                }
            }
        } else {
            data["create_building"] = [arr];
            parentNode.appendChild(
                draw_building_detail(
                    "",
                    "",
                    "",
                    data["create_building"][0],
                    data,
                    false
                )
            );
        }

        if (push) {
            data["create_building"].push(arr);
            let length = data["create_building"].length - 1;
            parentNode.appendChild(
                draw_building_detail(
                    "",
                    "",
                    "",
                    data["create_building"][length],
                    data,
                    false
                )
            );
        }
    };

    more.onclick = function (e) {
        is_more = !is_more;
        if (is_more) more_info.style.display = "block";
        else more_info.style.display = "none";
        more_info.innerHTML = `<p>${key_input.value}</p><p>生产方式:<button>+</button></p>`;

        if (data["create_building"] instanceof Array) {
            for (let i = 0; i < data["create_building"].length; i++) {
                if (data["create_building"][i]["building"] == key) {
                    pm = data["create_building"][i];
                    break;
                }
            }
        } else {
            pm = data["create_building"];
        }
        console.log("pm", pm, data["create_building"], data);

        let more_info_btn = more_info.querySelector(
            "button"
        ) as HTMLButtonElement;
        more_info_btn.addEventListener("click", function (e) {
            more_info.appendChild(
                draw_pm_detail("", pm, "activate_production_methods")
            );
        });

        for (let i = 0; i < pm["activate_production_methods"].length; i++) {
            more_info.appendChild(
                draw_pm_detail(
                    pm["activate_production_methods"][i],
                    pm,
                    "activate_production_methods"
                )
            );
        }
    };

    return dom;
};

const draw_pm_detail = (key, data, kw = "") => {
    let dom = document.createElement("div");
    let parentNode = dom.parentNode as HTMLDivElement;

    let minus = btn_adjustment("-");
    dom.appendChild(minus);

    let key_input = document.createElement("input");
    key_input.value = key;
    key_input.type = "text";
    key_input.classList.add("key_input");
    dom.appendChild(key_input);
    let plus = btn_adjustment("+");
    dom.appendChild(plus);
    minus.onclick = function (e) {
        if (!key_input.value) {
            if (!key) parentNode.removeChild(dom);
            else return;
        }

        data[kw] = data[kw].filter(
            (items: string, index: number) => ![key].includes(items)
        );

        parentNode.removeChild(dom);
    };

    plus.onclick = function (e) {
        console.log(kw, key_input.value);
        if (!data[`${kw}`]) {
            data[`${kw}`] = [key_input.value];
        } else if (data[`${kw}`] instanceof Array) {
            data[`${kw}`].push(key_input.value);
        } else {
            console.log("hello?", data[`${kw}`]);
            data[`${kw}`] = [key_input.value];
        }

        parentNode.appendChild(draw_pm_detail("", data, kw));
    };

    return dom;
};

const state_aresource_edit = (info) => {
    let state_detail =
        full_map_data.state_regions_map[info[0].replace("s:", "")];
    state_public.innerHTML = `<p>${info[0]}.region_state:${info[1].replace(
        "c:",
        ""
    )}</p><p>${localization.aresource_full}:<button>+</button></p>`;
    state_private.innerHTML = "";
    if (!state_public.classList.contains("state_property_flow"))
        state_public.classList.add("state_property_flow");
    if (state_private.classList.contains("state_property_flow"))
        state_private.classList.remove("state_property_flow");

    let spu_btn = state_public.querySelector("button") as HTMLButtonElement;
    spu_btn.addEventListener("click", function (e) {
        state_public.appendChild(
            draw_pm_detail("", state_detail, "arable_resources")
        );
    });

    if (state_detail["arable_land"]) {
        state_public.appendChild(
            draw_one_detail(
                state_detail["arable_land"],
                localization.arable_land,
                state_detail,
                "arable_land"
            )
        );
    } else {
        state_public.appendChild(
            draw_one_detail(
                "",
                localization.arable_land,
                state_detail,
                "arable_land"
            )
        );
    }

    if (state_detail["arable_resources"]) {
        for (let i = 0; i < state_detail["arable_resources"].length; i++) {
            state_public.appendChild(
                draw_pm_detail(
                    state_detail["arable_resources"][i],
                    state_detail,
                    "arable_resources"
                )
            );
        }
    }
};

const draw_one_detail = (key, text, data, kw) => {
    let dom = document.createElement("div");

    let alands = document.createTextNode(text);
    let key_input = document.createElement("input");

    key_input.value = key;
    key_input.type = "text";
    key_input.classList.add("key_input");
    dom.appendChild(alands);
    dom.appendChild(key_input);

    let plus = btn_adjustment("√");
    dom.appendChild(plus);
    plus.onclick = function (e) {
        if (!data[`${kw}`] && !key_input.value) return;

        if (!data[`${kw}`] && key_input.value) {
            data[`${kw}`] = parseInt(key_input.value);
        } else if (data[`${kw}`] && !key_input.value) {
            delete data[`${kw}`];
        } else {
            console.log("hello?", data[`${kw}`]);
            data[`${kw}`] = parseInt(key_input.value);
        }
    };
    return dom;
};

const draw_kv_detail = (key, value, data) => {
    let dom = document.createElement("div");
    let parentNode = dom.parentNode as HTMLDivElement;

    let minus = btn_adjustment("-");
    dom.appendChild(minus);

    let key_input = document.createElement("input");
    key_input.value = key;
    key_input.type = "text";
    key_input.classList.add("key_input");
    dom.appendChild(key_input);

    let op = document.createTextNode("=");
    dom.appendChild(op);

    let value_input = document.createElement("input");
    value_input.value = value;
    value_input.type = "text";
    value_input.classList.add("value_input");
    dom.appendChild(value_input);

    let plus = btn_adjustment("+");
    dom.appendChild(plus);

    minus.onclick = function (e) {
        if (!key_input.value) {
            if (!key && !value) parentNode.removeChild(dom);
            else return;
        }

        delete data[key];

        parentNode.removeChild(dom);
    };

    plus.onclick = function (e) {
        if (key_input != key) {
            if (key) delete data[key];
        }
        if (!data["capped_resources"]) {
            data["capped_resources"] = { [key_input.value]: value_input.value };
        } else {
            data["capped_resources"][key_input.value] = value_input.value;
        }
        parentNode.appendChild(draw_kv_detail("", "", data));
    };

    return dom;
};

const state_cresource_edit = (info) => {
    let state_detail =
        full_map_data.state_regions_map[info[0].replace("s:", "")];
    state_public.innerHTML = `<p>${info[0]}.region_state:${info[1].replace(
        "c:",
        ""
    )}</p><p>${localization.cresource_full}:<button>+</button></p>`;
    state_private.innerHTML = "";
    if (!state_public.classList.contains("state_property_flow"))
        state_public.classList.add("state_property_flow");
    if (state_private.classList.contains("state_property_flow"))
        state_private.classList.remove("state_property_flow");

    let spu_btn = state_public.querySelector("button") as HTMLButtonElement;
    spu_btn.addEventListener("click", function (e) {
        state_public.appendChild(draw_kv_detail("", "", state_detail));
    });

    if (state_detail["capped_resources"]) {
        for (
            let i = 0, keys = Object.keys(state_detail["capped_resources"]);
            i < keys.length;
            i++
        ) {
            let key = keys[i];
            state_public.appendChild(
                draw_kv_detail(
                    key,
                    state_detail["capped_resources"][key],
                    state_detail
                )
            );
        }
    }
};

const draw_resource_detail = (key, akey, un, max, data, index = 0) => {
    let dom = document.createElement("div");
    let parentNode = dom.parentNode as HTMLDivElement;

    let minus = btn_adjustment("-");
    dom.appendChild(minus);

    let key_input = document.createElement("input");
    key_input.value = key;
    key_input.type = "text";
    key_input.classList.add("key_resource_input");
    dom.appendChild(key_input);

    let opor = document.createTextNode("/");
    dom.appendChild(opor);

    let akey_input = document.createElement("input");
    if (akey) akey_input.value = akey;
    akey_input.type = "text";
    akey_input.classList.add("key_resource_input");
    dom.appendChild(akey_input);

    let op = document.createTextNode("=");
    dom.appendChild(op);

    let un_input = document.createElement("input");
    un_input.value = un;
    un_input.type = "text";
    un_input.classList.add("pico_input");
    dom.appendChild(un_input);

    let opor_ = document.createTextNode("/");
    dom.appendChild(opor_);

    let max_input = document.createElement("input");
    if (max) max_input.value = max;
    max_input.type = "text";
    max_input.classList.add("pico_input");
    dom.appendChild(max_input);

    let plus = btn_adjustment("+");
    dom.appendChild(plus);

    minus.onclick = function (e) {
        if (!key_input.value) {
            if (!key && !un) parentNode.removeChild(dom);
            else return;
        }

        if (data["resource"] instanceof Array) {
            delete data["resource"][index];
        } else {
            delete data["resource"];
        }

        parentNode.removeChild(dom);
    };

    plus.onclick = function (e) {
        if (key_input != key) {
            delete data[key];
        }
        let res = {
            type: key_input.value,
            undiscovered_amount: parseInt(un_input.value),
        };
        if (akey_input.value) res["depleted_type"] = akey_input.value;
        if (max_input.value)
            res["discover_amount_max"] = parseInt(max_input.value);

        if (data["resource"] instanceof Array) {
            if (index > -1) data["resource"][index] = res;
            else data["resource"].push(res);
        } else {
            data["resource"] = [res];
        }

        parentNode.appendChild(draw_resource_detail("", "", "", "", data, -1));
    };

    return dom;
};

const state_resource_edit = (info) => {
    panel.style.maxWidth = "45%";
    let state_detail =
        full_map_data.state_regions_map[info[0].replace("s:", "")];
    state_public.innerHTML = `<p>${info[0]}.region_state:${info[1].replace(
        "c:",
        ""
    )}</p><p>${localization.resource_full}:<button>+</button></p>`;
    state_private.innerHTML = "";

    if (!state_public.classList.contains("state_property_flow"))
        state_public.classList.add("state_property_flow");
    if (state_private.classList.contains("state_property_flow"))
        state_private.classList.remove("state_property_flow");

    let spu_btn = state_public.querySelector("button") as HTMLButtonElement;
    spu_btn.addEventListener("click", function (e) {
        state_public.appendChild(
            draw_resource_detail("", "", "", "", state_detail, -1)
        );
    });

    if (state_detail["resource"]) {
        if (state_detail["resource"] instanceof Array) {
            for (let i = 0; i < state_detail["resource"].length; i++) {
                console.log(state_detail["resource"][i]);
                state_public.appendChild(
                    draw_resource_detail(
                        state_detail["resource"][i]["type"],
                        state_detail["resource"][i]["depleted_type"],
                        state_detail["resource"][i]["undiscovered_amount"],
                        state_detail["resource"][i]["discover_amount_max"],
                        state_detail,
                        i
                    )
                );
            }
        } else {
            state_public.appendChild(
                draw_resource_detail(
                    state_detail["resource"]["type"],
                    state_detail["resource"]["depleted_type"],
                    state_detail["resource"]["undiscovered_amount"],
                    state_detail["resource"]["discover_amount_max"],
                    state_detail,
                    0
                )
            );
        }
    }
};
