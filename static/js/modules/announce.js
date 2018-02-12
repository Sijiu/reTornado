/**
 * Created by Marshall on 14-4-17.
 */
define(function(require, module, exports) {

    var $ = require('jquery');
	var bootbox = require('bootbox');

    var Announce = function(el,list) {

        this.$el = el;
        this.$title = this.$el.find('#title');
        this.$content = this.$el.find('#content');
		this.$action = this.$el.attr('action');
		this.$list = list;

        this.init();
    };

    Announce.prototype = {
        constructor: Announce,

        init: function() {
            this.$el.on('submit', $.proxy(this.submit, this));
			this.del();
        },
		
		validate: function(data){
		
		},

		del: function(){
		
			this.$list.on("click",".delanno",function(){
	
				var item = $(this);
				bootbox.confirm('确定要删除词条公告么？',function(confirm){
				if(confirm){
					var req = $.ajax({
						url: '/main/delannounce/',
						data: { id:item.attr('data-annoid'), },
						type: 'POST'
						 });
					req.done(function(data) {
						
						var data = eval('('+data+')');
						if(data.return=='true')
						{
							bootbox.alert('公告删除成功!');
							item.parents('tr').remove();
						}
					});
					req.fail(function(error) {});
				}});
			});
		},

        submit: function(e) {				
            e.preventDefault();
			
            var self = this;
            var params = {
                title: self.$title.val(),
                content: self.$content.val()
            }

			this.validate(params);

            var req = $.ajax({
                url: self.$action,
                data: params,
                type: 'POST'
            });

            req.done(function(data) {
				if(data.status==1)
				{
					$('#myModal').modal('hide');
					document.location.reload();
				
				}else{
					bootbox.alert(data.msg);
				}
			
			});
            req.fail(function(error) {});
        },
     
    };

    return Announce;

});