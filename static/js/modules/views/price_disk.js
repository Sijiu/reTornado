/**
 * Created by Marshall on 14-4-16.
 */
define(function(require, module, exports) {

    var $ = require('jquery'),
        _ = require('underscore'),
        Base = require('./base'),
        slider = require('bootstrap-slider');

    var Disk = Base.extend({
        className: 'price-disk',
        template: $('#tpl_price_disk').html(),

        events: {
            'keyup input.input-disk': 'inputKeyup'
        },

        initialize: function(opts) {
            _.bindAll(this);
            // this.price = opts.price;
        },

        render: function() {
            this.$el.html(this.template);
            this.$slider = this.$el.find('input.slider-disk');
            this.$input = this.$el.find('input.input-disk');

            setTimeout(this.renderSlider, 50);
            return this;
        },

        inputKeyup: function() {
            this.$input.val(this.$input.val().replace(/[^\d]/, ''));
            if (this.$input.val() > 2000) {
                this.$input.val(2000);
            }
            this.renderInput(this.$input.val())
        },

        renderInput: function(val) {
            var stepped = parseInt(val);
            this.$slider.slider('setValue', stepped);
            this.$input.val(val);
        },

        renderSlider: function() {
            var self = this;
            this.$slider.slider({
               min: 0,
               max: 2000,
               step: 10,
               value: 30,
               tooltip: 'always',
               formater: function(v) {
                   return v + ' GB';
               }
            }).on('slideStop', function() {
                self.renderInput(self.$slider.data('slider').getValue());
                self.getPrice();
            });
        },

        getPrice: function() {}
    });

     return Disk;
});