<template>
    <div class="payment-modal">
        <!-- CSS is included via this JavaScript file -->
        <div class="payment-container">
            <div class="close-modal" @click="$parent.open_subscribe = false">+</div>
            <div class="header">Monthly Subscription</div>
            <div class="description">
                $399 Per Month
            </div>
            <cardObject v-if="tariff.price != 0"
                        :tariff_id="tariff.id"
                        :price = "tariff.price / 100"
                        :card_visual="0"
            ></cardObject>
        </div>
    </div>
</template>

<script>
  import constants from "../../Constants";
  import cardObject from '@/components/simple/cardObject.vue';
  export default {
    name: 'paymentModal',
    props: {
      tariff: [Object],
    },
    components: {
      cardObject
    },
    data: ()=>({

    }),
    methods: {

    },
    mounted(){

    }
  }
</script>