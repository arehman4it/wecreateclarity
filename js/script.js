var wSt, slW, slImW, slImWDiff, wDiff, sliderTim, slIconWDiff, slIconW, slLiW, toHistory;
var winH = window.innerHeight;
var particlesV = false;
var slFullH, slFullW, slLayout, wSlLayout, conT=0;
var logoS, mouseX, mouseY, player, $grid, modalPlayer;
var magn, startTime;


/* On Back / Forward */
window.onpopstate = function () {
    ajaxLoadPage(location.href, false);
};

function ajaxLoadPage(url) {
    if ($('.ajax_inner').length < 2) {
        toHistory = true;
        $('body').removeClass('page_loaded');

        var section = $('<div class="ajax_inner overflow-hidden"></div>').appendTo('#ajax_wrap');

        section.load(url + ' .ajax_inner > *', function () {
            setTimeout(function () {
                section.prev('.active').removeClass('active').end().addClass('active').removeClass('overflow-hidden');
                section.prev('.ajax_inner').remove();

                var ajax_title = $(".ajax_wrap_data").data('title');
                var ajax_bodyclass = $(".ajax_wrap_data").data('bodyclass');

                $('body').attr('class', ajax_bodyclass);
                $('#theBall').removeClass('zooming zooming_lg');
                $('#theBall span').text('');
                $('html, body').scrollTop(0);

                $('.footer img').each(function (index, img) {
                    img.outerHTML = img.outerHTML;
                });
                document.title = ajax_title;

                setTimeout(function () {
                    $('html, body').scrollTop(0);
                    onReady();
                    $('body').addClass('page_loaded');
                }, 500);

                if (toHistory) {
                    window.history.pushState({'dataurl': url}, ajax_title, url);
                }

            }, 500);
        });
    }
}

function ajaxLoadBio(url) {
    if ($('.ajax_inner').length < 2) {
        toHistory = true;
        $('body').removeClass('page_loaded').addClass('load_bio');

        var section = $('<div class="ajax_inner overflow-hidden"></div>').appendTo('#ajax_wrap');

        section.load(url + ' .ajax_inner > *', function () {
            setTimeout(function () {
                section.prev('.active').removeClass('active').end().addClass('active').removeClass('overflow-hidden');
                section.prev('.ajax_inner').remove();

                var ajax_title = $(".ajax_wrap_data").data('title');
                var ajax_bodyclass = $(".ajax_wrap_data").data('bodyclass');

                $('body').attr('class', ajax_bodyclass);
                $('#theBall').removeClass('zooming zooming_lg');
                $('#theBall span').text('');

                $('.footer img').each(function (index, img) {
                    img.outerHTML = img.outerHTML;
                });
                document.title = ajax_title;

                setTimeout(function () {

                    $('html, body').scrollTop(0);
                    onReady();
                    $('body').removeClass('load_bio').addClass('page_loaded');
                }, 500);

                if (toHistory) {
                    window.history.pushState({'dataurl': url}, ajax_title, url);
                }

            }, 500);
        });
    }
}

function ajaxLoadMore(url) {
    $.get(url, function (data) {
        var thIt = $(data).find('.list_item');
        if($('.blog_list_section').length > 0) {
            thIt.imagesLoaded( function() {
                $grid.append(thIt).isotope('appended', thIt);
            });
        } else {
            thIt.imagesLoaded( function() {
                $('.work_list_wrap ').append(thIt);
                orderList();
            });
        }
    });
}

function orderList() {
    var thL = $('.work_list_item');
    if(thL.length > 0) {
        thL.removeClass('even_element');
        $('.work_list_item:visible').each(function (i) {
            if ((i +1) % 2 == 0) $(this).addClass('even_element');
        });
    }
}

function afterStart(){
    clearTimeout(startTime);
    $('#start_animation').fadeOut(500);
    $('#start').remove();
    $('body').addClass('page_loaded');
    $('#theBall').removeClass('zooming zooming_lg');
    $('#theBall span').text('');
    homeAn();
    particlesV = false;
}

