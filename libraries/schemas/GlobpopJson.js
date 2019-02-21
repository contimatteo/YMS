// MAIN CLASS
module.exports = class GlobpopJson {
  constructor(videoId, timesWatched, lastwatched) {
    this.site = "site1834.tw.cs.unibo.it"
    this.recommended = []

    if (videoId && timesWatched && lastwatched) {
      this.recommender = videoId
      this.timesWatched = timesWatched
      this.lastWatched = lastwatched
    }
  }

  addVideoRecommended(videoId, views, lastSelected, prevalentReason = null) {
    this.recommended.push({
      videoId: videoId,
      timesWatched: views,
      prevalentReason: prevalentReason || "Local Popularity",
      lastSelected: lastSelected
    })
  }
}