function vimScrollUpdate() {
  // grab the scroll amount and the window height
  var scrollAmount = $(window).scrollTop(),
      documentHeight = $(document).height(),
      scrollPercent = (scrollAmount / documentHeight) * 100;
      currentLine = scrollAmount > 100000000 ? "&infin;" : scrollAmount.toFixed(0);

  $('.vim-line-percent').text(scrollPercent.toFixed(0) + '%'); 
  $('.vim-line-current .vim-line-row').html(currentLine);
}
$(document).ready(function() {
  vimScrollUpdate();
  $(document).scroll(function(e){
    vimScrollUpdate();
  });
});
