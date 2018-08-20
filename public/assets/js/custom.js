jQuery(document).ready(function(){
  'use strict';
  //============================== PRE LOADER =============================================
  setTimeout(function(){
    $('body').addClass('loaded');
  }, 3000);


  //============================== SELECT BOX =========================
  $('.select-drop').selectbox();

  //============================== FIXED HEADER =========================
  $(window).on('load', function(){
    $('#body').each(function(){
      var header_area = $('.nav-wrapper');
      var main_area = header_area.find('.navbar');
      //SCROLL
      $(window).scroll(function(){
        if( main_area.hasClass('navbar-sticky') && ($(this).scrollTop() <= 400 || $(this).width() <= 750)){
          main_area.removeClass('navbar-sticky').appendTo(header_area);

        }else if( !main_area.hasClass('navbar-sticky') && $(this).width() > 750 && $(this).scrollTop() > 400 ){
          header_area.css('height', header_area.height());
          main_area.css({'opacity': '0'}).addClass('navbar-sticky');
          main_area.appendTo($('body')).animate({'opacity': 1});
        }
      });
    });
  });
  //============================== HEADER =========================

  $('.navbar a.dropdown-toggle').on('click', function(e) {
    var elmnt = $(this).parent().parent();
    if (!elmnt.hasClass('nav')) {
      var li = $(this).parent();
      var heightParent = parseInt(elmnt.css('height').replace('px', '')) / 2;
      var widthParent = parseInt(elmnt.css('width').replace('px', '')) - 10;

      if(!li.hasClass('open')){
        li.addClass('open');
      }
      else {
        li.removeClass('open');
        $(this).next().css('top', heightParent + 'px');
        $(this).next().css('left', widthParent + 'px');
      }

      return false;
    }
  });

  //============================== ALL DROPDOWN ON HOVER =========================
  if($('.navbar').width() > 1007)
  {
    $('.nav .dropdown').hover(function() {
      $(this).addClass('open');
    },
    function() {
      $(this).removeClass('open');
    });
  }

  //============================== SMOOTH SCROLLING TO SECTION =========================

  $('.scrolling  a[href*="#"]').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var target = $(this).attr('href');
    $(target).velocity('scroll', {
      duration: 800,
      offset: -150,
      easing: 'easeOutExpo',
      mobileHA: false
    });
  });

  // scroll to a div with the ID "scrollToThis" by clicking a link with the class "scrollLink"
  $('.scrolling').click( function() {
    $('html, body').animate({
      scrollTop: $('#message').offset().top -50
    }, 600);
  });

  //============================== BOOTSTRA THUMBNAIL SLIDER =========================
  (function(){
    $('#thubmnailSlider').carousel({ interval: 3000 });
  }());

  (function(){
    $('.thumbnailCarousel .item').each(function(){
      var itemToClone = $(this);
      var i = 1;
      if ($(window).width() <= 767) {
        for (i=1;i<1;i++) {
          itemToClone = itemToClone.next();

          if (!itemToClone.length) {
            itemToClone = $(this).siblings(':first');
          }

          itemToClone.children(':first-child').clone()
          .addClass('cloneditem-'+(i))
          .appendTo($(this));
        }
      } else if ($(window).width() <= 991) {
        for (i=1;i<2;i++) {
          itemToClone = itemToClone.next();

          if (!itemToClone.length) {
            itemToClone = $(this).siblings(':first');
          }

          itemToClone.children(':first-child').clone()
          .addClass('cloneditem-'+(i))
          .appendTo($(this));
        }
      } else {
        for (i=1;i<3;i++) {
          itemToClone = itemToClone.next();

          if (!itemToClone.length) {
            itemToClone = $(this).siblings(':first');
          }

          itemToClone.children(':first-child').clone()
          .addClass('cloneditem-'+(i))
          .appendTo($(this));
        }
      }

    });
  }());

  //============================== COUNTER-UP =========================
  $('.counter').counterUp({
    delay: 10,
    time: 2000
  });

  //============================== DATE-PICKER =========================

  $('.datepicker').datepicker({
    startDate: 'dateToday',
    autoclose: true
  });

  //============================== FILE UPLOADER =========================
  $(document).on('click', '.browse', function(){
    var file = $(this).parent().parent().parent().find('.file');
    file.trigger('click');
  });
  //============================== DATA TABLE =========================


  //============================== MAIN SLIDER =========================

  var $heroSlider = $( '.main-slider .inner' );
  if ( $heroSlider.length > 0 ) {
    $heroSlider.each( function () {

      var loop = $(this).parent().data('loop'),
      autoplay = $(this).parent().data('autoplay'),
      interval = $(this).parent().data('interval') || 3000;

      $(this).owlCarousel({
        items: 1,
        loop: loop,
        margin: 0,
        nav: true,
        dots: false,
        navText: [ ],
        autoplay: autoplay,
        autoplayTimeout: interval,
        autoplayHoverPause: true,
        smartSpeed:700,
        rtl:false
      });
    });
  }

  //============================== OWL-CAROUSEL =========================

  var owl = $('.owl-carousel.partnersLogoSlider');
  owl.owlCarousel({
    loop:true,
    margin:28,
    autoplay:true,
    autoplayTimeout:6000,
    autoplayHoverPause:true,
    nav:true,
    dots: false,
    smartSpeed:500,
    rtl:false,
    responsive:{
      320:{
        slideBy: 1,
        items:1
      },
      768:{
        slideBy: 1,
        items:3
      },
      992:{
        slideBy: 1,
        items:4
      }
    }
  });

  // Testimonial Testimonial Owl Carousel
  $('.testimonial-slider').owlCarousel({
    center: true,
    loop: true,
    autoplay: true,
    autoplayTimeout: 6000,
    smartSpeed:1000,
    responsive:{
      320:{
        slideBy: 1,
        items:1,
      },
      768:{
        slideBy: 1,
        items:1
      },
      992:{
        slideBy: 1,
        items:3
      }
    }
  });

  //=========================== FANCYBOX ==========================
  $('.quick_view').fancybox({
    baseClass : 'quick-view-container',
    infobar   : false,
    buttons   : false,
    thumbs    : false,
    margin    : 0,
    touch     : {
      vertical : false
    },
    animationEffect    : false,
    transitionEffect   : 'slide',
    transitionDuration : 500,
    baseTpl :
    '<div class="fancybox-container" role="dialog">' +
    '<div class="quick-view-content">' +
    '<div class="quick-view-carousel">' +
    '<div class="fancybox-stage"></div>' +
    '</div>' +
    '<div class="quick-view-aside"></div>' +
    '<button data-fancybox-close class="quick-view-close">X</button>' +
    '</div>' +
    '</div>',

    onInit : function( instance ) {
      /*
      #1 Create bullet navigation links
      =================================
      */
      var bullets = '<ul class="quick-view-bullets">';

      for ( var i = 0; i < instance.group.length; i++ ) {
        bullets += '<li><a data-index="' + i + '" href="javascript:;"><span>' + ( i + 1 ) + '</span></a></li>';
      }

      bullets += '</ul>';

      $( bullets ).on('click touchstart', 'a', function() {
        var index = $(this).data('index');

        $.fancybox.getInstance(function() {
          this.jumpTo( index );
        });

      })
      .appendTo( instance.$refs.container.find('.quick-view-carousel') );
      /*
      #2 Add product form
      ===================
      */
      var $element = instance.group[ instance.currIndex ].opts.$orig;
      var form_id  = $element.data('qw-form');

      instance.$refs.container.find('.quick-view-aside').append(

        // In this example, this element contains the form
        $( '#' + form_id ).clone( true ).removeClass('hidden')
      );
    },
    beforeShow : function( instance ) {
      /*
      Mark current bullet navigation link as active
      */
      instance.$refs.container.find('.quick-view-bullets')
      .children()
      .removeClass('active')
      .eq( instance.currIndex )
      .addClass('active');
    }
  });


  //============================== CLOSE BUTTON =========================
  $('.close-btn').click(function () {
    $(this).parent().hide();
  });

  //============================== SLICK CAROUSEL =========================
  // Banner City Carousel
  function doAnimations(elements) {
    var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    elements.each(function() {
      var $this = $(this);
      var $animationDelay = $this.data('delay');
      var $animationType = 'animated ' + $this.data('animation');
      $this.css({
        'animation-delay': $animationDelay,
        '-webkit-animation-delay': $animationDelay
      });
      $this.addClass($animationType).one(animationEndEvents, function() {
        $this.removeClass($animationType);
      });
    });
  }

  $('banner-slick-slider .inner').on('init', function(e, slick) {
    var $firstElements = $('.slide1').find('[data-animation]');
    doAnimations($firstElements);
  });

  $('.banner-slick-slider .inner').on('beforeChange', function(e, slick, currentSlide, nextSlide) {
    var $animatingElements = $('div.slide[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
    doAnimations($animatingElements);
  });

  $('.banner-slick-slider .inner').slick({
    autoplay: true,
    autoplaySpeed: 3000,
    dots: false,
    arrows: true,
    fade: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          dots: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          dots: false,
          arrows: false,
          autoplay: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          dots: false
        }
      }
    ]
  });

  //============================== ISOTOP =========================
  var grid = $('.gallery_grid');

  if(grid.length) {
    grid.isotope({
      itemSelector : '.element',
      layoutMode : 'fitRows'
    });

    $('#filters .button').on('click', function() {
      $('#filters .button').removeClass('active');
      $(this).addClass('active');

      var selector = $(this).attr('data-filter');
      $('.gallery_grid').isotope({
        filter : selector
      });
      return false;
    });
  }
  //============================== RATEYO =========================
  $(".user-pro").rateYo({
    starWidth: "15px",
    spacing   : "5px"
  });
  $(".visitor").rateYo({
    rating: 3.2,
    readOnly: true,
    starWidth: "15px",
    spacing   : "5px"
  });
  $(".user").rateYo({
    starWidth: "15px",
    spacing   : "5px"
  });

  //============================== RATEYO =========================
  $('.fa-heart-o').on('click', function(){
    $(this).toggleClass('active');
  });


  $('.grid').isotope({
    itemSelector: '.grid-item',
    layoutMode: 'fitRows'
  });
});
