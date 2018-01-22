define(function(require, module, exports) {

    var Backbone = require('backbone'),
        _ = require('underscore');

    var Data = Backbone.Model.extend({

        defaults: {},

        initialize: function(attributes, options) {
            _.bindAll(this);
            this.observer = options ? options.observer : null;
        },

        sync: function(method, model, options) {
            var type = 'POST',
                params = {
                    type: type,
                    dataType: 'json',
                    url: this.url
                };
            var data = _.extend(model.toJSON());
            //data = utils.normalize(data);
            if (this.url === '/api/') {
                params.data = {
                    'params': JSON.stringify(data)
                };
            } else {
                params.data = data;
            }

            var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
            model.trigger('request', model, xhr, options);
            return xhr;
        },

        save: function(attributes, options) {
            if (!this._validate(attributes, { validate: true })) {
                return false;
            }

            var opts = {
                success: options && options.success || this.successHandler,
                error: options && options.error || this.errorHandler
            };

            var _attributes = _.extend({}, this.defaults, attributes);
            return Backbone.Model.prototype.save.call(this, _attributes, opts);
        },

        successHandler: function(model, res, opts) {
            if (res.error_code) {
                this.failHandler(res.message);
            } else if (this.observer) {
                this.observer.trigger('action:success');
            } else {
                this.trigger('action:success');
            }
        },

        errorHandler: function(model, xhr, opts) {
            this.failHandler('系统错误');
        },

        failHandler: function(errMsg) {
            if (this.observer) {
                this.observer.trigger('action:error', errorMsg, this.observer.cid);
            } else {
                this.trigger('action:error', errMsg);
            }
        }
    });

    return Data;
})