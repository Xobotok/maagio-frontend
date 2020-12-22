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
      markers: [],
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
            if(this.checkCulture == false) {
              this.checkCulture = true;
            } else {
              this.checkCulture = false;
            }
            break;
          case 2 :
            if(this.checkRestaurant == false) {
              this.checkRestaurant = true;
            } else {
              this.checkRestaurant = false;
            }
            break;
          case 3 :
            if(this.checkSport == false) {
              this.checkSport = true;
            } else {
              this.checkSport = false;
            }
            break;
          case 4 :
            if(this.checkNature == false) {
              this.checkNature = true;
            } else {
              this.checkNature = false;
            }
            break;
        }
        this.appendFilters();
      },
      appendFilters() {
        var filters = [];
        if(this.checkNature) {
          filters.push(4)
        }
        if(this.checkSport) {
          filters.push(3)
        }
        if(this.checkRestaurant) {
          filters.push(2)
        }
        if(this.checkCulture) {
          filters.push(1)
        }
        for(var i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(null);
          this.markers.splice(i,1);
          i--;
        }
        var new_markers = [];
        for(var i = 0; i < this.$parent.project.markers.user_marker.length; i++) {
          var flag = false;
          for(var n = 0; n < filters.length; n++) {
           if(filters[n] == this.$parent.project.markers.user_marker[i].type) {
             flag = true;
           }
          }
          if(flag == false) {
            new_markers.push(this.$parent.project.markers.user_marker[i]);
          }
        }
        this.createMarkers(new_markers);
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
        var icon = '';
        switch(Number.parseInt(marker.type)) {
          case 1:
            icon = constants.BACKEND_URL +'/img/Cultural.png';
            break;
          case 2:
            icon = constants.BACKEND_URL +'/img/Restaurants.png';
            break;
          case 3:
            icon = constants.BACKEND_URL +'/img/Sports.png';
            break;
          case 4:
            icon = constants.BACKEND_URL +'/img/Nature.png';
            break;
        }
        var mark = new google.maps.Marker({
          position: { lat: Number.parseFloat(marker.lat), lng: Number.parseFloat(marker.lng) },
          name: marker.name,
          map: window.map,
          icon: icon,
        });

        let infowindow = new google.maps.InfoWindow();
        let content = this.createInfoWindowDom(marker);
        infowindow.setContent(content);
        mark.addListener("click", ()=> {
          infowindow.open(window.map, mark);
        });
        this.markers.push(mark);
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
          zoom: 15,
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
          map: window.map,
          icon: constants.BACKEND_URL + '/img/Home.png'
        });
        obj.createMarkers(obj.$parent.project.markers.user_marker);
      };
      window.initMap();
    },
  }
</script>
