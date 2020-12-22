<template>
    <div class="authorise-form">
        <form @submit.prevent="register">
            <h2>Register</h2>
            <input data-id="input" id="name" type="text" v-model="name" placeholder="Name*" required autofocus>
            <input data-id="input" id="last-name" type="text" v-model="last_name" placeholder="Last name">
            <input data-id="input"


                   id="company" type="text" v-model="company" placeholder="Company">
            <input id="email" type="email" v-model="email" placeholder="Email*" required>
            <input id="password" type="password" v-model="password" placeholder="Password*" required>
            <input id="password-confirm" type="password" v-model="password_confirmation" placeholder="Password confirm*"
                   required>
            <button type="submit">Register</button>
            <router-link to="/login" class="login-link">Log In</router-link>
        </form>

    </div>
</template>
<script>

</script>
<script>

  export default {
    data(){
      return {
        name: "",
        email: "",
        last_name: "",
        company: "",
        password: "",
        password_confirmation: "",
        is_admin: null
      }
    },
    methods: {
      stablePassword(val){
        var entityMap = {
          '#': '№',
          '&': '*',
        };
        function escapeHtml(string) {
          return String(string).replace(/[&#]/g, function (s) {
            return entityMap[s];
          });
        }
        return escapeHtml(val);
      },
      stableInput(val) {
        var entityMap = {
          '"': '`',
          "'": '`',
          '/': '/',
          '<': '',
          '>': '',
          '`': '`',
          '#': '№',
          '&': '',
        };
        function escapeHtml(string) {
          return String(string).replace(/[<>&#"'`\/]/g, function (s) {
            return entityMap[s];
          });
        }
         return escapeHtml(val);
      },
      register: function () {
        if (this.password !== this.password_confirmation) {
          alert('Password not confirmed')
        } else {
          let data = {
            name: this.name,
            last_name: this.last_name,
            email: this.email,
            company: this.company,
            password: this.password,
            is_admin: this.is_admin
          };
          this.$store.dispatch('register', data).then(()=>this.$router.push('/')).catch(err=>console.log(err))
        }

      }
    },
    watch: {
      name: function (val) {
        this.name = window.VueHelper.stableInput(val);
      },
      company: function (val) {
        this.company = window.VueHelper.stableInput(val);
      },
      last_name: function (val) {
        this.last_name = window.VueHelper.stableInput(val);
      },
      password_confirmation: function (val) {
        this.password_confirmation = window.VueHelper.stablePassword(val);
      },
      password: function (val) {
        this.password = window.VueHelper.stablePassword(val);
      },
    },
  }
</script>