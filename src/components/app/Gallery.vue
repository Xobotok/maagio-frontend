<template>
    <div class="open-gallery" id="unit-gallery-container">
        <div class="return" @click="backButtonClick(), currentImageIndex = 0"></div>
        <div class="image-list" id="unit-gallery" style="display: none">
            <div class="gallery-carousel">
                <img @mousedown.prevent="startDrag"
                     @touchstart="startDrag"
                     :src="photo" alt="" :key="index + photos" v-for="(photo, index) in photos">
            </div>
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
</template>

<script>
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
    'name': 'Gallery',
    data () {
      return {
        galleryActivePhoto: 0,
        currentImageIndex: 0,
        dragging: false,
        animating: false,
        cursorStartX: 0,
        cursorCurrentX: 0,
        currentImageAnimatedX: 0,
        nextImageAnimatedX: DEVICE_WIDTH,
        photos: [],
      }
    },
    props: ['images', 'backButtonClick'],
    mounted() {

    },
    beforeMount() {
      if(this.startingImageIndex == undefined) {
        this.startingImageIndex = 0;
      }
      for(var i = 0; i < this.images.length; i++) {
        if(this.images[i].image_link != undefined) {
          this.photos.push(this.images[i].image_link);
        }
      }
    },
    beforeDestroy() {

    },
    computed: {
      diffX () {
        return this.cursorStartX - this.cursorCurrentX
      },
      currentImage () {
        return this.photos[this.currentImageIndex];
      },
      previousImageIndex () {
        return (this.currentImageIndex - 1 + this.photos.length) % this.photos.length
      },
      previousImage () {
        return this.photos[this.previousImageIndex];
      },
      nextImageIndex () {
        return (this.currentImageIndex+1) % this.photos.length
      },
      nextImage () {
        return this.photos[this.nextImageIndex];
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
    methods: {
      previousImageClick() {
        if(this.currentImageIndex == 0) {
          this.currentImageIndex = this.images.length - 1;
        } else {
          this.currentImageIndex--;
        }
      },
      nextImageClick() {
        if(this.currentImageIndex == this.images.length - 1) {
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
    }
  }
</script>

<style lang="less">
    .mobile-container {
        max-height: 90vh;
        width: 90vw;
        max-width: 1200px;
        height: 100%;
        border: 1px solid #cccccc;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
    .mask {
        display: inline-block;
        max-width: 800px;
        height: 100%;

    }
    img {
        width: 100%;
        -o-object-fit: contain;
        object-fit: cover;
        object-position: center;
        height: 100%;
        border-radius: 12px;
    }
    }
    .open-gallery {
        position: absolute;
        top: 0;
        padding-top: 30px;
        width: 100vw;
        height: 100vh;
        left: 0;
        padding-left: 40px;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 60px;
    .gallery-control {
    div {
        margin-left: 10px;
        margin-right: 10px;
        cursor: pointer;
    }
    }
    .return {
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%2220%22%20viewBox%3D%220%200%2012%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M11.67%201.77L9.89%200L0%209.9L9.9%2019.8L11.67%2018.03L3.54%209.9L11.67%201.77Z%22%20fill%3D%22black%22/%3E%0A%3C/svg%3E%0A');
        background-repeat: no-repeat;
        width: 12px;
        height: 20px;
        position: absolute;
        top: 40px;
        left: 20px;
        cursor: pointer;
    }
    .gallery-control {
        position: absolute;
        bottom: 10px;
        display: flex;
        padding: 10px;
        background-color: white;
    .control-arrow-left.inactive {
        opacity: 0.3;
        cursor: default;
    }
    .control-arrow-left {
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M8%2016L9.41%2014.59L3.83%209L16%209L16%207L3.83%207L9.41%201.41L8%20-6.99382e-07L6.99382e-07%208L8%2016Z%22%20fill%3D%22black%22/%3E%0A%3C/svg%3E%0A');
        background-repeat: no-repeat;
        width: 16px;
        height: 16px;
        cursor: pointer;
    }
    .control-number {
        padding-left: 5px;
        padding-right: 5px;
    }
    .control-arrow-right.inactive {
        opacity: 0.3;
        cursor: default;
    }
    .control-arrow-right {
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M8%200L6.59%201.41L12.17%207H0V9H12.17L6.59%2014.59L8%2016L16%208L8%200Z%22%20fill%3D%22black%22/%3E%0A%3C/svg%3E%0A');
        background-repeat: no-repeat;
        width: 16px;
        height: 16px;
        cursor: pointer;
    }
    }
    .gradient {
        width: 100%;
        height: 40px;
        background: rgb(0,0,0);
        background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,1) 84%);
    }
    }
    .mobile-container img{
        background-color: white;
    }
    .gallery-control div {
        -ms-user-select: none;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
    }
</style>