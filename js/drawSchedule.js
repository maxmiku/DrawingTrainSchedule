let all_k=-1;//所有车次
let all_u=-1;//所有车站

let a_kfu_d;//a_kfu_draw
let d_kfu_d;
let dw_kfu_d;
let availableCars_f_d;//初始可用车底数 [null,上行,下行]

let allTime_d=3900;//全部时间 单位s
let timeInterval=-1;//每一条竖线的间隔时间 s T_delta动态定义
let pixelPerSec=(1/2);//每秒数所对应的像素
let pixelPerStation=100;//每个车站间隔的像素

let PreForm_DrawSchedule=150;//表头空出来的区域 时间s


let canvas_width;//画布宽度
let canvas_heigh;//画布高度

let schBasePot=pot(80,20);//运行图画图基点

let frameLineColor="#999";//表线颜色
let xLabelyOffset=20;//x轴标签 与x轴的距离

let carTurningList=[];//记录列车周转时间

function drawSchedule(a_kfu_i,d_kfu_i,dw_kfu_i,K,U,allTime,availableCars,pb_kfu_i,pa_kfu_i){
	all_k=K;
	all_u=U;
	a_kfu_d=a_kfu_i;
	d_kfu_d=d_kfu_i;
	dw_kfu_d=dw_kfu_i;
	availableCars_f_d=availableCars;
	carUturnList=[];//初始化车底折返线的数组
	carTurningList=[];//初始化车底周转时间数组
	$("#debugOutput").html("正在绘图...");
	allTime_d=allTime;

	//根据数据重置图的尺寸
	canvas_width=(allTime*pixelPerSec)+PreForm_DrawSchedule*pixelPerSec+2*schBasePot.x;//计算画布宽度 并加上裕度
	canvas_heigh=pixelPerStation*(all_u)+4*schBasePot.y;
	console.log("重置画布大小",canvas_width,canvas_heigh);
	resize_canvas(canvas_width,canvas_heigh);
	draw_rect(pot(0,0),pot(canvas_width,canvas_heigh),"#fff");//画背景

	timeInterval=T_delta;

	draw_frame();

	//测试

	//创建可用车底的处在的点
	let availableCars_upward_pot=[];
	let availableCars_downward_pot=[];
	for(var i=0;i<availableCars_f_d[1];i++){
		availableCars_upward_pot.push(null);
	}
	for(var i=0;i<availableCars_f_d[2];i++){
		availableCars_downward_pot.push(null);
	}

	//画列车运行的线
	for(let nowk=1;nowk<=all_k;nowk++){
		//画上行列车
		let schl=getTrainSchPotList(nowk,1);
		draw_lines(schl,"rgba(255,0,0,0.75)");

		if(!analyseCarCirculation(availableCars_upward_pot,availableCars_downward_pot,schl,1,nowk)){
			console.error("运行时出错,在绘制车次k:",nowk,"上行");
			alert("运行时出错,在绘制车次k:"+nowk+"上行 时");
			return;
		}
		
		//画上行车次号
		let txtPot;
		if(schl[0].y==schl[1].y){
			txtPot=schl[1];
		}else{
			txtPot=schl[0];
		}
		txtPot.x=txtPot.x-3;
		// draw_text(getTrainNumber(1,nowk),txtPot,"bottom","left","bold 1rem 微软雅黑",null,"#0000a0",-50);
		draw_text(getTrainNumber(1,nowk),txtPot,"bottom","left",null,null,"#0000a0",-50);


		//画下行列车
		schl=getTrainSchPotList(nowk,2);
		draw_lines(schl,"rgba(255,0,0,0.75)");

		if(!analyseCarCirculation(availableCars_downward_pot,availableCars_upward_pot,schl,0,nowk)){
			console.error("运行时出错,在绘制车次k:",nowk,"下行");
			alert("运行时出错,在绘制车次k:"+nowk+" 下行");
			return;
		}
		
		//画下行车次号
		if(schl[0].y==schl[1].y){
			txtPot=schl[1];
		}else{
			txtPot=schl[0];
		}
		txtPot.x=txtPot.x-5;
		// draw_text(getTrainNumber(2,nowk),txtPot,"top","left","bold 1rem 微软雅黑",null,"#0000a0",52);
		draw_text(getTrainNumber(2,nowk),txtPot,"top","left",null,null,"#0000a0",52);

		// console.log("nowk",nowk,"upavc",availableCars_upward_pot,"downavc",availableCars_downward_pot);
	}

	schDraw_inner_drawCarUturn();//将记录的列车运行线画到图上

	//绘制收车标志
	for(let i=0;i<availableCars_downward_pot.length;i++){
		schDraw_carEnd(availableCars_downward_pot[i]);
	}
	for(let i=0;i<availableCars_upward_pot.length;i++){
		schDraw_carEnd(availableCars_upward_pot[i]);
	}

	
	drawPassengerData(all_k,all_u,pb_kfu_i,pa_kfu_i);

	printCarTurningData();

    $("#btn-analyse").addClass("btn-outline-primary");
    $("#btn-analyse").removeClass("btn-success");

    $("#btn-export").addClass("btn-success");
    $("#btn-export").removeClass("btn-outline-secondary");


    $("#btn-upload").addClass("btn-primary");
    $("#btn-upload").removeClass("btn-outline-primary");



}

