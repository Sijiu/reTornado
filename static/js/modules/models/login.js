define(function(require, module, exports) {

    var Model = require('./base');

    var Login = Model.extend({

        url: baseurl+'login',
        method:"POST",

        validation: {
            accountName: {
                required: true,
                msg: '请输入用户名'
            },
            password: [{
                required: true,
                msg: '请输入密码'
            }, {
                fn: function(value, attr, computedState) {
                    if (value.length < 1) {
                        return '请输入密码'
                    }
                }
            }]
        }
    });

    return Login;


})