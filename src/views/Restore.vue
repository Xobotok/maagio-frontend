<template>
    <div class="authorise-form">
        <form class="login" @submit.prevent="send" v-if="restoreToken == '' && !backToLogin">
            <div class="message" v-if="message.length > 0">{{message}}</div>
            <h1>MAGGIO</h1>
            <div class="restore-text">Enter your email address and we will send you instructions on how to reset your
                password.
            </div>
            <input class="login-input" required v-model="email" type="email" placeholder="Email-Address"/>
            <hr/>
            <div class="submit-button">
                <button type="submit" v-if="!loading">Restore</button>
                <div class="subscribe-cancel-button inactive" v-show="loading">
                    <div id="floatingBarsG">
                        <div class="blockG" id="rotateG_01"></div>
                        <div class="blockG" id="rotateG_02"></div>
                        <div class="blockG" id="rotateG_03"></div>
                        <div class="blockG" id="rotateG_04"></div>
                        <div class="blockG" id="rotateG_05"></div>
                        <div class="blockG" id="rotateG_06"></div>
                        <div class="blockG" id="rotateG_07"></div>
                        <div class="blockG" id="rotateG_08"></div>
                    </div>
                </div>
            </div>
            <div class=""></div>
            <router-link to="/login" class="form-link">
                Login
            </router-link>
        </form>
        <form class="login" @submit.prevent="restore" v-if="restoreToken != '' && !backToLogin">
            <div class="message" v-if="message.length > 0">{{message}}</div>
            <h1>MAGGIO</h1>
            <div class="restore-text">Enter new password.</div>
            <input class="login-input" required v-model="newPass" type="password" placeholder="Password"/>
            <hr/>
            <div class="submit-button">
                <button type="submit" v-if="!loading">Restore</button>
                <div class="subscribe-cancel-button inactive" v-show="loading">
                    <div id="floatingBarsG">
                        <div class="blockG" id="rotateG_01"></div>
                        <div class="blockG" id="rotateG_02"></div>
                        <div class="blockG" id="rotateG_03"></div>
                        <div class="blockG" id="rotateG_04"></div>
                        <div class="blockG" id="rotateG_05"></div>
                        <div class="blockG" id="rotateG_06"></div>
                        <div class="blockG" id="rotateG_07"></div>
                        <div class="blockG" id="rotateG_08"></div>
                    </div>
                </div>
            </div>
            <div @click="goBack()" class="form-link">
                Back
            </div>
        </form>
        <form action="" v-if="backToLogin">
            <div class="back-to-login">
                <div class="">Password changed. You can
                    <router-link to="/login" class="form-link">
                        Login
                    </router-link>
                    with new password.
                </div>

            </div>
        </form>
    </div>
</template>

<script>
  import constants from "../Constants";
  export default {
    data(){
      return {
        email: "",
        message: '',
        newPass: '',
        restoreToken: '',
        loading: false,
        restoreTab: false,
        emailTab: true,
        backToLogin: false,
      }
    },
    methods: {
      goBack: function () {
        this.restoreToken = '';
        this.$router.push('../restore')
      },
      restore: function () {
        let obj = this;
        obj.message = '';
        obj.loading = true;
        $.ajax({
          url: constants.BACKEND_URL + 'users/change-password',
          type: 'GET', // важно!
          data: { token: obj.restoreToken, pass: obj.newPass },
          dataType: 'json',
          success: function (respond, status, jqXHR) {
            obj.loading = false;
            if (respond.ok === 1) {
              obj.backToLogin = true;
            } else {
              obj.message = respond.message;
            }
          },
          error: function (jqXHR, status, errorThrown) {
            obj.loading = false;
          }
        });
      },
      send: function () {
        let email = this.email;
        let obj = this;
        obj.message = '';
        obj.loading = true;
        $.ajax({
          url: constants.BACKEND_URL + 'users/restore-password',
          type: 'GET', // важно!
          data: { email: email },
          dataType: 'json',
          success: function (respond, status, jqXHR) {
            obj.loading = false;
            if (respond.ok === 1) {
              obj.message = respond.message;
            } else {
              obj.message = respond.message;
            }
          },
          error: function (jqXHR, status, errorThrown) {
            obj.loading = false;
          }
        });
      }
    },
    beforeMount() {
      if (this.$route.query.restore_token != undefined) {
        this.emailTab = false;
        this.restoreTab = true;
        this.restoreToken = this.$route.query.restore_token;
      }
    },
    updated() {
      if (this.$route.query.restore_token != undefined) {
        this.emailTab = false;
        this.restoreTab = true;
        this.restoreToken = this.$route.query.restore_token;
      }
    }
  }
</script>