//输出车底周转数据
function printCarTurningData(){
	// debugPrint("列车周转数据");
	// debugPrint(JSON.stringify(carTurningList));
	let addup=0;
	for(i in carTurningList){
		addup+=carTurningList[i]["time"];
	}
	debugPrint("车底周转总时间:"+addup+"s 平均周转时间:"+addup/carTurningList.length+"s 总共计算周转车次数:"+carTurningList.length);
}

function debugPrint(msg){
	$("#debugOutput").html($("#debugOutput").html()+"\n"+msg);
	$("#debugOutput").scrollTop(99999999);
}

//获取车次号
function getTrainNumber(f,k){
	return f*100+k;
}

//分析折返线和车底流转
function analyseCarCirculation(availableCars_nowWard_pot,availableCars_oppositeWard_pot,nowSchl,isUpward,nowk){
	//isUpward 给1为在上行发车(下行终点站掉头)  0为下行发车(上行终点站掉头)
	if(availableCars_nowWard_pot.length<1){
		console.error("运行时出错,无可用车底");
		alert("运行时出错,无可用车底");
		return false;
	}
	let nowTrain_startPot=nowSchl[0];//当前车辆起始点
	let nowTrain_endPot=nowSchl[nowSchl.length-1];//当前车辆终点


	let nowCar=0;
	for(nowCar=0;nowCar<availableCars_nowWard_pot.length;nowCar++){
		let avCar=availableCars_nowWard_pot.shift();
		let avCar_pot=null;
		let avCar_k=null;
		let avCarUTurningTime=0;
		let frontCarTimeUsing=null;
		if(avCar!=null){
			avCar_k=avCar.k;
			avCar_pot=avCar.pot;
			avCarUTurningTime=clcTime(nowSchl[nowSchl.length-1].x)-clcTime(avCar_pot.x);
			frontCarTimeUsing=d_kfu_d[avCar_k][isUpward==1?1:2][all_u]-a_kfu_d[avCar_k][isUpward==1?1:2][1];
			console.log("前向列车区间运行,车次号:",isUpward==1?"上行":"下行",avCar_k,"所用时间:",d_kfu_d[avCar_k][isUpward==1?1:2][all_u],"-",a_kfu_d[avCar_k][isUpward==1?1:2][1],"=",(d_kfu_d[avCar_k][isUpward==1?1:2][all_u]-a_kfu_d[avCar_k][isUpward==1?1:2][1])," 周转时间:",frontCarTimeUsing+avCarUTurningTime)
			carTurningList.push({"k":avCar_k,"f":isUpward==1?1:2,"time":frontCarTimeUsing+avCarUTurningTime});
		}
		console.log("当前车底安排线路,车底位置:",avCar_pot,"\t\t安排方向(上行?):"+isUpward+"\t安排车次:"+nowCar,"\t目的地:",nowSchl[nowSchl.length-1],"\t车底周转 "+avCar_k+"->"+nowk,"\t车底调头用时:"+avCarUTurningTime);
		
		
		if(avCar_pot==null){
			//车底在场内
			schDraw_carStart(nowSchl[0]);
			break;
		}else{
			//需要画连接线
			//判断车可用的点是否时间在需求点后
			if(avCar_pot.x>nowTrain_startPot.x){
				availableCars_nowWard_pot.push(avCar_pot);
				continue;
			}
			schDraw_addCarUturn(avCar_pot,nowSchl[0],isUpward);
			break;
		}
		
	}
	if(nowCar==availableCars_nowWard_pot.length){
		console.error("运行时出错,无可用车底,可用车底都在发车时间后");
		alert("运行时出错,无可用车底,可用车底都在发车时间后");
		return false;
	}
	availableCars_oppositeWard_pot.push({"k":nowk,"pot":nowTrain_endPot});//在下行可用车底 加入此车底

	return true;
}


