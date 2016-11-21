$(document).ready(function(){
  $(".JS-scroll-menu").on("click","a", function (event) {
    event.preventDefault();
    $(".JS-sidebar-menu").removeClass("sidebar__menu--show-tablet");
    var id  = $(this).attr('href'),
    top = $(id).offset().top - 80;
    $('body,html').animate({scrollTop: top}, 1000);
  });
});

/*$(document).ready(function(){
  $(".JS-sidebar-toggle").on("click", function (event) {
    event.preventDefault();
    $(".JS-sidebar-menu").toggle();
  });
});*/

$(document).ready(function(){
  $(".JS-sidebar-toggle").on("click", function (event) {
    event.preventDefault();
    $(".JS-sidebar-menu").toggleClass("sidebar__menu--show-tablet");
  });
});


$(document).ready(function(){
  $(".form-bg__close").on("click", function (event) {
    event.preventDefault();
    $(".form-bg").fadeOut();
  });
});
