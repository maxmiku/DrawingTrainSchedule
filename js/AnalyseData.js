console.log(data)

var fileData = data;


//预定义范围 从1开始
let K=6;
let F=2;
let U=7;

//定义空闲车底数
let AvailableCars_f=[null,3,3];//[空,上行,下行]

//分析从表格读取的数据并转换为格式化数据 value2Number=>将值转换为数字(不推荐使用)boolean
function analyseFormData2FormatData(fileData,K,F,U,value2Number){

	let formData_format={};//格式化后的数据存放在这里



	for (let formKey in fileData){
		let formData=fileData[formKey];
		let formRowLength=formData.length;
		// console.log("选中表",formKey,"表行数",formRowLength);



		//判断数据列名
		let dataColNames=[];//数据列名
		let subColNames=[];//下标列名
		let temp_row=formData[0];
		for(let key in temp_row){
			if(key.search("sub")==-1){
				// console.log("找到非下标列名",key);
				dataColNames.push(key);
				formData_format[key]={};

			}else{
				// console.log("找到下标列名",key);
				subColNames.push(key);
			}
		}
		subColNames.sort();
		// console.log("区分下标列完成 数据:",dataColNames,"下标:",subColNames);


		for(let formRow=0;formRow<formRowLength;formRow++){
			let rowData=formData[formRow];
			// console.log("选中行",formKey,"行号",formRow,"数据",rowData);

			let nowRow_sub_str=rowData[subColNames[0]];
			//处理下标
			for(let sub_i=1;sub_i<subColNames.length;sub_i++){
				nowRow_sub_str=nowRow_sub_str+","+rowData[subColNames[sub_i]];
			}	
			// console.log("当前数据下标",nowRow_sub_str);

			for(let val_i=0;val_i<dataColNames.length;val_i++){
				// console.log("置数据",dataColNames[val_i],nowRow_sub_str,"->",rowData[dataColNames[val_i]])
				if(value2Number){
					formData_format[dataColNames[val_i]][nowRow_sub_str]=Number(rowData[dataColNames[val_i]]);
				}else{
					formData_format[dataColNames[val_i]][nowRow_sub_str]=rowData[dataColNames[val_i]];
				}
			}

			// break;
		}
		// break;
	}

	console.log("处理结束后数据",formData_format);





	let a_kfu_i=createNDimArray([K+1,F+1,U+1]);
	formData_format2NDimArray(a_kfu_i,formData_format["a_kfu"]);

	// console.log(a_kfu_i);
	// console.log(a_kfu_i[4][1][4])


	let d_kfu_i=createNDimArray([K+1,F+1,U+1]);
	formData_format2NDimArray(d_kfu_i,formData_format["d_kfu"]);

	// console.log(d_kfu_i);
	// console.log(d_kfu_i[4][1][4])


	let dw_kfu_i=createNDimArray([K+1,F+1,U+1]);
	formData_format2NDimArray(dw_kfu_i,formData_format["dw_kfu"]);

	// console.log(dw_kfu_i);
	// console.log(dw_kfu_i[4][1][4])

	let now_k=1;
	let now_f=1;

	drawSchedule(a_kfu_i,d_kfu_i,dw_kfu_i,K,U,3900,AvailableCars_f);
}


//获取一次列车的时刻表 a和d
function getTrainSchList(k,f,a_kfu,d_kfu){
	let schList = [null];
	for(let nowu=1;nowu<=U;nowu++){
		// let trainStation={"a":a_kfu[getFormatSub(k,f,nowu)],"d":d_kfu[getFormatSub(k,f,nowu)]};
		let trainStation={"a":a_kfu[k][f][nowu],"d":d_kfu[k][f][nowu]};

		schList.push(trainStation);
	}
	return schList;
}

//给下标元组,返回相应字符串 用法 getFormatSub(1,2,3) => 得 1,2,3
function getFormatSub(){
	let tstr = arguments[0]; 
	for(let i=1;i<arguments.length;i++){
		tstr=tstr+","+arguments[i];
	}
	return tstr;
}


analyseFormData2FormatData(fileData,K,F,U);