var request = require("request");
var Twitter = require('twitter');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var fs = require("fs");

var firstTerminalCommand = process.argv[2];


var secondTerminalCommand = function() {

  var input2 = "";
  var longInput = process.argv;

  for(var i = 3; i < longInput.length; i++) {
    // console.log(longInput[i]);
    input2 += longInput[i] + " "  
  }

  return input2.substring(0, input2.length - 1);

}


// node liri.js movie-this matrix reloaded
function movieThis(movieTitle = "Mr. Nobody") {

  var movieName = movieTitle;

  // Then run a request to the OMDB API with the movie specified
  request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {

    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {

      console.log("Title of the movie: " + JSON.parse(body).Title);
      console.log("Year the movie came out: " + JSON.parse(body).Year);
      console.log("IMDB Rating of the movie: " + JSON.parse(body).Rated);
      console.log("Rotten Tomatoes Rating of the movie: " + JSON.parse(body).Ratings[1]);
      console.log("Language of the movie: " + JSON.parse(body).Language);
      console.log("Plot of the movie: " + JSON.parse(body).Plot);
      console.log("Actors in the movie: " + JSON.parse(body).Actors);

    }
  });
  
} 


//node liri.js my-tweets
function myTweets() {

  var client = new Twitter(keys);   
   
  var params = {screen_name: '@patluu66'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {

      for(var i = 0; i < 20; i++) {
        console.log("---------------\n");
        console.log(tweets[i].text);      
      }

    }
  });

}


// node liri.js spotify-this-song I Fall Apart
function spotifyThisSong(songInput) {
 
  var spotify = new Spotify({
    id: '21b269d9148a4679be42ec894486fb8b',
    secret: '97cad2d8cc78492797be0b251d552c0c'
  });

  var songTitle = songInput;

  spotify.search({ type: 'track', query: songTitle }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var artistsName = data.tracks.items[0].album.artists[0].name;
    // var album = data.tracks.items[0].album.artists[0].name;
    var address = data.tracks.items[0].album.artists[0].href;
    var album = data.tracks.items[0].album.name;
    var song = data.tracks.items[0].name;


    console.log('Artist(s): ' + artistsName);
    console.log("The song's name: " + song);
    console.log('A preview link of the song from Spotify: ' + address);
    console.log('The album that the song is from: ' + album);
    // console.log(song2);

  });

}


//node liri.js do-what-it-says
function doWhatItSays() {

  fs.readFile("random.txt", "utf8", function(error, data) {

    if (error) {
      return console.log(error);
    }

    var dataArr = data.split(",");

    spotifyThisSong(dataArr[1]);

  });

}

function log() {

  var textFile = firstTerminalCommand;

  fs.appendFile("log.txt", "node liri.js " + textFile + " " + secondTerminalCommand() + "\n", function(err) {

    if (err) {
      console.log(err);
    }else {
      console.log("Content Added!");
    }

  });

}


function startLiri() {

  switch (firstTerminalCommand) {
    case 'movie-this':  
      if(secondTerminalCommand()) {
        movieThis(secondTerminalCommand());
      } else {
        movieThis();
      }
      log();
      break;

    case 'my-tweets':
      myTweets();
      log();
      break;

    case 'spotify-this-song':
      if(secondTerminalCommand()) {
        spotifyThisSong(secondTerminalCommand());
      } else {
        spotifyThisSong("The Sign");
      }
      log();
      break;

    case 'do-what-it-says':
      doWhatItSays();
      log();
      break;
  }

}
  
startLiri();  





