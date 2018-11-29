// MAIN CLASS
module.exports = class JsonAPI {
  constructor(videoId, timesWatched, lastwatched) {
    this.recommender = videoId;
    this.site = "site1834.tw.cs.unibo.it" ;
    this.timesWatched = timesWatched ;
    this.lastWatched = lastwatched ;
    this.recommended = [] ;
  }

  addVideoRecommended(videoId, views, lastSelected) {
    this.recommended.push({
      videoId : videoId,
      timesWatched : views,
      prevalentReason : "Relative Local Popularity",
      lastSelected : lastSelected
    });
  }
};
