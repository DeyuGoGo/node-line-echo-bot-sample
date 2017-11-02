var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var EVENT_NAME = '穎奇婚禮';
var LINE_API_REPLY = "https://api.line.me/v2/bot/message/reply";
var URL_FCM_MEESSAGE = "https://fcm.googleapis.com/fcm/send";
var URL_GET_TOKEN = "https://us-central1-barrage-deyu.cloudfunctions.net/getToken";
var URL_GET_TOKENS = "https://us-central1-barrage-deyu.cloudfunctions.net/getTokens";
// var YOUR_CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN ;//your acccess token
// var CHANNEL_ACCESS_TOKEN = "Bearer " + YOUR_CHANNEL_ACCESS_TOKEN ;
var FCM_API_KEY = "key=AAAAZQKhlX0:APA91bEjT9S5V07RoHp7dFB-F5BvC5r6tLcC27zlQHvAvXTgxgkZeAxWscx3a-yU-FpEVBbqbRmFy7cH5xnvyTGrz1DWb7TlBtFTiO6YWrIst72SsHko_psCWxhbcYJsWY--xgu59JEg";
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())

app.post('/postBarrge', (req, res) => {
  console.log(req.body);
  res.send('Hello World')
  const result = req.body.events;
  for(var i=0; i<result.length; i++){
    const type = result[i]['type'];
    console.log('receive: ', type);
    if(type==='message'){
      getTokens(result[i].message.text)
      // sendFcm(, result[i]['replyToken']);
    }
  }
});

function getToken(message){
  const payload = {
    uid: EVENT_NAME
  };
  request(
    {
    url: URL_GET_TOKEN,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    method: 'POST',
    body: JSON.stringify(payload)
  },function(error , response , body){
    console.log(body);
    sendFcm(JSON.parse(body).token,message);
  });
}

function getTokens(message){
  const payload = {
    uid: EVENT_NAME
  };
  request(
    {
    url: URL_GET_TOKENS,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    method: 'POST',
    body: JSON.stringify(payload)
  },function(error , response , body){
    console.log(body);
    sendFcmToDevices(JSON.parse(body).token,message);
  });
}

function sendFcm(to,message){
  console.log(to);
  const payload = {
    to: to,
    data: {
      message: message
    }
  };
  request({
    url: URL_FCM_MEESSAGE,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': FCM_API_KEY
    },
    method: 'POST',
    body: JSON.stringify(payload)
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
    console.log('send response: ', body);
  });
}

function sendFcmToDevices(registration_ids,message){
  console.log(to);
  const payload = {
    registration_ids: registration_ids,
    data: {
      message: message
    }
  };
  request({
    url: URL_FCM_MEESSAGE,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': FCM_API_KEY
    },
    method: 'POST',
    body: JSON.stringify(payload)
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
    console.log('send response: ', body);
  });
}


// function sendTextMessage(text , token) {
//   console.log(text);
//   console.log(token);
//   const data = {
//     replyToken: token,
//     messages: [{
//     "type": "text",
//     "text": text
//   }]
// };
//   request({
//     url: LINE_API_REPLY,
//     headers: {
//       'Content-Type': 'application/json; charset=UTF-8',
//       'Authorization': CHANNEL_ACCESS_TOKEN
//     },
//     method: 'POST',
//     body: JSON.stringify(data)
//   }, function(error, response, body) {
//     if (error) {
//       console.log('Error sending message: ', error);
//     } else if (response.body.error) {
//       console.log('Error: ', response.body.error);
//     }
//     console.log('send response: ', body);
//   });
// }
//
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
