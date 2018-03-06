/**
 * Created by Marshall on 14-4-17.
 */
define(function(require, module, exports) {

    var $ = require('jquery');
    var bootbox = require('bootbox');
    var Buyconf = function(el) {

        this.$el = el;
		this.$serviceName = this.$el.find('#service_name');


        this.init();
    };

    Buyconf.prototype = {
        constructor: Buyconf,

        init: function() {

            this.$el.on('submit', $.proxy(this.submit, this));

        },

        submit: function(e) {
            e.preventDefault();

            var self = this;
          
            var params = {
                agency:self.$el.find('select#agency').val(),
                user:self.$el.find('select#user').val(),
                description:self.$el.find('textarea#description').val(),
				order_num: self.$el.find('select#order_num').val(),
                period:self.$el.find('select#period').val(),
                period_num:self.$el.find('select#period_num').val(),
                zoneid:self.$el.find('select#zoneid').val(),
                cpu: self.$el.find('input#cpu_value').val(),
                memory: self.$el.find('input#memory_value').val(),
                datahd: self.$el.find('input#datahd_value').val(),
                bw: self.$el.find('input#bw_value').val(),
                os: self.$el.find('input#os_value').val(),
				special:'cbs'
            }
            for(var dat in params){
				if(dat!='description' && (params[dat]=='' || params=='0')){
					bootbox.alert("请填写完整信息后，再次提交！");
					return false;
				}
			}
            var req = $.ajax({
                url: self.$el.attr('action'),
                data: params,
                type: 'POST',
				dataType:'json',
            });
			
            req.done(function(data) {if(data.status==true){bootbox.alert(data.msg);location.reload();}else{bootbox.alert(data.msg);}});
            req.fail(function(error) {});
        },
    };

    return Buyconf;

});
