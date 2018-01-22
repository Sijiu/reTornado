define( function(require, module, exports) {

    var $ = require('jquery');
    $.fn.serialize = function($form) {
        var obj = {};
        var array = $form.serializeArray();
        $.each(array, function() {
            if (obj[this.name] !== undefined) {
                if (!obj[this.name].push) {
                    obj[this.name] = [obj[this.name]];
                }
                obj[this.name].push(this.value || '');
            } else {
                obj[this.name] = this.value || '';
            }
        });
        return obj;
    };
    return $.fn.serialize;
});
