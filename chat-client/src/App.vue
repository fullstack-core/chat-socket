<script setup>
import { onBeforeMount, ref } from 'vue';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5500');

const messages = ref([]);
const messageText = ref('');
const joined = ref(false);
const name = ref('');
const typingDisplay = ref('');

onBeforeMount(()=>{
 socket.emit('findAllMessages', {}, (res)=>{
   messages.value = res;
 });

 socket.on('message', (message)=>{
   messages.value.push(message);
 });

 socket.on('typing', ({name, isTyping})=>{
   if(isTyping){
    typingDisplay.value = name + ' is typing...';
   }
   else{
    typingDisplay.value = '';
   }
 });
});

const join = () =>{
  socket.emit('join', {name: name.value}, ()=>{
    joined.value = true;
  });
}

const sendMessage = ()=>{
  socket.emit('createMessage', {text: messageText.value}, () => {
    messageText.value = '';
  });
}


let timeout;
const emitTyping = ()=>{
  socket.emit('typing', {isTyping: true});
  timeout = setTimeout(()=>{
    socket.emit('typing', {isTyping: false});
  }, 2000);
}

</script> 

<template>
  <div class="chat">
    <div v-if="!joined">
      <form @submit.prevent="join">
        <label>What's your name?</label>
        <input v-model="name" type="text" placeholder="Enter your name">
        <button type="submit">Join</button>
      </form>
    </div>

    <div class="chat-container" v-else>
      <div class="messages-container">
        <div v-for="(message, i) in messages" :key="i">
          [{{message.name}}]:{{message.text}}
        </div>
      </div>

      <div v-if="typingDisplay">{{ typingDisplay }}</div><hr />

      <div class="message-input">
        <form @submit.prevent="sendMessage">
          <label>Message: </label>
          <input v-model="messageText" type="text" @input="emitTyping">
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
.chat{
  padding: 20px;
  height: 80vh;
}
.chat-container{
  display: flex;
  flex-direction: column;
  height: 100%;
}
.messages-container{
  flex: 1;
}
</style>