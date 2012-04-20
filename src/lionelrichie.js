var sys = require('sys'),
    twitter = require('twitter');

var connect = function(twit) {
  twit.stream('statuses/filter', {track: 'night'}, function(stream) {
    stream.on('error', function(data) {
      sys.puts(sys.inspect(data));
      setTimeout(function() { reconnect(); }, 60000);
    });

    stream.on('end', function(data) {
      sys.puts(sys.inspect(data));
      setTimeout(function() { reconnect(); }, 60000);
    });

    stream.on('data', function(data) {
      if(data.text) {

        if(data.text.match(/all night long!*$/i)) {

          var screen_name = data.user.screen_name;

          var message = "@" + screen_name + " ♫ALL NIGHT!",
              options = {in_reply_to_status_id: data.id_str}

          twit.updateStatus(message, options, function(data) {
            setTimeout(function() {
              var message = "@" + screen_name + " ALL NIGHT!♫";

              twit.updateStatus(message, options, function(data) {});
            }, 5000);
          });
        }
      } else {
        sys.puts(sys.inspect(data));
      }
    });
  });
}

var reconnect = function() {
  var twit = new twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  });

  connect(twit);
}

reconnect();
