<template>
    <div class="show-map">
        <div class="map-controls-list">
            <div class="map-control" v-bind:class="{off : checkCulture}" @click="showType(1)">Culture</div>
            <div class="map-control" :class="{off :  checkRestaurant}" @click="showType(2)">Restaurants</div>
            <div class="map-control" :class="{off :  checkSport}" @click="showType(3)">Sport</div>
            <div class="map-control" :class="{off :  checkNature}" @click="showType(4)">Parks and recreations</div>
        </div>
        <div id="map"></div>
    </div>
</template>
<script>
  import constants from '../../Constants';

  export default {
    name: 'show-map',
    data: ()=>({
      logo: '',
      checkCulture: false,
      checkRestaurant: false,
      checkSport: false,
      checkNature: false,
    }),
    methods: {
      createMarkers(marker_array) {
        for (var i = 0; i < marker_array.length; i++) {
          this.createMarker(marker_array[i]);
        }
      },
      showType(type) {
        switch (Number.parseInt(type)) {
          case 1 :
            if (this.$parent.project.markers.culture.length != 0) {
              for (var i = 0; i < this.$parent.project.markers.culture.length; i++) {
                this.$parent.project.markers.culture[i].setMap(null);
              }
              this.$parent.project.markers.culture = [];
              this.checkCulture = true;
            } else {
              for (var i = 0; i < this.$parent.project.markers.automation_marker.length; i++) {
                if (this.$parent.project.markers.automation_marker[i].type == 1) {
                  this.createMarker(this.$parent.project.markers.automation_marker[i]);
                }
              }
              this.checkCulture = false;
            }
            break;
          case 2 :
            if (this.$parent.project.markers.restaurant.length != 0) {
              for (var i = 0; i < this.$parent.project.markers.restaurant.length; i++) {
                this.$parent.project.markers.restaurant[i].setMap(null);
              }
              this.$parent.project.markers.restaurant = [];
              this.checkRestaurant = true;
            } else {
              for (var i = 0; i < this.$parent.project.markers.automation_marker.length; i++) {
                if (this.$parent.project.markers.automation_marker[i].type == 2) {
                  this.createMarker(this.$parent.project.markers.automation_marker[i]);
                }
              }
              this.checkRestaurant = false
            }
            break;
          case 3 :
            if (this.$parent.project.markers.sport.length != 0) {
              for (var i = 0; i < this.$parent.project.markers.sport.length; i++) {
                this.$parent.project.markers.sport[i].setMap(null);
              }
              this.$parent.project.markers.sport = [];
              this.checkSport = true;
            } else {
              for (var i = 0; i < this.$parent.project.markers.automation_marker.length; i++) {
                if (this.$parent.project.markers.automation_marker[i].type == 3) {
                  this.createMarker(this.$parent.project.markers.automation_marker[i]);
                }
              }
              this.checkSport = false;
            }
            break;
          case 4 :
            if (this.$parent.project.markers.nature.length != 0) {
              for (var i = 0; i < this.$parent.project.markers.nature.length; i++) {
                this.$parent.project.markers.nature[i].setMap(null);
              }
              this.$parent.project.markers.nature = [];
              this.checkNature = true;
            } else {
              for (var i = 0; i < this.$parent.project.markers.automation_marker.length; i++) {
                if (this.$parent.project.markers.automation_marker[i].type == 4) {
                  this.createMarker(this.$parent.project.markers.automation_marker[i]);
                }
              }
              this.checkNature = false;
            }
            break;
        }
      },
      createInfoWindowDom(info) {
        var container = document.createElement('div');
        container.classList.add('custom-marker');
        var name = document.createElement('div');
        name.classList.add('map-info-name');
        name.textContent = info.name;
        var address = document.createElement('div');
        address.classList.add('map-info-address');
        address.textContent = info.address;
        var description = document.createElement('div');
        description.classList.add('map-info-description');
        description.textContent = info.description;
        container.appendChild(name);
        container.appendChild(address);
        container.appendChild(description);
        return container;
      },
      createMarker(marker) {
        var mark = new google.maps.Marker({
          position: { lat: Number.parseFloat(marker.lat), lng: Number.parseFloat(marker.lng) },
          name: marker.name,
          map: window.map
        });
        let infowindow = new google.maps.InfoWindow();
        let content = this.createInfoWindowDom(marker);
        infowindow.setContent(content);
        mark.addListener("click", ()=> {
          infowindow.open(window.map, mark);
        });
        switch (Number.parseInt(marker.type)) {
          case 1 :
            this.$parent.project.markers.culture.push(mark);
            break;
          case 2 :
            this.$parent.project.markers.restaurant.push(mark);
            break;
          case 3 :
            this.$parent.project.markers.sport.push(mark);
            break;
          case 4 :
            this.$parent.project.markers.nature.push(mark);
            break;
        }

      },
    },
    mounted(){
      let lat = this.$parent.project.map.lat;
      let lng = this.$parent.project.map.lng;
      let obj = this;
      window.initMap = function () {
        // JS API is loaded and available
        var styledMapType = new google.maps.StyledMapType(constants.MAP_OPTIONS, { name: 'styled_map' });
        window.map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: lat, lng: lng },
          zoom: 18,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          mapTypeControlOptions: {
            mapTypeIds: ['styled_map']
          }
        });
        window.map.mapTypes.set('styled_map', styledMapType);
        window.map.setMapTypeId('styled_map');
        var marker = new google.maps.Marker({
          position: { lat: Number.parseFloat(lat), lng: Number.parseFloat(lng) },
          map: window.map
        });
        obj.createMarkers(obj.$parent.project.markers.user_marker);
        obj.createMarkers(obj.$parent.project.markers.automation_marker);
      };
      window.initMap();
    },
  }
</script>
