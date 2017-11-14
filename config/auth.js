//will hold all our client secret keys (facebook, twitter, google)

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '490661971268498', // your App ID
        'clientSecret'  : 'f3300b97b2eab3cdf4d2379044fc1f7e', // your App Secret
        'callbackURL'   : 'http://transpire.azurewebsites.net/auth/facebook/callback'
    },

    'fitbitAuth' : {
      'clientID' : '22CK93',
      'clientSecret' : 'b696d195e374f8a183cbe550389c3a22',
      'callbackURL' : 'http://localhost:8080/auth/fitbit/callback'
    },

    

};
