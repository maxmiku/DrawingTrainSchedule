//给input标签绑定change事件，一上传选中的.xls文件就会触发该函数
$('#excel-file').change(function (e){readFile(e)});
GformData=null;
function readFile(e) {
    var files = $('#excel-file')[0].files;
    var fileReader = new FileReader();
    fileReader.onload = function(ev) {
        try {
            var data = ev.target.result
            var workbook = XLSX.read(data, {
                type: 'binary'
            }) // 以二进制流方式读取得到整份excel表格对象
        } catch (e) {
            console.log('文件类型不正确');
            return;
        }
        // 表格的表格范围，可用于判断表头是否数量是否正确
        var fromTo = '';
        
        //储存单表数据的变量
        var formData = {}
        // 遍历每张表读取
        for (var sheet in workbook.Sheets) {

            if (workbook.Sheets.hasOwnProperty(sheet)) {
                fromTo = workbook.Sheets[sheet]['!ref'];
                console.log(fromTo);
                formData[sheet]=XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                // persons = persons.concat());
                // break; // 如果只取第一张表，就取消注释这行
            }
        }
        //在控制台打印出来表格中的数据
        console.log("表格中的数据:");
        console.log(formData);

        GformData=formData;

        if(GformData["绘图常量"]!=undefined){
            let constantData = GformData["绘图常量"];
            $("#input_k").val(constantData[0]["K"]);
            $("#input_u").val(constantData[0]["U"]);
            $("#input_at").val(constantData[0]["ALL_TIME"]);
            $("#input_ac1").val(constantData[0]["AvailableCars"]);
            $("#input_ac2").val(constantData[1]["AvailableCars"]);
        }

        $("#DrawPassengerData")[0].disabled=false;
        if(GformData["pa_kfu"]==undefined){
            console.log("找不到pa_kfu表,关闭绘制客流数据开关");
            $("#DrawPassengerData")[0].checked=false;
        }else{
            $("#DrawPassengerData")[0].checked=true;
        }

        $("#btn-analyse").removeClass("btn-outline-secondary");
        $("#btn-analyse").addClass("btn-success");

        $("#btn-upload").removeClass("btn-success");
        $("#btn-upload").addClass("btn-outline-primary");

        $('#excel-file')[0].value="";
    };
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files[0]);
}

function resetBtn(){
    $("#btn-upload").addClass("btn-success");
    $("#btn-analyse").addClass("btn-outline-secondary");
    $("#btn-export").addClass("btn-outline-secondary");

    $("#btn-analyse").removeClass("btn-success");
    $("#btn-analyse").removeClass("btn-outline-primary");

    $("#btn-upload").removeClass("btn-outline-primary");
    $("#btn-upload").removeClass("btn-primary");


    $("#btn-export").removeClass("btn-success");
}