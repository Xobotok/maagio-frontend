<template>
    <div class="profile-page">
        <div class="profile-info">
            <div class="profile-header">Profile info</div>
            <div class="profile-details">
                <div class="profile-text">Name: <span>{{name}}</span></div>
                <div class="profile-text">Last name: <span>{{last_name}}</span></div>
                <div class="profile-text">Email: <span>{{email}}</span></div>
                <div class="profile-text">Company: <span>{{company}}</span></div>
            </div>
        </div>
        <div class="profile-info">
            <div class="profile-header">Pricing information</div>
            <div class="profile-details">
                <div class="profile-text">Tariff end: <span>{{paid}}</span></div>
                <dropdown v-if="actual_tariff != ''"
                          :options="tariffs"
                          :selected="actual_tariff"
                          v-on:updateOption="selectNewTariff"
                          :placeholder="'Select tariff'"
                          :closeOnOutsideClick="true">
                </dropdown>
                <div class="payment-tariff">
                    Extend for <span>{{actual_tariff.period}}</span> days for <span v-if="actual_tariff.price != 0">{{actual_tariff.price}} $</span>
                    <span v-if="actual_tariff.price == 0"> Free!</span>
                </div>
                <form id="payment-form" v-show="actual_tariff.price != 0">
                    <div id="card-element">
                        <!-- Elements will create input elements here -->
                    </div>

                    <!-- We'll put the error messages in this element -->
                    <div id="card-errors" role="alert"></div>
                    <div class="overview-checkbox" :class="{active: savePaymentMethod}">
                        <label for="save-payment">
                            <div class="overview-checkbox-mask">
                                <div class="overview-checkbox-icon"></div>
                            </div>
                            Save payment method</label>
                        <input type="checkbox" v-model="savePaymentMethod" id="save-payment"
                               style="display: none">
                    </div>
                    <button id="submit" class="pay-submit" v-show="payment_pause !== true && payment_done !== true">Pay {{actual_tariff.price}}$</button>
                    <div class="pay-submit inactive" v-show="payment_pause === true">
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
                    <div class="pay-submit done" v-show="payment_done === true">Payment is successful</div>
                    <div class="repayment" v-show="payment_done === true" @click="payment_done = false;">Make new payment</div>
                </form>
                <div class="trial-block"  v-show="actual_tariff.price == 0">
                    <div class="trial-button">Try for free</div>
                    <div class="pay-submit inactive" v-if="payment_pause === true">
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
            </div>
        </div>

    </div>
</template>
<script src="">

