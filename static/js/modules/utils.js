define(function(require, module, exports) {

    var _  = require('underscore');

    return {

        disableButton: function(button) {
            if (!button) return;
            button.addClass('disabled');
            button.prop('disabled', true);
        },

        enableButton: function(button) {
            if (!button) return;
            button.removeClass('disabled');
            button.prop('disabled', false);
        }

    }
})