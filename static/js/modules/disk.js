/**
 * Created by Marshall on 14-4-21.
 */
define(function(require, module, exports) {

    var $ = require('jquery'),
        _ = require('underscore'),
        select2 = require('select2'),
        bootbox = require('bootbox'),
        editable = require('editable'),
        utils = require('./utils');
    	require('dataTable');
    	require('bootstrap');
    	require('./datatables');
	var Period = require('modules/views/price_period');

    var Disk = function(el) {

        this.$el = el;
        // toolbar buttons
        this.$toolbar = this.$el.find('.datatable-toolbar');
        this.$dropdownMenu = this.$toolbar.find('.dropdown-menu li').not('.divider');
        this.$launch = this.$toolbar.find('.btn-launch'); // 挂载
        this.$shutdown = this.$toolbar.find('.btn-shutdown'); // 卸载
		this.$editname = this.$toolbar.find('.btn-edit'); // 修改名称

        this.$renew = this.$toolbar.find('.btn-renew'); // 续订
        this.$unsubscribe = this.$toolbar.find('.btn-unsubscribe'); // 退订
        this.$groupFilter = this.$el.find('#groupFilter'); // 组织选择

        // dataTable controls
        this.$renderedTable = null;
        this.$selectedRow = null;
        this.$diskInfo = null;
        this.dataStatus = null;
        this.$dataTable = this.$el.find('#tableSortable');
        this.$trs = this.$dataTable.find('tr');
        this.$showDetailBtn = this.$el.find('.btn-detail');
        //this.$checkall = this.$dataTable.find('input[type=checkbox]#check_all'); 不需要多选功能

        this.init();
    };

	 Disk.checkVMStatus = function(cur){
			var Timer = setTimeout(function() {

				var data= {
					'diskId':cur.find('input').attr('data-ebsId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
				};

				var req = $.ajax({
					url: baseurl+'control/mount_cms_status/',
					data: data,
					type: 'POST'
		         });
				req.done(function(data) {
					var data = eval('('+data+')');
					if(data.status=='unbind' || data.status=='bind')
					{
						cur.find('div[data-type=status] font').html(data.vmStatus);
						cur.find('div[data-type=status]').attr('data-status',data.status);
						cur.find('div[data-type=status] img').hide();
					}else{

						window.setTimeout( function(){Disk.checkVMStatus(cur)},3000);
					}
				});

			},10000);
	};

    Disk.prototype = {
        constructor: Disk,

        init: function() {

            // toolbar event listeners
            this.$launch.on('click', $.proxy(this.bind, this));
            this.$shutdown.on('click', $.proxy(this.unbind, this));
           
            this.$renew.on('click', $.proxy(this.renew, this));
            this.$unsubscribe.on('click', $.proxy(this.unsubscribe, this));
			this.$editname.on('click', $.proxy(this.editname, this));
            // table event listeners
            this.$dataTable.on('click', this.$trs, $.proxy(this.selectOne, this));
            this.$dataTable.on('click', '.editable-virtual-name', $.proxy(this.editVirtualName, this));
            this.$showDetailBtn.on('click', $.proxy(this.showDetail, this));
			
            this.initToolbar();
            this.renderTable();
			this.proceeding();
        },

		proceeding: function(){
			this.$dataTable.find('div[data-type=status]').each(function(){
				if($(this).attr('data-status')!='bind' && $(this).attr('data-status')!='unbind'){
					
					 Disk.checkVMStatus($(this).parents('tr'));
				}

			});

		},

        initToolbar: function() {

            if (this.$selectedRow) {
                this.dataStatus = this.$selectedRow.find('div[data-type=status]').attr('data-status');
                this.isPackaged = this.$selectedRow.find('input').attr('data-isPackaged');
				 utils.disableButton(this.$launch);
                 utils.disableButton(this.$shutdown);

                if (this.dataStatus === 'bind') {
                    utils.disableButton(this.$launch);
                    utils.enableButton(this.$shutdown);
                }
                if (this.dataStatus === 'unbind') {
                    utils.enableButton(this.$launch);
                    utils.disableButton(this.$shutdown);
                }
                this.$dropdownMenu.removeClass('disabled');
                if(this.isPackaged=='1'){
                	utils.disableButton(this.$launch);
               		utils.disableButton(this.$shutdown);
                	this.$dropdownMenu.addClass('disabled');
                }

            } else {
                utils.disableButton(this.$launch);
                utils.disableButton(this.$shutdown);
                this.$dropdownMenu.addClass('disabled');
            }
            this.$groupFilter.select2();
        },

        renderTable: function() {
            this.$renderedTable = this.$dataTable.dataTable({
                "oLanguage": {
                  "sEmptyTable": "没有云主机"
                },
                "iDisplayLength": 25,
                "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "全部"]]
            });
            var $countFilter = this.$renderedTable.parent().find('select');
            var $searchFilter = this.$renderedTable.parent().find('input[type=text]');
            $countFilter.addClass('form-control').select2();
            $searchFilter.addClass('form-control').attr('placeholder', '快速查找...');
        },
		//修改主机名称
		editname: function(e) {
			var cur = this.$selectedRow;
            e.preventDefault();e.stopPropagation();

            var $target = $(e.currentTarget);
            if($target.hasClass('disabled')) {
                return;
            }
			 e.preventDefault();e.stopPropagation();
            var self = this;
            var $target = $(e.currentTarget).parent();
            if ($target.hasClass('disabled')) {
                return;
            }
			bootbox.prompt('请输入新的主机名称,长度小于8个字符', function(res) {
				//var cur = this.$selectedRow;
				if(res==null){
					
				}else{
					if(res==''){
						 bootbox.alert('主机名称不能为空');
						 return false;
					}
					if(res.length>8){
						 bootbox.alert('主机名称不能大于8个字符');
						 return false;
					}
					self.detail();
					var data= {
						'newName':res,
						'volumeId':cur.find('input').attr('data-ebsId'),
						'zoneId':self.$diskInfo.ebsZoneId,
						'accountId':cur.find('input').attr('data-accountId'),
						'userId':cur.find('input').attr('data-userId'),
						'accountType':cur.find('input').attr('data-accountType'),
					};
					var req = $.ajax({
						url: baseurl+'control/disk_update_name/',
						data: data,
						type: 'POST'
					 });
					req.done(function(data) {
						if(data=='ok'){
							bootbox.alert('磁盘名称修改成功',function(){
								cur.find('td.name').html(res);
							});
						}
					});

				}
			});
        },

        detail:function(cur){
        	var self = this;
			var cur = cur?cur:this.$selectedRow;
			
        	self.$diskInfo = null;
        	var data= {
					'diskId':cur.find('input').attr('data-ebsId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
				};
				var req = $.ajax({
					url: baseurl+'control/storagedetail/',
					data: data,
					dataType: 'json',
					async: false,
					type: 'POST'
		         });

				req.done(function(data) {
					self.$diskInfo = data;
					
				});
        },

        diskVm:function(){
        	var self = this;
        	var cur = this.$selectedRow;
        	self.$vmlist = null;
        	var data= {
					'zoneId':self.$diskInfo.ebsZoneId,
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
				};
				var req = $.ajax({
					url: baseurl+'control/disk_vms/',
					data: data,
					async: false,
					type: 'POST'
		         });

				req.done(function(data) {
					self.$vmlist = data;
					
				});
        },
        // 挂载
        bind: function(e) {
            e.preventDefault();e.stopPropagation();
        	this.detail();
        	if(this.$diskInfo!=null){
        		this.diskVm();
        		$('#vms').html(this.$vmlist);
        		$('#zoneName').html(this.$diskInfo.ebsZoneName);
        	}
            var $target = $(e.currentTarget);
            if($target.hasClass('disabled')) {
                return;
            }
            $('#bind').modal();
            $('#bind').find('#bindBtn').off('click').on('click',$.proxy(this.doBind, this));
        },

        doBind: function() {
        		var vmStatus = $('#vms').find('option:selected').attr('status');
        		var vmId = $('#vms').val();

        		if(vmStatus=='3333'){
	        		bootbox.alert('此云主机已经过期，请先进行续订，续订后再进行挂载！');
	                return false;
                }
				var cur = this.$selectedRow;
				var self = this;
                var data= {
					'vmId':vmId,
					'diskId':cur.find('input').attr('data-ebsId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
				};
				var req = $.ajax({
					url: baseurl+'control/mount_vms/',
					data: data,
					dataType: 'json',
					type: 'POST'
		         });

				req.done(function(data) {
					if(data.status==false){
						bootbox.alert(data.msg);
					}else{
						cur.find('div[data-type=status] font').html(data.ebsStatus);
						cur.find('div[data-type=status] img').show();
						cur.find('div[data-type=status]').attr('data-status',data.status);
						self.initToolbar();
						$('#bind').modal('hide');
						Disk.checkVMStatus(cur);
					}
				});
            //
        },

        // 卸载
        unbind: function(e) {
            e.preventDefault();e.stopPropagation();
            var self = this;
            var $target = $(e.currentTarget);
            if ($target.hasClass('disabled')) {
                return;
            }
            bootbox.confirm('确定要卸载磁盘吗？', $.proxy(self.doUnbind, self));
        },

        doUnbind: function(confirm) {
            if (confirm) {
            	this.detail();
            	if(this.$diskInfo.isSysVolume=='1'){
            		bootbox.alert('系统磁盘不能进行卸载操作！');
            		return true;
            	}
        		var vmId = this.$diskInfo.vmId;
				var cur = this.$selectedRow;
				var self = this;
                var data= {
					'diskId':cur.find('input').attr('data-ebsId'),
					'vmId':vmId,
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
				};
				var req = $.ajax({
					url: baseurl+'control/unmount_vms/',
					data: data,
					dataType: 'json',
					type: 'POST'
		         });

				req.done(function(data) {
					if(data.status==false){
						bootbox.alert(data.msg);
					}else{
						cur.find('div[data-type=status] font').html(data.ebsStatus);
						cur.find('div[data-type=status] img').show();
						cur.find('div[data-type=status]').attr('data-status',data.status);
						self.initToolbar();
						Disk.checkVMStatus(cur);
					}
				});
            }
        },

        renewPrice: function(){
        	var self = this;
        	var cur = this.$selectedRow;
            var data= {
					'resource_id':cur.find('input').attr('data-ebsId'),
					'data_center':this.$diskInfo.ebsZoneId,
					'renew_period_num':$('#period_num').val(),
					'renew_period':$('#period').val(),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
			};

			var req = $.ajax({
					url: baseurl+'order/ajax_update_renew_ebs_price/',
					data: data,
					async: false,
					dataType: 'json',
					type: 'POST'
		         });
			req.done(function(data) {
				$('#renewdate').val(self.addByTransDate(data.expire_time_txt,$('#period_num').val(),$('#period').val()));
				//$('.text-danger').html(data.renew_price+' 元');
			});

        },
        // 续订
        renew: function(e) {

            e.preventDefault();e.stopPropagation();
            var self = this;
            var $target = $(e.currentTarget).parent();
            if ($target.hasClass('disabled')) {
                return;
            }
            this.detail();

			var period = new Period();
			$('.period').html(period.render().el).on('change','#period_num',function(){
				self.renewPrice();
			});
			period.getPrice = function(){
				self.renewPrice();
			}
		    if(this.$diskInfo!=null){
        		this.renewPrice();
        	}
			$('#renew_ebsId').val(this.$diskInfo.ebsId);
			$('#renew_ebsSize').html(this.$diskInfo.ebsSize+" GB");
			$('#renewDisk').modal();
			$('#renewDisk').find('#renewDiskBtn').off('click').on('click',$.proxy(self.doRenew, self));
			
        },

		doRenew: function() {
            var cur = this.$selectedRow;
            var zoneId = this.$diskInfo.ebsZoneId;
            var data= {
					'resource_id':cur.find('input').attr('data-ebsId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
					'data_center':zoneId,
					'renew_period_num':$('#period_num').val(),
					'renew_period':$('#period').val(),
					'agencyAccountId':cur.find('input').attr('data-agencyAccountId'),
					'agencyUserId':cur.find('input').attr('data-agencyUserId'),
			};
			var req = $.ajax({
					url: baseurl+'order/ajax_renew_ebs/',
					data: data,
					dataType: 'json',
					type: 'POST'
		         });
				req.done(function(data) {
					$('#renewDisk').modal('hide');
					if(data.status==true)
					{
						bootbox.alert(data.msg);
					}else{
						bootbox.alert(data.msg);
					}

			});

        },


        // 退订
        unsubscribe: function(e) {
            e.preventDefault();e.stopPropagation();
            var self = this;
            var $target = $(e.currentTarget).parent();
            if ($target.hasClass('disabled')) {
                return;
            }
            if(this.$selectedRow.find('div[data-type=status]').attr('data-status')!='unbind'){
            	bootbox.alert('请卸载云磁盘，再进行退订！');
            	return false;
            }
            bootbox.confirm('确定退订吗？', $.proxy(self.doUnsubscribe, self));
        },

        doUnsubscribe: function(confirm) {
            if (confirm) {
                var cur = this.$selectedRow;
				if(cur.find('div[data-type=status]').attr('data-status')=='3333')
				{	bootbox.alert('云磁盘已过期不能退订！');
					return false;
				}

				var data= {
						'resourceId':cur.find('input').attr('data-ebsId'),
						'accountId':cur.find('input').attr('data-accountId'),
						'userId':cur.find('input').attr('data-userId'),
						'accountType':cur.find('input').attr('data-accountType'),
						'agencyAccountId':cur.find('input').attr('data-agencyAccountId'),
						'agencyUserId':cur.find('input').attr('data-agencyUserId'),

				};

				var req = $.ajax({
						url: baseurl+'order/ajax_unsubscribe_ebs/',
						data: data,
						type: 'POST'
					 });

				req.done(function(data) {

					switch(data){

						case '0':
							bootbox.alert('当前订单尚未处理完成，请稍后再试！');

							break;
						case '1':
							bootbox.alert('退订申请已提交，等待管理员审核！');

							break;
						case '2':
							bootbox.alert('续订后的云磁盘不能退订！');

							break;
					}
					$('#renewVms').modal('hide');

				});

            }
        },

 
        groupFilter: function(e) {
            e.stopPropagation();
            var $target = $(e.currentTarget);
            if ($target.val() === '0') {
                return;
            } else {
                this.$renderedTable.fnFilter($target.find('option:selected').text());
            }
        },

        selectOne: function(e) {
            e.stopPropagation();
            var $target = $(e.target).closest('tr');
            if ($target.parent().is('thead')) {
                this.$selectedRow = null;
                return;
            }
            if ($target.hasClass('active')) {
                $target.removeClass('active');
                $target.find('input[type=checkbox]').prop('checked', false);
                this.$selectedRow = null;
            } else {

                this.$trs.removeClass('active').find('input[type=checkbox]').prop('checked', false);
                $target.addClass('active');
                $target.find('input[type=checkbox]').prop('checked', true);
                this.$selectedRow = $target;
            }

            this.initToolbar();
        },

        editVirtualName: function(e) {
            e.stopPropagation();
            var $target = $(e.currentTarget);
            $target.editable('/main/admin_console/show_vms/editname', {
                'submitdata': function(value) {
                    console.log(value)
                },
                'height': '14px',
                'width': '100%'
            })
        },

        // 显示所选磁盘详情
        showDetail: function(e) {
			e.stopPropagation(); e.preventDefault();
			var $dataEl = $(e.currentTarget).closest('tr');
			this.$diskInfo = null;
			this.detail($dataEl);
			if(this.$diskInfo!=null){
				var template = $('#showDetailTpl').html();
				var compiled = _.template(template, this.$diskInfo);
				$('#showDetail').find('.modal-body').html(compiled);
				$('#showDetail').modal();
			}
        },

		addByTransDate: function(dateParameter, num,type) {
			
			translateDate = dateParameter.replace("年", "/").replace("月", "/").replace("日", "");
			yearString = translateDate.split("/")[0];
			monthString = translateDate.split("/")[1];
			dayString = translateDate.split("/")[2].substring(0,2);
			var a = {
				'normal':[0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
				'leap':[0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
			};
			goalyear = type=='year'?parseInt(yearString,10) + parseInt(num):parseInt(yearString,10);
			goalmonth = type=='month'?parseInt(monthString,10) + parseInt(num):parseInt(monthString,10);
			dayString = type=='day'?parseInt(dayString,10) + parseInt(num):parseInt(dayString,10);
			if ((goalyear - 2000) % 4 == 0) {
				arrayyear = 'leap';
			}
			else {
				arrayyear = 'normal';
			}
			if (goalmonth > 12) {
				goalyear = goalyear + 1;
				goalmonth = goalmonth - 12;
			}
			if (dayString > a[arrayyear][goalmonth]) {
				if(type=='day'){
					dayString = dayString-a[arrayyear][goalmonth];
					goalmonth = goalmonth + 1;
				}else{
					dayString = a[arrayyear][goalmonth]
				}
			}

			if (goalmonth > 12 ) {
				goalyear = goalyear + 1;
				goalmonth = goalmonth - 12;
			}
			

			//如果月份长度少于2，则前加 0 补位
			if (goalmonth < 10) {
				monthString = 0 + "" + goalmonth;
			}
			else {
				monthString = "" + goalmonth;
			}

			//如果天数长度少于2，则前加 0 补位
			if (dayString < 10) {
				dayString = 0 + "" + dayString;
			}
			else {
				dayString = "" + dayString;
			}

			dateString = goalyear + "年" + monthString + "月" + dayString + "日";

			return dateString;
        }
    };

    return Disk;
});
