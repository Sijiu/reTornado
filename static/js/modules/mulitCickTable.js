define(function(require, module, exports) {

    var $ = require('jquery');
    var _ = require('underscore');
    var bootbox = require('libs/bootbox').exports;

    $(document).ready(function() {

        var vms_identi = ''; // 没办法只能放这儿了 囧

        var template = '<div class="form-horizontal">\
                            <% _.each(details, function(detail, index) { %>\
                                <div class="form-group">\
                                    <label class="col-sm-2 control-label"><%= detail.name %></label>\
                                    <div class="col-sm-10">\
                                        <% if (typeof detail.value === "object") { %>\
                                            <table class="table table-striped">\
                                                <% _.each(detail.value, function(item, index) { %>\
                                                    <tr><td class="col-sm-2"><%= item.type %></td><td><strong><%= item.value %></strong></td></tr>\
                                                <% }) %>\
                                            </table>\
                                        <% } else { %>\
                                            <p class="lead"><%= detail.value %></p>\
                                        <% } %>\
                                    </div>\
                                </div>\
                            <% }) %>\
                         </div>';

//        $("#tableSortable tbody tr").click( function( e ) {
//            vms_identi = $(this).data('id');
//            if ( $(this).hasClass('active') ) {
//                $(this).removeClass('active');
//                $(this).find("input[type=checkbox]").prop("checked", false);
//            }
//            else {
//                $(this).siblings().removeClass('active').find('input[type=checkbox]').prop('checked', false);
//                $(this).addClass('active').find("input[type=checkbox]").prop("checked", true);
//                showDetail(this);
//            }
//        });

        function showDetail(obj, identi) {
            var $this = $(obj);
            var data = {
                details: [{
                    name: '申请人',
                    value: $this.find('td').eq(0).html()
                }, {
                    name: '所属组织',
                    value: $this.find('td').eq(1).html()
                }, {
                    name: '申请时间',
                    value: $this.find('td').eq(2).html()
                },{
                    name: '申请理由',
                    value: $this.attr('description')
                },{
                    name: '主机详情',
                    value: $.parseJSON($this.attr('data'))
                }]
            };
            var result = _.template(template, data);
            $('#examineVms').find('.modal-body').html(result).end().modal();
        }

        var ExamineVms = function(el) {

            this.$el = el;
            this.$sure = this.$el.find('.btn-primary');
            this.$deny = this.$el.find('.btn-danger');

            this.init();
        };

        ExamineVms.prototype = {
            constructor: ExamineVms,

            init: function() {
                this.$sure.on('click', $.proxy(this.submit, this));
                this.$deny.on('click', $.proxy(this.deny, this));
            },

            submit: function(e) {
                e.preventDefault();
				bootbox.confirm('确定要通过此申请么？', function(res) {
					var currentID = vms_identi;
					var postdata={'orderId':currentID,'accountId':$('#'+currentID).attr('accountId'),'userId':$('#'+currentID).attr('userId'),'agencyAccountId':$('#'+currentID).attr('agencyAccountId'),'agencyUserId':$('#'+currentID).attr('agencyUserId'),'credit':$('#'+currentID).attr('credit'),'cash':0}
					$.post(baseurl+"ajax_execute_order",postdata, function(data){
						if (data === '1') {
						}else{
						}
					});
				});
            },

            deny: function(e) {
                e.preventDefault();
                bootbox.confirm('确定拒绝吗？', function(res) {});
            }
        };

        new ExamineVms($('#examineVms'));

    });

});