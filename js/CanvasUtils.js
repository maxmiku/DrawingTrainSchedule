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

 
//求斜边长度
function getBeveling(x,y)
{
	return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
}
//画虚线
function draw_dashLine(spot,epot,dashLen)
{
	dashLen=dashLen||1;
	let x1=spot.x;
	let y1=spot.y;
	let x2=epot.x;
	let y2=epot.y;

	//得到斜边的总长度
	var beveling = getBeveling(x2-x1,y2-y1);
	//计算有多少个线段
	var num = Math.floor(beveling/dashLen);
	
	for(var i = 0 ; i < num; i++)
	{
		ctx[i%2 == 0 ? 'moveTo' : 'lineTo'](x1+(x2-x1)/num*i,y1+(y2-y1)/num*i);
	}
	ctx.stroke();
}

//画一条连续的折线
function draw_lines(potList,color,width,closePath){
	setBrush(null,color,width);
	ctx.beginPath();

	spot=potList[0];
	ctx.moveTo(spot.x,spot.y); //把画笔移动到指定的坐标

	for(var i=1;i<potList.length;i++){
		// console.log(potList[i]);
		var tpot=potList[i];
		ctx.lineTo(tpot.x,tpot.y);  //绘制一条从当前位置到指定坐标(200, 50)的直线.

	}
    //闭合路径。会拉一条从当前点到path起始点的直线。如果当前点与起始点重合，则什么都不做
	if(closePath==true)
		ctx.closePath();
	ctx.stroke(); //绘制路径。
}

//画矩形 style指颜色
function draw_rect(spot,epot,fillColor){
	setBrush(fillColor);

    ctx.fillRect (spot.x, spot.y, epot.x, epot.y);
}

//写字
function draw_text(text,pot,textBaseline,textAlign,font,border,fill,rotateDeg){
	//textBaseline https://www.w3school.com.cn/tags/canvas_textbaseline.asp

	fill=fill||"#000";
	setBrush(fill,border);
	ctx.font = font||'1.5rem 微软雅黑';
	ctx.textBaseline=textBaseline||"top";
	ctx.textAlign=textAlign||"center";

	if(rotateDeg!=null){
		ctx.translate(pot.x,pot.y);//设置原点
		ctx.rotate(rotateDeg*Math.PI/180);
		ctx.fillText (text, 0,0);
		ctx.rotate(-rotateDeg*Math.PI/180);//还原原点及角度
		ctx.translate(-pot.x,-pot.y);

	}else{
		ctx.fillText (text, pot.x,pot.y);
	}

	
}

//调整画板大小
function resize_canvas(w,h){
	var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
	canvas.width = w;
	canvas.height = h;
	ctx.putImageData(imgData,0,0);
}

//导图图片
function exportImage(){

	var bloburl = canvas.toDataURL("image/jpeg",1);
	// console.log('bloburl', bloburl);
	var anchor = document.createElement('a');
	if ('download' in anchor) {
		anchor.style.visibility = 'hidden';
		anchor.href = bloburl;

		var myDate = new Date();

		anchor.download = "导出_列车运行图"+(myDate.getMonth()+1)+"-"+myDate.getDate()+" "+myDate.getHours()+"-"+myDate.getMinutes()+"-"+myDate.getSeconds();
		
		document.body.appendChild(anchor);
		var evt = document.createEvent('MouseEvents');
		evt.initEvent('click', true, true);
		anchor.dispatchEvent(evt);
		
		document.body.removeChild(anchor);
	} else {
		location.href = bloburl;
	}

}

//旋转画布
function draw_rotate(deg,centerPot){
	ctx.translate(centerPot.x,centerPot.y);//设置原点
	ctx.rotate(deg*Math.PI/180);
	
}

//重置画布位置
function draw_rotate_restore(){
	ctx.restore();
}


function test(){
	draw_Rect(pot(0,0),pot(2000,3000));
	resize_canvas(1000,1000);
	draw_Rect(pot(5,40),pot(20,300),"orange");
	
	draw_line(pot(10,10),pot(80,80),"purple");

	draw_lines([pot(0,0),pot(34,65),pot(78,23),pot(98,45)]);
}
// test();
