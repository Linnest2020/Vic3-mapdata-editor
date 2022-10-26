package main

import (
	"log"
	"os/exec"
	"strings"
)

var localization_zh = map[string]string{
	"start running": "http 服务器运行于localhost:5555 ...",
	"welcome_title": "欢迎",
	"welcome_msg":   "Vic3 mapdata editor 已启动, 右键托盘选择打开以开始编辑",
	"welcome_btn":   "开始编辑",
	"tray_tip":      "服务已最小化右下角, 右键点击打开菜单！",
	"tray_show":     "显示",
	"tray_hide":     "隐藏",
	"tray_open":     "打开",
	"tray_debug":    "调试",
	"tray_debug_tt": "以outputs文件作为输入的模式",
	"tray_quit":     "退出",
}

var localization_en = map[string]string{
	"start running": "start http server at 5555 ...",
	"welcome_title": "Welcome",
	"welcome_msg":   "Vic3 mapdata editor is started, right-click the tray to start edit",
	"welcome_btn":   "Start edit",
	"tray_tip":      "backend was minimized into the tray, right-click it to open the menu",
	"tray_show":     "Show",
	"tray_hide":     "Hide",
	"tray_open":     "Open",
	"tray_debug":    "Debug",
	"tray_debug_tt": "Load \"output\" folder as the inputs",
	"tray_quit":     "Quit",
}

func getlocate() string {
	cmd := exec.Command("powershell", "Get-Culture | select -exp Name")
	output, err := cmd.Output()
	if err != nil {
		log.Println(err)
	}

	return strings.TrimSpace(string(output))
}

func get_localization() map[string]string {
	loacate := getlocate()
	if strings.HasPrefix(loacate, "zh") {
		return localization_zh
	} else {
		return localization_en
	}
}
