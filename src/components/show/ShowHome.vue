<template>
    <div class="start-show">
        <div class="start-show-content">
            <img v-if="this.$parent.project.project_logo" :src="this.$parent.project.project_logo" alt="">
            <div class="start-button" @click="this.$parent.startShow">
                START
            </div>
        </div>
    </div>
</template>

<script>
  import constants from '../../Constants';
  export default {
    name: 'show-home',
    data: ()=>({
      logo: '',
    }),
    mounted(){

    },
  }
</script>