//Document ready
jQuery(document).ready(function ($) {
    onReady();

    //Load more button
    $(document).on('click', 'a[data-loadmore]', function (e) {
        e.preventDefault();
        var thUrl = $(this).closest('.work_list_btn').find('a.page-numbers:nth-child(2)');
        thUrl.remove();
        ajaxLoadMore(thUrl.attr('href'));

        if($(this).closest('.work_list_btn').find('.nav-links a').length === 0) {
            $(this).fadeOut(600);
        }
    });

    if($(window).width() < 768 && $('.grid_view_wrap ').length > 0){
        $('.grid_view_wrap ').addClass('list_view_wrap').removeClass('grid_view_wrap');
    }

    //Scroll events
    $(window).scroll(function () {
        wSt = $(window).scrollTop();
        winH = window.innerHeight;
        if(wSt < window.innerHeight && $('#home_page_inner').length > 0) {
            conT = -(window.innerHeight-wSt)/2;
            TweenLite.to('#home_page_inner', 0, {y: conT});
        } else {
            $('#home_page_inner').attr('style', '');
        }

        if(wSt <= winH && $('.slider_section_wrap').length > 0) {
            $('body').addClass('not_fixed_menu');
        } else {
            $('body').removeClass('not_fixed_menu');
        }

        if(wSt >= winH/2 && $('.slider_section_wrap').length > 0) {
            if(particlesV == false && window.innerWidth > 1199) particlesF($("#scene")[0]);
        }

        //Work nav
        if($('.single_work_navbar').length > 0) {
            if(wSt >= 2*winH  && wSt <= $('.form_section').offset().top - winH/3) $('body').addClass('work_nav_show'); else $('body').removeClass('work_nav_show');
        }

        //Work nav
        if($('.work_list_navbar').length > 0) {
            if(wSt >= 100 && wSt <= $('.nav_hide_point').offset().top - .7*window.innerHeight) $('body').addClass('work_nav_show'); else $('body').removeClass('work_nav_show');
        }

        //Article nav
        if($('.article_navbar').length > 0) {
            if(wSt >= window.innerHeight && wSt <= $('.nav_hide_point').offset().top - window.innerHeight) {
                $('body').addClass('work_nav_show');
            } else {
                $('body').removeClass('work_nav_show');
            }
        }

        //Menu button
        if($('.form_section').length > 0) {
            if(wSt >= $('.form_section').offset().top - window.innerHeight/3) {
                $('.menu_open_stick').addClass('show');
            } else {
                $('.menu_open_stick').removeClass('show');
            }
        }

        //Menu button
        if(logoS.length > 0) {
            if(wSt >= logoS.offset().top - window.innerHeight && wSt < logoS.offset().top + logoS.outerHeight()) {
                logoS.find('.logos_list li:nth-child(odd)').each(function () {
                    TweenLite.to($(this), 0.2, {y: (logoS.offset().top-wSt- window.innerHeight/2)*.1 });
                })
            }
        }

        //Scroll move image
        var imgIt = $('.section_img_animation');
        if(imgIt.length > 0) {
            if(wSt >= 0) {
                TweenLite.to(imgIt, 0.2, {y: wSt*.3 });
            }
        }

        //Scroll move image
        var shapeIt = $('.shape_wrap');
        if(shapeIt.length > 0) {
            if(wSt >= shapeIt.offset().top-winH) {
                TweenLite.to($('.shape_wrap_img'), 0.2, {y: (wSt-shapeIt.offset().top-winH)*.3 });
            }
        }

        if ($('.fixed_section').length > 0) {
            var animVal = (wSt == 0) ? 0 : (wSt + window.innerHeight - $('.home_page_wrap').offset().top) / -10;
            //var opacityVal = 1 + (WST + windowHeight - $('.section_to_fix_wrap').offset().top) / -1000;

            new TweenLite.to('.fixed_section', 0, {y: animVal});
            //new TweenLite.to('.loaded .home_hero .carousel_box', 0, {opacity: opacityVal,});
        }

    });

    $(document).on('click', '.work_filter_main .work_filter_list li a', function (e) {
        e.preventDefault();
        $('.work_filter_main li.active').removeClass('active');
        if($(this).closest('li').index() == 0) {
            clearF();
        } else {
            $('.work_filter_step').removeClass('active');
            $($(this).attr('href')).addClass('active');
        }
        $('html, body').animate({
            scrollTop: $('.filter_top_point').offset().top
        }, 500);
        return false;
    });


    // Work list filters
    var stringUrl = '';
    $(document).on('click', '[data-filter="pagination"] .work_filter_inner .work_filter_list li a', function (e) {
        e.preventDefault();
        stringUrl = '';
        e.preventDefault();
        $(this).closest('.work_filter_list').find('li.active').removeClass('active');
        $(this).closest('li').addClass('active');
        $('html, body').animate({
            scrollTop: $('.filter_top_point').offset().top
        }, 500);
        $('.work_filter_inner').each(function(){
            var dataId = $(this).attr('id');
            $('li.filter_item.active', this).each(function(){
                if (stringUrl != "") {
                    stringUrl += "&";
                }
                stringUrl += 'filter['+dataId+']' + '='+$('a',this).data('slug');
            })
        });

        var stringUrlFull = $('.ajax_wrap_data').data('url') + '?' + stringUrl;

        window.history.pushState({}, '', stringUrlFull);
        $('[data-ajax_pagination="true"]').load(stringUrlFull + ' [data-ajax_pagination="true"] > *', function(){
            orderList();
            massonryF();
        });
    });

    $(document).on('click', '.prev_filter', function (e) {
        e.preventDefault();
        $('.work_filter_step').removeClass('active');
        $('.work_filter_main').addClass('active');
        $('.work_filter_inner').each(function () {
            if($(this).find('li.active').index() !== 0) {
                $('.work_filter_main a[href="#'+$(this).attr('id')+'"]').closest('li').addClass('active');
            }
        });
        if($('.work_filter_main .work_filter_list li.active').length == 0) {
            $('.work_filter_main .work_filter_list li:first-child').addClass('active');
        }
    });

    function clearF() {
        $('.work_filter_main li:first-child').addClass('active');
        $('.work_filter_inner li.active').removeClass('active');
        $('.work_filter_inner li:first-child').addClass('active');
        $('.work_filter_main li').each(function () {
            $(this).find('a').text($(this).find('a').attr('data-default'));
        });

        var stringUrlFull = $('.ajax_wrap_data').data('url');

        window.history.pushState({}, '', stringUrlFull);
        $('[data-ajax_pagination="true"]').load(stringUrlFull + ' [data-ajax_pagination="true"] > *', function(){
            orderList();
            massonryF();
        });
    }

    //Grid view button
    $(document).on('click', '.tabs_list a', function (e) {
        e.preventDefault();
        $('.tabs_list a').removeClass('active');
        $(this).addClass('active');
        $('.form_section_box').removeClass('active');
        $($(this).attr('href')+'.form_section_box').addClass('active');
    });

    $.fn.parallax = function(resistance, mouse) {
        $el = $(this);
        TweenLite.to($el, 0.5, {
            x: -((mouse.clientX - window.innerWidth / 2) / resistance),
            y: -((mouse.clientY - window.innerHeight / 2) / resistance)
        });
    };

    //Animation parallax
    $(document).on('mousemove', '.home_section', function(e) {
        if($(window).width() > 1199 ) {
            $(".section_img svg:nth-child(1)", this).parallax(10, e);
            $(".section_img svg:nth-child(2)", this).parallax(30, e);
            $(".section_img svg:nth-child(3)", this).parallax(20, e);
        }
    });

    $(document).on('mousemove', '.work_results_section', function(e) {
        if($(window).width() > 1199 ) {
            $(".parallax_layer1", this).parallax(10, e);
            $(".parallax_layer2", this).parallax(30, e);
            $(".work_results_pink_circle", this).parallax(50, e);
            $(".work_results_red_circle", this).parallax(15, e);
            $(".work_results_blue_circle", this).parallax(-60, e);
        }
    });

    $(document).on('mousemove', '.work_list_item', function(e) {
        if($(window).width() > 1199 ) {
            $(".work_list_img", this).parallax(-30, e);
        }
    });

    $(document).on('mousemove', '.video_box', function(e) {
        if($(window).width() > 1199 ) {
            $(".video_box_img", this).parallax(-50, e);
        }
    });

    $(document).on('mousemove', '.blog_list_header', function(e) {
        if($(window).width() > 1199 ) {
            $(".section_title", this).parallax(-50, e);
        }
    });

    $(document).on('mousemove', '.our_story_item', function(e) {
        $(".our_story_item_img", this).parallax(-30, e);
    });

    $(document).on('mousemove', '.our_story_header', function(e) {
        if($(window).width() > 1199 ) {
            $(".article_heading", this).parallax(-40, e);
        }
    });

    $(document).on('mousemove', '.bio_section_parallax', function(e) {
        if($(window).width() > 1199 ) {
            $(".bio_title", this).parallax(-30, e);
            $(".bio_img img", this).parallax(50, e);
            $(".bio_section_img", this).parallax(20, e);
            $(".parallax_layer1", this).parallax(10, e);
            $(".parallax_layer2", this).parallax(30, e);
        }
    });

    $(document).on('mousemove', '.work_awards_section', function(e) {
        if($(window).width() > 1199 ) {
            $(".bio_title", this).parallax(-30, e);
            $(".bio_img img", this).parallax(50, e);
            $(".bio_section_img", this).parallax(20, e);
        }
    });

    $(document).on('mousemove', function(e) {
        mouseX = e.pageX;
        mouseY = e.pageY - $(window).scrollTop();
        if($(window).width() > 1199 ) {
            TweenLite.to('#theBall', 0, {left: mouseX, top: mouseY});
            $(".parallax_item", this).parallax(50, e);
        }
    });

    //Custom cursor
    $(document).on("mousemove", function(e) {
        if($(window).width() > 1199 ) {

            magn.each(function() {
                !function(e) {
                    var n, i, r, o = mouseX, s = mouseY, a = $(e), l = 20 * a.data("dist") || 60, c = a.offset().left + a.width() / 2, u = a.offset().top + a.height() / 2, d = -.45 * Math.floor(c - o), f = -.45 * Math.floor(u - s);
                    n = a,
                        i = o,
                        r = s,
                        Math.floor(Math.sqrt(Math.pow(i - (n.offset().left + n.width() / 2), 2) + Math.pow(r - (n.offset().top + n.height() / 2), 2))) < l ? (TweenLite.to(a, .3, {
                            y: f,
                            x: d
                        }),
                            a.addClass("magnet")) : (TweenLite.to(a, .45, {
                            y: 0,
                            x: 0
                        }),
                            a.removeClass("magnet"))
                }($(this), e)
            });

            //magnetize()
        }

    });

    //Work next slide
    $(document).on('click', '.next_slide, .slider_next', function (e) {
        e.preventDefault();
        var thSl = $(this).closest('.master-slider');
        if(thSl.find('.ms-slide').length > 1) thSl.masterslider('slider').api.next();
    });
    $(document).on('click', '.slider_prev', function (e) {
        e.preventDefault();
        var thSl = $(this).closest('.master-slider');
        if(thSl.find('.ms-slide').length > 1)  thSl.masterslider('slider').api.previous();
    });

    //Close start animation
    $(document).on('click', '#start_animation', function (e) {
        e.preventDefault();
        afterStart();
    });

    //Video control
    $(document).on('click', '.slide_content[data-cursor]', function () {
        var thO = $(this);
        var thWrap = thO.closest('.work_intro_section');
        iframe =  thO.closest('.ms-slide').find('iframe')[0];
        player = new Vimeo.Player(iframe);
        thWrap.addClass('video_playing');
        player.play().then(function() {
            player.play();
        });
        player.on('pause', function(data) {
            thWrap.removeClass('video_playing');
        });
    });

    $(document).on('click', 'a:not(.menu_open):not([data-ajax="false"])', function (e) {
        var thHref = $(this).attr('href');

        if ($(this).closest('.work_filter_list').length > 0 || $(this).closest('#wpadminbar').length > 0) return true;
        if (thHref.indexOf('mailto') !== -1 || thHref.indexOf('tel') !== -1 || $(this).attr('target')) return true;

        e.preventDefault();

        if (thHref.indexOf('#') === -1) {
            if($(this).hasClass('bio_link')) {
                ajaxLoadBio(thHref);
            } else {
                ajaxLoadPage(thHref);
            }
        } else if (thHref.indexOf('#our_story_point') !== -1) {
            setTimeout(function () {
                $('html, body').animate({
                    scrollTop: $('#our_story_point').offset().top
                }, 500);
            }, 3000);
            ajaxLoadPage(thHref);
        }
    });

    //Cursor links
    $(document).on('mouseenter', 'a, button, .form_label', function () {
        $('#theBall').addClass('zooming');
    }).on('mouseleave', 'a, button, .form_label', function () {
        $("#theBall").removeClass("zooming");
    });

    $(document).on('mouseenter', '[data-cursor]', function () {
        $('#theBall').addClass('zooming_lg').find('span').text($(this).attr('data-cursor'));
    }).on('mouseleave', '[data-cursor]', function () {
        $('#theBall').removeClass('zooming_lg').find('span').text('');
    });

    $(document).on('mouseenter', '.ms-nav-next, .bio_next, .slider_next', function () {
        $('#theBall span').addClass('icon-arrow-right');
        $('#theBall').addClass('zooming_lg');
    }).on('mouseleave', '.ms-nav-next, .bio_next, .slider_next', function () {
        $('#theBall').removeClass('zooming_lg');
        $('#theBall span').removeClass('icon-arrow-right');
    });

    $(document).on('mouseenter', '.ms-nav-prev, .bio_prev, .slider_prev', function () {
        $('#theBall span').addClass('icon-arrow-left');
        $('#theBall').addClass('zooming_lg');
    }).on('mouseleave', '.ms-nav-prev, .bio_prev, .slider_prev', function () {
        $('#theBall').removeClass('zooming_lg');
        $('#theBall span').removeClass('icon-arrow-left');
    });

    $(document).on('click', '.menu_open, .menu_open_stick', function (e) {
        e.preventDefault();
        $('body').addClass('show_menu');
        return false;
    });

    $(document).on('click', '.menu_close', function (e) {
        e.preventDefault();
        $('body').removeClass('show_menu');
        return false;
    });

    $(document).on('click', '.share_link', function (e) {
        e.preventDefault();
        var thL = $(this);
        var tempCopy = $("<input type='text'>");
        $(".share_text").append(tempCopy);
        tempCopy.val(thL.attr('data-url')).select();
        thL.addClass('link_copied');
        document.execCommand('copy');
        setTimeout(function () {
            thL.removeClass('link_copied');
            $('.share_text').html('');
        }, 200);
    });

    //Grid view button
    $(document).on('click', '.view_btn', function (e) {
        e.preventDefault();
        $('.view_btn').removeClass('active');
        $(this).addClass('active');
        if($(this).hasClass('grid_view')) {
            $.cookie('grid_view', 'grid', { expires: 7, path: '/' });
            $('.work_list_wrap').removeClass('list_view_wrap').addClass('grid_view_wrap');
        } else {
            $.cookie('grid_view', 'list', { expires: 7, path: '/' });
            $('.work_list_wrap').removeClass('grid_view_wrap').addClass('list_view_wrap');
        }

        $('html, body').animate({
            scrollTop: $('.work_list_wrap').offset().top
        }, 500);

        $('.work_list_wrap').addClass('grid_view_anim');
        setTimeout(function () {
            $('.work_list_wrap').removeClass('grid_view_anim');
        }, 600)
    });

    $(document).on('mouseenter', '.slider_list a', function () {
        if(window.innerWidth > 1199) {
            $('.slider_img_item, .slider_text').removeClass('active');
            $('.slider_list a').removeClass('active');
            $(this).addClass('active');
            $('#' + $(this).attr('data-id') + '.slider_img_item').addClass('active');
            $('.slider_text[data-item="' + $(this).attr('data-id') + '"]').addClass('active');
        }
    });

    $(document).on('click', '.slider_nav li', function () {
        slideChange(($(this)));
    });

    //Video modal
    $(document).on('click', '.play_btn', function () {
        $($(this).attr('data-modal')+'.video_popup').addClass('visible');
        $("body").addClass('overflow_hidden');
    });

    //Video modal
    $(document).on('click', '.modal_video_overlay', function () {
        var thWrap = $(this).closest('.modal_video');
        iframe =  thWrap.find('iframe')[0];
        modalPlayer = new Vimeo.Player(iframe);
        thWrap.addClass('video_playing');
        modalPlayer.play().then(function() {
            modalPlayer.play();
        });
        modalPlayer.on('pause', function() {
            thWrap.removeClass('video_playing');
        });
    });

    $(document).on('click', '.close_modal', function () {
        $(this).closest('.video_popup').removeClass('visible');
        $("body").removeClass('overflow_hidden');
        $("#theBall").removeClass('zooming_lg');
        $("#theBall span").text('');
        if(modalPlayer) {
            modalPlayer.pause();
            modalPlayer.on('pause', function() {
                thWrap.removeClass('video_playing');
            });
        }
    });

    $(document).on('mousemove',".slider_section", function(e) {
        if(window.innerWidth > 1199) {
            mX = e.pageX - this.offsetLeft;
            TweenLite.to(".slider_section_layout", 1,{opacity: 1-mX/slW, ease: "power1.out"});
            TweenLite.to(".slider_list", .4,{marginLeft: mX*wDiff, ease: "expo.out" });
            TweenLite.to(".slider_img", .3,{right: mX*slImWDiff, ease: "power1.out" });
            TweenLite.to(".slider_bg", .3,{left: mX*slIconWDiff, ease: "power1.out" });
        }
        $(".slider_parallax_layer1", this).parallax(10, e);
        $(".slider_parallax_layer2", this).parallax(30, e);
    });

    $(window).on('orientationchange', function () {
        setTimeout(function () {
            sliderH();
        },200)
    });

    //Form
    $(document).on('focus', '.form_item', function () {
        $(this).parents('.form_group').addClass('focused');
    }).on('blur', '.form_item', function () {
        var inputValue = $(this).val();
        if (inputValue == "") {
            $(this).removeClass('filled');
            $(this).parents('.form_group').removeClass('focused');
        } else {
            $(this).addClass('filled');
        }
    });

    $(window).resize(function () {
        sliderSize();
        teamGrid();
    });

});

