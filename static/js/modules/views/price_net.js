/**
 * Created by Marshall on 14-4-16.
 */
define(function(require, module, exports) {

    var $ = require('jquery'),
        _ = require('underscore'),
        Base = require('./base'),
        slider = require('bootstrap-slider');

    var Net = Base.extend({
        className: 'price-net',
        template: $('#tpl_price_net').html(),

        events: {
            'keyup input.input-net': 'inputKeyup'
        },

        initialize: function(opts) {
            _.bindAll(this);
            // this.price = opts.price;
        },

        render: function() {
            this.$el.html(this.template);
            this.$slider = this.$el.find('input.slider-net');
            this.$input = this.$el.find('input.input-net');

            setTimeout(this.renderSlider, 50);
            return this;
        },

        inputKeyup: function() {
            this.$input.val(this.$input.val().replace(/[^\d]/, ''));
            if (this.$input.val() > 100) {
                this.$input.val(100)
            }
            this.renderInput(this.$input.val());
        },

        renderInput: function(val) {
            var value = parseInt(val);
            this.$slider.slider('setValue', value);
            this.$input.val(val);
        },

        renderSlider: function() {
            var self = this;
            this.$slider.slider({
               min: 1,
               max: 100,
               step: 1,
               value: 2,
               tooltip: 'always',
               formater: function(v) {
                   return v + ' Mbps';
               }
            }).on('slideStop', function() {
                self.renderInput(self.$slider.data('slider').getValue());
                self.getPrice();
            });
        },

        getPrice: function() {}
    });

    return Net;
});