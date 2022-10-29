package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/fs"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"syscall"

	"github.com/getlantern/systray"              // It got somewhat changed
	"github.com/getlantern/systray/example/icon" // It got changed too
	"github.com/go-toast/toast"
	"golang.org/x/sys/windows/registry"
)

var Showed bool = true
var kernel32 = syscall.NewLazyDLL("kernel32.dll")
var user32 = syscall.NewLazyDLL("user32.dll")
var isDebug bool = false

var localization = get_localization()

type MenuItem = systray.MenuItem

// https://docs.microsoft.com/en-us/windows/console/getconsolewindow
var getConsoleWindows = kernel32.NewProc("GetConsoleWindow")

// https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-showwindowasync
var showWindowAsync = user32.NewProc("ShowWindowAsync")
var SetForegroundWindow = user32.NewProc("SetForegroundWindow")
var data_src = "./data"

func main() {
	go func() {
		http.Handle("/", http.HandlerFunc(
			func(rw http.ResponseWriter, r *http.Request) {
				log.Printf("%s %s%s from %s\n", r.Method, r.Host, r.URL.String(), r.RemoteAddr)
				if strings.HasSuffix(r.URL.String(), ".js") {
					rw.Header().Set("Content-Type", "application/javascript; charset=utf-8")
				}
				if strings.HasSuffix(r.URL.String(), ".png") {
					rw.Header().Set("Access-Control-Allow-Origin", "*")
				}
				http.FileServer(http.Dir(".")).ServeHTTP(rw, r)
			}))
		http.Handle("/datab", http.HandlerFunc(
			func(rw http.ResponseWriter, r *http.Request) {
				log.Printf("%s %s%s from %s\n", r.Method, r.Host, r.URL.String(), r.RemoteAddr)
				http.FileServer(http.Dir("/data")).ServeHTTP(rw, r)
			}))
		http.HandleFunc("/upload", handle_upload)
		http.HandleFunc("/debug", handle_debug)
		log.Println(localization["start running"])
		initciate_notification()
		open_browser()
		err := http.ListenAndServe(":5555", nil)
		if err != nil {
			log.Fatalln("Error start http server at 5555: ", err)
		}
		select {}
	}()

	// 托盘程序逻辑
	systray.Run(onReady, onExit, onClicked)
}

func initciate_notification() {
	notification := toast.Notification{
		AppID:   "Vic3 mapdata editor",
		Title:   localization["welcome_title"],
		Message: localization["welcome_msg"],
		Actions: []toast.Action{
			{"protocol", localization["welcome_btn"], ""},
		},
	}
	err := notification.Push()
	if err != nil {
		log.Fatalln(err)
	}
}
func CheckChrome() (string, bool) {
	regpath := "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe"
	checkKey := func(k *registry.Key) (string, bool) {
		s, _, err := k.GetStringValue("")
		if err != nil {
			return "", false
		}
		return s, true
	}
	chs := make(chan registry.Key, 2)
	queryKey := func(w *sync.WaitGroup, k registry.Key) {
		defer w.Done()
		key1, err := registry.OpenKey(k, regpath, registry.READ)
		if err == nil {
			chs <- key1
		}
	}
	waitGroup := new(sync.WaitGroup)
	waitGroup.Add(2)
	go queryKey(waitGroup, registry.CURRENT_USER)
	go queryKey(waitGroup, registry.LOCAL_MACHINE)
	waitGroup.Wait()
	close(chs)
	for k := range chs {
		return checkKey(&k)
	}
	return "", false
}

func open_browser() {
	_, is_chorme := CheckChrome()
	browser := "start /b chrome --incognito -app=http://127.0.0.1:5555/vic3util.html"
	if !is_chorme {
		browser = "start /b msedge --incognito -app=http://127.0.0.1:5555/vic3util.html"
	}
	cmd := exec.Command("cmd", "/c", browser)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Start()
	if err != nil {
		log.Println(err, out.String())
	}
}

type upload_data struct {
	// formData {
	// 	"src": "src",
	// 	"data": {
	// 		"1.txt":"..."
	// 		"2.txt":"..."
	// 	}
	// }
	Src  string            `json:"src"`
	Data map[string]string `json:"data"`
}