function slideChange(item) {
    $('.slider_nav li').removeClass('active');
    item.addClass('active');

    $('.slider_img_item, .slider_text').removeClass('active');
    $('.slider_list li').removeClass('active');
    $('#' + item.attr('data-slide') + '.slider_img_item').addClass('active');
    $('.slider_text[data-item="' + item.attr('data-slide') + '"]').addClass('active');
    $('.slider_list a[data-id="' + item.attr('data-slide') + '"]').closest('li').addClass('active');
    $('.work-link').attr('href', $('.slider_list a[data-id="' + item.attr('data-slide') + '"]').attr('href'));
}

function sliderSize() {
    if(sliderTim) clearTimeout(sliderTim);
    sliderTim = setTimeout(function () {
        slW = $(".slider_section").outerWidth(true);
        slImW = $(".slider_img").outerWidth(true);
        slIconW = $(".slider_bg").outerWidth(true);
        slLiW = $(".slider_list").outerWidth();
        slImWDiff = (slW-slImW)/slW;
        slIconWDiff = (slW-slIconW)/slW;
        wDiff = (slLiW/slW)-1;
        wDiff = (slW-slLiW)/slW;
    }, 200);
}

function sliderH() {
    if($('.slider_section').length > 0 && window.innerWidth < 768) {
        $('.slider_section').height(window.innerHeight);
    }
}

