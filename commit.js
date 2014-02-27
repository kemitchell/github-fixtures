var Factory = require('object-factory'),
    User = require('./user'),
    crypto = require('crypto');

function assign(object, key, value) {
  if (key in object) return;
  object[key] = value;
}

function assignSha1Url(obj) {
  assign(obj, 'sha', hash());
  assign(obj, 'url', BASE_URL + 'commits/' + obj.sha);
}

/**
Generic url used in the fixtures.

@constant
*/
var BASE_URL = 'https://api.github.com/repos/octocat/Hello-World/';

var CommitSha1Link = new Factory({
  onbuild: function(obj) {
    assignSha1Url(obj);
  },
  properties: {}
});

var GitUserAction = new Factory({
  onbuild: function(obj) {
    assign(obj, 'date', (new Date()).toJSON());
    assign(obj, 'name', 'Gomez Orez');
    assign(obj, 'email', 'email@email.com');
  }
});

var CommitRef = new Factory({
  onbuild: function(obj) {
    assign(obj, 'url', BASE_URL + 'commits/' + hash());
  },

  properties: {
    author: GitUserAction,
    committer: GitUserAction,
    message: 'I am a git commit message',
    tree: CommitSha1Link
  }
});

/**
Generate a sha which represents the github sha.

@return {String} sha of the current time.
*/
function hash(value) {
  value = value || Date.now();
  return crypto.createHash('sha1')
          .update(String(value))
          .digest('hex');
}

module.exports = new Factory({
  onbuild: function(obj) {
    assignSha1Url(obj);

    obj.parents = obj.parents || [{ sha: hash(Date.now() + 1000) }];
    obj.parents = obj.parents.map(function(item) {
      return CommitSha1Link.create(item);
    });
  },

  properties: {
    commit: CommitRef,
    author: User,
    committer: User
  }
});
