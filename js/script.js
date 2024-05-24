document.addEventListener(
    "DOMContentLoaded", () => {
        new Mmenu( "#mobile_menu", {
            // options
            offCanvas: {
                position: "right-front",
                
            },
            navbars: [
                {
                    "position": "top",
                    "content": ["prev", "title", "close"],
                },
                {
                    "position": "bottom",
                    "content": [
                         "<form  class='search_block' action=\"/search\" method=\"get\">"+$("#search_block").html()+"</form>"
                    ]
                },
                {
                    "position": "bottom",
                    "content": [
                        "<div class='socials'>"+$("#top .socials").html()+"</div>"
                    ]
                },
                
            ],
        }, {
            // configuration
            language: 'ru', 
        });
    }
);

$(document).ready(function(){
    var win=$(window);


    if ($("#tdb_form").length) {
        let topToFilter = localStorage.getItem("filter-scroll");
        if (topToFilter !== null) {
            win.scrollTop(parseInt(topToFilter, 10));
            localStorage.removeItem("filter-scroll")
//            $('.edu-clear').css("cursor", "default");
        }
    }

    // $("#tdb_form select").change(function () {
    //     $("body").css("cursor", "progress");
    //     localStorage.setItem("filter-scroll", win.scrollTop());
    //     $('#tdb_form').submit();
    // });
    // $("#tdb_form_submit").click(function () {
    //     $("#tdb_form select").val('');
    //     localStorage.setItem("filter-scroll", win.scrollTop());
    //     $(this).css("cursor", "wait");
    // });

    $("#tdb_form_submit").click(function () {
        localStorage.setItem("filter-scroll", win.scrollTop());
        $(this).css("cursor", "wait");
    });

    $('.edu-clear').on('click', function(event) {
        event.preventDefault();
//        $(this).css("cursor", "wait");
        $('.edu-cource input').prop('checked', false);
        localStorage.setItem("filter-scroll", win.scrollTop());
        $('#tdb_form').submit();
//        $(this).css("cursor", "pointer");
    });
    $(".edu-cource input").change(function() {
        localStorage.setItem("filter-scroll", win.scrollTop());
//        $(this).css("cursor", "wait");
        $('#tdb_form').submit();
    });




    $('.lang .select').on('click', function(event) {
        event.preventDefault();
        $(this).closest('.lang').toggleClass('open').find('.list').slideToggle('fast');
    });

    $('.toggle_slide').on('click', '.toggle_caption:not(.vacancy_bottom)', function(event) {
        event.preventDefault();
        $(this).closest('.toggle_slide').toggleClass('open').find('>.toggle_block').slideToggle('fast');
    });
    $('.toggle_slide1').on('click', '.toggle_caption1', function(event) {
        event.preventDefault();
        $(this).closest('.toggle_slide1').toggleClass('open').find('.toggle_block1').slideToggle('fast');
    });
    $('.toggle_slide').on('click', '.toggle_caption.vacancy_bottom .title', function(event) {
        event.preventDefault();
        $(this).closest('.toggle_slide').toggleClass('open').find('.toggle_block').slideToggle('fast');
    });


    $('.tab .tab_captions').on('click', 'div.item:not(.active)', function(event){
        event.preventDefault();
        $(this).addClass('active').siblings().removeClass('active').closest('.tab').find('.tab_content').removeClass('active').eq($(this).index()).addClass('active');
    });
   
    $('#search_block').on('click', '.search_btn', function(event) {
        var search_block = $(this).closest('#search_block');
        var left = search_block.closest('.col').position().left;
        var search_input = search_block.children('.search_input');
        if (!search_input.is(':visible')){
            event.preventDefault();
            search_input.css('left', left).fadeIn(400, function(){
                $('#main_menu').hide();
            });
        }
    });
    $('#search_block').on('click', '.close', function(event) {
        $('#main_menu').removeAttr('style');
        $(this).closest('.search_input').fadeOut(400);
    });

    $('#main_menu > li > a').on('click', function(event) {
        var ths=$(this).parent('li');
        var sub=ths.children('.sub');
        if (sub.length){
            event.preventDefault();
            if (sub.is(':hidden')){
                ths.closest('#main_menu').children('li.open').removeClass('open').children('.sub:visible').slideUp(400);
                ths.addClass('open');
                sub.slideDown(400);
                if (!$('.overlay').length){
                    $('.mm-page').append('<div class="overlay"></div>');
                    $('.overlay').fadeTo(400, 0.4);
                }
            }else{
                ths.removeClass('open');
                sub.slideUp(400);
                $('.overlay').fadeOut(400, function() {
                    $('.overlay').remove();
                });
            }
        }
    });

    $(document).mouseup(function (e){
        var div = $('#search_block');
        if (!div.is(e.target) && div.has(e.target).length === 0) {
            $('#main_menu').removeAttr('style');
            div.children('.search_input').fadeOut(400);
        }
    });
    $(document).mouseup(function (e){
        var div = $('#main_menu');
        if (!div.is(e.target) && div.has(e.target).length === 0) {
            div.children('li.open').removeClass('open').children('.sub').slideUp(400);
            $('.overlay').fadeOut(400, function() {
                $('.overlay').remove();
            });
        }
    });

    win.load(function() {
        if ($('.marquee').length){
            $('.marquee').marquee({
                delayBeforeStart: 0,
                speed: 50,
                pauseOnHover: true,
                duplicated: true,
                startVisible: true
            });
        }
    });


    var main_slider = $('#main_slider.owl-carousel');
    main_slider.owlCarousel({
        autoplay: true,
        loop:true,
        nav: false,
        items: 1,
        dots: false,
        autoplayTimeout: 10000,
        smartSpeed: 400,
        autoplaySpeed: 400,
        onInitialize: function(){
            bg_slider(main_slider);
        },
        onResize: function(){
            bg_slider(main_slider);
        }
    });

   $('.product_slider').owlCarousel({
        autoplay: true,
        loop:true,
        nav: false,
        dots: false,
        autoplayTimeout: 10000,
        smartSpeed: 400,
        autoplaySpeed: 400,
        margin: 28,
        responsive: {
            0: {
                items: 1
            },
            641: {
                items: 2
            },
            769: {
                items: 3,
                nav: true
            }
        }
    });

    $('#news_slider').owlCarousel({
        autoplay: false,
        loop: false,
        nav: true,
        dots: false,
        autoplayTimeout: 10000,
        smartSpeed: 400,
        autoplaySpeed: 400,
        margin: 0,
        responsive: {
            0: {
                items: 1,
                nav: false,
                autoplay: true,
                loop: true
                
            },
            692: {
                items: 1,
                nav: true,
                autoplay: false,
                loop: false
                
            },
            961: {
                items: 3
            }
        }
    });

    $('.owl-carousel:not(#main_slider, #news_slider)').owlCarousel({
        loop:true,
        margin:0,
        nav:true,
        dots: false,
        responsive:{
            0:{
                items:1
            },
            769:{
                items:2
            }
        }
    });



    function bg_slider(slider){
        slider.find(".item").each(function(index, el) {
            var ths = $(this);
            if (win.width()<=1024){
                if (win.width()<=640){
                    ths.css({
                        'background-image': 'url("'+ths.attr('data-mbg')+'")'
                    });
                }else{
                    ths.css({
                        'background-image': 'url("'+ths.attr('data-tbg')+'")'
                    });
                }
            }else{
                ths.css({
                    'background-image': 'url("'+ths.attr('data-bg')+'")'
                });
            }
        });
    }
    var banner = $('.main_banner');
    win.on('load resize', function(event) {
        if (banner.attr('data-mbg') || banner.attr('data-tbg') || banner.attr('data-bg')) {
            if (win.width()<=1024){
                if (win.width()<=640){
                    banner.css({
                        'background-image': 'url("'+banner.attr('data-mbg')+'")'
                    });
                }else{
                    banner.css({
                        'background-image': 'url("'+banner.attr('data-tbg')+'")'
                    });
                }
            }else{
                banner.css({
                    'background-image': 'url("'+banner.attr('data-bg')+'")'
                });
            }
        }
    });
    var slide = $('.no-owl-carousel .item');
    win.on('load resize', function(event) {
        if (slide.attr('data-mbg') || slide.attr('data-tbg') || slide.attr('data-bg')) {
            if (win.width()<=1024){
                if (win.width()<=640){
                    slide.css({
                        'background-image': 'url("'+slide.attr('data-mbg')+'")'
                    });
                }else{
                    slide.css({
                        'background-image': 'url("'+slide.attr('data-tbg')+'")'
                    });
                }
            }else{
                slide.css({
                    'background-image': 'url("'+slide.attr('data-bg')+'")'
                });
            }
        }
    });

    $('.toggle-blocks').on('click', function(event) {
        event.preventDefault();
        $('.'+$(this).data('toggle')).toggle('fast');
        if (!$(this).hasClass('not-hide')) {
            $(this).hide();
        }

    });


    $(".fancybox").fancybox();
    $(".lightbox").fancybox();

    $('.custom-scrollbar, .table_holder').mCustomScrollbar({
        axis:"x" 
    });

    var header = $('#header'),
    top = $('#top'),
    top_h = top.outerHeight(),
    header_h = header.outerHeight();

    win.scroll(function() {
        if(win.scrollTop() > top_h) {
            header.addClass("fixed");
        } else {
            header.removeClass("fixed");
        }
    });

    let elem = document.querySelector('.articles');
    if (elem != null) {
        let infScroll = new InfiniteScroll(elem, {
            // options
            path: '.f3-widget-paginator .next a',
            append: '.news_item',
            hideNav: '.f3-widget-paginator',
            status: '.page-load-status'
        });
    }

    $('.slides .item').on('click', '.more', function(event) {
        event.preventDefault();
        var item=$(this).closest('.item');
        item.find('.text').slideToggle(400,
            function(){
                item.toggleClass('active')
                var more_text=item.find('.more .txt');
                if (item.hasClass('active')){
                    more_text.text('Cвернуть');
                }else{
                    more_text.text('Подробнее');
                }
            });
    });


    $(".toggle_btn").on("click", function(event){
        event.preventDefault();
        var ths = $(this);
        if (ths.hasClass('active')){
            ths.removeClass("active").next('.toggle_holder').slideUp(400);
        }else{
            $('.toggle_btn.active').removeClass('active').next('.toggle_holder').slideUp(400);
            ths.addClass("active").next('.toggle_holder').slideDown(400);
        }
    });

    $('.scrollTo').on('click', function(event) {
        event.preventDefault();
        var id=$(this).attr('href');
        $('html, body').animate({
            scrollTop: $(id).offset().top - top_h - header_h
        }, 1000);
    });

    var tooltip=$('.tooltip');
    tooltip.on('click', function(event) {
        event.preventDefault();
    });
    if (tooltip.length){
        tooltip.tooltipster({
            theme: 'tooltipster-shadow',
            contentAsHTML: true,
            trigger: 'click'
        });
    }

    if (window.location.hash) {
        if (window.location.hash.indexOf('#tab-') === 0) {
            let tabUid = window.location.hash.substr(5);
            let secondHashStart = tabUid.indexOf('#');
            let secondHashId = '';
            console.log(tabUid);
            console.log(secondHashStart);
            if (secondHashStart > 0) {
                secondHashId = tabUid.substr(secondHashStart+1);
                tabUid = tabUid.substr(0, secondHashStart);
            }
            let tabElem = $('#tab-uid-'+tabUid);
            if (tabElem.length) {
                tabElem.addClass('active').siblings().removeClass('active').closest('.tab').find('.tab_content').removeClass('active').eq(tabElem.index()).addClass('active');
                if (secondHashId) {
                    let secondHashElem = $('#'+secondHashId);
                    if (secondHashElem.length) {
                        win.scrollTop(secondHashElem.offset().top);
                    }
                }
            }
        }
    }

// .main_banner .btns a.btn,
    $('.spanel a.icn_txt').on('click', function(event) {
//        console.log('go');
        if ($(this).attr('href').indexOf('#tab-') === 0) {
            event.preventDefault();
//            console.log('go1');
            let tabUid = $(this).attr('href').substr(5);
            let tabElem = $('#tab-uid-'+tabUid);
            if (tabElem.length) {
                tabElem.addClass('active').siblings().removeClass('active').closest('.tab').find('.tab_content').removeClass('active').eq(tabElem.index()).addClass('active');

                $('html, body').animate({
                    scrollTop: tabElem.offset().top - top_h - header_h
                }, 1000);

            }
        }
    });




});
