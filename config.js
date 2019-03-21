module.exports = {
  'facebookAuth': {
    'clientID': '400618683827961',
    'clientSecret': '62e4245b835df52d87b7e2e9935bc5b7',
    'callbackURL': 'http://localhost:8116/api/auth/facebook/callback',
    'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

  },

  'googleAuth': {
    'clientID': '1090401364981-sefk2u3p2nurck9gh06tgjptrs5pbtps.apps.googleusercontent.com',
    'clientSecret': 'CT_VHhnV8e1LQpRF_Gie6yu6',
    'callbackURL': 'http://localhost:8116/auth/google/callback'
  }
};
