/**
 * Created by Marshall on 14-4-17.
 */
define(function(require, module, exports) {

    var $ = require('jquery'),
        slider = require('bootstrap-slider');
    var bootbox = require('bootbox');
    var  initServicesFlage = true;
    var initData;
    var Services = function(el,data) {
        initData =data;
        this.$el = el;
        this.$zone = this.$el.find('#zone_select');
        this.$period_type=this.$el.find('#period');
        this.$period_num=this.$el.find('#period_num');
        this.$period_day=this.$el.find('#period_day');
        this.$order_num=this.$el.find('#order_num');
        this.$businessOrderId=this.$el.find('#businessOrderId');
        this.$accountId=this.$el.find('#accountId');
        this.$userId=this.$el.find('#userId');
        this.$serviceTag=this.$el.find('#serviceTag');
        this.$resourceType=this.$el.find('#resourceType');

        this.$ebsNum=this.$el.find('#ebsNum');
        this.$addebs=this.$el.find('#addebs');
        this.$delebs = this.$el.find('a[data-type=delebs]');
        this.$dataType = this.$el.find('select[name=datahdType]');
        this.$dataHd = this.$el.find('input[name=datahd_value]');
        this.$salePrice=this.$el.find('#salePrice');
        this.$businessOrderItemId=this.$el.find('#businessOrderItemId');

        this.init();
    };

    Services.prototype = {
        constructor: Services,

        init: function() {

            // event handlers
            this.$zone.on('change', $.proxy(this.changeZone, this));
            this.$period_type.on('change', $.proxy(this.getCloudPrice, this));
            this.$period_num.on('change', $.proxy(this.getCloudPrice, this));
            this.$period_day.on('change', $.proxy(this.changePeriodDay, this));
            this.$order_num.on('change', $.proxy(this.getCloudPrice, this));
            this.$el.off('submit').on('submit', $.proxy(this.submit, this));
            this.$period_type.on('change', $.proxy(this.changePeriod, this));

            this.$addebs.on('click', $.proxy(this.addEbsDiv, this));
            this.$delebs.on('click', $.proxy(this.delEbsDiv, this));
            this.$dataType.on('change', $.proxy(this.getCloudPrice, this));
            this.$dataHd.on('change', $.proxy(this.chageDataHdValue, this));
            this.$salePrice.on('change', $.proxy(this.chageSalePrice, this));

            this.$zone.trigger('change');
            var date = new Date();
            date.setDate(date.getDate()+1)
            var dateString = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
            this.$period_day.val(dateString);

            if(!$.isEmptyObject(initData)) {
                  this.itemInfo();
            }else{
                console.log(123);
                initServicesFlage=false;
               this.$zone.trigger('change');
               this.getCloudPrice(true);
            }



        },
        itemInfo:function () {
               console.log(initData);
                this.$zone.val(initData["zoneid"]);
                this.$zone.trigger('change');
                 this.$ebsNum.val(initData["ebsNum"]);
                $.each(initData['diskList'],function (i,diskInfo) {
                      $('.datadiv').find('input[name="datahd_value"]').val(diskInfo['dataHd']);
                      $('.datadiv').find('select[name="datahdType"]').val(diskInfo['dataType'].toLowerCase());
                });
                this.$period_type.val(initData['cycleType']);
                this.$period_num.val(initData['cycleCnt']);
                this.$order_num.val(initData['order_num']);
                 initServicesFlage=false;
                 this.getCloudPrice(false);
                this.$salePrice.val(initData['sale_price']);
                $('#payment').val(initData['separate_type']);
        },
        changePeriodDay:function(){
            var self = this;

            var time1 = new Date(this.$period_day.val());
            var today = new Date();
            if(time1<today){
                bootbox.alert('指定日期必须大于当天');
                var date = new Date();
                date.setDate(date.getDate()+1)
                var dateString = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                this.$period_day.val(dateString);
                this.$period_day.val(dateString);
            }
            this.getCloudPrice(true)
        },

        submit: function(e) {
            e.preventDefault();

            var self = this;
            var ebsNum=parseInt(this.$ebsNum.val());
            var params = {
                businessOrderId:self.$businessOrderId.val(),
                accountId:self.$accountId.val(),
                userId:self.$userId.val(),
                serviceTag:self.$serviceTag.val(),
                resourceType:self.$resourceType.val(),
                zoneId: self.$zone.val(),
                period_type: self.$period_type.val(),
                period_num: self.$period_num.val(),
                period_day: self.$period_day.val(),
                order_num: self.$order_num.val(),
                finalPrice: $('span.text-success').html(),
                ebsNum:this.$ebsNum.val(),
                salePrice:this.$salePrice.val(),
                payment:$('#payment').val()
            }
            if(this.$salePrice.attr('lock')==1){
                bootbox.alert('价格获取中，请稍后');
                return false
            }
            for(var i=0;i<ebsNum;i++){
                params['dataType'+(i+1)]=$('.dataHdDiv').eq(i).find('select[name="datahdType"]').val();
                params['dataHd'+(i+1)]=$('.dataHdDiv').eq(i).find('input[name="datahd_value"]').val();
            }
			 if($("#pageType").val()=='change'){
                params['businessOrderItemId'] = $("#businessOrderItemId").val();
            }
            var req = $.ajax({
                url: $('#service_post_form').attr('action'),
                data: params,
                type: 'POST',
				dataType:'json'
            });
			
            req.done(function(data) {if(data.return==false){bootbox.alert(data.msg)}else{
                bootbox.alert('保存成功');
                document.location=baseurl+data.url;
            }});
            req.fail(function(error) {});
        },
        changeZone:function(e){

        },
        chageSalePrice:function(e){
            var r = /^\d+(\.\d+)?$/
            var $target = $(e.currentTarget);
            var num=$target.val();
            num=num.replace(/[^0-9\.]/g,'');
            if(!r.test(num)){
                $target.val($('span.text-success').html());
                bootbox.alert('销售价格只能是正数')
                return false;
            }
            if(parseFloat($('span.text-success').html())*0.55>parseFloat(num)){
               // $target.val($('span.text-success').html());
               // bootbox.alert('销售价格不能小于标准价格的5.5折')
              //  return false;
            }
        },
        getCloudPrice:function(salePriceFlag){
            if(initServicesFlage){
                return ;
            }
            var self = this;
            var ebsNum=parseInt(this.$ebsNum.val());
            var params = {
                businessOrderId:self.$businessOrderId.val(),
                accountId:self.$accountId.val(),
                userId:self.$userId.val(),
                serviceTag:self.$serviceTag.val(),
                resourceType:self.$resourceType.val(),
                zoneId: self.$zone.val(),
                period_type: self.$period_type.val(),
                period_num: self.$period_num.val(),
                period_day: self.$period_day.val(),
                order_num: self.$order_num.val(),
                finalPrice: $('span.text-success').html(),
                ebsNum:this.$ebsNum.val(),
                salePrice:this.$salePrice.val(),
                payment:$('#payment').val()
            }
            for(var i=0;i<ebsNum;i++){
                params['dataType'+(i+1)]=$('.dataHdDiv').eq(i).find('select[name="datahdType"]').val();
                params['dataHd'+(i+1)]=$('.dataHdDiv').eq(i).find('input[name="datahd_value"]').val();
            }
            var req = $.ajax({
                url: baseurl+"business/getitemprice",
                data:params,
                type: 'POST',
				dataType:'json'
            });
             $('#salePrice').attr('lock',1)
            req.done(function(data) {
                if(data.statusCode==800){
                    $('#salePrice').attr('lock',0)
                    $('span.text-success').html(data.returnObj.finalPrice);
                    if(salePriceFlag){
                        $('#salePrice').val(data.returnObj.finalPrice);
                    }

                }else{
                    bootbox.alert('获取数据失败');
                }
            });
            req.fail(function(error) {});
        },
        changePeriod:function(e){
            e.preventDefault();
            var period_type=this.$period_type.val();
            if(period_type=='today'){
                this.$period_day.show();
                this.$period_num.hide();
            }else{
                this.$period_day.hide();
                this.$period_num.show();
            }
        },
        addEbsDiv:function(){
            var ebsNum=parseInt(this.$ebsNum.val());
            if(ebsNum>=5){
                bootbox.alert('最多只能添加5块数据盘');
                return false;
            }
            if(ebsNum==0){
                $('.dataHdDiv').find('input[name="datahd_value"]').val(30);
                $('.dataHdDiv').show();
            }else{
                var obj=$('.dataHdDiv').eq(0).clone(true);
                obj.find('input[name="datahd_value"]').val(30);
                $(this.$addebs).parents('.row').before($('.dataHdDiv').eq(0).clone(true));
            }
            ebsNum++;
            this.$ebsNum.val(ebsNum);
            this.getCloudPrice(true);
        },
        delEbsDiv:function(e){
            var ebsNum=parseInt(this.$ebsNum.val());
            var $target = $(e.currentTarget);
            if(ebsNum<=0){
                return false;
            }
            if(ebsNum==1){
                $('.dataHdDiv').hide();
            }else{
                $target.parents('.dataHdDiv').remove();
            }
            ebsNum--;
            this.$ebsNum.val(ebsNum);
            this.getCloudPrice(true);
        },
        chageDataHdValue:function(e){
            if(this.$serviceTag.val()=='vms'){
            var numMax =2000;
            }else{
            var numMax =30000;
            }
            var numMin =10;
            var step=10;
            var $target = $(e.currentTarget);
            var num=$target.val();
            num=num.replace(/[^0-9]/g,'');
            num=parseInt(num);
            $target.val()
            if(num >numMax){
                $target.val(numMax);
            }else if(num < numMin){
                $target.val(numMin);
            }else{
                num =  Math.floor(num /step)*step;
                $target.val(num);
            }

            this.getCloudPrice(true);
        }

    };

    return Services;

});