function massonryF() {
    var blogL = $('.blog_list_section');
    if (blogL.length > 0) {
        blogL.imagesLoaded( function() {
            $grid = $('.blog_list_section').isotope({
                itemSelector: '.blog_list_item',
                percentPosition: true
            });
        });
    }
}

function onReady() {
    var startAn = $('#start_animation');
    magn = $(".magnetize");
    if (!localStorage.noFirstVisit) {
        if (window.innerWidth > 1199) {
            startAn.show();
            particlesF($("#start")[0]);
            $( ".animation_line" ).animate({
                width: "100%",
            }, 11000);
            startTime = setTimeout(function () {
                afterStart();
            }, 11000);

        } else {
            setTimeout(function () {
                startAn.fadeIn();
                setTimeout(function () {
                    afterStart();
                }, 2000);
            }, 2000);
        }
        localStorage.noFirstVisit = "1";
    } else {
        setTimeout(function () {
            $('html, body').scrollTop(0);
            $('body').addClass('page_loaded');
        }, 1500);
    }

    logoS = $('.logo_section');

    if($('.work_slider_full .ms-slide').length >1) {
        if($(window).width() > 767) {
            slFullW = 2560; slFullH = 1400; slLayout = "fullwidth";
        } else {
            slFullW = 768; slFullH = 420; slLayout = "fullwidth";
        }
        $('.work_slider_full').masterslider({
            width: slFullW,
            height: slFullH,
            autoHeight:true,
            layout: slLayout,
            loop:true,
            grabCursor:false,
            mouse:false,
            view:"fade",
            controls : {
                arrows : {autohide:false},
                bullets : {autohide:false}
            }
        });
    } else {
        $('.work_slider_full').addClass('one_slide');
    }

    if($('.work_slider .ms-slide').length >1 && $(window).width() > 767) {
        if($(window).width() > 767) {
            wSlLayout = "fullwidth";
        } else {
            wSlLayout = "autofill";
        }
        $('.work_slider').masterslider({
            width: 2560,
            height: 1400,
            loop:true,
            grabCursor:false,
            mouse:false,
            view:"fade",
            layout: wSlLayout,
            controls : {
                arrows : {autohide:true}
            }
        });
    } else {
        $('.work_slider').addClass('one_slide');
    }

    if($('.work_intro_slider .ms-slide').length >1) {
        $('.work_intro_slider').masterslider({
            width: 2560,
            height: 1440,
            autoHeight:true,
            loop:true,
            grabCursor:false,
            mouse:false,
            layout: 'autofill',
            view:"fade",
            controls : {
                arrows : {autohide:false},
                bullets : {autohide:false}
            }
        });
    } else {
        $('.work_intro_slider').addClass('one_slide');
    }

    if($('#home_page_inner').length > 0) {
        setTimeout(function () {
            if(window.scrollY >= 0 && window.scrollY < window.innerHeight) {
                TweenLite.to('#home_page_inner', 0, {y: -(window.innerHeight-window.scrollY)/2});
            }
        },300)
    }

    if(!startAn.is(":visible")){
        homeAn();
    }

    //Animated images
    var heroAnimation;
    if ($('.animation_box').length > 0) { 
        $(this).html('');
        $('.animation_box').each(function (e) {
            var th = $(this)[0];
            var animP = $(this).attr('data-anim');
            heroAnimation = bodymovin.loadAnimation({
                container: th,
                path: animP,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                rendererSettings: {
                    scaleMode: 'noScale',
                    clearCanvas: false,
                    progressiveLoad:true
                }
            });
        });
    }

    if($('.slider_section').length > 0) {
        $('.slider_section').on("swipeleft", function() {
            var nextIt = $('.slider_nav li.active').next('li');
            if(nextIt.length > 0){
                slideChange(nextIt);
            } else {
                slideChange($('.slider_nav li:first-child'));
            }
        }).on("swiperight", function() {
            var prevIt = $('.slider_nav li.active').prev('li');
            if(prevIt.length > 0){
                slideChange(prevIt);
            } else {
                slideChange($('.slider_nav li:last-child'));
            }
        });
    }

    //Custom select
    $('select').each(function(){
        var $this = $(this), numberOfOptions = $(this).children('option').length;

        $this.addClass('select-hidden');
        $this.wrap('<div class="select"></div>');
        $this.after('<div class="select-styled"></div>');

        var $styledSelect = $this.next('div.select-styled');
        $styledSelect.text($this.children('option').eq(0).text());

        var $list = $('<ul />', {
            'class': 'select-options'
        }).insertAfter($styledSelect);

        for (var i = 0; i < numberOfOptions; i++) {
            $('<li />', {
                text: $this.children('option').eq(i).text(),
                rel: $this.children('option').eq(i).val()
            }).appendTo($list);
        }

        var $listItems = $list.children('li');

        $styledSelect.click(function(e) {
            e.stopPropagation();
            $('div.select-styled.active').not(this).each(function(){
                $(this).removeClass('active').next('ul.select-options').hide();
            });
            $(this).toggleClass('active').next('ul.select-options').toggle();
        });

        $listItems.click(function(e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).removeClass('active').addClass('selected');
            $this.val($(this).attr('rel'));
            $list.hide();
        });

        $(document).click(function() {
            $styledSelect.removeClass('active');
            $list.hide();
        });

    });

    sliderSize();
    sliderH();
    orderList();
    massonryF();

    new WOW().init({offset:window.innerHeight/2});


    if ($("#map_lat_long").length > 0)
        directionMap();

    $(document).on('mouseover', '.our_team_item', function () {
        var team_name = $(this).data('team_name');
        var team_position = $(this).data('team_position');
        $('.our_team_name').text(team_name);
        $('.our_team_position').text(team_position);
    });

    $(document).on('mouseout', '.our_team_item', function () {
        $('.our_team_name').text('');
        $('.our_team_position').text('');
    });

    teamGrid();

}

