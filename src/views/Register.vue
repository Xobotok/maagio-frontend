<template>
    <div class="authorise-form">
        <form @submit.prevent="register">
            <h2>Register</h2>
            <input id="name" type="text" v-model="name" placeholder="Name*" required autofocus>
            <input id="last-name" type="text" v-model="last_name" placeholder="Last name">
            <input id="company" type="text" v-model="company" placeholder="Company" >
            <input id="email" type="email" v-model="email" placeholder="Email*" required>
            <input id="password" type="password" v-model="password" placeholder="Password*" required>
            <input id="password-confirm" type="password" v-model="password_confirmation" placeholder="Password confirm*"
                   required>
            <button type="submit">Register</button>
        </form>
    </div>
</template>

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
      register: function () {
        if(this.password !== this.password_confirmation) {
          alert('Password not confirmed')
        } else {
          let data = {
            name: this.name,
            last_name: this.last_name,
            email: this.email,
            company: this.company,
            password: this.password,
            is_admin: this.is_admin
          }
          this.$store.dispatch('register', data).then(()=>this.$router.push('/')).catch(err=>console.log(err))
        }

      }
    }
  }
</script>