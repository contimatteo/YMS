////////////////////////////////////////////////////////////////////////////////

module.exports = {

  // songs
  songNameFormatter(artist, song) {
    /*
    OGGETTO CANZONE
    {
      "link1": "/canzone",
      "link2": "/canzone(song)",
      "link3": "/canzone(artista_song)""
    }
    */
    // string replace
    // (Green Day, American Idiot)
    // return {"link1": "/American_Idiot", "link2": "/American_Idiot(song)", "link3": "/American_Idiot(Green_Day_song)"}
  },
  // artists
  artistNameFormatter(artist) {
    
  }
};

////////////////////////////////////////////////////////////////////////////////