/**
 * Created by Marshall on 14-4-16.
 */
define(function(require, module, exports) {

    var $ = require('jquery'),
        _ = require('underscore'),
        Base = require('./base'),
        Model = require('../models/price_period');

    var Period = Base.extend({
        className: 'price-period',
        template: $('#tpl_price_period').html(),

        events: {
            'change #period': 'changePeriod'
        },

        initialize: function(opts) {
            _.bindAll(this);
            this.model = new Model();
            this.model.on('change', this.render);
            // this.price = opts.price;
        },

        render: function() {
            this.$el.html(_.template(this.template, this.model.toJSON()));
            return this;
        },

        changePeriod: function(e) {
            e.preventDefault();
            var $target = $(e.currentTarget);
            var type = $target.val();
            this.model.set({ selected_period_type: type });
            this.getPrice();
        },

        getPrice: function() {}
    });

    return Period;
})