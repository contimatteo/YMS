process.stdout.write("hello: ");

// get total length
var len = parseInt(response.headers['content-length'], 10);
var cur = 0;

// handle the response
response.on('data', function(chunk) {
  cur += chunk.length;
  util.print("Downloading " + (100.0 * cur / len).toFixed(2) + "% " + cur + " bytes\r");
});