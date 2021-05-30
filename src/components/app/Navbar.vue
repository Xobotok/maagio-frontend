<template>
    <div class="">
        <nav class="navbar">
            <div class="navbar__left">
                <router-link to="/projects" class="logo">MAGGIO</router-link>
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
              <div class="new-project relative profile-popup" data-id="profile-container">
                <div class="profile" @click="profileOpen = !profileOpen">
                  <div class="profile-icon"></div>
                  <div class="profile-name">{{user_name + ' ' + user_lastname}}</div>
                </div>
                <div class="profile__list" v-show="profileOpen">
                  <router-link to="/profile" class="new-project">
                    Profile
                  </router-link>
                  <div class="subscribe-block">
                    <span v-if="isLoggedIn" style="padding-right: 10px; cursor: pointer;"><a @click="logout">Logout</a></span>
                  </div>
                </div>
              </div>
              <div class="update-container" v-if="$store.getters.needUpdate == 1" data-id="update-container">
                <div class="dots-icon" v-if="$store.getters.needUpdate == 0"></div>
                <div class="update-icon" v-if="$store.getters.needUpdate == 1" @click="updateOpen = !updateOpen"></div>
                <div class="update-list" v-show="updateOpen">
                    <div class="update-item" v-if="$store.getters.needUpdate == 1" @click="update">Update application</div>
                </div>
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
        profileOpen: false,
        updateOpen: false,
        user_name: '',
        user_lastname: '',
        end_time: 0,
        show_subscribe: true,
        openSubscribeModal: false,
        actual_tariff: '',
        tariffs: [],
        }),
      methods: {
        update() {
          this.$store.dispatch('updateVersion');
        },
        openUpdateContainer(evt) {
          var path = (evt.composedPath && evt.composedPath()) || evt.path;
          for(var i = 0; i < path.length; i++) {
            var dataId = $(path[i]).attr('data-id');
            if(dataId === 'update-container') {
              return;
            }
          }
          this.updateOpen = false;
        },
        openProfileContainer(evt) {
          var path = (evt.composedPath && evt.composedPath()) || evt.path;
          for(var i = 0; i < path.length; i++) {
            var dataId = $(path[i]).attr('data-id');
            if(dataId === 'profile-container') {
              return;
            }
          }
          this.profileOpen = false;
        },
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
      beforeDestroy() {
        document.removeEventListener('click', this.openProfileContainer);
        document.removeEventListener('click', this.openUpdateContainer);
      },
      mounted(){
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        this.user_name = user.name;
        if(this.user_lastname != ''){
          this.user_lastname = user.last_name;
        }
        document.addEventListener('click', this.openProfileContainer);
        document.addEventListener('click', this.openUpdateContainer);
      }
    }
</script>
