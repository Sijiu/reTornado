// 
//  step.js
//  <流程图对象>
//  
//  2017年4月12日16:52:49.
//  Author JIA XIN.
// 
function drawRoundRect(x, y, w, h) {
    var r = h / 2;
    cxt.beginPath();
    cxt.moveTo(x + r, y);
    cxt.arcTo(x + w, y, x + w, y + h, r);
    cxt.arcTo(x + w, y + h, x, y + h, r);
    cxt.arcTo(x, y + h, x, y, r);
    cxt.arcTo(x, y, x + w, y, r);
  
    cxt.closePath();
    cxt.stroke();;
    

}

function drawRhombus(x, y, l) {
    cxt.beginPath();
    cxt.moveTo(x, y + l);
    cxt.lineTo(x - l * 2, y);
    cxt.lineTo(x, y - l);
    cxt.lineTo(x + l * 2, y);
    cxt.closePath();
    cxt.stroke();
}

/**
 * 圆角矩形开始对象
 * @param {Object} x
 * @param {Object} y
 */
function Start(x, y,isPass,textCon,textX, textY) {
        cxt.beginPath();

    var passborder = "#4EA441";
    var borderColor = "#93BF73";
    var fillColor = "#DBE7AC";
    var fontColor = "#000";
    this.flag = "start";
    this.h = 50;
    this.w = this.h;
    this.x = x;
    this.y = y;
    if(isPass != 0){
        //borderColor = "#BBBBBB";
        fillColor = "#FFF";
    }

      cxt.fillStyle=fillColor;
    cxt.strokeStyle=borderColor;
     drawRoundRect(x - this.w / 2, y - this.h / 2, this.w, this.h);
     cxt.closePath();
      cxt.fill();
    cxt.stroke();  // 进行绘制
    cxt.beginPath();
    cxt.font = 'bold 14px 宋体';
    
    //  if(isPass != 0){
    //     fontColor = "#BCBCBC";
    // }
    cxt.fillStyle=fontColor;
    cxt.fillText(textCon, textX, textY);
    //cxt.fillText('结束', 1085, 210);
    cxt.closePath();
    cxt.fill();
    cxt.stroke();  // 进行绘制


}

/**
 * 矩形步骤对象
 * @param {Object} x
 * @param {Object} y
 */
function Step(x, y,isPass,textCon,textX, textY) {
    var borderColor = "#9FCCD3"
    var fillColor = "#E7F6FE";
    var fontColor = "#000"
    this.flag = "step";
    this.h = 50;
    this.w = 3 * this.h;
    this.x = x;
    this.y = y;
    cxt.beginPath();
    if(isPass != 0){
         //borderColor = "#BBBBBB";
         fillColor = "#FFF";
         //fontColor = "#BCBCBC";
    }
    cxt.strokeStyle=borderColor;

    cxt.fillStyle=fillColor;
    cxt.fillRect(x - this.w / 2, y - this.h / 2, this.w, this.h);
    cxt.strokeRect(x - this.w / 2, y - this.h / 2, this.w, this.h);
    cxt.stroke();  // 进行绘制
        cxt.font = '14px 宋体';
    
    cxt.fillStyle=fontColor;
    cxt.fillText(textCon, textX, textY);
    cxt.stroke();  // 进行绘制
}

/**
 * 菱形条件对象
 * @param {Object} x
 * @param {Object} y
 */
function Condition(x, y) {
    this.flag = "condition";
    this.l = 30;
    this.x = x;
    this.y = y;
    drawRhombus(x, y, this.l);
}

