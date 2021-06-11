<template>
    <div class="gallery-show">
        <div class="gallery-list">
            <div class="gallery-tab" :class="{'multiple-galleries': $parent.project.galleries.length > 3}">
              <div class="gallery-content" :style="{width: galleryStyles.width, height: galleryStyles.height}" v-for="(tab, key) in $parent.project.galleries">
                <div class="gallery-art" @click="openGallery(key)">
                  <img :src="tab.photos[0]" alt="">
                  <div class="gallery-name">{{tab.name}}</div>
                </div>
              </div>
            </div>
        </div>
        <Gallery v-for="(gallery, index) in $parent.project.galleries" v-show="actualGallery !== false && actualGallery == index"
                 :images="gallery.photos"
                 :backButtonClick="closeGallery"></Gallery>


    </div>
</template>

<script>
  import constants from '../../Constants';
  import Slider from '../../widgets/wyhaya-slider/index';
  import Gallery from '../../components/app/Gallery';
  export default {
    name: 'gallery',
    components: {
      Gallery,Slider
    },
    data: ()=>({
      galleries: [],
      gallery_swipe: [],
      actualGallery: false,
      galleryOpened: false,
      images: [],
      activeTab: 0,
      galleryActivePhoto: 0,
      dragging: false,
      animating: false,
      cursorStartX: 0,
      cursorCurrentX: 0,
      currentImageIndex: 0,
      currentImageAnimatedX: 0,
    }),
    watch: {},
    methods: {
      closeGallery() {
        this.actualGallery = false
      },
      openGallery(gallery){
        console.log(this.$parent.project.galleries[gallery].photos)
        this.actualGallery = gallery
        this.currentImageIndex = 0;
      },
    },
    computed: {
      galleryStyles() {
        var result = {};
        if(this.$parent.project.galleries.length <= 4) {
          result.width = 100/this.$parent.project.galleries.length + '%';
          result.height = '100%';
        } else if(this.$parent.project.galleries.length > 4 && this.$parent.project.galleries.length <= 8) {
          result.width = 100/(Math.ceil(this.$parent.project.galleries.length / 2)) + '%';
          result.height = '50%';
        } else if(this.$parent.project.galleries.length > 8) {
          result.width = '12.5%'
          result.height = 100/(Math.ceil(this.$parent.project.galleries.length / 8)) + '%';
        }
        return result;
      },
      diffX () {
        return this.cursorStartX - this.cursorCurrentX
      },
      currentImage () {
        return this.images[this.currentImageIndex]
      },
      previousImageIndex () {
        return (this.currentImageIndex - 1 + this.images.length) % this.images.length
      },
      previousImage () {
        return this.images[this.previousImageIndex]
      },
      nextImageIndex () {
        return (this.currentImageIndex+1) % this.images.length
      },
      nextImage () {
        return this.images[this.nextImageIndex]
      },
      swipingLeft () {
        return this.diffX >= 0
      },
      currentImagePosition () {
        if(this.animating) {
          return this.currentImageAnimatedX
        }
        if(!this.dragging || this.swipingLeft) {
          return 0
        }
        const position = this.diffX * -DRAGGING_SPEED
        return clampPosition(position)
      },
      prevImageStyle () {
        const blur = calculateBlur(this.currentImagePosition)

        return {
          'filter': `blur(${blur}px)`
        }
      },
      currentImageStyle () {
        const blur = calculateBlur(this.nextImagePosition)

        return {
          'left': `${this.currentImagePosition}px`,
          'filter': `blur(${blur}px)`
        }
      },
      nextImagePosition () {
        if(this.animating) {
          return this.nextImageAnimatedX
        }
        const swipingRight = !this.swipingLeft
        if(!this.dragging || swipingRight) {
          return DEVICE_WIDTH
        }

        const position = DEVICE_WIDTH - (this.diffX * DRAGGING_SPEED)
        return clampPosition(position)
      },
      nextImageStyle () {
        return {
          'left': `${this.nextImagePosition}px`
        }
      }
    },
    created(){
      this.galleries = this.$parent.project.galleries;
      console.log(this.galleries);
    },
  }
</script>
