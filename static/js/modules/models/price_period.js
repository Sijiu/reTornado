/**
 * Created by Marshall on 14-4-16.
 */
define(function(require, module, exports) {

    var _ = require('underscore'),
        Base = require('./base');

    var Period = Base.extend({

        defaults: {
            period: [{
                type: 'day',
                name: '按天',
                value: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29]
            }, {
                type: 'month',
                name: '按月',
                value: [1,2,3,4,5,6,7,8,9]
            }, {
                type: 'year',
                name: '按年',
                value: [1,2,3]
            }],

            selected_period_type: 'month'
        }
    });

    return Period;
});