Start.prototype.drawBottomToTop = function(obj) {
    if(obj.flag == "step") {
        var arrow = new Arrow(this.x, this.y + this.h / 2, obj.x, obj.y - obj.h / 2);
        arrow.drawBottomToTop(cxt);
    } else if(obj.flag == "condition") {
        var arrow = new Arrow(this.x, this.y + this.h / 2, obj.x, obj.y - obj.l);
        arrow.drawBottomToTop(cxt);
    }
}
Start.prototype.drawLeftToRight = function(obj) {
    if(obj.flag == "step") {
        var arrow = new Arrow(this.x - this.l * 2, this.y, obj.x + this.w / 2, obj.y);
        arrow.drawLeftToRightOrRightToLeft(cxt);
    } else if(obj.flag == "condition") {
        var arrow = new Arrow(this.x - this.l * 2, this.y, obj.x + this.l * 2, obj.y);
        arrow.drawLeftToRightOrRightToLeft(cxt);
    }
}
Step.prototype.drawBottomToTop = function(obj) {
    if(obj.flag == "start") {
        var arrow = new Arrow(this.x, this.y + this.h / 2, obj.x, obj.y - obj.h / 2);
        arrow.drawBottomToTop(cxt);
    }
}
Step.prototype.drawRightToLeft = function(obj) {
    if(obj.flag == "step") {
        var arrow = new Arrow(this.x + this.h+this.h/2, this.y, obj.x - this.w / 2, obj.y);
        arrow.drawLeftToRightOrRightToLeft(cxt);
    }
}

Condition.prototype.drawBottomToTop = function(obj) {
    if(obj.flag == "step") {
        var arrow = new Arrow(this.x, this.y + this.l, obj.x, obj.y - obj.h / 2);
        arrow.drawBottomToTop(cxt);
    } else if(obj.flag == "condition") {
        var arrow = new Arrow(this.x, this.y + this.l, obj.x, obj.y - obj.l);
        arrow.drawBottomToTop(cxt);
    }
}

Condition.prototype.drawRightToTop = function(obj) {
    if(obj.flag == "step") {
        var arrow = new Arrow(this.x + this.l * 2, this.y, obj.x, obj.y - obj.h / 2);
        arrow.drawLeftOrRightToTop(cxt);
    } else if(obj.flag == "condition") {
        var arrow = new Arrow(this.x + this.l * 2, this.y, obj.x, obj.y - obj.l);
        arrow.drawLeftOrRightToTop(cxt);
    }
}

Condition.prototype.drawLeftToTop = function(obj) {
    if(obj.flag == "step") {
        var arrow = new Arrow(this.x - this.l * 2, this.y, obj.x, obj.y - obj.h / 2);
        arrow.drawLeftOrRightToTop(cxt);
    } else if(obj.flag == "condition") {
        var arrow = new Arrow(this.x - this.l * 2, this.y, obj.x, obj.y - obj.l);
        arrow.drawLeftOrRightToTop(cxt);
    }
}

Condition.prototype.drawRightToLeft = function(obj) {
    if(obj.flag == "step") {
        var arrow = new Arrow(this.x + this.l * 2, this.y, obj.x - this.w / 2, obj.y);
        arrow.drawLeftToRightOrRightToLeft(cxt);
    } else if(obj.flag == "condition") {
        var arrow = new Arrow(this.x + this.l * 2, this.y, obj.x - this.l * 2, obj.y);
        arrow.drawLeftToRightOrRightToLeft(cxt);
    }
}

Condition.prototype.drawLeftToRight = function(obj) {
    if(obj.flag == "step") {
        var arrow = new Arrow(this.x - this.l * 2, this.y, obj.x + this.w / 2, obj.y);
        arrow.drawLeftToRightOrRightToLeft(cxt);
    } else if(obj.flag == "condition") {
        var arrow = new Arrow(this.x - this.l * 2, this.y, obj.x + this.l * 2, obj.y);
        arrow.drawLeftToRightOrRightToLeft(cxt);
    }
}

/*画斜箭头*/
Condition.prototype.drawLeftToRightSlash = function(obj) {
    if(obj.flag == "step") {
    	console.log(123);
        var arrow = new Arrow(this.x - this.l * 2, this.y, obj.x + this.w / 2, obj.y);
        arrow.drawLeftToRightOrRightToSlash(cxt);
    } else if(obj.flag == "condition") {
        var arrow = new Arrow(this.x - this.l * 2, this.y, obj.x + this.l * 2, obj.y);
        arrow.drawLeftToRightOrRightToSlash(cxt);
    }
}