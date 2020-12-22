<template>
    <div class="authorise-form">
        <form>
        <div class="confirmed" id="confirm-message"></div>
        </form>
    </div>
</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'
  import axios from 'axios'
  import constants from '../Constants';
  export default {
    data(){
      return {
        message: '',
      }
    },
    methods: {
      confirmMail(){
        const request = new XMLHttpRequest();
        console.log(this.$route.query.confirm_token)
        const url = constants.BACKEND_URL + "/authorisation/confirm/?confirm_token=" + this.$route.query.confirm_token;
        request.open('GET', url);
        request.setRequestHeader('Accept', 'application/json, text/plain, */*');
        request.addEventListener("readystatechange", () => {
          if (request.readyState === 4 && request.status === 200) {
            let messageContainer = document.getElementById('confirm-message');
            let link = document.createElement('a');
            let text = document.createElement('div');
            link.setAttribute('href', "/#/login");
            link.textContent = 'Login';
            text.textContent = 'Your account confirmed. Please ';
            messageContainer.appendChild(text);
            messageContainer.appendChild(link);
          }
        });
        request.send();
      },
    },
    mounted() {
      if(this.$route.query.confirm_token) {
        this.message = this.$route.query.confirm_token;
        this.confirmMail();
      }

    }
  }
</script>