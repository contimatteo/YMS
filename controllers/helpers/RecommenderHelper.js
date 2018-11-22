// ////////////////////////////////////////////////////////////////////////////////

self = module.exports = {

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

  localRelativePopularityCounter(videosHistory, currentVideoId) {
    // array for returnig videos history recommendation
    var videoList = []
    for (var index = 0; index < (videosHistory.length - 1); index++) {
      video1 = videosHistory[index];
      if (video1.FKVideoId == currentVideoId) {
        // video2 = videosHistory[index+1];
        // // video3 = videosHistory[index + 2];
        // if (/*video1.FKVideoId == video3.FKVideoId && */ video1.FKVideoId != video2.FKVideoId) {
        //   self.createVideoRelation(videoList, video2.FKVideoId);
        // }
        video2 = videosHistory[index+1];
        // from A goes to B with complete view
        if (video1.complete==1 && video1.FKVideoId!=video2.FKVideoId && video2.complete==1) {
          self.createVideoRelation(videoList, video2.FKVideoId);
        }
        if((index+2)<=videosHistory.length - 1) {
          video3 = videosHistory[index + 2];
          video4 = videosHistory[index + 3];
          // from B goes to A with partial view and from A goes to B with complete view
          if(video2.complete==1 && video2.FKVideoId!=video3.FKVideoId && video3.complete==0 && video3.FKVideoId==video1.FKVideoId && video4.complete==1 && video1.FKVideoId!=video4.FKVideoId) {
            self.createVideoRelation(videoList, video4.FKVideoId);
            index++;
            index++;
          }
        }
      }
    }
    // order results by view
    videoList = self._orderVideoHistoryFoundedByViews(videoList);
    console.log("%j", videoList);
    return videoList;
  },

  createVideoRelation(videoArray, videoId) {
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

};

// ////////////////////////////////////////////////////////////////////////////////