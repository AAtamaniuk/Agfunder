$(document).ready(function(){
  $(".JS-scroll-menu").on("click","a", function (event) {
    event.preventDefault();
    var id  = $(this).attr('href'),
    top = $(id).offset().top - 80;
    $('body,html').animate({scrollTop: top}, 1000);
  });
});

