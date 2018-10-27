// ////////////////////////////////////////////////////////////////////////////////

// module.exports = {

//   // songs
//   nameFormatter(artist, song) {
//     var prefix = "http://dbpedia.org/resource/";
//     /*
//     OGGETTO CANZONE
//     {
//       "link1": "/canzone",
//       "link2": "/canzone(song)",
//       "link3": "/canzone(artista_song)""
//     }
//     */
//     // string replace
//     // (Green Day, American Idiot)
//     // return {"link1": "/American_Idiot", "link2": "/American_Idiot(song)", "link3": "/American_Idiot(Green_Day_song)"}
//     var object={link1:"", link2:"", link3:""};
    
//     song = song.trim();
//     artist = artist.trim();

//     song = song.toLowerCase();
//     artist = artist.toLowerCase();

//     var arraySplittedSong = song.split(" ");
//     var arraySplittedArtist = artist.split(" ");
    
//     function capitalizeFirstLetter(myString) {
//       return myString.charAt(0).toUpperCase() + myString.slice(1);
//     }

//     for (var i =0; i< arraySplittedSong.length; i++)
//     {
//       arraySplittedSong[i]=capitalizeFirstLetter(arraySplittedSong[i]);
//     }

//     for (var i =0; i< arraySplittedArtist.length; i++)
//     {
//       arraySplittedArtist[i]=capitalizeFirstLetter(arraySplittedArtist[i]);
//     }

//     for (var i = 0; i< arraySplittedSong.length; i++)
//     {
//       if (i == 0)
//       {
//         var newSong = arraySplittedSong[i];
//       }
//       else
//       {
//         newSong = newSong + '_' + arraySplittedSong[i]
//       }
//     }

//     for (var i =0; i< arraySplittedArtist.length; i++)
//     {
//       if (i == 0)
//       {
//         var newArtist = arraySplittedArtist[i]; + '_';
//       }
//       else
//       {
//         newArtist = newArtist + '_' + arraySplittedArtist[i];
//       }

//     }

//     // var link1 = song.replace(/\s+/g, '_');
//     var link1 = prefix + newSong;
//     object.link1 = link1;

//     // var link2 = song.replace(/\s+/g, '_');
//     var link2 = prefix + newSong + "(song)";
//     object.link2 = link2;

//     // var link3 = song.replace(/\s+/g, '_');
//     // var artista = artist.replace(/\s+/g, '_');
//     var link3 = prefix + newSong + "(" + newArtist + "_song)";
//     object.link3 = link3;

//     return(object);

//   }
// };

// ////////////////////////////////////////////////////////////////////////////////