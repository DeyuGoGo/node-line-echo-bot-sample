var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var LINE_API_REPLY = "https://api.line.me/v2/bot/message/reply";
var YOUR_CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN ;//your acccess token
var CHANNEL_ACCESS_TOKEN = "Bearer " + YOUR_CHANNEL_ACCESS_TOKEN ;
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())

app.post('/linego', (req, res) => {
  console.log(req);
  console.log(req.body);
  res.send('Hello World')
  const result = req.body.events;
  for(var i=0; i<result.length; i++){
    const type = result[i]['type'];
    console.log('receive: ', type);
    if(type==='message'){
      sendTextMessage(result[i].message.text, result[i]['replyToken']);
    }
  }
});

function sendTextMessage(text , token) {
  console.log(text);
  console.log(token);
  const data = {
    replyToken: token,
    messages: [{
    "type": "text",
    "text": text
  }]
};
  request({
    url: LINE_API_REPLY,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': CHANNEL_ACCESS_TOKEN
    },
    method: 'POST',
    body: JSON.stringify(data)
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
    console.log('send response: ', body);
  });
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
