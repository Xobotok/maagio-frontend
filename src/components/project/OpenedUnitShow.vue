<template>
    <div class="unit-content">
        <div class="unit-info" :class="{'with-photos': unit.photos.length > 0}">
            <div class="unit-back" @click="callback"></div>
            <div class="unit-common-info">
                <div class="common-block">
                    <div class="unit-header">{{project.name}}</div>
                    <div class="unit-number">{{unit.unit_number}}</div>
                    <div class="unit-number">Floor </div>
                </div>
                <div class="common-block">
                    <div class="unit-extra-info" style="padding-bottom: 20px; padding-top: 20px;">
                        {{unit.int_sq}} Sq.Ft. Interior
                    </div>
                    <div class="unit-extra-info" v-if="unit.ext_sq != null">{{unit.ext_sq}} Sq.Ft.
                        Exterior
                    </div>
                    <div class="unit-extra-info" v-if="unit.bad != 0">{{unit.bad}} Bedroom</div>
                    <div class="unit-extra-info" v-if="unit.bad == 0">STUDIO</div>
                    <div class="unit-extra-info">{{unit.bath}} Bathroom</div>
                    <div class="unit-extra-info" v-if="unit.parking == 1">Parking</div>
                </div>
            </div>
            <div class="unit-status-info">
                <div class="unit-status-text">{{this.statuses[unit.status]}}</div>
                <div class="unit-status-text">$ {{unit.price}}</div>
            </div>
            <div class="unit-gallery" v-if="unit.photos.length > 0">
                <div class="carousel">
                    <div class="carousel-images" :style="{left: '-' + activePhoto * 300 + 'px'}">
                        <img :src="image.image_link" alt="" v-for="image in unit.photos" @click="openUnitGallery">
                    </div>
                </div>
                <div class="carousel-buttons">
                    <div class="button" @click="carouselGoLeft"><</div>
                    <div class="" style="font-size: 18px">{{activePhoto + 1}} / {{unit.photos.length}}</div>
                    <div class="button" @click="carouselGoRight">></div>
                </div>
            </div>
        </div>
        <div class="unit-image">
            <div class="" v-show="unit.image != undefined">
                <img :src="unit.image" alt="">
            </div>
        </div>
        <Gallery v-show="unit.photos.length > 0 && openedUnitGallery == true"
                 :images="unit.photos"
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
    data () {
      return {
        statuses: ['Available', 'Reserved', 'Sold', 'Unreleased'],
        openedUnitGallery: false,
        activePhoto: 0,
      }
    },
    props: ['unit', 'callback', 'project'],
    mounted() {

    },
    beforeMount() {

    },
    beforeDestroy() {

    },
    computed: {

    },
    methods: {
      carouselGoLeft(e) {
        if(this.activePhoto == 0) {
          return false;
        } else {
          this.activePhoto--;
        }
      },
      carouselGoRight(e) {
        if(this.activePhoto == this.unit.photos.length - 1) {
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