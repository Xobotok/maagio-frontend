<template>
    <div class="project-maps">
        <div class="map-header"><span>GOOGLE MAPS</span> If enabled, Google Maps will show up when the device is
            connected to Wi-Fi.
        </div>
        <div class="overview-checkbox" :class="{active: mapActivate}">
            <label for="map-active">
                <div class="overview-checkbox-mask">
                    <div class="overview-checkbox-icon"></div>
                </div>
                Enabled</label>
            <input type="checkbox" v-model="mapActivate" v-on:change="changeMapActive" id="map-active"
                   style="display: none">
        </div>
        <div class="map-container" v-show="mapActivate">
            <div class="input-container">
                <input type="text" v-on:keyup.enter="searchAddress" v-model="searchingAddress" class="project-input">
                <div class="search-icon" @click="searchAddress"></div>
            </div>
            <div class="google-map" id="map">

            </div>
        </div>
    </div>
</template>
<script>
  // Create the script tag, set the appropriate attributes
  export default {
    name: 'ProjectMap',
    props: ['name'],
    data: ()=>({
      mapActivate: true,
      searchingAddress: '',
      addressList: [],
      map: '',
      mapMarker: {}
    }),
    methods: {
      changeMapActive() {
        this.$parent.project.mapActivate = this.mapActivate;
      },
      mapCenter(lat, lng) {
        window.map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: lat, lng: lng },
          zoom: 18,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        });
        var marker = new google.maps.Marker({
          position: {lat: lat, lng: lng},
          map: map,
        });
        this.mapMarker = {lat: lat, lng: lng};
        this.$parent.project.map = {lat: lat, lng: lng};
      },
      searchAddress() {
          let callBackSearch =(callback)=> {
          let geo = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +this.searchingAddress + '&key=AIzaSyDAHyg8_wG19M4GTE4BDSuez-Xc3wjllYQ' ;
          let x = new XMLHttpRequest();
          x.open("GET", geo, true);
          x.onload = (e = this) => {
            let result = JSON.parse(x.responseText);
            if(result.results.length > 0) {
              if(JSON.parse(x.responseText).results[0].geometry.location.lat && JSON.parse(x.responseText).results[0].geometry.location.lng) {
                let lat = JSON.parse(x.responseText).results[0].geometry.location.lat;
                let lng = JSON.parse(x.responseText).results[0].geometry.location.lng;
                callback(lat, lng)
              }
            } else {

            }
          };
          x.send(null);
        }
        if(this.searchingAddress.trim().length > 0) {
          callBackSearch(this.mapCenter)
        }
      },
    },
    mounted: function () {
      var script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDAHyg8_wG19M4GTE4BDSuez-Xc3wjllYQ&callback=initMap';
      script.defer = true;
      window.initMap = function () {
        // JS API is loaded and available
       this.map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 15,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        });

      };
// Append the 'script' element to 'head'
      document.head.appendChild(script);
    },
  }
</script>