func handle_upload(rw http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		log.Fatal("parse form error", err)
	}
	log.Printf("%s %s%s from %s\n", r.Method, r.Host, r.URL.String(), r.RemoteAddr)
	if r.Method == "POST" {
		formData := upload_data{}
		json.NewDecoder(r.Body).Decode(&formData)

		src := formData.Src
		data := formData.Data

		if src != "" {
			src = data_src + "/" + src
		} else {
			src = data_src
		}
		log.Printf("dump to %s ", src)
		for key, value := range data {
			err := ioutil.WriteFile(src+"/"+key, []byte(value), 0666)
			if err != nil {
				log.Println(err)
			}
		}
	} else if r.Method == "GET" {
		src := r.URL.Query().Get("src")
		if src != "" {
			src = data_src + "/" + src
		} else {
			src = data_src
		}
		var files []string
		err := filepath.Walk(src, func(path string, info fs.FileInfo, err error) error {
			if filepath.Ext(path) == ".txt" {
				files = append(files, info.Name())
			}
			return nil
		})
		if err != nil {
			panic(err)
		}
		log.Printf("%s: %s", src, files)
		rw.Header().Set("Content-Type", "application/json")
		json.NewEncoder(rw).Encode(files)

	}

}

func handle_debug(rw http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		log.Fatal("parse form error", err)
	}
	log.Printf("%s %s%s from %s\n", r.Method, r.Host, r.URL.String(), r.RemoteAddr)
	if r.Method == "GET" {
		res := map[string]bool{
			"debug": isDebug,
		}
		json.NewEncoder(rw).Encode(res)

	} else if r.Method == "POST" {
		isDebug = !isDebug
	}

}

func onReady() {
	systray.SetIcon(icon.Data)
	systray.SetTitle("HTTP Server")
	systray.SetTooltip(localization["tray_tip"])
	mShow := systray.AddMenuItem(localization["tray_show"], "")
	mHide := systray.AddMenuItem(localization["tray_hide"], "")
	mOpen := systray.AddMenuItem(localization["tray_open"], "")
	mDebug := systray.AddMenuItem(localization["tray_debug"], localization["tray_debug_tt"])
	// systray.AddSeparator()
	mQuit := systray.AddMenuItem(localization["tray_quit"], "")

	consoleHandle, r2, err := getConsoleWindows.Call()
	if consoleHandle == 0 {
		fmt.Println("Error call GetConsoleWindow: ", consoleHandle, r2, err)
	}

	vh := make(chan interface{})

	go func() {
		for {
			select {
			case <-mShow.ClickedCh:
				r1, r2, err := showWindowAsync.Call(consoleHandle, 5)
				if r1 != 1 {
					fmt.Println("Error call ShowWindow @SW_SHOW: ", r1, r2, err)
				} else {
					r1, r2, err := SetForegroundWindow.Call(consoleHandle)
					if r1 == 0 {
						fmt.Println("Error call ShowWindow @SW_SHOW: ", r1, r2, err)
					}
					Showed = true
				}
			case <-mHide.ClickedCh:
				r1, r2, err := showWindowAsync.Call(consoleHandle, 0)
				if r1 != 1 {
					fmt.Println("Error call ShowWindow @SW_HIDE: ", r1, r2, err)
				} else {
					Showed = false
				}
			case data := <-vh:
				fmt.Println(data)
				vh = make(chan interface{})
			case <-mDebug.ClickedCh:
				isDebug = !isDebug
				if isDebug {
					mDebug.Check()
				} else {
					mDebug.Uncheck()
				}
			case <-mOpen.ClickedCh:
				open_browser()
			case <-mQuit.ClickedCh:
				systray.Quit()
			}
		}
	}()

}

func onExit() {
	// clean up here
}

func onClicked() {
	consoleHandle, r2, err := getConsoleWindows.Call()
	if consoleHandle == 0 {
		fmt.Println("Error call GetConsoleWindow: ", consoleHandle, r2, err)
	}
	if Showed {
		r1, r2, err := showWindowAsync.Call(consoleHandle, 0)
		if r1 != 1 {
			fmt.Println("Error call ShowWindow @SW_HIDE: ", r1, r2, err)
		} else {
			Showed = !Showed
		}
	} else {
		r1, r2, err := showWindowAsync.Call(consoleHandle, 5)
		if r1 != 1 {
			fmt.Println("Error call ShowWindow @SW_SHOW: ", r1, r2, err)
		} else {
			r1, r2, err := SetForegroundWindow.Call(consoleHandle)
			if r1 == 0 {
				fmt.Println("Error call ShowWindow @SW_SHOW: ", r1, r2, err)
			}
			Showed = !Showed
		}
	}
}
