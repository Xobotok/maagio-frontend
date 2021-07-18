<template>
    <div class="app-constructor-layout">
        <Navbar/>
        <main class="app-content">
            <div class="app-page">
                <router-view/>
            </div>
        </main>
        <paymentModal v-if="open_subscribe"
        :tariff="this.actual_tariff"></paymentModal>
    </div>
</template>

<style lang="less">
    @import '../assets/main.less';
</style>

<script>
    import Navbar from '@/components/app/Navbar.vue'
    import paymentModal from '@/components/app/paymentModal.vue'
    import constants from "../Constants";
    export default {
      name: 'constructor-layout',
      components: {
        Navbar, paymentModal
      },
      data: ()=>({
        open_subscribe: false,
        end_time: '',
        subscribe: {},
        tariffs: [],
        heartBeatVariable: '',
        old_profile: {
          last_name: '',
          company: '',
          name: '',
        },
        user:{
          name: '',
          last_name: '',
          company: '',
          email: '',
        },
        actual_tariff: {
         id: '',
          price: '',
          period: '',
          type: '',
        },
      }),
      mounted(){
        this.heartBeatVariable = this.heartBeat();
        this.takeUserInfo();
      },
      beforeDestroy() {
        clearInterval(this.heartBeatVariable);
        this.heartBeatVariable = '';
      },
      updated() {

      },
      methods: {
        heartBeat() {
          this.checkUpdate();
          return setInterval(this.checkUpdate, 360000)
        },
        checkUpdate() {
          this.takeEndTariff();
        },
        takeEndTariff() {
          let obj = this;
          let user = JSON.parse(localStorage.getItem('maagio_user'));
          let token = localStorage.getItem('token');
          obj.cardError = '';
          $.ajax({
            url: constants.BACKEND_URL + 'tariff/take-end-tariff',
            data: { user: user, token: token },
            type: 'GET',
            dataType: 'json',
            success: function (respond, status, jqXHR) {
              if (respond.ok == 1) {
                obj.end_time = obj.formatEndDate(respond.end_time);
                obj.subscribe = respond.subscribe;
              }
            },
            error: function () {
            }
          });
        },
        formatEndDate: function (seconds) {
          if(seconds > 0) {
            if( Math.floor(seconds / (60*60*24)) < 1) {
              return 'Less then one ';
            } else {
              return  Math.floor(seconds / (60*60*24));
            }

          } else {
            return 'Subscription ended';
          }
        },
        takeUserInfo: function () {
          let obj = this;
          let user = JSON.parse(localStorage.getItem('maagio_user'));
          let token = localStorage.getItem('token');
          $.ajax({
            url: constants.BACKEND_URL + 'authorisation/take-user-info',
            data: {user: user, token: token},
            type: 'GET',
            dataType: 'json',
            success: function (respond, status, jqXHR) {
              console.log(respond);
              if(respond.ok == 1) {
                obj.end_time = obj.formatEndDate(respond.end_time);
                obj.tariffs = respond.tariffs;
                obj.subscribe = respond.subscribe;
                obj.actual_tariff = respond.actual_tariff;
                obj.old_profile.name = respond.user.name;
                obj.user.name = respond.user.name;
                obj.old_profile.last_name = respond.user.last_name;
                obj.user.last_name = respond.user.last_name;
                obj.old_profile.company = respond.user.company;
                obj.user.company = respond.user.company;
                obj.user.email = respond.user.email;
              } else {

              }
            },
            error: function (jqXHR, status, errorThrown) {
              obj.payment_pause = false;
              console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
            }
          });
        },
      }
    }
</script>
