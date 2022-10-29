\*其他语言版本: [English](backend.md), [简体中文](backend.zh-cn.md)

## / `GET`

返回本地文件

## /upload `GET`

通过查询字符串 src 返回文件夹中的所有文件

## /upload `POST`

上传

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

返回,debug 值视是否在菜单中选择调试

```
    {
        "debug":true
    }
```

## /debug `POST`

如果 debug 为 false 设置为 true,反之亦然
