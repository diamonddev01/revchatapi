# RevChatAPI
An API made to interact with the revolt API

# Quick Guide

```js
const revchat require('revchatapi');
const Client = new revchat.Client('token');

Client.on('ready', () => {
  console.log(`${Client.username} logged in`);
})

Client.on('message', (message) => {
  Client.sendToChannel(message.channel.id, {content: `Hey ${message.author.username}`});
  message.reply({content: 'I think your cool'}, true);
  console.log(message);
})

```
