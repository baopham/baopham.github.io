function vimScrollUpdate() {
  // grab the scroll amount and the window height
  var scrollAmount = $(window).scrollTop(),
      height = $(document).height() - $(window).height(),
      scrollPercent = height > 0 ? (scrollAmount / height) * 100 : 0,
      scrollAmount = scrollAmount > 100000000 ? "&infin;" : scrollAmount.toFixed(0);

  $('.vim-line-percent').text(scrollPercent.toFixed(0) + '%'); 
  $('.vim-line-current .vim-line-row').html(scrollAmount);
}
$(document).ready(function() {
  vimScrollUpdate();
  $(document).scroll(function(e){
    vimScrollUpdate();
  });
});
