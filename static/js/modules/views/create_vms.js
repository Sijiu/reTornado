/**
 * Created by Marshall on 14-4-16.
 */
define(function(require, module, exports) {

    var Base = require('./base'),
        $ = require('jquery'),
        _ = require('underscore'),
        CpuMemory = require('./price_cpu_memory'),
        Disk = require('./price_disk'),
        Net = require('./price_net'),
        OS = require('./price_os'),
        Period = require('./price_period');

    var CreateVMS = Base.extend({
        className: 'create-vms animated fadeInRight',
        template: $('#tpl_create_vms').html(),

        resources: [{
            cls: CpuMemory
        }, {
            cls: Disk
        }, {
            cls: Net
        }, {
            cls: OS
        }, {
            cls: Period
        }],

        initialize: function(opts) {
            // this.prices = new Prices();
        },

        render: function() {
            this.$el.html(this.template);
            var self = this;
            var $el = this.$el.find('.resources');
            _.each(this.resources, function(res, index) {
                var view = new res.cls();
                $el.append(view.render().el);
            });
            return this;
        }
    });

    return CreateVMS;
});