////////////////////////////////////////////////////////////////////////
//
// lib:       Video Graphics Creation
// author:    @contimatteo
// date:      16/11/2018
//
////////////////////////////////////////////////////////////////////////


function createVideoElement(containerId, videoId, videoImageUrl, videoTitle, channelTitle, recommender) {

  var videoHtmlString = " <div> " +
    " <div class='row'>  " +
    " <div class='col-sm-4 col-xs-12'> " +
    " <div class='categoryImage'> " +
    " <a href='/videos/" + videoId + "'> " +
    " <img src='" + videoImageUrl + "' alt='Image category' class='img-responsive img-rounded'> " +
    " </a> " +
    " </div> " +
    "  </div> " +
    " <div class='col-sm-8 col-xs-12'> " +
    " <div class='categoryDetails' style='padding-top: 12.5px'> " +
    " <h4> " +
    " <a href='/videos/" + videoId + "' style='color: #222222; font-weight:600'> " +
    videoTitle +
    " </a> " +
    " <span aria-hidden='true'></span> " +
    " </h4> " +
    " <p> " +
    " youtube channel: <span class='placeName'>" + channelTitle + "</span> " +
    " <br> " +
    " Reccomended by Random Algorithm " +
    " </p> " +
    " </div> " +
    " </div> " +
    " </div> " +
    " <hr> " +
    " </div> ";

  var htmParsed = $.parseHTML(videoHtmlString);
  $(containerId).append(htmParsed);

}


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////