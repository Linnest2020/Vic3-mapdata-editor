
let main_canvas = document.getElementById("canvas")
let voronoi = document.createElement("canvas")
let ctx = voronoi.getContext("2d")

let board = document.getElementById("board")
let btn = document.createElement("button")
// canvasbg.appendChild(voronoi)
document.body.appendChild(voronoi)
let _width,_height

voronoi.style.zIndex = 165

// https://github.com/MrGaoGang/js-map-generator
// https://www.proyy.com/6977667374849736735.html
// https://blog.csdn.net/aihidao/article/details/104760251?spm=1001.2101.3001.6650.5&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-5-104760251-blog-104756677.pc_relevant_multi_platform_whitelistv3&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-5-104760251-blog-104756677.pc_relevant_multi_platform_whitelistv3&utm_relevant_index=6


// [_width,_height] = [main_canvas.width,main_canvas.height]
// [voronoi.width,voronoi.height] = [_width,_height]
[voronoi.width,voronoi.height] = [300,200]
voronoi.width = 300
voronoi.height = 200
// let canvasbg = document.getElementById("canvasbg")

class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x
    }

    getY() {
        return this.y
    }

    setpoint(point){
        this.x = point.getX()
        this.y = point.getY()
    }

    randomPoint(width,height){
        this.x = Math.round(Math.random()*width)
        this.y = Math.round(Math.random()*height)
    }

    isReal(){
        return x != -1 && y != -1
    }

    pointdis(other){
        let noise = Math.random()
        return Math.sqrt( // any magic number there?
            Math.pow( (this.getX() - other.getX()),2 )
        +   Math.pow( (this.getY() - other.getY()),2 )
        )
    }
}


//记录不同点的颜色
var colorMap = {};




class Voronoi {
    constructor(width,height,num_of_points) {
        this.width = width
        this.height = height
        this.num_of_points = num_of_points
        console.log(num_of_points,width,height)
        this.points = []
        this.colorMap = {}
        this.randomPoint()
        
    }

    randomPoint(){
        console.log("?")
        for(var i =this.num_of_points ;i--;){
            var tmpPoint = new Point(0,0);
            tmpPoint.randomPoint(this.width,this.height);
            this.points.push(tmpPoint);
            this.colorMap[i] ="#" + Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0')
        }
    }

    getcolor(p1,imgdata=null){
        let dis = -1
        let nearPointID = 0
        for (let m=this.num_of_points;m--;){
            let tmpDis = this.points[m].pointdis(p1);
            if(dis < 0){
                dis = tmpDis;
            }

            if(tmpDis<dis){
                dis = tmpDis;
                nearPointID = m;
            }
        }
        return this.colorMap[nearPointID]
    }
}

const Overlay = (v1,v2) => {
    for (i=v2.num_of_points;i--;){
        let color = v1.getcolor(v2.points[i])
        v2.colorMap[i] = color
    }
}


const drawVoronoi = (ctx,v1) =>{
    imgdata = ctx.getImageData(0,0,v1.width,v1.height).data
    for (let i=v1.width;i--;){
        for (let j = v1.height;j--;){
            let sindex = 4*(v1.width*j+i)
            if (imgdata[sindex] == 0 && imgdata[sindex+1] == 0 && imgdata[sindex+2] == 0 && imgdata[sindex+3] != 0)
                continue
            // console.log(i,j)
            ctx.fillStyle = v1.getcolor(new Point(i,j),imgdata)
            // console.log(v1.getcolor(new Point(i,j)))
            ctx.fillRect(i,j,5,5)
        }
    }
}




voronoi.onclick = function(e){
//绘制出每个点的颜色，它的颜色和它距离最近的点的颜色相同
    let points = []
    // point_number = 100
    //第一步随机生成点
    ctx.fillStyle = "#000000"
    ctx.fillRect(50,60,50,60)
    ctx.moveTo(70,80)
    ctx.lineTo(270,180)
    ctx.closePath()
    ctx.stroke()

    let width = voronoi.width
    let height = voronoi.height

    let v1 = new Voronoi(width,height,100)
    let v4 = new Voronoi(width,height,1000)
    console.log("over");


    Overlay(v1,v4)
    drawVoronoi(ctx,v4)

    // for(var i = 0; i < width ; i++){
    //     for(var j = 0; j <height ; j++){
            
    //         var dis = -1;
    //         var nearPointID = 0;
            
    //         for(var m = 0 ; m < points.length ; m++){
    //             var tmpDis = points[m].pointdis(new Point(i,j));
    //             if(dis < 0){
    //                 dis = tmpDis;
    //             }

    //             if(tmpDis<dis){
    //                 dis = tmpDis;
    //                 nearPointID = m;
    //             }
    //         }
    //         if(!colorMap[nearPointID]){
    //             colorMap[nearPointID]=Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
    //         }

    //         ctx.fillStyle = "#" + colorMap[nearPointID];
            
    //         ctx.fillRect(i,j,1,1);
    //     }
    // }
}