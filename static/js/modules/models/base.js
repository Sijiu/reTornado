define(function(require, module, exports) {

    var Backbone = require('backbone'),
        _ = require('underscore'),
        Request = require('./request');

    var BaseModel = Request.extend({

        fetch: function(opts) {
            var self = this;
            var req = new Request();
            var params = _.extend({foo:'bar'}, opts);

            this.trigger('request', this);

            req.save(params).done(function(r) {
                if (JSON.parse(r)['login']) {
                    location.href = '/main/admin_console/';
                } else {
                    cfm = new Confirm({
                        type: 'error',
                        message: r.message
                    });
                }
            });
        }

    });

    return BaseModel;
})