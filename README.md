# Vic3 mapdata editor

## 简介

Vic3 mapdata editor是基于[Jomini]("https://github.com/nickbabcock/jomini")的, 开源的Vic3地图省份编辑器。

## 特性

+ ✅可视化编辑Vic3的省份(含region_state)
+ ✅可视化编辑Vic3的省份资源、城市地块、人口、建筑
+ ✅可视化编辑Vic3的战略地区

## TODO

+ 更流畅的国家模式显示（且不加载更多的文件）
+ 显示性能优化，修复CROS的固有bug
+ 可视化编辑adjacencies
+ 实时可视化编辑城市地块
+ 完全的上传至网络服务器并docker化
+ Typescript化？
+ 友好的自动补全
+ 友好的使用文档和开发者文档
+ 放大和缩小(不开玩笑，这个真的很难弄)
+ 通过读取存档实现转换成现有地图(So long!主要是我真的没看懂存档是怎么写的!)
+ 总之，欢迎提供修改意见

## 快速上手
在本项目的`data`文件夹里
+ buildings: 将`game/common/history/buildings`的所有文件放到这里
+ outputs: 存放输出文件的文件夹,初始时应当留空
+ pops: 将`game/common/history/pops`的所有文件放到这里
+ state_regions: 将`game/map_data/state_regions`的所有文件放到这里
+ strategic_regions: 将`game/common/strategic_regions`的所有文件放到这里
+ states: 将`game/common/history/states`的所有文件放到这里
+ adjacencies.csv: 将`game/map_data`的同名文件放到这里
+ provinces.png: 将`game/map_data`的同名文件放到这里
+ rivers.png: 将`game/map_data`的同名文件放到这里

打开`start.exe`, 启动该编辑器

编辑器有几种模式, `地块`, `省份`, `编辑`,`战略`,`国家`
- `地块`: 目前除了看默认地图和生成随机一个地图外的颜色之外没有用处
- `省份`: 单选以选择一个省份地区, 编辑省份的属性
- `编辑`: 编辑history, 单选一个地块进入选区, `ctrl`+单选增加选区, `shift`+单选选择该地块所属的省份的所有地块,长按拖动后释放选择矩形选区, 编辑省份栏和国家栏, 按`转换`后转换
- `战略`: 点击一个省份,`ctrl`+单选增加选区, 编辑战略地区, 按`转换`后转换
- `国家`: 只读模式, 观赏用, 且可能在点击该模式时崩溃

在编辑过程中, 应当随时点击上面的`保存`按钮, 以避免可能会存在的崩溃。
所有保存的都在`data/outputs`
如果你在托盘菜单里选择了`调试`, 那么当你下次使用(刷新或者在关闭先前的浏览器再在托盘菜单点击`打开`), 编辑器就会以上次保存的文件作为这次的输入

最后你会在`data/outputs` 找到一系列文件, 这些文件应当在mod文件夹里,也就是你创建的文件夹里替换掉原版的文件

```
<!-- description.mod -->
name="Yourmod"
version="0.1.1"
tags={
	"funny modding"
}
picture="thumbnail.png"
replace_path="common/history/states" 
replace_path="map_data/state_regions"
replace_path="common/history/strategic_regions"
replace_path="common/history/pops"
replace_path="common/history/buildings"

<!-- 在你的mod 的文件夹的对应文件夹里均只有一个文件, 分别是 -->
<!-- common/history/states/00_states.txt -->
<!-- map_data/state_regions/01_state_regions.txt -->
<!-- common/history/strategic_regions/02_strategic_regions.txt -->
<!-- common/history/buildings/04_buildings.txt -->
<!-- common/history/pops/05_pops.txt -->

```

## Quick Guide
In `data` folder of the repo:
+ buildings: place all documents in `game/common/history/buildings` to this folder
+ outputs: remain it empty if you save nothing
+ pops: place all documents in `game/common/history/pops` to this folder
+ state_regions: place all documents in `game/map_data/state_regions` to this folder
+ strategic_regions: place all documents in `game/common/strategic_regions` to this folder
+ states: place all documents in `game/common/history/states` to this folder
+ adjacencies.csv: as the same name document in `game/map_data`
+ provinces.png: as the same name document in `game/map_data`
+ rivers.png: as the same name document in `game/map_data`

Double-click `start.exe` and launch the editor.

There are serval mode of the editor: `prov`,`state`,`edit`,`strategy`,and `country`

- `prov`: Just for look the default map and generate a color which can not shown in the map
- `state`: Click to select a state_region, and edit the property of this state_region
- `edit`: Editing the `history/state`. Click to select a prov, `ctrl`+click to select multiple provs, `shift` + click to select all of the provs of the state_region which contains your selected prov, press the mouse left key and drag and release to select a series of provs in a rectangle selecting area,edit the input of state and country, press `convert` button to convert.
- `strategy`: Click to select a state_region, `ctrl`+click to select multiple state_regions, edit the strategy_region, press `convert` button to convert.
- `country`: Just for watch and it has the risk of crash

In your editing, the `save` button should be press to save the files.
All of the save file would be in `data/outputs`
If you select `debug` in the tray menu, in your next editing(fresh it or click `open` in the tray menu after you close the previous editor), the editor would read your previous saving as the inputs.

Finnally you will get a seriers of document, you should place them in `mod` folder(where you create your mod!), and make them replace the vanilla files
```
<!-- description.mod -->
name="Yourmod"
version="0.1.1"
tags={
	"funny modding"
}
picture="thumbnail.png"
replace_path="common/history/states" 
replace_path="map_data/state_regions"
replace_path="common/history/strategic_regions"
replace_path="common/history/buildings"
replace_path="common/history/pops"

<!-- In your mod folder there is only one file, they are -->
<!-- common/history/states/00_states.txt -->
<!-- map_data/state_regions/01_state_regions.txt -->
<!-- common/history/strategic_regions/02_strategic_regions.txt -->
<!-- common/history/buildings/04_buildings.txt -->
<!-- common/history/pops/05_pops.txt -->
```