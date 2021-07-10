//author Lok
var canvas = document.getElementById('tutorial');

if (!canvas.getContext){
  alert("您的浏览器不支持绘制图片");
}

//获得 2d 上下文对象
var ctx = canvas.getContext('2d');

//定义pot对象
function pot(x,y){
	var opot = new Object;
	opot.x=x;
	opot.y=y;
	return opot;
}

//设置刷子
function setBrush(fillColor,strokeColor,strokeWidth){
	ctx.fillStyle=fillColor||"#888";
	ctx.strokeStyle=strokeColor||"black";
	ctx.strokeWidth=strokeWidth||1;
}



//划线
function draw_line(spot,epot,color,width){
	setBrush(null,color,width);
	ctx.beginPath();
	ctx.moveTo(spot.x,spot.y); //把画笔移动到指定的坐标
    ctx.lineTo(epot.x,epot.y);  //绘制一条从当前位置到指定坐标(200, 50)的直线.
    //闭合路径。会拉一条从当前点到path起始点的直线。如果当前点与起始点重合，则什么都不做
    // ctx.closePath();
	ctx.stroke(); //绘制路径。
}

//画一条连续的线
function draw_lines(potList,color,width,closePath){
	setBrush(null,color,width);
	ctx.beginPath();

	spot=potList[0];
	ctx.moveTo(spot.x,spot.y); //把画笔移动到指定的坐标

	for(var i=1;i<potList.length;i++){
		console.log(potList[i]);
		var tpot=potList[i];
		ctx.lineTo(tpot.x,tpot.y);  //绘制一条从当前位置到指定坐标(200, 50)的直线.

	}
    //闭合路径。会拉一条从当前点到path起始点的直线。如果当前点与起始点重合，则什么都不做
	if(closePath==true)
		ctx.closePath();
	ctx.stroke(); //绘制路径。
}

//画矩形 style指颜色
function draw_Rect(spot,epot,fillColor){
	setBrush(fillColor);

    ctx.fillRect (spot.x, spot.y, epot.x, epot.y);
}

//调整画板大小
function resize_canvas(w,h){
	var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
	canvas.width = w;
	canvas.height = h;
	ctx.putImageData(imgData,0,0);
}


function test(){
	draw_Rect(pot(0,0),pot(2000,3000));
	resize_canvas(1000,1000);
	draw_Rect(pot(5,40),pot(20,300),"orange");
	
	draw_line(pot(10,10),pot(80,80),"purple");

	draw_lines([pot(0,0),pot(34,65),pot(78,23),pot(98,45)]);
}
// test();