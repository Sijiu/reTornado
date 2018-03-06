define(function(require, module, exports) {

    var $ = require('jquery'),
        Backbone = require('backbone'),
        utils = require('utils'),
        Validation = require('backboneValidation');

    var View = Backbone.View.extend({

        subviews: [],

        addSubView: function(view) {
            if (!this.subviews[this.cid]) {
                this.subviews[this.cid] = [];
            }
            this.subviews[this.cid].push(view);
            return view;
        },

        closeSubViews: function() {
            if (this.subviews[this.cid]) {
                this.subviews[this.cid].forEach(function(view) {
                    view.close();
                });
                delete this.subviews[this.cid];
            }
        },

        close: function() {
            this.closeSubViews();
            this.remove();
            this.off();
            this.stopListening();
        },

        bindValidation: function() {
            Validation.bind(this, {
                valid: function(view, attr, selector) {
                    var control = view.$('[' + selector + '=' + attr + ']');
                    var group = control.parents(".form-group");
                    group.removeClass("has-error");
                    group.find(".help-inline.error-message").remove();
                },
                invalid: function(view, attr, error, selector) {
                    var control = view.$('[' + selector + '=' + attr + ']');
                    var group = control.parents(".form-group");
                    group.addClass("has-error");
                    if (group.find(".help-inline").length === 0) {
                        group.append("<span class=\"help-inline error-message\"></span>");
                    }

                    var target = group.find(".help-inline");
                    target.text(error);

                    var submitButton = view.$el.find('input[type=submit]');
                    utils.enableButton(submitButton);
                }
            });
        }

    });

    return View;
});