var constants = require('./ConstantsHelper.js');
const recommenderNumber = constants.recommenderVideosNumber;

var self = module.exports = {

  _orderVideoFoundedByViews(array) {
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

  _orderVideoFoundedByHit(array) {
    return array.sort(function (first, second) {
      var a = second.hit;
      var b = first.hit;
      if (a < b) {
        return 1;
      } else if (a > b) {
        return -1;
      } else {
        return 1;
      }
    });
  },

  localRelativePopularityCounter(videosHistory, currentVideoId) {
    // array for returnig videos history recommendation
    var videoList = []
    for (var index = 0; index < (videosHistory.length - 1); index++) {
      video1 = videosHistory[index];
      if (video1.FKVideoId == currentVideoId) {
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
    videoList = self._orderVideoFoundedByViews(videoList);
    return videoList;
  },

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

  // check if json for this grup is valid
  validateGroupJson(json) {
    if (json && typeof json === 'object' && json.recommended && Array.isArray(json.recommended)) {
      return true;
    }
    return false;
  },

  globalAbsolutePopularity(groupsVideos, myVideosFounded = null) {
    var videosListInput = groupsVideos
    var videoList = [];
    // foreach group's json
    videosListInput.forEach((video, index) => {
      // check if this video is valid
      if (video != null && video.lastSelected != null && video.timesWatched != null) {
        var id = "";
        var lastWatched = "";
        var views = 0;
        if (video.videoId != null) {
          id = video.videoId;
        }
        if (video.videoID != null) {
          id = video.videoID;
        }
        views = video.timesWatched;
        lastWatched = video.lastSelected;
        self.createGlobalVideoRelation(videoList, id, views, lastWatched);
      }
    });

    if (myVideosFounded) {
      // foreach recommended by my local relative algorithm
      myVideosFounded.forEach((myVideo, index) => {
        self.createGlobalVideoRelation(videoList, myVideo.youtube_id, myVideo.views, myVideo.updatedAt);
      });
    }
    // return array with videos as {id, views, lastWatched}
    videoList = self._orderVideoFoundedByViews(videoList);
    // take only the first <n> videos
    videoList = videoList.slice(0, recommenderNumber);
    // return
    return videoList;
  },

  globalRelativePopularity(groupsVideos, myVideosFounded = null) {
    var videoList = [];
    var hit = 0;
    // foreach group's json
    // groupsVideos.forEach((singleJsonResponse, index) => {
    hit = 0;
    // if (self.validateGroupJson(singleJsonResponse)) {
    // this json is valid
    groupsVideos.forEach((video, index) => {
      // check if this video is valid
      if (video != null && video.lastSelected != null && video.timesWatched != null) {
        hit++;
        var id = "";
        var lastWatched = "";
        var views = 0;
        if (video.videoId != null) {
          id = video.videoId;
        }
        if (video.videoID != null) {
          id = video.videoID;
        }
        views = video.timesWatched;
        lastWatched = video.lastSelected;
        self.createGlobalVideoRelationHitmap(videoList, id, views, lastWatched, hit);
      }
    });
    // }
    // });
    hit = 0;
    if (myVideosFounded) {
      // foreach recommended by my local relative algorithm
      myVideosFounded.forEach((myVideo, index) => {
        hit++;
        self.createGlobalVideoRelationHitmap(videoList, myVideo.youtube_id, myVideo.views, myVideo.updatedAt, hit);
      });
    }
    // return array with videos as {id, views, lastWatched}
    videoList = self._orderVideoFoundedByHit(videoList);
    // take only the first <n> videos
    videoList = videoList.slice(0, recommenderNumber);
    // return
    return videoList;
  },

  createGlobalVideoRelation(videoArray, id, views, lastWatched) {
    var trovato = false;
    videoArray.forEach(function (viewObject) {
      if (viewObject.id == id) {
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

  createGlobalVideoRelationHitmap(videoArray, id, views, lastWatched, hit) {
    var trovato = false;
    videoArray.forEach(function (viewObject) {
      if (viewObject.id == id) {
        try {
          // check if the new date is more recent
          if (Date.parse(viewObject.lastWatched) < Date.parse(lastWatched)) {
            // set new date as last selected 
            viewObject.lastWatched = lastWatched;
          }
          if (viewObject.hit > hit) {
            // set new hit as current
            viewObject.hit = hit;
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
        lastWatched: lastWatched,
        hit: hit
      });
    } else trovato = false;
  },

  artistSimilarity(artistsFounded) {
    var numberOfArtists = 0;
    var artistsRelatedNames = [];
    // count artist related numbers
    artistsFounded.forEach(function (artistObject, index) {
      numberOfArtists += artistObject.Related.length;
      // foreach related artist
      artistObject.Related.forEach(function (artist, index) {
        artistsRelatedNames.push(artist.name);
      });
    });
    // limit max number of videos
    var numVideosForEachArtist = 0;
    var remainder = 0;
    if (numberOfArtists > constants.recommenderVideosNumber) {
      numberOfArtists = constants.recommenderVideosNumber;
      numVideosForEachArtist = 1;
      remainder = 0;
    } else {
      numVideosForEachArtist = Math.floor(constants.recommenderVideosNumber / numberOfArtists);
      remainder = constants.recommenderVideosNumber - (numberOfArtists * numVideosForEachArtist);
    }
    var artistVideoNums = [];
    for (var i = 0; i < numberOfArtists; i++) {
      var currentNumberOfVideos = 0;
      if (remainder > 0) {
        currentNumberOfVideos = numVideosForEachArtist + 1;
        remainder -= 1;
      } else
        currentNumberOfVideos = numVideosForEachArtist;
      // set current related artist videos number
      artistVideoNums.push(currentNumberOfVideos);
    };
    return {
      artistsNames: artistsRelatedNames,
      artistsVideosNumbers: artistVideoNums
    };
  },

  bandMembersSimilarity(artistsFounded) {
    var numberOfArtists = 0;
    var artistsRelatedNames = [];
    // count artist related numbers
    artistsFounded.forEach(function (artistObject, index) {
      numberOfArtists += artistObject.BandMembers.length;
      // foreach related artist
      artistObject.BandMembers.forEach(function (artist, index) {
        artistsRelatedNames.push(artist.name);
      });
    });
    // limit max number of videos
    var numVideosForEachArtist = 0;
    var remainder = 0;
    if (numberOfArtists > constants.recommenderVideosNumber) {
      numberOfArtists = constants.recommenderVideosNumber;
      numVideosForEachArtist = 1;
      remainder = 0;
    } else {
      numVideosForEachArtist = Math.floor(constants.recommenderVideosNumber / numberOfArtists);
      remainder = constants.recommenderVideosNumber - (numberOfArtists * numVideosForEachArtist);
    }
    var artistVideoNums = [];
    for (var i = 0; i < numberOfArtists; i++) {
      var currentNumberOfVideos = 0;
      if (remainder > 0) {
        currentNumberOfVideos = numVideosForEachArtist + 1;
        remainder -= 1;
      } else
        currentNumberOfVideos = numVideosForEachArtist;
      // set current related artist videos number
      artistVideoNums.push(currentNumberOfVideos);
    };
    return {
      artistsNames: artistsRelatedNames,
      artistsVideosNumbers: artistVideoNums
    };
  },

};