</script>
<script>
  import constants from "../Constants";
  import dropdown from '@/components/simple/dropdown.vue';
  export default {
    name: 'profile',
    components: {
      dropdown
    },
    data: ()=>({
      name: '',
      last_name: '',
      company: '',
      email: '',
      paid: '',
      token: '',
      payment_pause: false,
      payment_done: false,
      tariffs:[],
      actual_tariff: '',
      savePaymentMethod: true,
    }),
    mounted(){
      let user = JSON.parse(localStorage.getItem('maagio_user'));
      this.name = user.name;
      this.last_name = user.last_name;
      this.company = user.company;
      this.token = localStorage.getItem('token');
      this.email = user.email;
      if(user.paid){
        let date = new Date(user.paid * 1000);
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let year = date.getFullYear();
        let month = months[date.getMonth()];
        let day = date.getDate();
        let minutes = date.getMinutes();
        if (day < 10) {
          day = '0' + day;
        }
        let hours = date.getHours();
        if (hours < 10) {
          hours = '0' + hours;
        }
        if (minutes < 10) {
          minutes = '0' + minutes;
        }

        this.paid = year + ' ' + month + ' ' + day + ' ' + hours + ':' + minutes;
      } else {
        this.paid = 'No tariff';
      }

      let obj = this;
      $(document).ready(function () {
        obj.stripeInit();
      });
      this.takeTariffInfo();
    },
    methods: {
      selectNewTariff(e){
        this.actual_tariff = e;
      },
      takeTariffInfo() {
        let obj = this;
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        this.token = localStorage.getItem('token');
        $.ajax({
          url: constants.BACKEND_URL + 'payment/take-user-tariffs',
          data: {user_id: user.uid, token: this.token},
          type: 'GET',
          dataType: 'json',
          success: function (respond, status, jqXHR) {
            if(respond.ok == 1) {
              for(var i = 0; i < respond.tariffs.length; i++) {
                obj.tariffs.push({val: respond.tariffs[i].id, name: respond.tariffs[i].name, price: respond.tariffs[i].price, period: respond.tariffs[i].period, id: respond.tariffs[i].id});
              }
              obj.actual_tariff = {val: respond.tariffs[0].id, name: respond.tariffs[0].name, price: respond.tariffs[0].price, period: respond.tariffs[0].period, id: respond.tariffs[0].id};
            }
          }
        });
      },
      stripeInit(){
        let obj = this;
        setTimeout(function () {
          var stripe = Stripe('pk_test_51GuBOGC3fcSx3Qt94MdCbROyn2HJ83V4H6L6YGcsZ4BuKPsMhmLJOqQAS2txJu0cZpf334mcso3sp67YTcOndr6H00NTeXiodl');
          var elements = stripe.elements();
          var style = {
            base: {
              color: "#32325d",
            }
          };
          var card = elements.create("card", { style: style });
          card.mount("#card-element");
          var form = document.getElementById('payment-form');
          form.addEventListener('submit', function (ev) {
            let tariff_id = obj.actual_tariff.id;
            let user = JSON.parse(localStorage.getItem('maagio_user'));
            let token = localStorage.getItem('token');
            ev.preventDefault();
            obj.payment_pause = true;
            var clientSecret = '';
            let data = {
              user: user,
              token: token,
              tariff: tariff_id,
            };
            $.ajax({
              url: constants.BACKEND_URL + 'payment/payment',
              type: 'GET',
              data: data,
              dataType: 'json',
              success: function (respond, status, jqXHR) {
                if (!respond.client_secret || respond.client_secret == null) {
                  return false;
                }
                clientSecret = respond.client_secret;
                if(obj.savePaymentMethod) {
                  var payment_method = {
                    payment_method: {
                      card: card,
                      billing_details: {
                        name: obj.name,
                        last_name: obj.last_name,
                        email: obj.email,
                      },
                    },
                    setup_future_usage: 'off_session'
                  };
                } else {
                  var payment_method = {
                    payment_method: {
                      card: card,
                      billing_details: {
                        name: obj.name,
                        last_name: obj.last_name,
                        email: obj.email,
                      },
                    }
                  };
                }

                stripe.confirmCardPayment(clientSecret, payment_method).then(function (result) {

                  if (result.error) {
                    // Show error to your customer (e.g., insufficient funds)
                    document.getElementById('card-errors').textContent = result.error.message;
                  } else {
                    // The payment has been processed!
                    if (result.paymentIntent.status === 'succeeded') {
                      result.user = user;
                      result.token = token;
                      result.tariff = tariff_id;
                      result.save_payment = obj.savePaymentMethod;
                      $.ajax({
                        url: constants.BACKEND_URL + 'payment/success',
                        type: 'GET',
                        data: result,
                        dataType: 'json',
                        success: function (respond, status, jqXHR) {
                          obj.payment_pause = false;
                          obj.payment_done = true;
                          if(respond.ok == 1) {

                          }
                        },
                        error: function () {
                          obj.payment_pause = false;
                        },
                      });
                      // Show a success message to your customer
                      // There's a risk of the customer closing the window before callback
                      // execution. Set up a webhook or plugin to listen for the
                      // payment_intent.succeeded event that handles any business critical
                      // post-payment actions.
                    }
                  }
                });
              },

              error: function (jqXHR, status, errorThrown) {
                obj.payment_pause = false;
                obj.payment_done = true;
              }
            });
          });
        }, 500);
      }
    },
  }
</script>
