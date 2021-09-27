
//创建多维数组 传入尺寸列表 
function createNDimArray(sizeList){
	let tmp_arr = loopCreateNDimArray(sizeList,0);
	return tmp_arr;
}

//在arr中的每一个子项都添加当前层级数量的数组 从上而下
function loopCreateNDimArray(sizeList,nowDim){
	if(nowDim>sizeList.length-1){
		return null;
	}
	let l=sizeList[nowDim];
	if(nowDim==0){
		console.error(nowDim,l);
	}
	let tmp_arr=new Array(l);
	for (let i=0;i<l;i++){
		tmp_arr[i]=loopCreateNDimArray(sizeList,nowDim+1);
	}
	return tmp_arr;
}

//将formData_format中的某个字段转换为多维数组  eg.formData_format2NDimArray(dw_kfu,formData_format["dw_kfu"]);
function formData_format2NDimArray(targetArray,sourceData){
	t_conv=sourceData;
	for (let key in t_conv){
		let s = key.split(",");
		// console.log(s,t_conv[key],s[0],s[1],s[2],targetArray);
		targetArray[s[0]][s[1]][s[2]]=t_conv[key];
	}
}

//字符串数组转数值数组
function arrayConversionStr2Int(arr){
	for(let i=arr.length-1;i>=0;i--){
		arr[i]=Number(arr[i]);
	}
}
// let a=createNDimArray([2,1,3]);

// a[1][0][2]="hi";
// console.log(a)

//数组除重
function arrayDeduplication(inarr){  
	var h={};    //定义一个hash表  
	var arr=[];  //定义一个临时数组  
	  
	for(var i = 0; i < inarr.length; i++){    //循环遍历当前数组  
		//对元素进行判断，看是否已经存在表中，如果存在则跳过，否则存入临时数组  
		if(!h[inarr[i]]){  
			//存入hash表  
			h[inarr[i]] = true;  
			//把当前数组元素存入到临时数组中  
			arr.push(inarr[i]);  
		}  
	}  
	return arr;  
}  


function setCookie(c_name,value,expiredays)  
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}

function getCookie(c_name)
{
	if (document.cookie.length>0)
	  {
	  c_start=document.cookie.indexOf(c_name + "=");
	  if (c_start!=-1)
	    { 
	    c_start=c_start + c_name.length+1 ;
	    c_end=document.cookie.indexOf(";",c_start);
	    if (c_end==-1) c_end=document.cookie.length
	    	return unescape(document.cookie.substring(c_start,c_end));
	    } 
	  }
	return ""
}
function clearCookie(name) {  
	setCookie(name,"", -1);  
}  