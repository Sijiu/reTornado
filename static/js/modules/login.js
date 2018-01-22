define(function(require, module, exports) {

    var _  = require('underscore'),
        serialize = require('serialize'),
        Model = require('./models/login'),
        View = require('./views/base'),
        utils = require('utils'),
        cookie = require('cookie');

    var Login = View.extend({

        events: {
            'click input[type=submit]': 'submit'
        },

        initialize: function(options) {
            _.bindAll(this);
            this.model = new Model();
            this.bindValidation();
        },

        showError: function(err_msg) {
            return this.$error.html(err_msg);
        },

        render: function() {
            this.$form = this.$el.find('form');
            this.$error = this.$el.find('.item-error');
            this.$submitBtn = this.$el.find('input[type=submit]');
            return this;
        },

        submit: function(e) {
            e.preventDefault();
            utils.disableButton(this.$submitBtn);
            this.$error.hide();
            var attrs = serialize(this.$form);
            this.model.save(attrs, {
                success: this.successHandler,
                error: this.errorHandler
            });

        },

        successHandler: function(model, resp, opts) {
            if (resp.result == "login success") {
                window.location.href = "/";
            }else {
                var err_msg = resp.msg;
                this.showError(err_msg).show();
                if(resp['imageCode']){
                    document.getElementById("codeImage").src=baseurl+"verifycode/codeimage?"+parseInt(Math.random()*10000);
                    document.getElementById("yzm").style.display="block"
                }else{
                    document.getElementById("yzm").style.display="none"

                }
            }
            utils.enableButton(this.$submitBtn);
        },

        errorHandler: function(model, xhr, opts) {
            console.log('just error');
            this.showError(xhr.responseText).show();
            utils.enableButton(this.$submitBtn);
        }
    });

    return Login;
}); // seajs wrapper