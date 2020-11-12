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
        this.takeUserInfo();
        let obj = this;
        if(this.interval != undefined) {
          clearInterval(this.interval)
        }
        this.interval = setInterval(function () {
          obj.takeEndTariff();
        }, 360000)
      },

      updated() {

      },
      methods: {
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
                window.db.setValue('subscribe', 1, respond.subscribe);
              }
            },
            error: function () {
            }
          });
        },
        formatEndDate: function (seconds) {
          if(seconds > 0) {
            return  Math.floor(seconds / (60*60*24));
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
                window.db.setValue('subscribe', 1, respond.subscribe);
                window.db.setValue('actual_tariff', 1,respond.actual_tariff);
                window.db.setValue('tariffs', 1, respond.tariffs);
                window.db.setValue('user', 1, respond.user);
                window.db.actualProjects();
              } else {

              }
            },
            error: function (jqXHR, status, errorThrown) {
              var user = '';
                window.db.getValue('user', 1, function (e) {
                  user = e.value;
                  obj.old_profile.name = user.name;
                  obj.user.name = user.name;
                  obj.old_profile.last_name =user.last_name;
                  obj.user.last_name = user.last_name;
                  obj.old_profile.company = user.company;
                  obj.user.company = user.company;
                  obj.user.email = user.email;
              });
              window.db.getValue('tariffs', 1, function (e) {
                obj.tariffs = e.value;
              });
              window.db.getValue('subscribe', 1, function (e) {
                obj.subscribe = e.value;
              });
              window.db.getValue('actual_tariff', 1, function (e) {
                obj.actual_tariff = e.value;
              });
              obj.payment_pause = false;
              console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
            }
          });
        },
      }
    }
</script>