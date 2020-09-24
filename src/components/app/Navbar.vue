<template>
    <nav class="navbar">
        <div class="navbar__left">
            <router-link to="/projects" class="logo">MAAGIO</router-link>
        </div>
        <div class="navbar__middle">
            <router-link to="/projects" class="active-link">MY APPS</router-link>
            <div class="inactive-nav">ANALITYCS <span class="small-top">coming soon</span></div>
            <div class="inactive-nav">FAQ <span class="small-top">coming soon</span></div>
        </div>
        <div class="navbar__right">
            <span v-if="isLoggedIn" style="padding-right: 10px; cursor: pointer;"><a @click="logout">Logout</a></span>
            <router-link to="/new" class="new-project">
                <div class="new-project">
                    <div class="new-project-icon"></div>
                    <div class="new-project-text">New App</div>
                </div>
            </router-link>
            <!--<div class="new-project">
                <div class="profile">
                    <div class="profile-icon"></div>
                    <div class="profile-name">{{user_name + ' ' + user_lastname}}</div>
                </div>
            </div>-->

            <router-link to="/profile" class="new-project">
                <div class="profile">
                    <div class="profile-icon"></div>
                    <div class="profile-name">{{user_name + ' ' + user_lastname}}</div>
                </div>
            </router-link>
        </div>
    </nav>
</template>

<script>
    export default {
      'name': 'Navbar',
      computed : {
        isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
      },
      data: ()=>({
        user_name: '',
        user_lastname: '',
        }),
      methods: {
        logout: function () {
          this.$store.dispatch('logout')
          .then(() => {
            this.$router.push('/login')
          })
        }
      },
      mounted(){
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        this.user_name = user.name;
        if(this.user_lastname != ''){
          this.user_lastname = user.last_name;
        }
      }
    }
</script>