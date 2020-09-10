<template>
    <div class="show-map">
        <div id="map"></div>
    </div>
</template>
<script>
  import constants from '../../Constants';

  export default {
    name: 'show-map',
    data: ()=>({
      logo: '',
    }),
    mounted(){
      var script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDAHyg8_wG19M4GTE4BDSuez-Xc3wjllYQ&callback=initMap';
      script.defer = true;
      let lat = this.$parent.project.map.lat;
      let lng = this.$parent.project.map.lng;
      window.initMap = function () {
        // JS API is loaded and available
        this.map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: lat, lng: lng },
          zoom: 18,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        });
        var marker = new google.maps.Marker({position: { lat: lat, lng: lng }, map: map});
      };
// Append the 'script' element to 'head'
      document.head.appendChild(script);
    },
  }
</script>
