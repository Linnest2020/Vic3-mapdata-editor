const blockwrite = (writer,key,value,ambiuious=[],quote=[]) => {
    if (value instanceof Array && ambiuious.indexOf(key) >= 0 ){
        if (typeof(value[0]) == 'string' || typeof(value[0]) =='number'){
            for (let i= 0;i<value.length;i++){
                let item = value[i]
                writer.write_unquoted(key)
                if (typeof(item) == 'number'){
                    if (String(item).indexOf(".")>-1){
                        writer.write_f32(item)
                    } else {
                        writer.write_integer(item)
                    }
                } else  {
                    if (quote.indexOf(key)>-1){
                        writer.write_quoted(item)
                    } else {
                        writer.write_unquoted(item)
                    }
                }
                
            }
        } else {
            for (let i= 0;i<value.length;i++){
                let item = value[i]
                writer.write_unquoted(key)
                writer.write_object_start();
                for (let iitem in item){
                    blockwrite(writer,iitem,item[iitem],ambiuious=ambiuious,quote=quote)
                }
                writer.write_end();
            }
            
        }
    } else if( value instanceof Array ){
        writer.write_unquoted(key)
        writer.write_array_start();
        for (let i= 0;i<value.length;i++){
            let item = value[i]
            if (typeof(item) == 'number'){
                if (String(item).indexOf(".")>-1) writer.write_f32(item)
                else writer.write_integer(item)
            } else  {
                if (quote.indexOf(key)>-1)writer.write_quoted(item)
                else writer.write_unquoted(item)
            }
        }
        writer.write_end();
    } else if( typeof(value) == 'string' || typeof(value) =='number' ) {
        writer.write_unquoted(key)
        if (typeof(value) == 'number'){
            if (String(value).indexOf(".")>-1){
                writer.write_f32(value)
            } else {
                writer.write_integer(value)
            }
        } else  {
            if (quote.indexOf(key)>-1) {
                writer.write_quoted(value)
            } else {
                writer.write_unquoted(value)
            }
        }
    } else{
        writer.write_unquoted(key)
        writer.write_object_start();
        for (let newkey in value){
            blockwrite(writer,newkey,value[newkey],ambiuious=ambiuious,quote=quote)
        }
        writer.write_end();
    }
}

const justwrite = (writer,text,ambiuious=[],quote=[]) => {
    for (let key in text){
        blockwrite(writer,key,text[key],ambiuious=ambiuious,quote=quote)
    }
}

export {justwrite}