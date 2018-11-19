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

  viewsHistoryCounter(videosHistory, currentVideoId) {
    // array for returnig videos history recommendation
    var videoList = []
    for (var index = 0; index < (videosHistory.length - 2); index++) {
      currentView = videosHistory[index];
      if (currentView.FKVideoId == currentVideoId) {
        nextView = videosHistory[index + 1];
        nextNextView = videosHistory[index + 2];
        if (currentView.FKVideoId == nextNextView.FKVideoId && currentView.FKVideoId != nextView.FKVideoId) {
          self.createVideoRelation(videoList, nextView.FKVideoId);
        }
      }
    }
    // order results by view
    videoList = self._orderVideoHistoryFoundedByViews(videoList);
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