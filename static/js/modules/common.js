define(function(require, module, exports){

    var $ = require('jquery'),
        cookie = require('cookie');
        Modernizr = require('modernizr');

    var Common = function(el) {

        this.$el = el;
		this.$notice = this.$el.find('#list_announce');
        this.init();
    }

    Common.prototype = {
        constructor: Common,

        init: function() {
			this.$notice.on('click', 'tr', $.proxy(this.showNotice, this));
            this.testiOS();
            this.responsive();
            this.ajaxCsrf();
        },

        testiOS: function() {
            // Adds iOS modernizr tests
            Modernizr.addTest('ipad', function () {
              return !!navigator.userAgent.match(/iPad/i);
            });

            Modernizr.addTest('iphone', function () {
              return !!navigator.userAgent.match(/iPhone/i);
            });

            Modernizr.addTest('ipod', function () {
              return !!navigator.userAgent.match(/iPod/i);
            });

            Modernizr.addTest('appleios', function () {
              return (Modernizr.ipad || Modernizr.ipod || Modernizr.iphone);
            });

            // add ios-device class to html if ios is used to view
            if(Modernizr.appleios){
                $('html').addClass('ios-device');
            }
        },

        ajaxCsrf: function() {
            // Define $.ajaxSetup
            var csrftoken = cookie('csrftoken');

            function csrfSafeMethod(method) {
                // these HTTP methods do not require CSRF protection
                return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
            }
            $.ajaxSetup({
                crossDomain: false, // obviates need for sameOrigin test
                beforeSend: function(xhr, settings) {
                    if (!csrfSafeMethod(settings.type)) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });
        },

        responsive: function() {

            if(ltIE9 || Modernizr.mq('(min-width:' + (screenXs) + 'px)')){
                setTimeout(function() {
                    $('.sidebar').addClass('animated fadeInLeft');
                    setTimeout(function() {
                        $('.sidebar').removeClass('animated fadeInLeft').css('opacity', '1');
                    }, 1050);
                }, 50);
                setTimeout(function() {
                    $('.wrapper').addClass('animated fadeInRight');
                    setTimeout(function() {
                        $('.wrapper').removeClass('animated fadeInRight').css('opacity', '1');
                    }, 1050);
                }, 150);
            }
            else{
                setTimeout(function() {
                    $('.sidebar, .wrapper').addClass('animated fadeInUp');
                    setTimeout(function() {
                        $('.sidebar, .wrapper').removeClass('animated fadeInUp').css('opacity', '1');
                    }, 1050);
                }, 50);
            }
        },
		showNotice: function(e) {
            var $target = $(e.target);
            var content = $target.closest('tr').attr('content');
            if ($target.hasClass('editanno') || $target.hasClass('delanno')) return;
			$('#noticetitle').html($target.closest('tr').find('td').eq(0).html());
			$('#noticecontent').html(content);
            $('#noticeModal').modal();
        }
    };

    $(document).ready(function() {
        new Common($(document.body));
    });

});
