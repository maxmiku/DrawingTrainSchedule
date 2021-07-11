console.log(data)

var fileData = data;


//预定义范围
let K=6;
let F=2;
let U=7;




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
			formData_format[dataColNames[val_i]][nowRow_sub_str]=rowData[dataColNames[val_i]];
		}

		// break;
	}
	// break;
}

console.log("处理结束后数据",formData_format);





let a_kfu_i=createNDimArray([K+1,F+1,U+1]);
formData_format2NDimArray(a_kfu_i,formData_format["a_kfu_i"]);

// console.log(a_kfu_i);
// console.log(a_kfu_i[4][1][4])


let d_kfu_i=createNDimArray([K+1,F+1,U+1]);
formData_format2NDimArray(d_kfu_i,formData_format["d_kfu_i"]);

// console.log(d_kfu_i);
// console.log(d_kfu_i[4][1][4])


let dw_kfu_i=createNDimArray([K+1,F+1,U+1]);
formData_format2NDimArray(dw_kfu_i,formData_format["dw_kfu_i"]);

// console.log(dw_kfu_i);
// console.log(dw_kfu_i[4][1][4])

let now_k=1;
let now_f=1;

drawSchedule(a_kfu_i,d_kfu_i,dw_kfu_i,K,U,4000);