# Vic3 mapdata editor

\*Read this in other languages: [English](README.md), [简体中文](README.zh-cn.md)

## A Brief Introduction

Vic3 mapdata editor is an open source province editor based off [Jomini](https://github.com/nickbabcock/jomini).

## Abilities

-   ✅ Visualize and edit Vic3 states(Keeping track of region_state)
-   ✅ Visualize and edit Vic3 state resources、city provinces、population and buildings
-   ✅ Visualize and edit Vic3 strategy_region

## TODO

-   A more intuitive way to display nations（Without using more files）
-   Optimize visualization performance，Fix [CROS](https://github.com/Linnest2020/Vic3-mapdata-editor/pull/2#issuecomment-1293482034) bug
-   Visualize and edit adjacencies
-   Real-time visualization and editing of city provinces
-   A live instance on the web that is created with docker
-   [Refactor JavaScript to TypeScript?](https://github.com/Linnest2020/Vic3-mapdata-editor/tree/typescript))
-   Good autocomplete
-   Good user and developer documentation
-   Scalable UI(I'm not joking，this is really difficult)
-   Update the map based on save files(So long! The main thing is I don't understand how the saves written!)
-   In summary, I welcome all suggestions for modifications

## Quick Guide

By the new version, if you install vanilla game, you can just launch the ediotr without put anything!

If your game installation failed, please follow the guides below:

In `data` folder of the repo:

-   buildings: place all documents in `game/common/history/buildings` to this folder
-   outputs: remain it empty if you save nothing
-   pops: place all documents in `game/common/history/pops` to this folder
-   state_regions: place all documents in `game/map_data/state_regions` to this folder
-   strategic_regions: place all documents in `game/common/history/strategic_regions` to this folder
-   states: place all documents in `game/common/history/states` to this folder
-   adjacencies.csv: as the same name document in `game/map_data`
-   provinces.png: as the same name document in `game/map_data`
-   rivers.png: as the same name document in `game/map_data`

Double-click `start.exe` and launch the editor.

There are serval mode of the editor: `prov`,`state`,`edit`,`strategy`,and `country`

-   `prov`: Just for look the default map and generate a color which can not shown in the map
-   `state`: Click to select a state_region, and edit the property of this state_region
-   `edit`: Editing the `history/state`. Click to select a prov, `ctrl`+click to select multiple provs, `shift` + click to select all of the provs of the state_region which contains your selected prov, press the mouse left key and drag and release to select a series of provs in a rectangle selecting area,edit the input of state and country, press `convert` button to convert.
-   `strategy`: Click to select a state_region, `ctrl`+click to select multiple state_regions, edit the strategy_region, press `convert` button to convert.
-   `terrain`: Show the terrain if you put `map_data/province_terrains.txt`
-   `country`: Just for watch and it has the risk of crash

In your editing, the `save` button should be press to save the files.
All of the save file would be in `data/outputs`
If you select `debug` in the tray menu, in your next editing(fresh it or click `open` in the tray menu after you close the previous editor), the editor would read your previous saving as the inputs.

Finally you will get a series of document, you should place them in `mod` folder(where you create your mod!), and make them replace the vanilla files

in `.metadata/metadata.json`:

```json
{
    "name": "Yourmod",
    "id": "your.mod",
    "version": "0.01",
    "supported_game_version": "",
    "short_description": "",
    "tags": ["funny modding"],
    "relationships": [],
    "game_custom_data": {
        "multiplayer_synchronized": true,
        "replace_paths": [
            "common/history/states",
            "common/history/pops",
            "common/history/buildings",
            "map_data/state_regions",
            "common/strategic_regions"
        ]
    }
}
```

In your mod folder there is only one file, they are:

-   common/history/states/00_states.txt
-   map_data/state_regions/01_state_regions.txt
-   common/strategic_regions/02_strategic_regions.txt
-   common/history/buildings/04_buildings.txt
-   common/history/pops/05_pops.txt
