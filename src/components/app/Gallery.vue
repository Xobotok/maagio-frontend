<template>
    <div class="open-gallery" id="unit-gallery-container">
      <div class="return-container" @click="backButtonClick(), currentImageIndex = 0">
        <div class="return"></div>
      </div>
      <Slider :data="images"
              :time="0"
              :spot="false"></Slider>
    </div>
</template>

<script>
import Slider from '../../widgets/wyhaya-slider/index'
  export default {
    'name': 'Gallery',
    components: {
      Slider
    },
    data () {
      return {
        galleryActivePhoto: 0,
        currentImageIndex: 0,
        dragging: false,
        animating: false,
        cursorStartX: 0,
        cursorCurrentX: 0,
        currentImageAnimatedX: 0,
        photos: [],
      }
    },
    props: ['images', 'backButtonClick'],
    mounted() {
    },
    beforeMount() {

    },
    beforeDestroy() {

    },
    computed: {

    },
    methods: {
    }
  }
</script>

<style lang="less">
    .open-gallery {
        position: fixed;
        top: 0;
      left: 0;
      padding: 20px;
        width: 100vw;
        height: 100vh;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
      .return-container {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background-color: white;
        position: absolute;
        top: 40px;
        left: 20px;
        z-index: 99;
        cursor: pointer;
      }
    .return {
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%2220%22%20viewBox%3D%220%200%2012%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M11.67%201.77L9.89%200L0%209.9L9.9%2019.8L11.67%2018.03L3.54%209.9L11.67%201.77Z%22%20fill%3D%22black%22/%3E%0A%3C/svg%3E%0A');
        background-repeat: no-repeat;
        width: 12px;
        height: 20px;
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
    .gallery-control .control-button {
      padding-right: 10px;
      padding-left: 10px;
    }
    .gallery-control div {
        -ms-user-select: none;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
    }
</style>
