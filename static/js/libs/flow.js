// 
//  flow.js
//  <主要逻辑>
//  
//  2017年4月12日16:51:45
//  Author JIA XIN.
// 
var canvas = document.getElementById("myCanvas");
var cxt = canvas.getContext('2d');

var datas = {
	"list":[
	{"checkName":"业务受理单申请人","isPass":"0"},
	{"checkName":"市公司审批","isPass":"1"},
	{"checkName":"大区审批","isPass":"0"}]
};
var obj = eval(datas);
var len = obj.list.length;
var siteX;
var siteStart = 100;
siteStart = 700-100*len;
console.log(len);
var start = new Start(siteStart,35,"0","开始",siteStart-15,"40");//新建开始对象
var stop = new Start(siteStart+200*(len-1),235,"1","结束",siteStart+200*(len-1)-15,"240");
	
var m = 1200 - (siteStart+200*(len-1));

for(var i = 0;i<len;i++){

	if(i == 0){
		siteX = siteStart;
	}else{
		siteX = 200*i+siteStart;
	}
	obj.list[i] = new Step(siteX,135,obj.list[i].isPass,obj.list[i].checkName,siteX-obj.list[i].checkName.length*7,140);

	if(i>0){

		obj.list[i-1].drawRightToLeft(obj.list[i]);

	}
	if(i == obj.list.length-1){
		obj.list[i].drawBottomToTop(stop);
	}
}


 start.drawBottomToTop(obj.list[0]); //画箭头(从开始对象指向第一个步骤)


