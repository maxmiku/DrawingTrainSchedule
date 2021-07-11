let all_k=-1;//所有车次
let all_u=-1;//所有车站

let a_kfu_d;//a_kfu_draw
let d_kfu_d;
let dw_kfu_d;
let availableCars_f_d;//初始可用车底数 [null,上行,下行]

let allTime_d=3900;//全部时间 单位s
let timeInterval=300;//每一条竖线的间隔时间 s
let secPerPixel=1//每个像素所对应的秒数
let pixelPerStation=100;//每个车站间隔的像素


let canvas_width;//画布宽度
let canvas_heigh;//画布高度

let schBasePot=pot(80,20);//运行图画图基点

let frameLineColor="#999";//表线颜色


function drawSchedule(a_kfu_i,d_kfu_i,dw_kfu_i,K,U,allTime,availableCars,canvasId){
	all_k=K;
	all_u=U;
	a_kfu_d=a_kfu_i;
	d_kfu_d=d_kfu_i;
	dw_kfu_d=dw_kfu_i;
	availableCars_f_d=availableCars;

	allTime_d=allTime;

	//根据数据重置图的尺寸
	canvas_width=(allTime/secPerPixel)+2*schBasePot.x;//计算画布宽度 并加上裕度
	canvas_heigh=pixelPerStation*(all_u)+4*schBasePot.y;
	console.log("重置画布大小",canvas_width,canvas_heigh);
	resize_canvas(canvas_width,canvas_heigh);
	draw_rect(pot(0,0),pot(canvas_width,canvas_heigh),"#fff");//画背景

	draw_frame();

	//测试
	// draw_lines([clcPot(15,1),clcPot(86,2),clcPot(180,3)])

	//创建可用车底的处在的点
	let availableCars_upward_pot=[];
	let availableCars_downward_pot=[];
	for(var i=0;i<availableCars_f_d[1];i++){
		availableCars_upward_pot.push(null);
	}
	for(var i=0;i<availableCars_f_d[2];i++){
		availableCars_downward_pot.push(null);
	}


	for(let nowk=1;nowk<=all_k;nowk++){
		draw_lines(getTrainSchPotList(nowk,1),"rgba(255,0,0,0.75)");
		draw_lines(getTrainSchPotList(nowk,2),"rgba(0,0,255,0.75)");
	}

	
}


//画列车运行图的框架
function draw_frame(){

	//画车站横线
	for(let i=1;i<all_u+1;i++){
		draw_line(pot(schBasePot.x,schBasePot.y+pixelPerStation*i),pot(schBasePot.x+allTime_d/secPerPixel,schBasePot.y+pixelPerStation*i),frameLineColor);
		draw_text(all_u-i+1+"("+(i)+")",pot(schBasePot.x-10,schBasePot.y+pixelPerStation*i),"middle","right",null,null,frameLineColor);
	}
	// console.log(pixelPerStation*-1)
	draw_text("123",pot(schBasePot.x-10,schBasePot.y),"buttom","right",null,null,frameLineColor);


	//画时间线
	let maxi=(allTime_d/timeInterval)+1;
	let spot_y=schBasePot.y+pixelPerStation, epot_y=schBasePot.y+pixelPerStation*all_u;
	for(let i=0;i<maxi;i++){
		let nowx=schBasePot.x+i*secPerPixel*timeInterval;
		draw_line(pot(nowx,spot_y),pot(nowx,epot_y),frameLineColor);
		draw_text(timeInterval*i,pot(nowx,epot_y+15),"top","center",null,null,frameLineColor);
	}
	draw_line(pot(schBasePot.x+allTime_d/secPerPixel,spot_y),pot(schBasePot.x+allTime_d/secPerPixel,epot_y),frameLineColor);
	draw_text(allTime_d,pot(schBasePot.x+allTime_d/secPerPixel,epot_y+15),"top","center",null,null,frameLineColor);

}

//计算坐标点 t时间s  u车站上行为准
function clcPot(t,u){
	if(u>all_u)
		console.error("clcPot 传入数据 u>all_u t:",t,"u:",u)
	return pot(schBasePot.x+t*secPerPixel,schBasePot.y+pixelPerStation*(all_u-u+1));
}

//获取指定车次的时刻表对应的点的位置
function getTrainSchPotList(k,f){
	let schl=getTrainSchList(k,f,a_kfu_d,d_kfu_d);
	// console.log("getTrainSchPotList 得到运行列表",schl);
	let potList=[];
	if(f==1){
		//列车上行
		for(let nowu=1;nowu<schl.length;nowu++){
			let nowStationSch = schl[nowu];
			potList.push(clcPot(Number(nowStationSch["a"]),nowu));
			potList.push(clcPot(Number(nowStationSch["d"]),nowu));
		}
	}else{
		//列车下行
		for(let nowu=1;nowu<schl.length;nowu++){
			let nowStationSch = schl[nowu];
			potList.push(clcPot(Number(nowStationSch["a"]),all_u-nowu+1));
			potList.push(clcPot(Number(nowStationSch["d"]),all_u-nowu+1));
		}
	}
	
	return potList;
}

//在图中指定位置绘制开出列车标志
function schDraw_carStart(spot){
	let x=spot.x;
	let y=spot.y;
	draw_lines([pot(x,y),pot(x,y-15),pot(x-40,y-15),pot(x-47,y-22)],"rgba(0,0,255,0.9)")
}

//在图中指定位置绘制收车标志
function schDraw_carEnd(spot){
	let x=spot.x;
	let y=spot.y;
	draw_lines([pot(x,y),pot(x,y-15),pot(x+40,y-15),pot(x+47,y-22)],"rgba(0,0,255,0.9)")
}
