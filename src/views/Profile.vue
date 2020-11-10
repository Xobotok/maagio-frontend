<template>
    <div class="profile">
        <div class="profile-avatar">
            <div class="profile-user">
                {{ $parent.old_profile.name}} {{ $parent.old_profile.last_name}}
            </div>
            <div class="profile-mail">{{ this.$parent.user.email}}</div>
        </div>
        <div class="profile-page">
            <div class="profile-info">
                <div class="profile-header">Profile</div>
                <div class="profile-details">
                    <div class="profile-separate">
                        <div class="profile-input">
                            <div class="profile-text">First Name</div>
                            <input @keyup="checkSave()" type="text" v-model="$parent.user.name">
                        </div>
                        <div class="profile-input">
                            <div class="profile-text">Last Name</div>
                            <input @keyup="checkSave()" type="text" v-model="$parent.user.last_name">
                        </div>
                    </div>
                    <div class="profile-input">
                        <div class="profile-text">Company Name</div>
                        <input @keyup="checkSave()" type="text" v-model="$parent.user.company">
                    </div>
                </div>
                <div class="save-profile-button" v-if="save_check != false" @click="saveProfile">Save</div>
                <div class="save-profile-button inactive" v-if="save_check == false">Save</div>
            </div>
            <div class="profile-info">
                <div class="profile-header">Membership</div>
                <div class="tariff-description" v-if="$parent.end_time != ''" :class="{trial: $parent.subscribe.cancel_at_period_end != false,
                subscribe: $parent.subscribe.cancel_at_period_end == false}">
                    <span v-if="$parent.subscribe.cancel_at_period_end != false && $parent.subscribe.status == 'trialing'">You’re currently in free trial. <span
                            class="roboto_bold db pt10">{{$parent.end_time}} days left.</span></span>
                    <span v-if="$parent.subscribe.cancel_at_period_end != false && $parent.subscribe.status != 'trialing'">You’re subscribed to our monthly membership. <span
                            class="roboto_bold db pt10">{{$parent.end_time}} days left.</span></span>
                    <span v-if="$parent.subscribe.cancel_at_period_end == false">You’re subscribed to our monthly membership. <span
                            class="roboto_bold db pt10">{{$parent.end_time}} days left until automatic renewal.</span></span>
                </div>
                <div class="profile-details">
                    <div v-if="$parent.subscribe.cancel_at_period_end == true || $parent.subscribe == null"
                         @click="$parent.open_subscribe = true" class="subscribe-button">Subscribe Now
                    </div>
                    <div v-if="$parent.subscribe.cancel_at_period_end == false" v-show="unsubscribe_pause === false" class="subscribe-cancel-button" @click="cancelSubscribe">
                        Unsubscribe
                    </div>
                    <div class="subscribe-cancel-button inactive" v-show="unsubscribe_pause === true">
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
  import cardObject from '@/components/simple/cardObject.vue';
  export default {
    name: 'profile',
    components: {
      dropdown, cardObject
    },
    data: ()=>({
      save_check: false,
      name: '',
      last_name: '',
      company: '',
      email: '',
      paid: '',
      token: '',
      cancel_sub: false,
      tariffs: [],
      actual_tariff: '',
      end_time: '',
      unsubscribe_pause: false,
    }),
    mounted(){
    },
    methods: {
      checkSave() {
        if (this.$parent.user.name === this.$parent.old_profile.name && this.$parent.user.last_name === this.$parent.old_profile.last_name
          && this.$parent.user.company === this.$parent.old_profile.company) {
          this.save_check = false;
        } else {
          this.save_check = true;
        }
      },
      saveProfile() {
        let obj = this;
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        obj.cardError = '';
        $.ajax({
          url: constants.BACKEND_URL + 'users/save-profile',
          data: {
            user: user,
            token: token,
            name: this.$parent.user.name,
            last_name: this.$parent.user.last_name,
            company_name: this.$parent.user.company
          },
          type: 'GET',
          dataType: 'json',
          success: function (respond, status, jqXHR) {
            obj.save_check = false;
            if (respond.ok == 1) {
              obj.$parent.old_profile.name = respond.user.name;
              obj.$parent.old_profile.last_name = respond.user.last_name;
              obj.$parent.old_profile.company = respond.user.company;
            }
          },
          error: function () {
            obj.cancel_sub = false;
          }
        });
      },
      cancelSubscribe() {
        let obj = this;
        obj.unsubscribe_pause = true;
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        obj.cardError = '';
        $.ajax({
          url: constants.BACKEND_URL + 'payment/cancel-subscribe',
          data: { user: user, token: token },
          type: 'GET',
          dataType: 'json',
          success: function (respond, status, jqXHR) {
            obj.cancel_sub = false;
            obj.unsubscribe_pause = false;
            if (respond.ok == 1) {
              obj.$parent.subscribe = respond.subscribe;
            }
          },
          error: function () {
            obj.unsubscribe_pause = false;
          }
        });
      },
      selectNewTariff(e){
        this.actual_tariff = e;
      },
    },
  }
</script>
