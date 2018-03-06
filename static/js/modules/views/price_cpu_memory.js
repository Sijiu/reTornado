/**
 * Created by Marshall on 14-4-15.
 */
define(function(require, module, exports) {

    var $ = require('jquery'),
        _ = require('underscore'),
        Base = require('./base'),
        Model = require('../models/price_cpu_memory');

    var CpuMemory = Base.extend({

        className: 'price-cpu-memory',

        template: $('#tpl_cpu_memory').html(),

        events: {
            'click button[data-type=cpu]': 'changeCPU',
            'click button[data-type=memory]': 'changeMemory'
        },

        initialize: function(opts) {
            _.bindAll(this);

            this.model = new Model();
            this.model.on('change', this.render);

//            this.price = opts.price;
            var cpu = this.model.get('selected_cpu'),
                memory = this.model.get('selected_memory');
            this.model.selectCPU(cpu, memory);
            this.getPrice();
            this.render();
        },

        render: function() {
            this.$el.html(_.template(this.template, this.model.toJSON()));
            return this;
        },

        changeCPU: function(e) {
            e.preventDefault();
            var $target = $(e.currentTarget);
            if ($target.hasClass('hidden') || $target.hasClass('selected')) {
                return;
            }
            var cpu = $target.data('value');
            this.model.selectCPU(cpu, null);
            this.getPrice();
        },

        changeMemory: function(e) {
            e.preventDefault();
            var $target = $(e.currentTarget);
            if ($target.hasClass('hidden') || $target.hasClass('selected')) {
                return;
            }
            var memory = $target.data('value');
            this.model.selectMemory(memory);
            this.getPrice();
        },

        getPrice: function() { }
    });

    return CpuMemory;

});