const Client = require('node-xmpp-client');
const axios = require('axios');

// const topicUrl = 'https://iid.googleapis.com/iid/v1:batchAdd';
// const sendMsgUrl = 'https://fcm.googleapis.com/fcm/send';

const topicUrl = 'http://10.34.41.52:80/iid/v1:batchAdd';
const sendMsgUrl = 'http://10.34.41.52:80/fcm/send';

const fcmServerKey =
  'AAAA42rY5kY:APA91bGJ6_XmwY1440-tmDJHF2k3AioT3t9qmq78-FjiR1OqeqVleRefbUIx2yQ6SJ-9gApQQKVbtBJCUmvGN8f3PwNbojGk56Sas9n-s1JqbrGifrcjUTBgcYJz8lfK6nRwMszK87QV';

const createTopic = async (topicName, fcmTokens) => {
  const resp = await axios({
    method: 'post',
    url: topicUrl,
    headers: { Authorization: 'key=' + fcmServerKey },
    data: {
      to: '/topics/' + topicName,
      registration_tokens: fcmTokens
    }
  });
  return resp;
};

const sendMessageToTopic = async (topicName, data) => {
  const resp = await axios({
    method: 'post',
    url: topicUrl,
    headers: { Authorization: 'key=' + fcmServerKey },
    data: {
      to: '/topics/' + topicName,
      notification: { content_available: true },
      priority: 'high',
      data: data
    }
  });
  return resp;
};

const sendMessageToUsers = async (tokenArrays, data) => {
  const resp = await axios({
    method: 'post',
    url: sendMsgUrl,
    headers: { Authorization: 'key=' + fcmServerKey },
    data: {
      registration_ids: tokenArrays,
      notification: { content_available: true },
      priority: 'high',
      data: data
    }
  });
  return resp;
};

const receiveFCMNotifications = () => {
  const client = new Client({
    jid: '976750175814@gcm.googleapis.com',
    password:
      'AAAA42rY5kY:APA91bGJ6_XmwY1440-tmDJHF2k3AioT3t9qmq78-FjiR1OqeqVleRefbUIx2yQ6SJ-9gApQQKVbtBJCUmvGN8f3PwNbojGk56Sas9n-s1JqbrGifrcjUTBgcYJz8lfK6nRwMszK87QV',
    host: 'fcm-xmpp.googleapis.com',
    port: 5235,
    reconnect: true,
    legacySSL: true,
    preferredSaslMechanism: 'PLAIN'
  });

  client.on('error', err => {
    console.error('❌', err.toString());
  });

  client.on('status', (status, value) => {
    console.log('🛈', status, value ? value.toString() : '');
  });

  client.on('online', jid => {
    console.log('🗸', 'online as', jid.toString());
  });

  client.on('stanza', stanza => {
    console.log('⮈', stanza.toString());
  });
};
module.exports = { receiveFCMNotifications, createTopic, sendMessageToUsers };
