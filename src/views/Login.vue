<template>
    <div class="authorise-form">
        <form class="login" @submit.prevent="login">
            <div class="message" v-if="message.length > 0">{{message}}</div>
            <h1>MAGGIO</h1>
            <input class="login-input" required v-model="email" type="email" placeholder="Email-Address"/>
            <input class="login-input" required v-model="password" type="password" placeholder="Password"/>
            <hr/>
            <router-link to="/restore" class="form-link restore-password-link">
                Forgot your password?
            </router-link>
            <button type="submit">Login</button>
            <router-link to="/register" class="form-link">
                Registration
            </router-link>
        </form>
    </div>
</template>

<script>
  export default {
    data(){
      return {
        email : "",
        password : "",
        message: '',
      }
    },
    watch: {
      password: function (val) {
        this.password = window.VueHelper.stablePassword(val);
      },
    },
    methods: {
      login: function () {
        let email = this.email;
        let password = this.password;
        this.$store.dispatch('login', { email, password, obj: this },)
        .then(() => this.$router.push('/'))
        .catch(err => console.log(err))
      }
    },
    mounted() {
      if(this.$route.query.message) {
        this.message = this.$route.query.message;
      }
    }
  }
</script>
