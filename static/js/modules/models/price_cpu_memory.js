/**
 * Created by Marshall on 14-4-15.
 */
define(function(require, module, exports) {

    var _  = require('underscore'),
        Model = require('./base');

    var PriceCpuMemory = Model.extend({

        url: '/ajax_get_order_price',

        defaults: {
            cpu: [{
               name: '1 核',
               value: 1,
               memoryRange: [1024, 2048]
            }, {
               name: '2 核',
               value: 2,
               memoryRange: [1536, 4096]
            }, {
               name: '4 核',
               value: 4,
               memoryRange: [1536, 4096]
            }, {
               name: '8 核',
               value: 8,
               memoryRange: [8192, 8192]
            }],

            memory: [{
               name: '1 GB',
               value: 1024,
               valid: true
            },{
               name: '1.5 GB',
               value: 1536,
               valid: false
            }, {
               name: '2 GB',
               value: 2048,
               valid: true
            }, {
               name: '2.5 GB',
               value: 2560,
               valid: false
            }, {
               name: '4 GB',
               value: 4096,
               valid: false
            }, {
               name: '8 GB',
               value: 8192,
               valid: false
            }],

            selected_cpu: 1,
            selected_memory: 1024
        },

        selectCPU: function(cpu, memory) {
            cpu = parseInt(cpu, 10);
            memory = parseInt(memory || 0, 10);
            this.invalidMemory(this.getMemoryRange(cpu));
            this.set({
               selected_cpu: cpu,
               selected_memory: memory || this.getValidMemory()[0].value
            });
        },

        selectMemory: function(memory) {
            memory = parseInt(memory, 10);
            if (_.findWhere(this.get('memory'), { value: memory }).valid) {
                this.set({
                   selected_memory: memory
                });
            }
        },

        getMemoryRange: function(cpu) {
            var cpus = this.get('cpu');
            for (var i = 0; i < cpus.length; i++) {
                if (cpus[i].value === cpu) {
                   return cpus[i].memoryRange;
                }
            }
        },

        getValidMemory: function() {
            return _.filter(this.get('memory'), function(m) {
                return m.valid
            });
        },

        invalidMemory: function(range) {
            var mems = this.get('memory');
            var min = range[0],
                max = range[1];

            for (var i = 0; i < mems.length; i++) {
                mems[i].valid = (mems[i].value >= min && mems[i].value <= max);
            }
        }

    });

    return PriceCpuMemory;

})