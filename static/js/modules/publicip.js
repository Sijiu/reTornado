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
        this.$el = el;
        this.$zone = this.$el.find('#zone_select');
        this.$net = this.$el.find('input.slider-net');
        this.$netInput = this.$el.find('input.input-net');
        this.$period_type=this.$el.find('#period');
        this.$period_num=this.$el.find('#period_num');
        this.$period_day=this.$el.find('#period_day');
        this.$order_num=this.$el.find('#order_num');
        this.$businessOrderId=this.$el.find('#businessOrderId');
        this.$accountId=this.$el.find('#accountId');
        this.$userId=this.$el.find('#userId');
        this.$serviceTag=this.$el.find('#serviceTag');
        this.$resourceType=this.$el.find('#resourceType');
        this.$vpcList=this.$el.find('#vpcList');
        this.$vpc=this.$el.find('#vpc');
        this.$vlan=this.$el.find('#vlan');
        this.$salePrice=this.$el.find('#salePrice');

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
            this.$netInput.on('keyup', $.proxy(this.applyValueToSlider, this));
            this.$el.off('submit').on('submit', $.proxy(this.submit, this));
            this.$period_type.on('change', $.proxy(this.changePeriod, this));
            this.$vpc.on('change', $.proxy(this.changeVpc, this));
            this.$salePrice.on('change', $.proxy(this.chageSalePrice, this));
            this.$zone.trigger('change');




            var date = new Date();
            date.setDate(date.getDate()+1)
            var dateString = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
            this.$period_day.val(dateString);
            this.renderSlider();
              if(!$.isEmptyObject(initData)) {
               this.itemInfo();
            }else{
                console.log(123);
                initServicesFlage=false;
               this.$zone.trigger('change');
               this.getCloudPrice(true);
            }
        //    this.getCloudPrice(true);

        },
        itemInfo:function () {
             console.log(initData);
                this.$zone.val(initData["zoneid"]);
                this.$zone.trigger('change');


                this.$net.slider('setValue', parseInt(initData['bw']));
                this.$netInput.val(parseInt(initData['bw']));
                this.$period_type.val(initData['cycleType']);
                this.$period_num.val(initData['cycleCnt']);
                this.$order_num.val(initData['order_num']);
                 initServicesFlage=false;
                 this.getCloudPrice(false);
                this.$salePrice.val(initData['sale_price']);
                $('#payment').val(initData['separate_type']);
        },
        changeZone:function(e){
            e.preventDefault();
            var thisVpc=this.$vpc;
            if(thisVpc.parents('.form-group').hasClass('hide')){
                return false;
            }
            var thisVlan=this.$vlan;
            var thisVpcList=this.$vpcList;
            var vpcreq = $.ajax({
                url: baseurl+"business/getvpclist",
                data: {'zoneId':this.$zone.val(),accountId:this.$accountId.val(),userId:this.$userId.val()},
                type: 'POST',
				dataType:'json'
            });
            vpcreq.done(function(data) {
                if(data.status=="1"){
                    thisVpcList.val(JSON.stringify(data.vpcList))
                    thisVpc.empty();

                    if ($.isEmptyObject(data.vpcList)){
                        thisVpc.parents('.form-group').hide();
                    }else{
                        thisVpc.parents('.form-group').show();
                        for(k in data.vpcList){
                            thisVpc.append("<option value='"+k+"'>"+data.vpcList[k].name+"</option>")

                        }
                        thisVpc.trigger('change');
                    }
                }else{
                    bootbox.alert('vpc获取数据失败');
                }
            });
            vpcreq.fail(function(error) {bootbox.alert('vpc获取数据失败');});

        },
        changeVpc:function(){
            var vpcId=this.$vpc.val();
            var thisVpcList=JSON.parse(this.$vpcList.val());

            var vlanList=thisVpcList[vpcId].vlan;
            var thisVlan=this.$vlan;
            thisVlan.empty();
            for(m in vlanList){
               thisVlan.append("<option value='"+m+"'>"+vlanList[m].vlanName+"</option>")
            }
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
            if(this.$serviceTag.val()=='vms'&&(this.$vpc.val()==null ||this.$vpc.val()=='')){
                bootbox.alert('只有有vpc的客户才可以单独订购IP');
                return false;
            }
            var self = this;
            var params = {
                businessOrderId:self.$businessOrderId.val(),
                accountId:self.$accountId.val(),
                userId:self.$userId.val(),
                serviceTag:self.$serviceTag.val(),
                resourceType:self.$resourceType.val(),
                net: self.$netInput.val(),
                zoneId: self.$zone.val(),
                period_type: self.$period_type.val(),
                period_num: self.$period_num.val(),
                period_day: self.$period_day.val(),
                order_num: self.$order_num.val(),
                vpcId: self.$vpc.val(),
                vpcVlanId: self.$vlan.val(),
                finalPrice: $('span.text-success').html(),
                salePrice:this.$salePrice.val(),
                payment:$('#payment').val()
            }
            if(this.$salePrice.attr('lock')==1){
                bootbox.alert('价格获取中，请稍后');
                return false
            }
            console.log($("#pageType").val());
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

        getCloudPrice:function(salePriceFlag){
            var self = this;
            var params = {
                businessOrderId:self.$businessOrderId.val(),
                accountId:self.$accountId.val(),
                userId:self.$userId.val(),
                serviceTag:self.$serviceTag.val(),
                resourceType:self.$resourceType.val(),
                net: self.$netInput.val(),
                zoneId: self.$zone.val(),
                period_type: self.$period_type.val(),
                period_num: self.$period_num.val(),
                period_day: self.$period_day.val(),
                order_num: self.$order_num.val(),
                vpcId: self.$vpc.val(),
                vpcVlanId: self.$vlan.val(),
                salePrice:this.$salePrice.val(),
                payment:$('#payment').val()
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
                    $('span.text-success').html(data.returnObj.finalPrice);
                     $('#salePrice').attr('lock',0)
                    if(salePriceFlag){
                         $('#salePrice').val(data.returnObj.finalPrice);
                    }

                }else{
                    bootbox.alert('获取数据失败');
                }
            });
            req.fail(function(error) {});
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
              //  bootbox.alert('销售价格不能小于标准价格的5.5折')
               // return false;
            }
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


        renderSlider: function() {
            var self = this;
            this.$net.slider({
                min: 1,
                max: 300,
                step: 1,
                tooltip: 'always',
                formater: function(v) {
                    return v + ' Mbps';
                }
            }).on('slideStop', function() {
                self.applySliderValue(self.$net.data('slider').getValue(), this);
            })
        },

        applySliderValue: function(value, obj) {
            var val = isNaN(parseInt(value))?0:parseInt(value);
            if ($(obj).hasClass('slider-net') || $(obj).hasClass('input-net')) {
                this.$net.slider('setValue', val);
                this.$netInput.val(value);
            }
            this.getCloudPrice(true)

        },

        applyValueToSlider: function(e) {
            var $target = $(e.currentTarget);
            var val = isNaN(parseInt($target.val().replace(/[^\d]/, ''))) ? 0 : parseInt($target.val().replace(/[^\d]/, ''));
            $target.val(val);
            if ($target.hasClass('input-disk')) {
                if ($target.val() > 2000 ) {
                    $target.val(2000);
                }
                this.applySliderValue($target.val(), $target);
            }
            if ($target.hasClass('input-net')) {
                if ($target.val() > 100) {
                    $target.val(100);
                }
                this.applySliderValue($target.val(), $target);
            }
        }
    };

    return Services;

});
