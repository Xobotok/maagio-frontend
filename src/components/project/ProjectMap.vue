<template>
    <div class="project-maps">
        <div class="google-map" id="map">

        </div>
    </div>
</template>

<script>
  // Create the script tag, set the appropriate attributes
    export default {
      name: 'ProjectMap',
      props: ['name'],
      data: function () {
        return {}
      },
      methods: {
      },
      mounted: function () {
        const element = document.getElementById('map');
        const options = {
          zoom: 14,
          center: new google.maps.LatLng(59.93, 30.32)
        }
        this.map = new google.maps.Map(element, options)
      },
    }
</script>

<style scoped>
    .google-map {
        width: 640px;
        height: 480px;
        margin: 0 auto;
        background: gray;
    }
</style>
