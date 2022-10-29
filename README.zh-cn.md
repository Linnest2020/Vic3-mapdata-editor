# Vic3 mapdata editor

\*其他语言版本: [English](README.md), [简体中文](README.zh-cn.md)

## 简介

Vic3 mapdata editor 是基于[Jomini](https://github.com/nickbabcock/jomini)的, 开源的 Vic3 地图省份编辑器。

## 特性

-   ✅ 可视化编辑 Vic3 的省份(含 region_state)
-   ✅ 可视化编辑 Vic3 的省份资源、城市地块、人口、建筑
-   ✅ 可视化编辑 Vic3 的战略地区

## TODO

-   更流畅的国家模式显示（且不加载更多的文件）
-   显示性能优化，修复 CROS 的固有 bug
-   可视化编辑 adjacencies
-   实时可视化编辑城市地块
-   完全的上传至网络服务器并 docker 化
-   Typescript 化？
-   友好的自动补全
-   友好的使用文档和开发者文档
-   放大和缩小(不开玩笑，这个真的很难弄)
-   通过读取存档实现转换成现有地图(So long!主要是我真的没看懂存档是怎么写的!)
-   总之，欢迎提供修改意见

## 快速上手

在本项目的`data`文件夹里

-   buildings: 将`game/common/history/buildings`的所有文件放到这里
-   outputs: 存放输出文件的文件夹,初始时应当留空
-   pops: 将`game/common/history/pops`的所有文件放到这里
-   state_regions: 将`game/map_data/state_regions`的所有文件放到这里
-   strategic_regions: 将`game/map_data/strategic_regions`的所有文件放到这里
-   states: 将`game/common/history/states`的所有文件放到这里
-   adjacencies.csv: 将`game/map_data`的同名文件放到这里
-   provinces.png: 将`game/map_data`的同名文件放到这里
-   rivers.png: 将`game/map_data`的同名文件放到这里

打开`start.exe`, 启动该编辑器

编辑器有几种模式, `地块`, `省份`, `编辑`,`战略`,`国家`

-   `地块`: 目前除了看默认地图和生成随机一个地图外的颜色之外没有用处
-   `省份`: 单选以选择一个省份地区, 编辑省份的属性
-   `编辑`: 编辑 history, 单选一个地块进入选区, `ctrl`+单选增加选区, `shift`+单选选择该地块所属的省份的所有地块,长按拖动后释放选择矩形选区, 编辑省份栏和国家栏, 按`转换`后转换
-   `战略`: 点击一个省份,`ctrl`+单选增加选区, 编辑战略地区, 按`转换`后转换
-   `地形`: 如果你把`map_data/province_terrains.txt`放到`data`文件夹, 你就可以查看地形图
-   `国家`: 只读模式, 观赏用, 且可能在点击该模式时崩溃

在编辑过程中, 应当随时点击上面的`保存`按钮, 以避免可能会存在的崩溃。
所有保存的都在`data/outputs`
如果你在托盘菜单里选择了`调试`, 那么当你下次使用(刷新或者在关闭先前的浏览器再在托盘菜单点击`打开`), 编辑器就会以上次保存的文件作为这次的输入

最后你会在`data/outputs` 找到一系列文件, 这些文件应当在 mod 文件夹里,也就是你创建的文件夹里替换掉原版的文件

在`.metadata/metadata.json`中
```json
{
  "name" : "Yourmod",
  "id" : "your.mod",
  "version" : "0.01",
  "supported_game_version" : "",
  "short_description" : "",
  "tags" : ["funny modding"],
  "relationships" : [],
  "game_custom_data" : {
    "multiplayer_synchronized" : true,
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

在你的mod 的文件夹的对应文件夹里均只有一个文件, 分别是
+ common/history/states/00_states.txt
+ map_data/state_regions/01_state_regions.txt
+ common/strategic_regions/02_strategic_regions.txt
+ common/history/buildings/04_buildings.txt
+ common/history/pops/05_pops.txt
