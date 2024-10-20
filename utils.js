const Fuse = require('fuse.js');

function getUserRefence(user) {
  return "<@" + user.id + ">"
}

function isTagged(user, msg) {
  return msg.content.startsWith(getUserRefence(user))
}

function findChannel(channelQuery, channels) {
  const options = {
    threshold: 0.3,
  };
  const fuse = new Fuse(Array.from(channels.keys()), options);
  const results = fuse.search(channelQuery);
  
  if (results.length != 1) {
    return;
  }

  const channelName = results[0].item;
  return channels.get(channelName);
}

function getChannelReference(channel) {
  return "<#" + channel.id + ">"
}

function getChannelQuery(msg) {
  const messageArgs = msg.content.split(" ")
  messageArgs.shift()
  return messageArgs.join("")
}

module.exports = {
  getUserRefence,
  isTagged,
  getChannelQuery,
  getChannelReference,
  findChannel
}