// Team grid items
function teamGrid() {
    $('.our_team_bleak').remove();
    if(window.innerWidth > 1199) {
        $("<div class='our_team_bleak'></div>" ).insertAfter(".our_team_item:nth-child(7), .our_team_item:nth-child(15), .our_team_item:nth-child(22), .our_team_item:nth-child(30)")
    } else if (window.innerWidth > 767 && window.innerWidth < 1199) {
        $("<div class='our_team_bleak'></div>" ).insertAfter(".our_team_item:nth-child(5), .our_team_item:nth-child(11), .our_team_item:nth-child(16), .our_team_item:nth-child(22), .our_team_item:nth-child(27)")
    } else {
        $("<div class='our_team_bleak'></div>" ).insertAfter(".our_team_item:nth-child(4), .our_team_item:nth-child(9), .our_team_item:nth-child(13), .our_team_item:nth-child(18), .our_team_item:nth-child(22), .our_team_item:nth-child(27), .our_team_item:nth-child(22), .our_team_item:nth-child(31)")
    }
}

// Home page direction map
function directionMap() {
    var thMap = $('#map_lat_long');
    var address = thMap.data('marker');
    var lat = thMap.data('lat');
    var long = thMap.data('lng');
    var center = {lat: lat, lng: long};

    var map = new google.maps.Map(thMap[0], {
        center: center,
        zoom: 15,
        mapTypeControl: false
    });

    var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h3 id="firstHeading" class="firstHeading">Clarity</h3><br>'+
        '<div id="bodyContent">'+address+'</div>'+
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var marker = new google.maps.Marker({
        position: center,
        map: map,
        title: 'Clarity'
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

}

//Animated images
function homeAn() {
    var animation1, animation2, animation3;
    if ($('.image_animation').length > 0) {
        $(this).html('');
        $('.image_animation').each(function (e) {
            var th = $(this)[0];
            var animP1 = $(this).attr('data-anim1');
            var animP2 = $(this).attr('data-anim2');
            var animP3 = $(this).attr('data-anim3');
            animation1 = bodymovin.loadAnimation({
                container: th,
                path: animP1,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                rendererSettings: {
                    clearCanvas: false,
                    progressiveLoad:true
                }
            });
            animation1.addEventListener('DOMLoaded', function (e) {
                animation2 = bodymovin.loadAnimation({
                    container: th,
                    path: animP2,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    rendererSettings: {
                        clearCanvas: false,
                        progressiveLoad:true
                    }
                });
                animation2.addEventListener('DOMLoaded', function (e) {
                    animation3 = bodymovin.loadAnimation({
                        container: th,
                        path: animP3,
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        rendererSettings: {
                            clearCanvas: false,
                            progressiveLoad:true
                        }
                    });
                });
            });
        });
    }

}

function magnetize(el, e){
    var items = $('.magnetize');

    [].forEach.call(items, function(item) {
        var customDist = item.getAttribute('dist') * 20 || 60;
        var centerX = item.offsetLeft + (item.clientWidth/2);
        var centerY = item.offsetTop + (item.clientHeight/2);

        var deltaX = Math.floor((centerX - mouseX)) * -0.45;
        var deltaY = Math.floor((centerY - mouseY)) * -0.45;

        var distance = calculateDistance(item, mouseX, mouseY);

        if(distance < customDist){
            TweenLite.to(item, 0.3, {y: deltaY, x: deltaX});
            $(item).addClass('magnet');
        }
        else {
            TweenLite.to(item, 0.45, {y: 0, x: 0});
            $(item).removeClass('magnet');
        }
    });
}

function calculateDistance(elem, mouseX, mouseY) {
    return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offsetLeft+(elem.clientWidth/2)), 2) + Math.pow(mouseY - (elem.offsetTop+(elem.clientHeight/2)), 2)));
}

