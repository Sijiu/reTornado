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
        initData = data;
        console.log(initData);
        this.$el = el;
        this.$zone = this.$el.find('#zone_select');
		this.$vpcName = this.$el.find('#vpcName');
        this.$cidr = this.$el.find('#cidr');
        this.$vlanName = this.$el.find('#vlanName');
        this.$vlanType= this.$el.find('#vlanType');
        this.$vlanCidr = this.$el.find('#vlanCidr');
        this.$period_type=this.$el.find('#period');
        this.$period_num=this.$el.find('#period_num');
        this.$period_day=this.$el.find('#period_day');
        this.$order_num=this.$el.find('#order_num');
        this.$businessOrderId=this.$el.find('#businessOrderId');
        this.$accountId=this.$el.find('#accountId');
        this.$userId=this.$el.find('#userId');
        this.$serviceTag=this.$el.find('#serviceTag');
        this.$resourceType=this.$el.find('#resourceType');
        this.$basicVpcId=this.$el.find('#basicVpcId');
        this.$salePrice=this.$el.find('#salePrice');
        this.$network=this.$el.find('.network');

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
            this.$salePrice.on('change', $.proxy(this.chageSalePrice, this));
            this.$network.find('input').on('change', $.proxy(this.chageNetwork, this));

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
        itemInfo:function(){
                this.$zone.val(initData["zoneid"]);
                this.$zone.trigger('change');
                this.$vpcName.val(initData['vpcName']);
                this.$vlanName.val(initData['vlanName']);
                this.$period_type.val(initData['cycleType']);
                this.$period_num.val(initData['cycleCnt']);
                this.$order_num.val(initData['order_num']);

                this.$cidr.val(initData['cidr']);
                this.$vlanCidr.val(initData['vlanCidr']);
                 this.changeCidr(this.$cidr,initData['cidr']);
                 this.changeCidr(this.$vlanCidr,initData['vlanCidr']);
                 this.$vlanType.val(initData['vlanType']);
                 initServicesFlage=false;
                 this.getCloudPrice(false);
                this.$salePrice.val(initData['sale_price']);
                $('#payment').val(initData['separate_type']);
        },
        changeCidr:function (ele,value) {
            var mask = value.split("/");
            var ip  = mask[0].split(".");
            var paren = ele.parent();
            console.log(ip);
            console.log(paren);
            paren.find(".tiny_input_ip_octet").eq(0).val(ip[0]);
            paren.find(".tiny_input_ip_octet").eq(1).val(ip[1]);
            paren.find(".tiny_input_ip_octet").eq(2).val(ip[2]);
            paren.find(".tiny_input_ip_octet").eq(3).val(ip[3]);
            paren.find('.tiny-input-text').val(mask[1]);
        },
        chageNetwork:function(e){

            var $target = $(e.currentTarget);
            var num=parseInt($target.val());
            var ip1=$target.parents('.network').find('.tiny_input_ip_octet').eq(0);
            var ip2=$target.parents('.network').find('.tiny_input_ip_octet').eq(1);
            var ip3=$target.parents('.network').find('.tiny_input_ip_octet').eq(2);
            var ip4=$target.parents('.network').find('.tiny_input_ip_octet').eq(3);
            var mask=$target.parents('.network').find('.tiny-input-text');
            var index = $target.parents('.network').find('.tiny_input_ip_octet').index($target);
            if(isNaN(num)||num<0||num>255||(index==-1&& num<8)||(index==-1&& num>30)){
                if(index==0){
                    ip1.val(192);
                    ip2.val(168);
                    ip3.val(0);
                    ip4.val(0);
                }else if(index==1){
                    if(ip1.val()==10){
                        ip2.val(0);
                        ip3.val(0);
                        ip4.val(0);
                    }else if(ip1.val()==172){
                        ip2.val(16);
                        ip3.val(0);
                        ip4.val(0);
                    }else{
                        ip2.val(168);
                        ip3.val(0);
                        ip4.val(0);
                    }
                }else if(index ==-1){
                    $target.val(16);
                }else{
                    ip3.val(0);
                    ip4.val(0);
                }
                if($target.hasClass('tiny_input_ip_octet')){
                    bootbox.alert('必须输入0-255之间的数值');
                    return false;
                }else{
                    bootbox.alert('必须输入8-30之间的数值');
                    return false;
                }
            }
            if(index==0&&num!=10&&num!=172&&num!=192){
                ip1.val(192);
                ip2.val(168);
                ip3.val(0);
                ip4.val(0);
                return false;
            }
            $target.closest('.form-group').find("input:first").val(ip1.val()+'.'+ip2.val()+'.'+ip3.val()+'.'+ip4.val()+'/'+mask.val())
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
            var params = {
                businessOrderId:self.$businessOrderId.val(),
                accountId:self.$accountId.val(),
                userId:self.$userId.val(),
                serviceTag:self.$serviceTag.val(),
                resourceType:self.$resourceType.val(),
				vpcName: self.$vpcName.val(),
                cidr: self.$cidr.val(),
                vlanName: self.$vlanName.val(),
                vlanType: self.$vlanType.val(),
                vlanCidr: self.$vlanCidr.val(),
                basicVpcId: self.$basicVpcId.val(),
                zoneId: self.$zone.val(),
                period_type: self.$period_type.val(),
                period_num: self.$period_num.val(),
                period_day: self.$period_day.val(),
                order_num: self.$order_num.val(),
                finalPrice: $('span.text-success').html(),
                salePrice:this.$salePrice.val(),
                payment:$('#payment').val()
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
            e.preventDefault();

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
        },
        getCloudPrice:function(salePriceFlag){
            if(initServicesFlage){
                return ;
            }
            var self = this;
            var params = {
                businessOrderId:self.$businessOrderId.val(),
                accountId:self.$accountId.val(),
                userId:self.$userId.val(),
                serviceTag:self.$serviceTag.val(),
                resourceType:self.$resourceType.val(),
				vpcName: self.$vpcName.val(),
                cidr: self.$cidr.val(),
                vlanName: self.$vlanName.val(),
                vlanType: self.$vlanType.val(),
                vlanCidr: self.$vlanCidr.val(),
                basicVpcId: self.$basicVpcId.val(),
                zoneId: self.$zone.val(),
                period_type: self.$period_type.val(),
                period_num: self.$period_num.val(),
                period_day: self.$period_day.val(),
                order_num: self.$order_num.val(),
                salePrice:this.$salePrice.val(),
                payment:$('#payment').val()
            }
            var req = $.ajax({
                url: baseurl+"business/getitemprice",
                data:params,
                type: 'POST',
				dataType:'json'
            });

            req.done(function(data) {
                if(data.statusCode==800){
                    $('span.text-success').html(data.returnObj.finalPrice);
                    if(salePriceFlag){
                        $('#salePrice').val(data.returnObj.finalPrice)
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
        }

    };

    return Services;

});
