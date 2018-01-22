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

    var Virtual = function(el) {

        this.$el = el;
        // toolbar buttons
        this.$toolbar = this.$el.find('.datatable-toolbar');
        this.$dropdownMenu = this.$toolbar.find('.dropdown-menu li').not('.divider');
		this.$editname = this.$toolbar.find('.btn-edit'); // 修改名称
        this.$launch = this.$toolbar.find('.btn-launch'); // 启动
        this.$shutdown = this.$toolbar.find('.btn-shutdown'); // 关机
        this.$reboot = this.$toolbar.find('.btn-reboot'); // 重启
        this.$reset = this.$toolbar.find('.btn-sys-reset'); // 重置
        this.$getPassword = this.$toolbar.find('.btn-get-password'); // 获取密码
        this.$resetPassword = this.$toolbar.find('.btn-reset-password'); // 重置密码
        this.$renew = this.$toolbar.find('.btn-renew'); // 续订
        this.$unsubscribe = this.$toolbar.find('.btn-unsubscribe'); // 退订
        this.$btnUpgrade = this.$toolbar.find('.btn-upgrade'); // 升级
        this.$groupFilter = this.$el.find('#groupFilter'); // 组织选择

        // dataTable controls
        this.$renderedTable = null;
        this.$selectedRow = null;
        this.dataStatus = null;
        this.$dataTable = this.$el.find('#tableSortable');
        this.$trs = this.$dataTable.find('tr');
        this.$showDetailBtn = this.$el.find('.btn-detail');
        //this.$checkall = this.$dataTable.find('input[type=checkbox]#check_all'); 不需要多选功能

        this.init();
    };

	 Virtual.checkVMStatus = function(cur){

			var Timer = setTimeout(function() {

				var data= {
					'vmId':cur.find('input').attr('data-vmId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
				};

				var req = $.ajax({
					url: baseurl+'control/selectstatusnow/',
					data: data,
					type: 'POST'
		         });
				req.done(function(data) {
					var data = eval('('+data+')');
					if(data.status=='stopped' || data.status=='running')
					{
						cur.find('div[data-type=status] font').html(data.vmStatus);
						cur.find('div[data-type=status]').attr('data-status',data.status);
						cur.find('div[data-type=status] img').hide();
						

					}else{

						window.setTimeout(function(){Virtual.checkVMStatus(cur)},3000);

					}
				});

			},10000);
	};

    Virtual.prototype = {
        constructor: Virtual,

        init: function() {

            // toolbar event listeners
			this.$editname.on('click', $.proxy(this.editname, this));
            this.$launch.on('click', $.proxy(this.launch, this));
            this.$shutdown.on('click', $.proxy(this.shutdown, this));
            this.$reboot.on('click', $.proxy(this.reboot, this));
            this.$reset.on('click', $.proxy(this.reset, this));
            this.$getPassword.on('click', $.proxy(this.getPassword, this));
            this.$resetPassword.on('click', $.proxy(this.resetPassword, this));
            this.$renew.on('click', $.proxy(this.renew, this));
            this.$unsubscribe.on('click', $.proxy(this.unsubscribe, this));
            this.$btnUpgrade.on('click', $.proxy(this.upgrade, this));
            this.$groupFilter.on('change', $.proxy(this.groupFilter, this));

            // table event listeners
            this.$dataTable.on('click', this.$trs, $.proxy(this.selectOne, this));
            this.$dataTable.on('click', '.editable-virtual-name', $.proxy(this.editVirtualName, this));
            this.$showDetailBtn.on('click', $.proxy(this.showDetail, this));

            this.initToolbar();
            this.renderTable();
			this.proceeding();
			this.duedate();
        },

		proceeding: function(){
			this.$dataTable.find('div[data-type=status]').each(function(){
				if($(this).attr('data-status')!='running' && $(this).attr('data-status')!='stopped'){
					 Virtual.checkVMStatus($(this).parents('tr'));
				}

			});

		},

        initToolbar: function() {

            if (this.$selectedRow) {
                this.dataStatus = this.$selectedRow.find('div[data-type=status]').attr('data-status');
				 utils.disableButton(this.$launch);
                 utils.disableButton(this.$shutdown);

                if (this.dataStatus === 'running') {
                    utils.disableButton(this.$launch);
                    utils.enableButton(this.$shutdown);
                }
                if (this.dataStatus === 'stopped') {
                    utils.enableButton(this.$launch);
                    utils.disableButton(this.$shutdown);
                }

                this.$dropdownMenu.removeClass('disabled');
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
					if(res.length>10){
						 bootbox.alert('主机名称不能大于10个字符');
						 return false;
					}
					var data= {
						'vmName':res,
						'vmId':cur.find('input').attr('data-vmId'),
						'accountId':cur.find('input').attr('data-accountId'),
						'userId':cur.find('input').attr('data-userId'),
						'accountType':cur.find('input').attr('data-accountType'),
					};
					var req = $.ajax({
						url: baseurl+'control/vmupdatename/',
						data: data,
						type: 'POST'
					 });
					req.done(function(data) {
						if(data=='ok'){
							bootbox.alert('主机名称修改成功',function(){
								cur.find('td.name').html(res);
							});
						}
					});

				}
			});
        },
		doEditName: function() {
				var cur = this.$selectedRow;
				var self = this;
                var data= {
					'vmName':$(''),
					'vmId':cur.find('input').attr('data-vmId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
				};
				var req = $.ajax({
					url: baseurl+'control/vmupdatename/',
					data: data,
					type: 'POST'
		         });

				req.done(function(data) {
					var data = eval('('+data+')');
					cur.find('div[data-type=status] font').html(data.vmStatus);
					cur.find('div[data-type=status] img').show();
					cur.find('div[data-type=status]').attr('data-status',data.status);
					self.initToolbar();
					Virtual.checkVMStatus(cur);

				});
            //
        },
        // 开机
        launch: function(e) {
            e.preventDefault();e.stopPropagation();

            var $target = $(e.currentTarget);
            if($target.hasClass('disabled')) {
                return;
            }
            this.doLaunch();
        },

        doLaunch: function() {
				var cur = this.$selectedRow;
				var self = this;
                var data= {
					'vmId':cur.find('input').attr('data-vmId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
				};
				var req = $.ajax({
					url: baseurl+'control/starting/',
					data: data,
					type: 'POST'
		         });

				req.done(function(data) {
					var data = eval('('+data+')');
					cur.find('div[data-type=status] font').html(data.vmStatus);
					cur.find('div[data-type=status] img').show();
					cur.find('div[data-type=status]').attr('data-status',data.status);
					self.initToolbar();
					Virtual.checkVMStatus(cur);

				});
            //
        },

        // 关机
        shutdown: function(e) {
            e.preventDefault();e.stopPropagation();
            var self = this;
            var $target = $(e.currentTarget);
            if ($target.hasClass('disabled')) {
                return;
            }
            bootbox.confirm('确定关机吗？', $.proxy(self.doShutdown, self));
        },

        doShutdown: function(confirm) {

            if (confirm) {
				var cur = this.$selectedRow;
				var self = this;
                var data= {
					'vmId':cur.find('input').attr('data-vmId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
				};
				var req = $.ajax({
					url: baseurl+'control/stopvm/',
					data: data,
					type: 'POST'
		         });

				req.done(function(data) {
					var data = eval('('+data+')');
					cur.find('div[data-type=status] font').html(data.vmStatus);
					cur.find('div[data-type=status] img').show();
					cur.find('div[data-type=status]').attr('data-status',data.status);
					self.initToolbar();
					 Virtual.checkVMStatus(cur);
				});
            }
        },

        // 重启
        reboot: function(e) {
            e.preventDefault();e.stopPropagation();
            var self = this;
            var $target = $(e.currentTarget).parent();
            if ($target.hasClass('disabled')) {
                return;
            }
            bootbox.confirm('确定重启吗？', $.proxy(self.doReboot, self));
        },

        doReboot: function(confirm) {
            if (confirm) {
				var self = this;
				var cur = this.$selectedRow;
                var data= {
					'vmId':cur.find('input').attr('data-vmId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
				};
				var req = $.ajax({
					url: baseurl+'control/restartingvm/',
					data: data,
					type: 'POST'
		         });

				req.done(function(data) {
					var data = eval('('+data+')');
					cur.find('div[data-type=status] font').html(data.vmStatus);
					cur.find('div[data-type=status] img').show();
					cur.find('div[data-type=status]').attr('data-status',data.status);
					self.initToolbar();
					 Virtual.checkVMStatus(cur);
				});

            }
        },

        // 重置
        reset: function(e) {
            e.preventDefault();e.stopPropagation();
            var self = this;
            var $target = $(e.currentTarget).parent();
            if ($target.hasClass('disabled')) {
                return;
            }
			var cur = this.$selectedRow;
            var data= {
					'vmId':cur.find('input').attr('data-vmId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
			};
			var req = $.ajax({
					url: baseurl+'control/getvminfo/',
					data: data,
					type: 'POST'
		         });

			req.done(function(data) {
					var data = eval('('+data+')');
					$('#reinstallVms').find('input[name=vms_name]').val(data.vmName);

					$('#reinstallVms').find('.dl-horizontal.pz').html('<dt>硬件配置</dt><dd>CPU'+data.offerCpuNum+'核/内存'+data.offerMem+'GB/系统盘'+data.ebsSize+'GB</dd><dt>系统</dt><dd>'+data.osStyle+'位</dd>');
					$('#reinstallVms').find('.ip-external').html(data.privateIp);
					$('#reinstallVms').find('.ip-internal').html(data.publicIP);
					$('#reinstallVms').modal();
					$('#reinstallVms').find('#reinstallBtn').off('click').on('click',$.proxy(self.doReset, self));
				});

        },

        doReset: function() {
				var self = this;
				var cur = this.$selectedRow;
                var data= {
					'vmId':cur.find('input').attr('data-vmId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
					'newstyle':$('#reinstallOS').val(),
				};
				var req = $.ajax({
					url: baseurl+'control/oneresinstall/',
					data: data,
					type: 'POST'
		         });

				req.done(function(data) {
					if(data=='no'){bootbox.alert('请确保主机关闭或运行中！');}
					var data = eval('('+data+')');
					cur.find('div[data-type=status] font').html(data.vmStatus);
					cur.find('div[data-type=status] img').show();
					cur.find('div[data-type=status]').attr('data-status',data.status);
					$('#reinstallVms').modal('hide');
					self.initToolbar();
					 Virtual.checkVMStatus(cur);
				});
		},

        // 获取密码
        getPassword: function(e) {
            e.preventDefault();e.stopPropagation();
            var self = this;
            var $target = $(e.currentTarget).parent();
            if ($target.hasClass('disabled')) {
                return;
            }

				var cur = this.$selectedRow;
				var data= {
					'vmId':cur.find('input').attr('data-vmId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
				};
				var req = $.ajax({
					url: baseurl+'control/selectpasword/',
					data: data,
					type: 'POST'
		         });

				req.done(function(data) {
					 bootbox.alert('该主机密码是：'+data);
				});


        },

        // 重置密码
        resetPassword: function(e) {
            e.preventDefault();e.stopPropagation();
            var self = this;
            var $target = $(e.currentTarget).parent();
            if ($target.hasClass('disabled')) {
                return;
            }
			bootbox.confirm('确定将主机重置密码吗？', $.proxy(self.doResetPassword, self));
        },

        doResetPassword: function(confirm) {
		if (confirm) {
				var self = this;
				var cur = this.$selectedRow;
                var data= {
					'vmId':cur.find('input').attr('data-vmId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
				};
				var req = $.ajax({
					url: baseurl+'control/uppasword/',
					data: data,
					type: 'POST'
		         });

				req.done(function(data) {
					if(data=='no'){bootbox.alert('请先关闭主机！');}
					var data = eval('('+data+')');
					cur.find('div[data-type=status] font').html(data.vmStatus);
					cur.find('div[data-type=status] img').show();
					cur.find('div[data-type=status]').attr('data-status',data.status);
					 Virtual.checkVMStatus(cur);
				});

            }
		},


		//查询续订价格
        renewPrice: function(){
        	var self = this;
        	var cur = this.$selectedRow;
            var data= {
					'id':cur.find('input').attr('data-vmId'),
					'cycle_cnt':$('#period_num').val(),
					'type':$('#period').val(),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
			};
	
			var req = $.ajax({
					url: baseurl+'order/ajax_get_xuding_price/',
					data: data,
					async: false,
					dataType: 'json',
					type: 'POST'
		         });
			req.done(function(data) {
				$('#renewdate').val(self.addByTransDate(self.$vmInfo.dueDate,$('#period_num').val(),$('#period').val()));
				$('.text-danger').html(data.toFixed(2)+' 元');
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

			var cur = this.$selectedRow;
            var data= {
					'vmId':cur.find('input').attr('data-vmId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
			};

			var req = $.ajax({
					url: baseurl+'control/getvminfo/',
					data: data,
					type: 'POST'
		         });
			req.done(function(data) {
					var data = eval('('+data+')');
					$('#renewVms').find('input[name=vms_name]').val(data.vmName);

					$('#renewVms').find('.dl-horizontal.pz').html('<dt>硬件配置</dt><dd>CPU'+data.offerCpuNum+'核/内存'+data.offerMem+'GB/系统盘'+data.ebsSize+'GB</dd><dt>系统</dt><dd>'+data.osStyle+'位</dd>');
					//$('#renewVms').find('.dl-horizontal.price').html('<dt>价格</dt><dd>129元</dd><dt>到期时间</dt><dd>2014年8月8日 02:17:19</dd>');

					$('#renewVms').find('.ip-external').html(data.privateIp);
					$('#renewVms').find('.ip-internal').html(data.publicIP);				
					
					var period = new Period();self.$vmInfo = data;
					$('.period').html(period.render().el).on('change','#period_num',function(){
						self.renewPrice();
					});
					period.getPrice = function(){
						self.renewPrice();
					}
					self.renewPrice();
					
					$('#renewVms').modal();
					$('#renewVms').find('#renewVmsBtn').off('click').on('click',$.proxy(self.doRenew, self));
				});

        },

		 doRenew: function() {
            var cur = this.$selectedRow;
            var data= {
					'id':cur.find('input').attr('data-vmId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
					'type':$('#renewVms').find('select[name=period]').val(),
					'cycle_cnt':$('#renewVms').find('select[name=period_num]').val(),
					'agencyAccountId':cur.find('input').attr('data-agencyAccountId'),
					'agencyUserId':cur.find('input').attr('data-agencyUserId'),
			};

			var req = $.ajax({
					url: baseurl+'control/renewvm/',
					data: data,
					type: 'POST'
		         });
				req.done(function(data) {
					$('#renewVms').modal('hide');
					if(data=='1')
					{
						bootbox.alert('续订成功，等待处理！');
					}else{
						bootbox.alert('申请尚未处理！');
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
            bootbox.confirm('确定退订吗？', $.proxy(self.doUnsubscribe, self));
        },

        doUnsubscribe: function(confirm) {
            if (confirm) {


                var cur = this.$selectedRow;
				if(cur.find('div[data-type=status]').attr('data-status')=='dueed')
				{	bootbox.alert('主机已过期不能退订！');
					return false;
				}

				if(cur.find('div[data-type=status]').attr('data-status')=='updateserviceoffering')
				{	bootbox.alert('云主机正在升级，请稍后再试！');
					return false;
				}

				var data= {
						'id':cur.find('input').attr('data-vmId'),
						'accountId':cur.find('input').attr('data-accountId'),
						'userId':cur.find('input').attr('data-userId'),
						'accountType':cur.find('input').attr('data-accountType'),
						'agencyAccountId':cur.find('input').attr('data-agencyAccountId'),
						'agencyUserId':cur.find('input').attr('data-agencyUserId'),

				};

				var req = $.ajax({
						url: baseurl+'control/Unsubscribe/',
						data: data,
						type: 'POST'
					 });

				req.done(function(data) {

					switch(data){

						case '0':
							bootbox.alert('云主机订单异常不能退订！');

							break;
						case '1':
							bootbox.alert('退订成功！');

							break;
						case 'no':
							bootbox.alert('退订已提交，等待处理！');

							break;
					}
					$('#renewVms').modal('hide');

				});

            }
        },
	
		upgradePrice: function(e){
			var self = this;
        	var cur = this.$selectedRow;
            var data= {
					'upgrade_cpu':$('#upgradeVms').find('#cpu').val(),
					'upgrade_memory':$('#upgradeVms').find('#mem').val(),
					'os_type':self.$vmInfo.osStyle,
					'rootDiskSize':self.$vmInfo.ebsSize,
					'zone_id':self.$vmInfo.cloudStackZoneId,
					'resourceId':cur.find('input').attr('data-vmId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
			};
	
			var req = $.ajax({
					url: baseurl+'order/ajax_upgrade_vm_price/',
					data: data,
					async: false,
					dataType: 'json',
					type: 'POST'
		         });
			req.done(function(data) {
				$('.text-danger').html(data.toFixed(2)+' 元');
			});
		},

        // 升级
        upgrade: function(e) {
            e.preventDefault();e.stopPropagation();
            var self = this;
            var $target = $(e.currentTarget).parent();
            if ($target.hasClass('disabled')) {
                return;
            }
			var cur = this.$selectedRow;


			if(cur.find('div[data-type=status]').attr('data-status')!='stopped')
			{
				bootbox.alert('请先将云主机停止后再进行升级！');
					return false;
			}

            var data= {
					'vmId':cur.find('input').attr('data-vmId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
			};

			var req = $.ajax({
					url: baseurl+'control/getvminfo/',
					data: data,
					type: 'POST'
		         });
			req.done(function(data) {
					var data = eval('('+data+')');
					var cpulist=[1,2,4,6,8];
					var nextcpu=[2,4,6,8,12]
					var memlist={1:[1,2],2:[2,4,6,8],4:[4,6,8],6:[6,8],8:[16]}
					$('#cpu').html('');
					if(data.offerCpuNum==8){
                        bootbox.alert('主机已经是最高配置无法升级');
                        return false;
					}
					for(cpu in cpulist){
						scpu=nextcpu[cpu];
						if(scpu==12){
		                        continue; 
						}
						if(cpulist[cpu]==data.offerCpuNum ){
							$('#cpu').append('<option value="'+scpu+'" selected>'+scpu+' 核</option>');
							$('#mem').html('');
							for(mem in memlist[scpu]){
								if(memlist[scpu][mem]>=data.offerMem){
									$('#mem').append('<option value="'+memlist[scpu][mem]+'">'+memlist[scpu][mem]+' G</option>');
								}
							}
						}else if(cpulist[cpu]>data.offerCpuNum){
							$('#cpu').append('<option value="'+scpu+'" >'+scpu+' 核</option>');
						}
					}
					$('#cpu').on('change',function(){
						var scpu=$('#cpu').val();
						$('#mem').html('');
						for(mem in memlist[scpu]){
							if(memlist[scpu][mem]>=$('#memi').html()){
								$('#mem').append('<option value="'+memlist[scpu][mem]+'">'+memlist[scpu][mem]+' G</option>');
							}
						}
					});
					$('#upgradeVms').find('input[name=vms_name]').val(data.vmName);
					self.$vmInfo = data;
					self.upgradePrice();
					$('#upgradeVms').find('#cpu').on('change',$.proxy(self.upgradePrice, self));
					$('#upgradeVms').find('#mem').on('change',$.proxy(self.upgradePrice, self));

					$('#upgradeVms').find('.dl-horizontal.pz').html('<dt>硬件配置</dt><dd>CPU'+data.offerCpuNum+'核/内存<span id="memi">'+data.offerMem+'</span>GB/系统盘'+data.ebsSize+'GB</dd><dt>系统环境</dt><dd>'+data.osStyle+'位</dd>');
					$('#upgradeVms').modal();
					$('#upgradeVms').find('#updateVmsBtn').off('click').on('click',$.proxy(self.doUpgrade, self));
				});
        },

		doUpgrade: function(){
	        var cur = this.$selectedRow;

            var data= {
					'id':cur.find('input').attr('data-vmId'),
					'accountId':cur.find('input').attr('data-accountId'),
					'userId':cur.find('input').attr('data-userId'),
					'accountType':cur.find('input').attr('data-accountType'),
					'agencyAccountId':cur.find('input').attr('data-agencyAccountId'),
					'agencyUserId':cur.find('input').attr('data-agencyUserId'),
					'mem':$('#upgradeVms').find('select[name=mem]').val(),
					'cpu':$('#upgradeVms').find('select[name=cpu]').val(),
					'description':$('#upgradeVms').find('textarea[name=description]').val(),
					'attach_id':$('#upgradeVms').find('input[name=attach_id]').val(),
			};

			var req = $.ajax({
					url: baseurl+'control/upgradevm/',
					data: data,
					type: 'POST'
		         });
				req.done(function(data) {
					$('#upgradeVms').modal('hide');
					if(data=='success')
					{
						bootbox.alert('升级申请提交成功，等待审核！');
					}else if(data=='has snapshot'){
						bootbox.alert('主机存在快照，不能进行升级！');
					}else{
						bootbox.alert('主机存在未处理完成的申请！');
					}

			});
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

        // 显示所选主机详情
        showDetail: function(e) {
          e.stopPropagation(); e.preventDefault();
          var self = this;
          var $dataEl = $(e.currentTarget).closest('tr').find('input[type=checkbox]');
		  var $displayName = $(e.currentTarget).closest('tr').find('td.displayName').html();
          var $container = $('#showDetail').find('.modal-body');
          var template = $('#showDetailTpl').html();
          var params = {
            accountId : $dataEl.data('accountid'),
            userId: $dataEl.data('userid'),
            accountType: $dataEl.data('accounttype'),
            vmId: $dataEl.data('vmid')
          };

          var req = $.ajax({
            url: baseurl + 'control/ajax_vminfo',
            type: 'POST',
            data: params
          });

          req.done(function(data) {
            data = $.parseJSON(data);
            if (data.vmStatus === 'stopped') {
              data.vmStatus = '已停止';
            }
            if (data.vmStatus === 'Running') {
              data.vmStatus = '运行中';
            }
			
            var compiled = _.template(template, data);
            $container.html(compiled);
			//self.getVmMonitor($displayName);
            $('#showDetail').modal();
          })

        },
		
		duedate: function(e){
			var self = this;
			$('#cycle_cnt').on('change',function(){
				$('#renewdate').val(self.addByTransDate($('#duedate').val(),$(this).val()));
			});
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
			goalyear = type=='year'?parseInt(yearString,10)+parseInt(num):parseInt(yearString,10);
			goalmonth = type=='month'?parseInt(monthString,10)+parseInt(num):parseInt(monthString,10);
			dayString = type=='day'?parseInt(dayString,10)+parseInt(num):parseInt(dayString,10);
		
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
        },
				//调取监控数据
		getVmMonitor: function (displayName){
			var req = $.getJSON(baseurl+"control/monitor", {'name': displayName});

            req.done(this.getVmMonitorCallback);
		},
	    getVmMonitorCallback: function(data) {

            $("#content2").modal("loading");

            if(!data){
                return false;
            }
            if (data.ret) {
                $("#content2").html('所要查看的云主机暂无数据。');
                return false;
            } else {

            var container = $('<div class="clearfix" id="containerAnalytics" />'),
                  containerCPU = $('<div class="clearfix" id="containerCPU" />'),
                  containerDisk = $('<div class="clearfix" id="containerDisk" />'),
                  containerMem = $('<div class="clearfix" id="containerMem" />'),
                  containerNet = $('<div class="clearfix" id="containerNet" />'),
                  containerCPUUsage = $('<div class="pull-left analytics-container" id="containerCPUUsage" />'),
                  containerCPUMhz = $('<div class="pull-left analytics-container" id="containerCPUMhz" />'),
                  containerDiskRead = $('<div class="pull-left analytics-container" id="containerDiskRead" />'),
                  containerDiskUsage = $('<div class="pull-left analytics-container" id="containerDiskUsage" />'),
                  containerDiskWrite = $('<div class="pull-left analytics-container" id="containerDiskWrite" />'),
                  containerMemActive = $('<div class="pull-left analytics-container" id="containerMemActive" />'),
                  containerMemUsage = $('<div class="pull-left analytics-container" id="containerMemUsage" />'),
                  containerNetPackRx = $('<div class="pull-left analytics-container" id="containerNetPackRx" />'),
                  containerNetPackTx = $('<div class="pull-left analytics-container" id="containerNetPackTx" />'),
                  containerNetReceived = $('<div class="pull-left analytics-container" id="containerNetReceived" />'),
                  containerNetUsage = $('<div class="pull-left analytics-container" id="containerNetUsage" />');
              var containerWidth = $("#content2").width();

              var precentedCPU = _.map(data['cpu.usage.average'], function(data, index) { return [data[0], data[1]]; });
              var precentedMem = _.map(data['memory.usage.average'], function(data, index) {if(data[1] >= 100){data[1] = 100;} return [data[0], data[1]]; });
              var MegaMem = _.map(data['mem.active.average'], function(data, index) { return [data[0], data[1]]; });

              var parsedCPU = [{
                  "name": "CPU 使用量（%）",
                  "data": precentedCPU
                },{
                  "name": "CPU 频率(Mhz)",
                  "data": data['cpu.usagemhz.average']
                }];
              var parsedDisk = [{
                  "name": "磁盘读取速率（KB/s）",
                  "data": data['disk.read.average']
                },{
                  "name": "磁盘读/写速率（KB/s）",
                  "data": data['disk.usage.average']
                },{
                  "name": "磁盘写入速率（KB/s）",
                  "data": data['disk.write.average']
                }];
              var parsedMem = [{
                  "name": "活动内存（MB）",
                  "data": MegaMem
                },{
                  "name": "内存使用率（%）",
                  "data": precentedMem
                }];
              var parsedNet = [{
                  "name": "接收包（个数）",
                  "data": data['net.packetsRx.summation']
                },{
                  "name": "发送包（个数）",
                  "data": data['net.packetsTx.summation']
                },{
                  "name": "网络接收速率（KB/s）",
                  "data": data['net.received.average']
                },{
                  "name": "网络传输速率（KB/s）",
                  "data": data['net.transmitted.average']
                },{
                  "name": "网络 I/O 速率（KB/s）",
                  "data": data['net.usage.average']
                }];

              $("#content2").empty();
              containerCPUUsage.appendTo(containerCPU);
              // containerCPUMhz.appendTo(containerCPU);
              // containerDiskRead.appendTo(containerDisk);
              containerMemUsage.appendTo(containerCPU);
              containerDiskUsage.appendTo(containerCPU);
              // containerDiskWrite.appendTo(containerDisk);
              // containerMemActive.appendTo(containerCPU);
              // containerNetPackRx.appendTo(containerNet);
              // containerNetPackTx.appendTo(containerNet);
              // containerNetReceived.appendTo(containerNet);
              containerNetUsage.appendTo(containerCPU);
              containerCPU.appendTo(container); containerMem.appendTo(container); containerNet.appendTo(container); containerDisk.appendTo(container);
              container.appendTo($('#content2'));
              container.css({'width': containerWidth});
              $('.analytics-container').css({'width': containerWidth, 'height': '200px', 'margin-bottom': '20px'});
              try {
                  new Chartkick.LineChart('containerCPUUsage', [parsedCPU[0]], {"library": {"colors": ["#1196a9"], 'yAxis': {'labels': {'formatter': function() { return this.value + '%'; }}}}});
                  // new Chartkick.LineChart('containerCPUMhz', [parsedCPU[1]], {"library": {"colors": ["#1196a9"], 'yAxis': {'labels': {'formatter': function() { return this.value + 'Mhz'; }}}}});
                  // new Chartkick.AreaChart('containerDiskRead', [parsedDisk[0]], {"library": {"colors": ["#fd9035"], 'yAxis': {'labels': {'formatter': function() { return this.value + 'KB/s'; }}}}});
                  new Chartkick.AreaChart('containerDiskUsage', [parsedDisk[0], parsedDisk[2]], {"library": {"colors": ["#fd9035", "#5957c7"], 'yAxis': {'labels': {'formatter': function() { return this.value + 'KB/s'; }}}}});
                  // new Chartkick.AreaChart('containerDiskWrite', [parsedDisk[2]], {"library": {"colors": ["#fd9035"], 'yAxis': {'labels': {'formatter': function() { return this.value + 'KB/s'; }}}}});
                  // new Chartkick.LineChart('containerMemActive', [parsedMem[0]], {"library": {"colors": ["#bada55"], 'yAxis': {'labels': {'formatter': function() { return this.value + 'MB'; }}}}});
                  new Chartkick.LineChart('containerMemUsage', [parsedMem[1]], {"library": {"colors": ["#bada55"], 'yAxis': {'labels': {'formatter': function() { return this.value + '%'; }}}}});
                  // new Chartkick.LineChart('containerNetPackRx', [parsedNet[0]], {"library": {"colors": ["#912cee"], 'yAxis': {'labels': {'formatter': function() { return this.value + '个'; }}}}});
                  // new Chartkick.LineChart('containerNetPackTx', [parsedNet[1]], {"library": {"colors": ["#912cee"], 'yAxis': {'labels': {'formatter': function() { return this.value + '个'; }}}}});
                  // new Chartkick.LineChart('containerNetReceived', [parsedNet[2]], {"library": {"colors": ["#912cee"], 'yAxis': {'labels': {'formatter': function() { return this.value + 'KB/s'; }}}}});
                  new Chartkick.LineChart('containerNetUsage', [parsedNet[2], parsedNet[3]], {"library": {"colors": ["#912cee", "#88bad7"], 'yAxis': {'labels': {'formatter': function() { return this.value + 'KB/s'; }}}}});
              } catch (err) {
                $("#content2").html('所要查看的云主机暂无数据。');
              }

            }
        }

    };

    return Virtual;
});
