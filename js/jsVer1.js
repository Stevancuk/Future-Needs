"use strict";








$(function(){
  //var pageTitle = $(document).find("title").text();

  //Temp for 'next next next' through pages
  // if(pageTitle == "Clean Questionnaire") {
  //   $('#next_buttons_subb_2_button').on("click", function(e) {
  //     e.preventDefault();
  //     window.location = "indexVideo.html";
  //   })
  // }




  // Warning Duplicate IDs
  $('[id]').each(function(){
    var ids = $('[id="'+this.id+'"]');
    if(ids.length>1 && ids[0]==this)
      console.warn('Multiple IDs #'+this.id);
  });

  $('[name]').each(function(){
    var names = $('[name="'+this.name+'"]');
    if(names.length>1 && names[0]==this)
      console.warn('Multiple names #'+this.name);
  });

})