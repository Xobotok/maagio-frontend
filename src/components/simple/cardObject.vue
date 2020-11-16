<template>
    <div class="card-object">
        <!-- CSS is included via this JavaScript file -->
        <div class="container">
            <form class="card-inputs">
                <div class="card-name">
                    <div class="">Card number</div>
                    <input type="text" @keyup="resetWarnings" v-model="cardNumber" :class="{warning: numberWarning}" placeholder="**** **** **** ****" name="number">
                </div>
                <div class="card-details">
                    <div class="">
                        <div class="">Card date</div>
                        <input type="text" placeholder="**/**"  :class="{warning: monthYearWarning}" v-model="cardMonthYear" name="expiry"/>
                    </div>
                    <div class="">
                        <div class="">Card CVC</div>
                        <input type="text" v-model="cardCvv" :class="{warning: cvvWarning}" placeholder="***" name="cvc"/>
                    </div>
                </div>
                <div class="payment-warning">
                    {{cardError}}
                </div>
                <!--<div class="overview-checkbox" :class="{active: savePaymentMethod}">
                    <label for="save-payment">
                        <div class="overview-checkbox-mask">
                            <div class="overview-checkbox-icon"></div>
                        </div>
                        Save payment method</label>
                    <input type="checkbox" v-model="savePaymentMethod" id="save-payment"
                           style="display: none">
                </div>-->
                <div class="pay-submit done" v-show="payment_done === true">Payment is successful</div>
                <div class="repayment" v-show="payment_done === true" @click="payment_done = false;">Make new payment</div>
                <button class="pay-submit" @click="createPayment" v-show="payment_pause !== true && payment_done !== true">Subscribe</button>
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
            </form>
            <div class='card-wrapper' v-show="card_visual == 1"></div>
        </div>
    </div>
</template>

<script>
  import constants from "../../Constants";
  export default {
    name: 'cardObject',
    props: {
        tariff_id: [String, Number],
        price: [Number, String],
        card_visual: [Number],
    },
    data: ()=>({
      paymentWarning: '',
      savePaymentMethod: true,
      cardNumber: '',
      cardMonthYear: '',
      cardCvv: '',
      cardError: '',
      payment_pause: false,
      payment_done: false,
      numberWarning: false,
      monthYearWarning: false,
      cvvWarning: false,
    }),
    methods: {
      requireAction(secret, method_id) {
        let obj = this;
        var stripe = Stripe(constants.STRIPE_PUBLIC);
        stripe.confirmCardPayment(secret, {
          payment_method: method_id,
        }).then((result) => {
          if (result.error) {
            obj.payment_pause = false;
            obj.paymentWarning = result.error;
          } else {
            if (result.paymentIntent.status === 'succeeded') {
              obj.confirmPayment(result.paymentIntent.id);
            }
          }
        })
        .catch((error) => {
          obj.payment_pause = false;
          obj.paymentWarning = error;
        });
      },
      confirmPayment(paymentIntentId) {
        let obj = this;
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        $.ajax({
          url: constants.BACKEND_URL + 'payment/confirm-payment',
          data: {user: user, token: token, payment_id: paymentIntentId, tariff_id: obj.tariff_id},
          type: 'GET',
          dataType: 'json',
          success: function (respond, status, jqXHR) {
            obj.payment_pause = false;
            if(respond.ok == 1) {
              obj.payment_done = true;
            } else {
              obj.payment_done = false;
            }
          },
          error: function (jqXHR, status, errorThrown) {
            obj.payment_pause = false;
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
          }
        });
      },
      createPayment(e) {
        e.preventDefault();
        this.check();
        if(this.numberWarning == true || this.cardMonthYear == true || this.cardCvv == true) {
          return false;
        }
        this.payment_pause = true;
        let obj = this;
        var card = {number: obj.cardNumber, month: obj.cardMonthYear.split('/')[0], year: obj.cardMonthYear.split('/')[1], cvv: obj.cardCvv};
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        obj.cardError = '';

        $.ajax({
          url: constants.BACKEND_URL + 'payment/subscribe',
          data: {card: card, user: user, token: token, tariff: obj.$parent.tariff},
          type: 'GET',
          dataType: 'json',
          success: function (respond, status, jqXHR) {
            obj.payment_pause = false;
            if(respond.ok == 1) {
                if(respond.secret != undefined) {
                  obj.requireAction(respond.secret, respond.method_id)
                } else {
                  obj.$parent.$parent.subscribe = respond.subscribe;
                  obj.$parent.$parent.open_subscribe = false;
                }
            } else {
              if(respond.error_code == 'card') {
                obj.cardError = respond.message;
              }
            }
          },
          error: function (jqXHR, status, errorThrown) {
            obj.payment_pause = false;
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
          }
        });
      },
      check(){
        if(this.cardNumber == '') {
          this.numberWarning = true;
        }
        if(this.cardMonthYear == '') {
          this.monthYearWarning = true;
        }
        if(this.cardCvv == '') {
          this.cvvWarning = true;
        }
      },
      resetWarnings(){
        this.numberWarning = false;
          this.monthYearWarning = false;
          this.cvvWarning = false;
      },
    },
    mounted(){
      var card = require("card");
      card = new Card({
        form: 'form',
        container: '.card-wrapper',
        messages: {
          validDate: 'expire\ndate',
          monthYear: 'mm/yy'
        },
      });
    }
  }
</script>