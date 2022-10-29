\*Read this in other languages: [English](backend.md), [简体中文](backend.zh-cn.md)

## / `GET`

Get local file

## /upload `GET`

Get all documents from directory "src"

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

Check if debug mode is active

```
    {
        "debug":true
    }
```

## /debug `POST`

If debug is false, make it true, vice versa
