/**
 * Created by Marshall on 14-4-25.
 */
define(function(require) {

    var $ = require('jquery');
    require('bootstrap');
    require('prettify'); // highlight
    require('dataTable');
    require('./datatables');

    hljs.configure({
        tabReplace: '<span class="indent">\t</span>'
    });
    hljs.initHighlightingOnLoad();

    var Order = function(el) {

        this.$el = el || $(document);
        this.$showErr = this.$el.find('.show-error');
        this.$checkSettings = this.$el.find('.check-settings');
        this.$checkDetail = this.$el.find('.check-detail');
        this.$resolved = this.$el.find('.resolved');
        this.$deny = this.$el.find('.deny');
        this.$workOrder = this.$el.find('.work-order');

        this.$dataTable = this.$el.find('#tableSortable');

        this.init();
    };

    Order.prototype = {
        constructor: Order,

        init: function() {

            this.$showErr.on('click', $.proxy(this.showErr, this));
            this.$checkSettings.on('click', $.proxy(this.checkSettings, this));
            this.$checkDetail.on('click', $.proxy(this.checkDetail, this));
            this.$resolved.on('click', $.proxy(this.resolved, this));
            this.$deny.on('click', $.proxy(this.deny, this));
            this.$workOrder.on('click', $.proxy(this.workOrder, this));

            this.renderTable();
        },

        renderTable: function() {
            this.$dataTable.dataTable();
        },

        showErr: function(e) {
            e.stopPropagation();
            e.preventDefault();
			$target = $(e.currentTarget).closest('tr');
            ID = $target.attr('error').replace(/</g,'&lt;').replace(/>/g,'&gt;');
			if(ID.length==0)ID='没有输出错误信息';
			$('#msgInfo').html(ID);
            $('#errMsg').modal();
        },

        checkSettings: function(e) {
            e.stopPropagation();
            e.preventDefault();
			$target = $(e.currentTarget).closest('tr');
            ID = $target.attr('config');
			if(ID.length==0)ID='没有输出配置信息';
			$('#configInfo').html(ID);
            $('#checkSettings').modal();
        },

        checkDetail: function(e) {
            e.stopPropagation();
            e.preventDefault();
            $('#checkDetail').modal();
        },

        resolved: function(e) {
            e.stopPropagation();
            e.preventDefault();
		 $target = $(e.currentTarget).closest('tr');
	    $.post(baseurl+'control/repaire',{'jobId':$target.attr('id'),'orderId':$target.attr('orderId'),'type':$target.attr('jobAction')},function(data){
			if(data==1){
			alert('修复请求发送成功');
			document.location.reload();
			}else{

			alert('修复请求发送失败，请稍后重试');
			}
		});
            
        },

        deny: function(e) {
            e.stopPropagation();
            e.preventDefault();
            $('#deny').modal();
        },

        workOrder: function(e) {
            e.stopPropagation();
            e.preventDefault();
            $('#workOrder').modal();
        }
    };

    $(document).ready(function() {
        new Order($('#order'));
    })
});
