////////////////////////////////////////////////////////////////////////////////

module.exports = {

  // songs
  songNameFormatter(artist, song) {
    var prefix = "http://dbpedia.org/page/";
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
    var object={link1:"", link2:"", link3:""};
    var link1 = song.replace(/\s+/g, '_');
    link1 = prefix + link1;
    object.link1 = link1;

    var link2 = song.replace(/\s+/g, '_');
    link2 = prefix + link2 + "(song)";
    object.link2 = link2;

    var link3 = song.replace(/\s+/g, '_');
    var artista = artist.replace(/\s+/g, '_');
    link3 = prefix + link3 + "(" + artista + "_song)";
    object.link3 = link3;

    return(object);

  },
  // artists
  artistNameFormatter(artist) {

  }
};

////////////////////////////////////////////////////////////////////////////////