//画列车运行图的框架
function draw_frame(){

	//画车站横线
	for(let i=1;i<all_u+1;i++){
		draw_line(pot(schBasePot.x,schBasePot.y+pixelPerStation*i),pot(schBasePot.x+PreForm_DrawSchedule*pixelPerSec+allTime_d*pixelPerSec,schBasePot.y+pixelPerStation*i),frameLineColor);
		draw_text(all_u-i+1+"("+(i)+")",pot(schBasePot.x-10,schBasePot.y+pixelPerStation*i),"middle","right",null,null,frameLineColor);
	}
	// console.log(pixelPerStation*-1)
	draw_text("列车运行图",pot(schBasePot.x-10,schBasePot.y),"buttom","left",null,null,frameLineColor);


	//画时间线
	let maxi=(allTime_d/timeInterval)+1;
	let spot_y=schBasePot.y+pixelPerStation, epot_y=schBasePot.y+pixelPerStation*all_u;
	let TimeOffest = -T_0;
	for(let i=0;i<maxi;i++){
		let nowx=schBasePot.x+PreForm_DrawSchedule*pixelPerSec+i*pixelPerSec*timeInterval;
		draw_line(pot(nowx,spot_y),pot(nowx,epot_y),frameLineColor);
		draw_text(timeInterval*i,pot(nowx,epot_y+xLabelyOffset),"top","center",null,null,frameLineColor);
		if($("#DrawTime")[0].checked && (i+TimeOffest/timeInterval+1>0)){
			let nowEndTime=(i+1)*timeInterval;
			if(nowEndTime<=T_1){
				draw_text(i+TimeOffest/timeInterval+1,pot(nowx+pixelPerSec*timeInterval/2,epot_y+xLabelyOffset),"top","center",null,null,"#099");
			}
		}
	}

	if(PreForm_DrawSchedule!=0){
		draw_line(pot(schBasePot.x,spot_y),pot(schBasePot.x,epot_y),frameLineColor);
		draw_text(-PreForm_DrawSchedule,pot(schBasePot.x,epot_y+xLabelyOffset),"top","center",null,null,frameLineColor);
	}
	
	// draw_line(pot(schBasePot.x+allTime_d*pixelPerSec,spot_y),pot(schBasePot.x+allTime_d*pixelPerSec,epot_y),frameLineColor);
	// draw_text(allTime_d,pot(schBasePot.x+allTime_d*pixelPerSec,epot_y+xLabelyOffset),"top","center",null,null,frameLineColor);

}

//计算坐标点 t时间s  u车站上行为准
function clcPot(t,u){
	if(u>all_u)
		console.error("clcPot 传入数据 u>all_u t:",t,"u:",u)
	return pot(schBasePot.x+PreForm_DrawSchedule*pixelPerSec+t*pixelPerSec,schBasePot.y+pixelPerStation*(all_u-u+1));
}

