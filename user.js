var Factory = require('object-factory');

var User = new Factory({
  properties: {
    login: 'octocat',
    id: 1,
    avatar_url: 'https://github.com/images/error/octocat_happy.gif',
    gravatar_id: 'somehexcode',
    url: 'https://api.github.com/users/octocat'
  }
});

module.exports = User;
