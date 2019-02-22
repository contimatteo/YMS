////////////////////////////////////////////////////////////////////////////////
var prefix = "http://dbpedia.org/resource/";

module.exports = {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  capitalizeFirstLetter(myString) {
    return myString.charAt(0).toUpperCase() + myString.slice(1);
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  nameFormatter(artist, song) {
    var object = {
      link1: "",
      link2: "",
      link3: ""
    };
    // delete spaces after and before input string
    song = song.trim();
    artist = artist.trim();
    song = song.toLowerCase();
    artist = artist.toLowerCase();
    var arraySplittedSong = song.split(" ");
    var arraySplittedArtist = artist.split(" ");
    // ...
    for (var i = 0; i < arraySplittedSong.length; i++) {
      arraySplittedSong[i] = this.capitalizeFirstLetter(arraySplittedSong[i]);
    }
    // ...
    for (var i = 0; i < arraySplittedArtist.length; i++) {
      arraySplittedArtist[i] = this.capitalizeFirstLetter(arraySplittedArtist[i]);
    }
    // ...
    var newSong;
    for (var i = 0; i < arraySplittedSong.length; i++) {
      if (i == 0) {
        newSong = arraySplittedSong[i];
      } else {
        newSong = newSong + '_' + arraySplittedSong[i]
      }
    }
    // ...
    var newArtist;
    for (var i = 0; i < arraySplittedArtist.length; i++) {
      if (i == 0) {
        newArtist = arraySplittedArtist[i]; + '_';
      } else {
        newArtist = newArtist + '_' + arraySplittedArtist[i];
      }
    }
    // link 1
    var link1 = newSong;
    object.link1 = link1;
    // link 2
    var link2 = newSong + "(song)";
    object.link2 = link2;
    // link 3
    var link3 = newSong + "(" + newArtist + "_song)";
    object.link3 = link3;
    // return object with link
    return (object);
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  getFirstCharacterFromId(videoId){
    var videoIdShortered = videoId.youtube_id.slice(0,4);
    console.log(videoIdShortered)
    return(videoIdShortered);
  }
};

////////////////////////////////////////////////////////////////////////////////
