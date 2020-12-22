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
        <div class="open-gallery" v-for="(gallery, index) in $parent.project.galleries" v-show="actualGallery === index">
            <div class="return" @click="actualGallery = false; galleryActivePhoto = 0;"></div>
            <div class="image-list" v-for="(photos, key) in gallery.photos">
                <img :src="photos" alt="" v-show="key === galleryActivePhoto">
            </div>
            <div class="gallery-control" v-if="actualGallery !== false" v-show="$parent.project.galleries[actualGallery].photos.length > 1">
                <div class="control-arrow-left inactive" v-if="galleryActivePhoto == 0"></div>
                <div class="control-arrow-left" @click="galleryActivePhoto--" v-if="galleryActivePhoto != 0"></div>
                <div class="control-number">{{galleryActivePhoto + 1}} / {{$parent.project.galleries[actualGallery].photos.length}} </div>
                <div class="control-arrow-right inactive" v-if="galleryActivePhoto == $parent.project.galleries[actualGallery].photos.length - 1"></div>
                <div class="control-arrow-right" v-if="galleryActivePhoto < $parent.project.galleries[actualGallery].photos.length - 1" @click="galleryActivePhoto++"></div>
            </div>
        </div>
        <!--<div class="open-gallery" v-if="$parent.project.galleries.length > 0" v-show="galleryOpened != false">
            <div class="return" @click="actualGallery = false; galleryActivePhoto = 0;"></div>
            <div class="image-list" v-for="(photos, key) in actualGallery.photos">
                <img :src="photos" alt="" v-if="key === galleryActivePhoto">
            </div>
            <div class="gallery-control" v-show="$parent.project.galleries[actualGallery].photos.length > 1">
                <div class="control-arrow-left inactive" v-if="galleryActivePhoto == 0"></div>
                <div class="control-arrow-left" @click="galleryActivePhoto&#45;&#45;" v-if="galleryActivePhoto != 0"></div>
                <div class="control-number">{{galleryActivePhoto + 1}} / {{actualGallery.photos.length}} </div>
                <div class="control-arrow-right inactive" v-if="galleryActivePhoto == actualGallery.photos.length - 1"></div>
                <div class="control-arrow-right" v-if="galleryActivePhoto < actualGallery.photos.length - 1" @click="galleryActivePhoto++"></div>
            </div>
        </div>-->
    </div>
</template>

<script>
  import constants from '../../Constants';
  export default {
    name: 'gallery',
    data: ()=>({
      galleries: [],
      actualGallery: false,
      galleryOpened: false,
      activeTab: 0,
      galleryActivePhoto: 0,
    }),
    methods: {
      openGallery(gallery){
        this.actualGallery = gallery;
        console.log(this.$parent.project.galleries[this.actualGallery].photos)
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
