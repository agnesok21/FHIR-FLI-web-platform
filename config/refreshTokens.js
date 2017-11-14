const User = require('../app/models/user.js');
const credentials = require('./auth.js');
const http = require('request');

exports.refreshGoogleToken = function(userID, callback){
  User.findOne({'_id':userID}, function(err, u){
      if(err){
        console.log(err);
        return callback('');
      }

      if(u.publishers.fitbit.refreshToken){
        http.post({
          url : 'https://api.fitbit.com/oauth2/token',
          headers : {
            "Content-Type" : "application/x-www-form-urlencoded"
          },
          form : {
            "client_id"      : credentials.fitbitAuth.clientID,
            "client_secret"  : credentials.fitbitAuth.clientSecret,
            "refresh_token"  : u.publishers.fitbit.refreshToken,
            "grant_type"     : 'refresh_token'
          }
        }, function(err, resdata, tokendata) {
          tokendata = JSON.parse(tokendata);
          if(err){
            console.log(err);
            return callback('');
          }
          if(resdata.statusCode != 200){
            // console.log(tokendata);
            return callback('');
          }
          if(tokendata.error){
            console.log(tokendata.console.error);
            return callback('');
          }
          if(tokendata.access_token){
            return callback(tokendata.access_token);
          }
          console.log('Uncaught Error While Refreshing Google Access Token');
          return callback('');
        })
      } else {
        console.log('Can\'t Refresh User Token!');
        return callback('');
      }
  })

}
