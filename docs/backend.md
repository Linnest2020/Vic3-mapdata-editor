\*Read this in other languages: [English](backend.md), [简体中文](backend.zh-cn.md)

## / `GET`

Get local file

## /upload `GET`

Get all documents from directory "src" by query string

## /upload `POST`

Upload

```
	{
	 	"src": "src",
	 	"data": {
	 		"1.txt":"..."
	 		"2.txt":"..."
	 	}
	 }

```

## /debug `GET`

Check if debug mode is active, determined by if you select "Debug" in system tray

```
    {
        "debug":true
    }
```

## /debug `POST`

Toggle the debug to make debug mode activated.
