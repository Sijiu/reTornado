define(function(require, module, exports) {

    var $ = require('jquery');
	var bootbox = require('bootbox');
    var _ = require('underscore');
    var bootbox = require('bootbox');

    $(document).ready(function() {

        var vms_identi = ''; // 没办法只能放这儿了 囧

        var template = '<div class="form-horizontal">\
                            <% _.each(details, function(detail, index) { %>\
                                <div class="form-group">\
                                    <label class="col-sm-2 control-label"><%= detail.name %></label>\
                                    <div class="col-sm-10">\
                                        <% if (typeof detail.value === "object") { %>\
                                            <table class="table table-striped">\
                                                <% _.each(detail.value, function(item, index) { if(item.value){%>\
                                                    <tr><td class="col-sm-2"><%= item.type %></td><td><strong><%= item.value %></strong></td></tr>\
                                                <% }}) %>\
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

        $('.show-detail').on('click', showDetail);

        function showDetail() {
            var $this = $(this).closest('tr');
			vms_identi = $this.attr('id');
            var data = {
                details: [{
                    name: '申请人',
                    value: $this.find('td').eq(0).html()
                }, {
                    name: '所属组织',
                    value: $this.find('td').eq(1).html()
                },{
                    name: '申请类型',
                    value: $this.find('td').eq(2).html()
                },{
                    name: '申请时间',
                    value: $this.find('td').eq(3).html()
                }]
            };
			if($this.attr('description')!='' && $this.attr('description')!=null){
			
				data.details.push({name:'申请理由',value:$this.attr('description')});
			}
			if($this.attr('attach')!='' && $this.attr('attach_remark')!=''&&$this.attr('attach_remark')!=undefined){
				
				data.details.push({name:'证明材料',value:"<a href="+baseurl+$this.attr('attach')+">"+$this.attr('attach_remark')+"</a>"});
			}
	   	if($this.attr('remark')!=''){
			data.details.push({name:'拒绝原因',value:$this.attr('remark')});
		}
				data.details.push({name: '服务详情',value: $.parseJSON($this.attr('data'))});
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
					var currentID = vms_identi;
					var postdata={'orderId':currentID,'accountId':$('#'+currentID).attr('accountId'),'userId':$('#'+currentID).attr('userId'),'agencyAccountId':$('#'+currentID).attr('agencyAccountId'),'agencyUserId':$('#'+currentID).attr('agencyUserId'),'credit':$('#'+currentID).attr('credit'),'cash':0,'orderType':$('#'+currentID).find('td').eq(2).html()}
					$.post(baseurl+"ajax_execute_order",postdata, function(data){
						if (data === '1') {
								$('#examineVms').modal('hide');
								bootbox.alert('审批成功');
								document.location.reload();
						}else{
							$('#examineVms').modal('hide');
							alert('审批失败');
						}
					});
				
				
            },

            deny: function(e) {
                e.preventDefault();
                bootbox.prompt('请输入拒绝的原因', function(res) {
					if (res === null) {
					 bootbox.alert('原因不能为空');
					} else{
						var currentID = vms_identi;
						var postdata={'orderId':currentID,'accountId':$('#'+currentID).attr('accountId'),'userId':$('#'+currentID).attr('userId'),'remark':res,'orderType':$('#'+currentID).find('td').eq(2).html()}
						$.post(baseurl+"ajax_cancel_order",postdata, function(data){
							if (data === '1') {
									$('#examineVms').modal('hide');
									bootbox.alert('拒绝成功');
									document.location.reload();
							}else{
									bootbox.alert('拒绝失败');
									$('#examineVms').modal('hide');
							}
						});
					}						   
				});
            }
        };

        new ExamineVms($('#examineVms'));

    });

});