//通过坐标计算时间
function clcTime(x){
	return (x-(schBasePot.x+PreForm_DrawSchedule*pixelPerSec))/pixelPerSec;
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


function drawPassengerData(all_k,all_u,pb_kfu_i,pa_kfu_i){
	
	if(!$("#DrawPassengerData")[0].checked){
		console.log("跳过绘制客流数据");
		return;
	}
	for(let nowk=1;nowk<=all_k;nowk++){
		for(let nowf=1;nowf<=2;nowf++){
			let passList=getTrainPassengerList(nowk,nowf,pb_kfu_i,pa_kfu_i);
			
			let schl=getTrainSchList(nowk,nowf,a_kfu_d,d_kfu_d);

			for(let nowu=1;nowu<passList.length;nowu++){
				let nowStationSch = schl[nowu];
				let nowPassList = passList[nowu];

				// console.log(nowStationSch,nowu);


				let t_pot=clcPot(Number(nowStationSch["a"]),nowu);
				if(nowf==2){
					t_pot=clcPot(Number(nowStationSch["a"]),all_u-nowu+1)
				}else{
					t_pot.y=t_pot.y-16;
				}
				let t_pot_pb=pot(t_pot.x,t_pot.y);
				// t_pot_pb.x=t_pot.x-80;
				// t_pot.x=t_pot.x+13;
				
				if(Number(nowPassList["pb"])==0 && Number(nowPassList["pa"])==0 && !$("#DrawZeroPassengerData")[0].checked){
					continue;
				}

				if(nowf==1){
					draw_text("["+Math.round(Number(nowPassList["pb"]))+","+Math.round(Number(nowPassList["pa"]))+"]",t_pot_pb,null,null,"bold 1rem 微软雅黑",null,"#198754");
				}else{
					draw_text("["+Math.round(Number(nowPassList["pb"]))+","+Math.round(Number(nowPassList["pa"]))+"]",t_pot_pb,null,null,"bold 1rem 微软雅黑",null,"#a31515");
				}

				
			}
		}
	}
}



//在图中指定位置绘制开出列车标志
function schDraw_carStart(spot){
	let x=spot.x;
	let y=spot.y;
	draw_lines([pot(x,y),pot(x,y-5),pot(x-40,y-5),pot(x-45,y-10)],"rgba(0,0,255,0.9)")
}

//在图中指定位置绘制收车标志
function schDraw_carEnd(spot){
	let x=spot.x;
	let y=spot.y;
	draw_lines([pot(x,y),pot(x,y-5),pot(x+40,y-5),pot(x+45,y-10)],"rgba(0,0,255,0.9)")
}


let carUturnList=[];

//记录列车折返线的项目
function schDraw_addCarUturn(spot,epot,isUpward){
	//isUpward 给1为在上行发车(下行终点站掉头)  0为下行发车(上行终点站掉头)
	if(spot.x==epot.x && spot.y==epot.y){
		return;
	}
	
	let item = {"spot":spot,"epot":epot,"isUpward":isUpward,"offset":null};

	carUturnList.push(item);
}

//将列表中的折返线处理并画出
function schDraw_inner_drawCarUturn(){
	//处理重叠的折返线
	let min_x=clcPot(PreForm_DrawSchedule,1).x;
	
	let max_x=clcPot(allTime_d,1).x;

	let min_offset=11;
	let lineGap=6;//最小间隙

	let uturnLinesInTime_up={};//将线都按照时间对应起来
	let uturnLinesInTime_down={};//将线都按照时间对应起来


	console.log(carUturnList);//需要画折返线 数组

	//先把折返线数据写入数组中
	for(let i=0;i<carUturnList.length;i++){
		let item=carUturnList[i],sx=parseInt(item["spot"].x),ex=parseInt(item["epot"].x);
		if(item["isUpward"]==1){
			//上行发车
			for(let nowx=sx;nowx<=ex;nowx++){
				if(uturnLinesInTime_up[nowx]==undefined){
					uturnLinesInTime_up[nowx]=[i];
				}else{
					uturnLinesInTime_up[nowx].push(i);
				}
			}
		}else{
			//下行发车
			for(let nowx=sx;nowx<=ex;nowx++){
				if(uturnLinesInTime_down[nowx]==undefined){
					uturnLinesInTime_down[nowx]=[i];
				}else{
					uturnLinesInTime_down[nowx].push(i);
				}
			}
		}
		
	}

	// console.log(uturnLinesInTime_down);

	//分析哪些需要错开
	let uturnNeedFix_up=[];//需要处理的折返线
	let uturnNeedFix_down=[];//需要处理的折返线

	for(key in uturnLinesInTime_up){
		if(uturnLinesInTime_up[key].length!=1)
			uturnNeedFix_up.push(uturnLinesInTime_up[key]);
	}
	uturnNeedFix_up=arrayDeduplication(uturnNeedFix_up);

	for(key in uturnLinesInTime_down){
		if(uturnLinesInTime_down[key].length!=1)
			uturnNeedFix_down.push(uturnLinesInTime_down[key]);
	}
	uturnNeedFix_down=arrayDeduplication(uturnNeedFix_down);
	
	console.log(uturnNeedFix_down);

	//错开重叠线的offset
	dealUturnNeedFix(uturnNeedFix_up,min_offset,lineGap);
	dealUturnNeedFix(uturnNeedFix_down,min_offset,lineGap);
	
	console.log(carUturnList);

	//划线
	for(let i=0;i<carUturnList.length;i++){
		let item = carUturnList[i];
		let spot=item["spot"];
		let epot=item["epot"];
		let isUpward=item["isUpward"];
		let nowOffset=item["offset"]||15;

		if(isUpward){
			draw_lines([spot,pot(spot.x,spot.y+nowOffset),pot(epot.x,epot.y+nowOffset),epot],"blue");
		}else{
			draw_lines([spot,pot(spot.x,spot.y-nowOffset),pot(epot.x,epot.y-nowOffset),epot],"blue");
		}
	}
}

//修改需要修改的折返线数据
function dealUturnNeedFix(needFixList,min_offset,lineGap){
	for(let i=0;i<needFixList.length;i++){
		let item = needFixList[i];
		let occupyOffset=[];//当前区间已经设置的并占用的offset
		for(let j=0;j<item.length;j++){
			let itemIndex = item[j];
			if(carUturnList[itemIndex]["offset"]!=null)
				occupyOffset.push(carUturnList[itemIndex]["offset"]);
		}
		
		let temp_offset_offset=0;
		for(let j=0;j<item.length;j++){
			let itemIndex = item[j];
			while(occupyOffset.indexOf(min_offset+temp_offset_offset)!=-1){
				temp_offset_offset=temp_offset_offset+lineGap;
			}
			if(carUturnList[itemIndex]["offset"]==null){
				carUturnList[itemIndex]["offset"]=min_offset+temp_offset_offset;
				temp_offset_offset=temp_offset_offset+lineGap;
			}
			
		}
	}
}