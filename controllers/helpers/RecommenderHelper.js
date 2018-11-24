// ////////////////////////////////////////////////////////////////////////////////
const recommenderNumber = 20;

var self = module.exports = {

  _orderVideoHistoryFoundedByViews(array) {
    return array.sort(function (first, second) {
      var a = second.views;
      var b = first.views;
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      } else {
        return 0;
      }
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  localRelativePopularityCounter(videosHistory, currentVideoId) {
    // array for returnig videos history recommendation
    var videoList = []
    for (var index = 0; index < (videosHistory.length - 1); index++) {
      video1 = videosHistory[index];
      if (video1.FKVideoId == currentVideoId) {
        // video2 = videosHistory[index+1];
        // // video3 = videosHistory[index + 2];
        // if (/*video1.FKVideoId == video3.FKVideoId && */ video1.FKVideoId != video2.FKVideoId) {
        //   self.createLocalVideoRelation(videoList, video2.FKVideoId);
        // }
        video2 = videosHistory[index + 1];
        // from A goes to B with complete view
        if (video1.complete == 1 && video1.FKVideoId != video2.FKVideoId && video2.complete == 1) {
          self.createLocalVideoRelation(videoList, video2.FKVideoId);
        }
        if ((index + 2) <= videosHistory.length - 1) {
          video3 = videosHistory[index + 2];
          video4 = videosHistory[index + 3];
          // from B goes to A with partial view and from A goes to B with complete view
          if (video2.complete == 1 && video2.FKVideoId != video3.FKVideoId && video3.complete == 0 && video3.FKVideoId == video1.FKVideoId && video4.complete == 1 && video1.FKVideoId != video4.FKVideoId) {
            self.createLocalVideoRelation(videoList, video4.FKVideoId);
            index++;
            index++;
          }
        }
      }
    }
    // order results by view
    videoList = self._orderVideoHistoryFoundedByViews(videoList);
    return videoList;
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  createLocalVideoRelation(videoArray, videoId) {
    var trovato = false;
    videoArray.forEach(function (viewObject) {
      if (viewObject.videoId == videoId) {
        trovato = true;
        viewObject.views++;
      }
    });
    if (!trovato) {
      videoArray.push({
        videoId: videoId,
        views: 1
      });
    } else trovato = false;
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // check if json for this grup is valid
  _validateGroupJson(json) {
    if (json !== null && typeof json === 'object' && json.recommended != null && Array.isArray(json.recommended)) {
      return true;
    }
    return false;
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  globalRelativePopularity(myVideosFounded, groupsVideos) {
    var videoList = [];
    // foreach group's json
    groupsVideos.forEach((singleJsonResponse, index) => {
      if (self._validateGroupJson(singleJsonResponse)) {
        // this json is valid
        singleJsonResponse.recommended.forEach((video, index) => {
          // check if this video is valid
          if (video != null && video.lastSelected != null && video.timesWatched != null) {
            var id = "";
            var lastWatched = "";
            var views = 0;
            if (video.videoId != null) {
              // console.log(video.videoId + " ["+video.views+"]");
              id = video.videoId;
            }
            if (video.videoID != null) {
              // console.log(video.videoID + " ["+video.views+"]");
              id = video.videoID;
            }
            views = video.timesWatched;
            lastWatched = video.lastSelected;
            self.createGlobalVideoRelation(videoList, id, views, lastWatched);
          } else {
           // invalid video json
          }
        });
      } else {
        // this json isn't valid
      }
    });
    // foreach recommended by local relative algorithm
    myVideosFounded.forEach((myVideo, index) => {
      self.createGlobalVideoRelation(videoList, myVideo.youtube_id, myVideo.views, myVideo.updatedAt);
    });
    // return array with videos as {id, views, lastWatched}
    videoList = self._orderVideoHistoryFoundedByViews(videoList);
    // take only the first <n> videos
    videoList = videoList.slice(0, recommenderNumber);
    return videoList;
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  createGlobalVideoRelation(videoArray, id, views, lastWatched) {
    //console.log("video: " + id+", "+views+", "+lastWatched);
    var trovato = false;
    videoArray.forEach(function (viewObject) {
      if (viewObject.id == id) {
        //console.log("video["+video.id+"] gia presente --> " + viewObject.views + " + " + views);
        try {
          // check if the new date is more recent
          if (Date.parse(viewObject.lastWatched) < Date.parse(lastWatched)) {
            // set new date as last selected 
            viewObject.lastWatched = lastWatched;
          }
        } catch (error) {
          // nothing to do 
        }
        // increment views
        viewObject.views += views;
        trovato = true;
      }
    });
    if (!trovato) {
      videoArray.push({
        id: id,
        views: views,
        lastWatched: lastWatched
      });
    } else trovato = false;
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};

// ////////////////////////////////////////////////////////////////////////////////