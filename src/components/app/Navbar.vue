<template>
    <div class="">
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
                <div class="subscribe-block" v-if="this.$parent.subscribe == null || this.$parent.subscribe.cancel_at_period_end == true">
                    <div v-if="show_subscribe" @click="$parent.open_subscribe = true" class="subscribe-button">Subscribe</div>
                    <div class=""> {{$parent.end_time}} days left.</div>
                </div>
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
                <div class="subscribe-block">
                    <span v-if="isLoggedIn" style="padding-right: 10px; cursor: pointer;"><a @click="logout">Logout</a></span>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
  import constants from "../../Constants";
  import cardObject from '@/components/simple/cardObject.vue';
  import dropdown from '@/components/simple/dropdown.vue';
    export default {
      'name': 'Navbar',
      computed : {
        isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
      },
      components: {
        cardObject, dropdown
      },
      data: ()=>({
        user_name: '',
        user_lastname: '',
        end_time: 0,
        show_subscribe: true,
        openSubscribeModal: false,
        actual_tariff: '',
        tariffs: [],
        }),
      methods: {
        logout: function () {
          this.$store.dispatch('logout')
          .then(() => {
            this.$router.push('/login')
          })
        },
        selectNewTariff(e){
          this.actual_tariff = e;
        },
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