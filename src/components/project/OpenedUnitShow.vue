<template>
  <div class="unit-content">
    <div class="unit-info superscroll" v-show="openedUnitGallery == false"
         :class="{'with-photos': unit.photos.length > 0}">
      <div class="unit-back" @click="callback"></div>
      <div class="unit-common-info">
        <div class="common-block">
          <div class="unit-header">{{ project.name }}</div>
          <!--                    <div class="unit-number">{{unit.unit_number}}</div>-->
          <div class="unit-number">Floor {{ floor }}</div>
        </div>
        <div class="unit-bad-bath">
          <div class="unit-extra-info right-delimiter" v-if="unit.bad != 0">{{ unit.bad }} Bed</div>
          <div class="unit-extra-info" v-if="unit.bad != 0">{{ unit.bath }} Bath</div>
          <div class="unit-extra-info" v-if="unit.bad == 0">STUDIO</div>
        </div>
        <div class="common-block" style="line-height: 25px; padding-bottom: 40px;">
          <div class="unit-extra-info" style="">
            Interior: {{ interior_text }} Sq.Ft.
          </div>
          <div class="unit-extra-info" v-if="unit.ext_sq != '' && unit.ext_sq != null">
            Exterior: {{ exterior_text }} Sq.Ft.
          </div>
        </div>
        <div class="common-block" style="line-height: 25px; padding-bottom: 40px;">
          <div class="unit-extra-info" style="" v-if="unit.parking != 0">
           Parking
          </div>
          <div class="unit-extra-info">
            HOA: ${{ hoa_text }}
          </div>
          <div class="unit-extra-info" style="" v-if="unit.bmr != 0">
            BMR
          </div>
        </div>
      </div>
      <div class="unit-status-info">
        <div class="unit-status-text">{{ this.statuses[unit.status] }}</div>
        <div class="unit-status-text">$ {{ Intl.NumberFormat('en-US').format(unit.price) }}</div>
      </div>
      <div class="unit-gallery" v-if="unit.photos.length > 0">
        <div class="carousel">
          <div class="carousel-images" :style="{left: '-' + activePhoto * 300 + 'px'}">
            <img :src="image.image_link" alt="" v-for="image in unit.photos" @click="openUnitGallery">
          </div>
        </div>
        <div class="carousel-dots">
          <div class="carousel-dots__container">
            <div class="carousel-dot" :class="{'active': activePhoto === key -1}" v-for="(key, dot) in unit.photos.length" @click="activePhoto = key - 1" v-if="key <= 10"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="unit-image">
      <div class="" v-show="unit.image != undefined">
        <img :src="unit.image" alt="">
      </div>
    </div>
    <Gallery v-show="unit.photos.length > 0 && openedUnitGallery == true"
             :images="unit.photos.map( image => image.image_link)"
             :backButtonClick="closeUnitGallery"></Gallery>
  </div>
</template>

<script>
import Gallery from '../app/Gallery.vue'

export default {
  'name': 'OpenedUnitShow',
  components: {
    Gallery
  },
  data() {
    return {
      statuses: ['Available', 'Reserved', 'Sold', 'Unreleased'],
      openedUnitGallery: false,
      activePhoto: 0,
    }
  },
  props: ['unit', 'callback', 'project', 'floor'],
  mounted() {
    console.log(this.$parent)
    console.log(this.unit)
  },
  beforeMount() {

  },
  beforeDestroy() {

  },
  computed: {
    interior_text() {
      return new Intl.NumberFormat('en-US').format(this.unit.int_sq);
    },
    exterior_text() {
      return new Intl.NumberFormat('en-US').format(this.unit.ext_sq);
    },
    hoa_text() {
      return new Intl.NumberFormat('en-US').format(this.unit.hoa);
    }
  },
  methods: {
    carouselGoLeft(e) {
      if (this.activePhoto == 0) {
        return false;
      } else {
        this.activePhoto--;
      }
    },
    carouselGoRight(e) {
      if (this.activePhoto == this.unit.photos.length - 1) {
        return false;
      } else {
        this.activePhoto++;
      }
    },
    openUnitGallery() {
      this.openedUnitGallery = true;
    },
    closeUnitGallery() {
      this.openedUnitGallery = false;
    },
  }
}
</script>