//Particles
function particlesF(scene) {
    particlesV = true;
    var canvas = scene,
        textB = $(canvas).closest('.canvas_wrap').find('.canvas_item'),
        ctx = canvas.getContext("2d"),
        particles = [],
        amount = 0,
        mouse = {x: 0, y: 0},
        radius = 1,
        canvasFont;

    //var colors = ["#f6ba28", "#1c7059", "#e71d72", "#4e58e7", "#fcd6da", "#110553"];
    var colors = ["#f6ba28", "#1c7059", "#e71d72", "#4e58e7", "#110553"];

    var copy = $(canvas).attr('data-text');
    if($(window).width() > 1190) {
        canvasFont = "bold 98px sans-serif";
    }

    var ww = canvas.width = window.innerWidth;
    var wh = canvas.height = window.innerHeight;

    function Particle(x, y) {
        this.x = Math.random() * ww;
        this.y = Math.random() * wh;
        this.dest = {
            x: x,
            y: y
        };
        this.r = Math.random() * 2.5 + 1.5;
        this.vx = (Math.random() - 0.5) * 15;
        this.vy = (Math.random() - 0.5) * 15;
        this.accX = 0;
        this.accY = 0;
        this.friction = Math.random() * 0.05 + 0.93;

        this.color = colors[Math.floor(Math.random() * 6)];
    }

    Particle.prototype.render = function () {

        this.accX = (this.dest.x - this.x) / 500;
        this.accY = (this.dest.y - this.y) / 500;
        this.vx += this.accX;
        this.vy += this.accY;
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
        ctx.fill();

        var a = this.x - mouse.x;
        var b = this.y - mouse.y;

        var distance = Math.sqrt(a * a + b * b);
        if (distance < (radius * 60)) {
            this.accX = (this.x - mouse.x) / 100;
            this.accY = (this.y - mouse.y) / 100;
            this.vx += this.accX;
            this.vy += this.accY;
        }
    };

    function initScene() {
        var yPos = textB.position().top+30;
        var xPos = textB.offset().left - window.scrollX;

        ctx.clearRect(0, 0, ww, wh);

        ctx.font = canvasFont;
        ctx.textBaseline = "top";
        ctx.fillText(copy, xPos, yPos);

        var data = ctx.getImageData(0, 0, ww, wh).data;
        ctx.clearRect(0, 0, ww, wh);
        //ctx.globalCompositeOperation = "color";
        particles = [];
        for (var i = 0; i < ww; i += 6) {
            for (var j = 0; j < wh; j += 6) {

                if (data[((i + j * ww) * 4) + 3] > 150) {
                    particles.push(new Particle(i, j));
                }
            }
        }

        amount = particles.length;

    }

    function onMouseMove(e) {
        mouse.x = e.layerX;
        mouse.y = e.layerY - conT;
    }

    function render(a) {
        requestAnimFrame(render);
        ctx.clearRect(0, 0, ww, wh);
        for (var i = 0; i < amount; i++) {
            particles[i].render();
        }
    }

    //window.addEventListener("resize", initScene);
    //window.addEventListener("mousemove", onMouseMove);
    var canvasWr = $('.canvas_wrap');
    for (var i = 0; i < canvasWr.length; i++) {
        canvasWr[i].addEventListener("mousemove", onMouseMove);
    }
    setTimeout(function () {
        initScene();
        requestAnimFrame(render);
    }, 150);
}

window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();