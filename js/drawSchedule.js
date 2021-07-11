let all_k=-1;//所有车次
let all_u=-1;//所有车站

let a_kfu_d;
let d_kfu_d;
let dw_kfu_d;

let allTime_d=4000;//全部时间 单位s
let timeInterval=300;//每一条竖线的间隔时间 s
let secPerPixel=1//每个像素所对应的秒数
let pixelPerStation=50;//每个车站间隔的像素


let canvas_width;//画布宽度
let canvas_heigh;//画布高度

let schBasePot=pot(50,20);//运行图画图基点

let frameLineColor="#999";//表线颜色


function drawSchedule(a_kfu_i,d_kfu_i,dw_kfu_i,K,U,allTime,canvasId){
	console.log("传入参数画图",K,U);
	all_k=K;
	all_u=U;
	a_kfu_d=a_kfu_i;
	d_kfu_d=d_kfu_i;
	dw_kfu_d=dw_kfu_i;

	allTime_d=allTime;

	canvas_width=(allTime/secPerPixel)+100;//计算画布宽度 并加上裕度
	canvas_heigh=pixelPerStation*(all_u+2);
	console.log(canvas_width,canvas_heigh);
	resize_canvas(canvas_width,canvas_heigh);

	draw_frame();
}


//画列车运行图的框架
function draw_frame(){

	//画车站横线
	for(let i=1;i<all_u+1;i++){
		draw_line(pot(schBasePot.x,schBasePot.y+pixelPerStation*i),pot(schBasePot.x+allTime_d/secPerPixel,schBasePot.y+pixelPerStation*i),frameLineColor);
	}

	//画时间线
	let maxi=(allTime_d/timeInterval)+1;
	let spot_y=schBasePot.y+pixelPerStation, epot_y=schBasePot.y+pixelPerStation*all_u;
	for(let i=0;i<maxi;i++){
		let nowx=50+i*secPerPixel*timeInterval;
		draw_line(pot(nowx,spot_y),pot(nowx,epot_y),frameLineColor);
		draw_text(timeInterval*i,pot(nowx,epot_y+10),"top","center",null,null,frameLineColor);
	}
	draw_line(pot(schBasePot.x+allTime_d/secPerPixel,spot_y),pot(schBasePot.x+allTime_d/secPerPixel,epot_y),frameLineColor);
	draw_text(allTime_d,pot(schBasePot.x+allTime_d/secPerPixel,epot_y+10),"top","center",null,null,frameLineColor);

}