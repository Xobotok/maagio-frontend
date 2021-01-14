<template>
    <div class="gallery-show">
        <div class="gallery-list">
            <div class="gallery-tab">
                <div class="gallery-content" v-for="(tab, key) in $parent.project.galleries">
                    <div class="gallery-art" @click="openGallery(key)">
                        <img :src="tab.photos[0]" alt="">
                        <div class="gallery-name">{{tab.name}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="open-gallery" id="gallery-container" v-for="(gallery, index) in $parent.project.galleries"
             v-show="actualGallery === index">
            <div class="return" @click="actualGallery = false; galleryActivePhoto = 0;"></div>
            <div class="image-list" id="gallery" style="display: none">
                <div class="gallery-carousel">
                    <img @mousedown.prevent="startDrag"
                         @touchstart="startDrag"
                         :src="photos" alt="" :key="index + photos" v-for="(photos, index) in gallery.photos">
                </div>
                     <!--v-show="index === galleryActivePhoto"-->
            </div>
            <div data-id="image-container" class="mobile-container relative overflow-hidden"  @mousemove="drag"
                 @touchmove="drag"
                 @mouseup="stopDrag"
                 @touchend="stopDrag">
                <img class="absolute h-full z-0"
                     :style="prevImageStyle"
                     :src="previousImage">
                <img class="absolute h-full z-10"
                     @mousedown.prevent="startDrag"
                     @touchstart="startDrag"
                     :style="currentImageStyle"
                     :src="currentImage">
                <img class="absolute h-full z-20"
                     :style="nextImageStyle"
                     :src="nextImage">
            </div>
            <div class="gallery-control" v-if="images.length > 0">
                <div class="" @click="previousImageClick">Prevent</div>
                <div class="">{{currentImageIndex + 1}} / <span v-if="images.length > 0">{{images.length}}</span></div>
                <div class="" @click="nextImageClick">Next</div>
            </div>
        </div>
    </div>
</template>

<script>
  import constants from '../../Constants';
  var width = document.body.clientWidth / 100 * 90;
  if(width > 1200) {
    width = 1200;
  }
  const DEVICE_WIDTH = width;
  const HALF_WIDTH = DEVICE_WIDTH / 2
  const DRAGGING_SPEED = 1.2
  const MAX_BLUR = 8
  var images = [];
  const getCursorX = (event) => {
    if(event.touches && event.touches.length) {
      // touch
      return event.touches[0].pageX
    }

    if(event.pageX && event.pageY) {
      // mouse
      return event.pageX
    }

    return 0
  }

  const clampPosition = (position) => {
    // constrain image to be between 0 and device width
    return Math.max(Math.min(position, DEVICE_WIDTH), 0)
  }

  const calculateBlur = (position) => {
    return MAX_BLUR * (1 - (position / DEVICE_WIDTH));
  }
  export default {
    name: 'gallery',
    components: {

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
      nextImageAnimatedX: DEVICE_WIDTH
    }),
    watch: {},
    methods: {
      previousImageClick() {
        if(this.currentImageIndex == 0) {
          this.currentImageIndex = this.galleries[0][this.actualGallery].photos.length - 1;
        } else {
          this.currentImageIndex--;
        }
      },
      nextImageClick() {
        if(this.currentImageIndex == this.galleries[0][this.actualGallery].photos.length - 1) {
          this.currentImageIndex = 0;
        } else {
          this.currentImageIndex++;
        }
      },
      startDrag(e) {
        if(this.animating) {
          // avoid dragging when animation is running
          return
        }
        this.dragging = true
        this.cursorStartX = getCursorX(e)
        this.cursorCurrentX = this.cursorStartX
      },
      drag(e) {
        if(!this.dragging) {
          // avoid updating if not dragging
          return
        }
        this.cursorCurrentX = getCursorX(e)
      },
      stopDrag(e) {
        let animationProps = this.createReleaseAnimation()
        this.dragging = false
        this.animating = true
        TweenLite.to(this, 0.2, {
          ...animationProps,
          onComplete: () => {this.animating = false}
        })
      },
      createReleaseAnimation() {
        if(this.swipingLeft) {
          if(this.nextImagePosition > HALF_WIDTH) {
            // next image should be animated back to be offscreen
            this.nextImageAnimatedX = this.nextImagePosition
            return {nextImageAnimatedX: DEVICE_WIDTH}
          }

          // current image "copies" the nextImage position
          this.currentImageAnimatedX = this.nextImagePosition
          // the nextImage is sent offscreen
          this.nextImageAnimatedX = DEVICE_WIDTH

          // Change the image index to become the next image in the array
          // images src attribute will update accordingly
          this.currentImageIndex = this.nextImageIndex
          return {currentImageAnimatedX: 0}
        }

        // swipe right
        if(this.currentImagePosition < HALF_WIDTH) {
          // current image should be animated back to center position
          this.currentImageAnimatedX = this.currentImagePosition
          return {currentImageAnimatedX: 0}
        }

        // the nextImage "copies" the currentImage position
        this.nextImageAnimatedX = this.currentImagePosition
        // the currentImage gets centered to become the prevImage
        this.currentImageAnimatedX = 0

        // Change the image index to become the previous image in the array
        this.currentImageIndex = this.previousImageIndex
        return {nextImageAnimatedX: DEVICE_WIDTH}
      },
      openGallery(gallery){
        this.actualGallery = gallery;
        var cont = $('[data-id=image-container]');
        cont.css('width', DEVICE_WIDTH + 'px');
        images = this.$parent.project.galleries[this.actualGallery].photos;
        this.images = [];
        for(var i = 0; i < images.length; i++) {
          this.images.push(images[i]);
        }
        this.currentImageIndex = 0;
      },
    },
    computed: {
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
      let iter = 0;
      this.galleries[iter] = [];
      for (let i = 0; i < this.$parent.project.galleries.length; i++) {
        this.galleries[iter].push(this.$parent.project.galleries[i]);
        if (this.$parent.project.galleries.length > i + 1) {
          if ((i + 1) % 3 === 0) {
            iter++;
            this.galleries[iter] = [];
          }
        }
      }
    },
  }
</script>
