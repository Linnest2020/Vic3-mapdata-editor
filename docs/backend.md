## / `GET`
返回本地文件

## /upload `GET`
通过查询字符串src返回文件夹中的所有文件

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
返回,debug值视是否在菜单中选择调试
```
    {
        "debug":true
    }
```

## /debug `POST`
如果debug为false设置为true,反之亦然