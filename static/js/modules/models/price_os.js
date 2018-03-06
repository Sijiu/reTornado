/**
 * Created by Marshall on 14-4-16.
 */
define(function(require, module, exports) {

    var Base = require('./base'),
        _ = require('underscore');

    var OS = Base.extend({

        defaults: {
            os: [{
                name: 'Ubuntu 12.04 /64位',
                value: 1
            }, {
                name: 'CentOS 5.10 /64位',
                value: 2
            }, {
                name: 'CentOS 6.4 /64位',
                value: 3
            }, {
                name: 'Windows 2003 SP2/32位',
                value: 4
            }, {
                name: 'Windows 2008 R2/64位',
                value: 5
            }, {
                name: 'CentOS 6.4 /32位',
                value: 7
            }, {
                name: 'Debian 7/64位',
                value: 8
            }]
        }
    });

    return OS;
})