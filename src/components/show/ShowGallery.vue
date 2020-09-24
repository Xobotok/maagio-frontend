<template>
    <div class="gallery-show">
        <div class="gallery-list">
            <div class="gallery-tab" v-if="activeTab == key"  v-for="(tab, key) in galleries">
                <div class="gallery-content" v-for="gallery in galleries[key]">
                    <div class="gallery-art" @click="openGallery(gallery)">
                        <img :src="gallery.photos[0]" alt="">
                        <div class="gallery-name">{{gallery.name}}</div>
                    </div>
                </div>
            </div>
            <div class="gallery-control" v-if="galleries.length > 1">
                <div class="control-arrow-left inactive" v-if="activeTab == 0"></div>
                <div class="control-arrow-left" @click="activeTab--" v-if="activeTab != 0"></div>
                <div class="control-number">{{activeTab + 1}} / {{galleries.length}} </div>
                <div class="control-arrow-right inactive" v-if="activeTab == galleries.length - 1"></div>
                <div class="control-arrow-right" v-if="activeTab < galleries.length - 1" @click="activeTab++"></div>
            </div>
        </div>
        <div class="open-gallery" v-if="actualGallery != false">
            <div class="return" @click="actualGallery = false; galleryActivePhoto = 0;"></div>
            <div class="image-list" v-for="(photos, key) in actualGallery.photos">
                <img :src="photos" alt="" v-if="key === galleryActivePhoto">
            </div>
            <div class="gallery-control" v-if="actualGallery.photos.length > 1">
                <div class="control-arrow-left inactive" v-if="galleryActivePhoto == 0"></div>
                <div class="control-arrow-left" @click="galleryActivePhoto--" v-if="galleryActivePhoto != 0"></div>
                <div class="control-number">{{galleryActivePhoto + 1}} / {{actualGallery.photos.length}} </div>
                <div class="control-arrow-right inactive" v-if="galleryActivePhoto == actualGallery.photos.length - 1"></div>
                <div class="control-arrow-right" v-if="galleryActivePhoto < actualGallery.photos.length - 1" @click="galleryActivePhoto++"></div>
            </div>
        </div>
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
