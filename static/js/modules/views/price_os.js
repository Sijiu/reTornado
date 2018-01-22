/**
 * Created by Marshall on 14-4-16.
 */
define(function(require, module, exports) {

    var $ = require('jquery'),
        _ = require('underscore'),
        Base = require('./base'),
        Model = require('../models/price_os');

    var OS = Base.extend({
        className: 'price-os',
        template: $('#tpl_price_os').html(),

        initialize: function(opts) {
            _.bindAll(this);
            this.model = new Model();
            // this.price = opts.price;
        },

        render: function() {
            this.$el.html(_.template(this.template, this.model.toJSON()));
            return this;
        }
    });

    return OS;
});