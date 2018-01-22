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


        this.$el = el;
        this.$zone = this.$el.find('#zone_select');
        this.$cpu = this.$el.find('a[data-type=cpu]');
        this.$memory = this.$el.find('a[data-type=memory]');
        this.$net = this.$el.find('input.slider-net');
        this.$netInput = this.$el.find('input.input-net');
        this.$os = this.$el.find('#os_select');
		this.$serviceName = this.$el.find('#service_name');
        this.$period_type=this.$el.find('#period');
        this.$period_num=this.$el.find('#period_num');
        this.$period_day=this.$el.find('#period_day');
        this.$order_num=this.$el.find('#order_num');
        this.$businessOrderId=this.$el.find('#businessOrderId');
        this.$accountId=this.$el.find('#accountId');
        this.$userId=this.$el.find('#userId');
        this.$serviceTag=this.$el.find('#serviceTag');
        this.$resourceType=this.$el.find('#resourceType');
        this.$specType = this.$el.find('#specType');

        this.$vpcList=this.$el.find('#vpcList');
        this.$vpc=this.$el.find('#vpc');
        this.$vlan=this.$el.find('#vlan');

        this.$ebsNum=this.$el.find('#ebsNum');
        this.$addebs=this.$el.find('#addebs');
        this.$delebs = this.$el.find('a[data-type=delebs]');
        this.$sysDataType = this.$el.find('#syshdType');
        this.$dataType = this.$el.find('select[name=datahdType]');
        this.$dataHd = this.$el.find('input[name=datahd_value]');

        this.$salePrice=this.$el.find('#salePrice');
        this.$businessOrderItemId=this.$el.find('#businessOrderItemId');

        this.selected_cpu = $('#defaultCpu').val();
        this.selected_memory = $('#defaultMem').val();
        this.$syshd=this.$el.find('#datahd_value');
        initData = data;
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
            this.$cpu.on('click', $.proxy(this.applyCPU, this));
            this.$memory.on('click', $.proxy(this.applyMemory, this));
            this.$netInput.on('keyup', $.proxy(this.applyValueToSlider, this));
            this.$el.off('submit').on('submit', $.proxy(this.submit, this));
            this.$period_type.on('change', $.proxy(this.changePeriod, this));
            this.$vpc.on('change', $.proxy(this.changeVpc, this));
            this.$addebs.on('click', $.proxy(this.addEbsDiv, this));
            this.$delebs.on('click', $.proxy(this.delEbsDiv, this));
            this.$dataType.on('change', $.proxy(this.getCloudPrice, this));
            this.$dataHd.on('change', $.proxy(this.chageDataHdValue, this));
            this.$salePrice.on('change', $.proxy(this.chageSalePrice, this));
            this.$sysDataType.on('change', $.proxy(this.getCloudPrice, this));
            this.$syshd.on('change', $.proxy(this.getCloudPrice, this));
            this.$specType.on('change', $.proxy(this.specTypeChange, this));
            this.$os.on('change', $.proxy(this.chageSysHd, this));

            var date = new Date();
            date.setDate(date.getDate()+1)
            var dateString = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
            this.$period_day.val(dateString);
            this.renderSlider();


            if(!$.isEmptyObject(initData)) {
                // 修改或者详情初始化页面
                this.itemInfo();
            }else{
                console.log(123);
                initServicesFlage=false;
               this.$zone.trigger('change');
               this.$cpu.eq(0).trigger('click');
               this.getCloudPrice(true);
               this.$specType.trigger('change');
            }


        },
        specTypeChange:function(){
            if(this.$specType.val()=='standards'){
                $('.standards').show();
                $('.highstandards').hide();
                $('.standards').find('.btn').eq(0).trigger('click')
            }else{
                $('.standards').hide();
                $('.highstandards').show();
                $('.highstandards').find('.btn').eq(0).trigger('click')
            }
        },
        itemInfo:function () {
                  console.log(initData);

                this.$zone.val(initData["zoneid"]);
                this.$zone.trigger('change');
            this.$specType.val(initData["specType"])
                this.$specType.trigger('change');
                this.$cpu.each(function () {
                    if ($(this).attr("data-value") == initData['cpu']) {
                        $(this).click();
                    }
                });
                this.$memory.each(function () {
                    var value = parseInt(initData['memory']) * 1024;
                    if ($(this).attr("data-value") == value) {
                        $(this).click();
                    }
                });

                this.$ebsNum.val(initData["ebsNum"]);
                var addebs = this.$addebs;
                $.each(initData['diskList'],function (i,diskInfo) {
                     if(i){
                         var obj=$('.dataHdDiv').eq(0).clone(true);
                         $(addebs).parents('.row').before(obj);
                         $('.dataHdDiv').eq(i).find('input[name="datahd_value"]').val(diskInfo['dataHd']);
                          $('.dataHdDiv').eq(i).find('select[name="datahdType"]').val(diskInfo['dataType'].toLowerCase());

                     }else{
                          $('.dataHdDiv').find('input[name="datahd_value"]').val(diskInfo['dataHd']);
                          $('.dataHdDiv').find('select[name="datahdType"]').val(diskInfo['dataType'].toLowerCase());
                          $('.dataHdDiv').show();
                     }
                });
                this.$net.slider('setValue', parseInt(initData['bw']));
                this.$netInput.val(parseInt(initData['bw']));
                this.$period_type.val(initData['cycleType']);
                this.$period_num.val(initData['cycleCnt']);
                this.$order_num.val(initData['order_num']);
                this.$sysDataType.val(initData['sysDataType'].toLocaleLowerCase())
                this.$syshd.val(initData['syshd'])
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
                $(this.$addebs).parents('.row').before(obj);
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
            var step=10;
            }else{
            var numMax =30000;
            var step=1;
            }
            var numMin =10;
		
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
        },
        chageDataHdValue:function(e){
            if(this.$serviceTag.val()=='vms'){
            var numMax =2000;
		var step=10;
            }else{
            var numMax =30000;
		var step=1;
            }
            var numMin =10;
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
               // return false;
            }
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
				serviceName: self.$serviceName.val(),
                cpu: self.selected_cpu,
                memory: self.selected_memory,
                net: self.$netInput.val(),
                zoneId: self.$zone.val(),
                os: self.$os.val(),
                period_type: self.$period_type.val(),
                period_num: self.$period_num.val(),
                period_day: self.$period_day.val(),
                order_num: self.$order_num.val(),
                vpcId: self.$vpc.val(),
                vpcVlanId: self.$vlan.val(),
                finalPrice: $('span.text-success').html(),
                ebsNum:this.$ebsNum.val(),
                sysDataType:this.$sysDataType.val(),
                salePrice:this.$salePrice.val(),
                payment:$('#payment').val(),
                syshd:$('#datahd_value').val(),
                specType:this.$specType.val()
            }
            if(this.$salePrice.attr('lock')==1){
                bootbox.alert('价格获取中，请稍后');
                return false
            }
            console.log($("#pageType").val());
            if($("#pageType").val()=='change'){
                params['businessOrderItemId'] = $("#businessOrderItemId").val();
            }
            for(var i=0;i<ebsNum;i++){
                params['dataType'+(i+1)]=$('.dataHdDiv').eq(i).find('select[name="datahdType"]').val();
                params['dataHd'+(i+1)]=$('.dataHdDiv').eq(i).find('input[name="datahd_value"]').val();
            }
			
            var req = $.ajax({
                url: $('#service_post_form').attr('action'),
                data: params,
                type: 'POST',
				dataType:'json'
            });
			
            req.done(function(data) {if(data.return==false){bootbox.alert(data.msg)}else{
                bootbox.alert('保存成功');
                console.log(data);
                document.location=baseurl+data.url;
            }});
            req.fail(function(error) {});
        },
        chageSysHd:function(e){

            var $target = $(e.currentTarget);
            if(this.$serviceTag.val()=='vms'){
                $('#datahd_value').attr('readonly',"readonly")
            }else{
                $('#datahd_value').removeAttr('readonly')
            }
            if(initServicesFlage){
                return
            }
            $('#datahd_value').val($target.children('option:selected').attr('syshd'))
        },
        changeZone:function(e){
            e.preventDefault();
            var thisOs=this.$os;
            var thisVpc=this.$vpc;
            var thisVlan=this.$vlan;
            var thisVpcList=this.$vpcList;
            var initFlag = initServicesFlage;
            var req = $.ajax({
                url: baseurl+"business/getoslist",
                data: {'zoneId':this.$zone.val(),'serviceTag':this.$serviceTag.val()},
                type: 'POST',
				dataType:'json'
            });
            req.done(function(data) {
                if(data.status=="1"){
                    thisOs.empty();
                    for(k in data.osList){
                        thisOs.append("<option value='"+k+"' syshd='"+data.osList[k].syshd+"' >"+data.osList[k].text+"</option>")
                    }
                    if(initFlag && !$.isEmptyObject(initData) && initData['os']){
                         thisOs.find("option").each(function () {
                            if( $(this).html()== initData['os']){
                                thisOs.val($(this).attr('value'));
                            }
                        });
                    }
                    thisOs.trigger('change');
                }else{
                    bootbox.alert('获取操作系统数据失败');
                }
            });
            req.fail(function(error) {bootbox.alert('获取操作系统数据失败');});
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
                        if( !$.isEmptyObject(initData)&&initData['vpcID']) {
                            thisVpc.find("option").each(function () {
                                if ($(this).attr('value') == initData['vpcID']) {
                                    thisVpc.val($(this).attr('value'));
                                }
                            });
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
            if(!$.isEmptyObject(initData) && initData['vpcVlanId']){
                 thisVlan.find("option").each(function () {
                    if( $(this).attr('value')== initData['vpcVlanId']){
                        thisVlan.val($(this).attr('value'));
                    }
                 });
             }
        },
        // salePriceFlag 是否修改销售价格
        getCloudPrice:function(salePriceFlag){
            // 如果在初始化中不查询价格
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
				serviceName: self.$serviceName.val(),
                cpu: self.selected_cpu,
                memory: self.selected_memory,
                net: self.$netInput.val(),
                zoneId: self.$zone.val(),
                os: self.$os.val(),
                period_type: self.$period_type.val(),
                period_num: self.$period_num.val(),
                period_day: self.$period_day.val(),
                order_num: self.$order_num.val(),
                vpcId: self.$vpc.val(),
                vpcVlanId: self.$vlan.val(),
                ebsNum:this.$ebsNum.val(),
                sysDataType:this.$sysDataType.val(),
                salePrice:this.$salePrice.val(),
                payment:$('#payment').val(),
                syshd:$('#datahd_value').val(),
                specType:this.$specType.val()
            }
            if(! params['os']){
               params['os'] =  params['serviceTag'] == 'hws'? 'windows':'1';
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
        applyCPU: function(e) {
            e.preventDefault();
            var $target = $(e.currentTarget);
            var range = $target.data('range');
            var $cpus = $target.parent().siblings().children();
            if ($target.hasClass('active')) {
                return;
            }
            $cpus.removeClass('active');
            $target.addClass('active');
            this.selected_cpu = $target.data('value');
            console.log("123444");
            this.changeMemoryRange(range);
            this.getCloudPrice(true);
        },
        changeMemoryRange: function(range) {
            var min = range.split(',')[0],
                max = range.split(',')[1],
                $validMemories = $();

            this.$memory.each(function(index, memory) {
                var value = $(memory).data('value');
                if (value >= min && value <= max) {
                    $validMemories.push(memory);
                }
            });
            $validMemories
                .parent()
                .removeClass('hidden')
                .end()
                .removeClass('hidden active')
                .eq(0).addClass('active');
            this.selected_memory = $validMemories.eq(0).data('value');
            this.$memory
                .not($validMemories)
                .parent()
                .removeClass('hidden')
                .addClass('hidden')
                .end().removeClass('hidden active')
                .addClass('hidden');

        },

        applyMemory: function(e) {
            var $target = $(e.currentTarget);
            var $memories = $target.parent().siblings().children();
            if ($target.hasClass('active')) {
                return;
            }
            $memories.removeClass('active');
            $target.addClass('active');
            this.selected_memory = $target.data('value');
            this.getCloudPrice(true);
        },

        renderSlider: function() {
            var self = this;
            this.$net.slider({
                min: 0,
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
            this.getCloudPrice(true);

        },

        applyValueToSlider: function(e) {
            var $target = $(e.currentTarget);
            var val = isNaN(parseInt($target.val().replace(/[^\d]/, ''))) ? 0 : parseInt($target.val().replace(/[^\d]/, ''));
            $target.val(val);
            if ($target.hasClass('input-net')) {
                if ($target.val() > 300) {
                    $target.val(300);
                }
                this.applySliderValue($target.val(), $target);
            }
        }
    };

    return Services;

});
