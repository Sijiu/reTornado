define(function(require, module, exports){

    var $ = require('jquery'),
        Modernizr = require('modernizr');

    var Sidebar = function(el) {

        this.$el = el;
        this.$sidebarHandler = this.$el.find('.sidebar-handle');
        this.$toggleSearch = this.$el.find('.btn-advanced-search, .close-advanced-search');
        this.$listSearch = this.$el.find('#user-list-search');

        this.init();
    };

    Sidebar.prototype = {
        constructor: Sidebar,

        init: function() {

            this.$sidebarHandler.on('click', $.proxy(this.toggleSidebar, this));
            this.$toggleSearch.on('click', $.proxy(this.toggleAdvancedSearch, this));
            this.$listSearch.on('keyup', $.proxy(this.buildPageData, this));

            this.setSidebarMobHeight();
        },

        toggleAdvancedSearch: function(e) {
            e.stopPropagation();e.preventDefault();
            $('.sidebar').toggleClass('search-mode');
        },

        toggleSidebar: function(e) {
            e.stopPropagation();e.preventDefault();
            $('.sidebar').toggleClass('extended').toggleClass('retracted');
            $('.wrapper').toggleClass('extended').toggleClass('retracted');

            if ($('.sidebar').is('.search-mode')){
                this.toggleAdvancedSearch();
            }

            if ($('.sidebar').is('.retracted')){
                $.cookie('protonSidebar', 'retracted', {
                    expires: 7,
                    path: '/'
                });
            }
            else {
                $.cookie('protonSidebar', 'extended', {
                    expires: 7,
                    path: '/'
                });
            }
        },

        setSidebarMobHeight : function () {
            if(ltIE9 || Modernizr.mq('(min-width:' + (screenXs) + 'px)')){
                $('.sidebar').css('max-height','none');
            } else {
                $('.sidebar').css('max-height','none');
                setTimeout(function() {
                    var sidebarMaxH = $('.sidebar > .panel').height() + 30 + 'px';
                    $('.sidebar').css('max-height',sidebarMaxH);
                }, 200);
            }
        },

        buildPageData: function() {
            var value = $('#user-list-search').val();
            $(".user-list > li").each(function () {
                if ($(this).text().indexOf(value) > -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    };

    $(document).ready(function() {
        new Sidebar($('.sidebar'));
    });

});