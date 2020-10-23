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
        <div class="markers-block" v-show="this.$parent.project.map.lat != '' && this.mapActivate == true">
            <div class="marker-block-button" v-show="!openMarker" @click="openAddMarker">Add marker</div>
            <div class="marker-block" v-show="openMarker">
                <div class="marker-block-form">
                    <div class="marker-header">Add new marker</div>
                    <div class="marker-form-field">
                        <div class="marker-form-column">
                            <div class="marker-field-header">Name</div>
                            <input type="text" v-model="userMarker.name" class="project-input">
                        </div>
                        <div class="marker-form-column">
                            <div class="marker-field-header">Description</div>
                            <textarea class="project-input superscroll" v-model="userMarker.description" cols="30"
                                      rows="10"></textarea>
                        </div>
                        <div class="marker-field-type">
                            <dropdown :options="markerOption"
                                      v-on:updateOption="selectMarkerType"
                                      :selected="{val: '', name: ''}"
                                      :placeholder="'Select marker type'"
                                      :closeOnOutsideClick="true"></dropdown>
                        </div>
                    </div>
                </div>
                <div class="marker-buttons">
                    <div class="marker-block-button save-button"
                         v-show="openMarker == true && userMarker != '' && markerPause == false && userMarker.marker != ''"
                         @click="addMarker">Save
                    </div>
                    <div class="marker-block-button save-button" style="opacity: 0.3;"
                         v-show="(openMarker == true && userMarker.marker == '')|| markerPause == true">Save
                    </div>
                    <div class="marker-block-button cancel-button" v-show="openMarker == true" @click="cancelMarker">
                        Cancel
                    </div>
                </div>
            </div>
            <div class="neardy-marker-buttons">
                <div>
                    <div class="overview-checkbox"
                         :class="{active: $parent.project.markers.culture.length > 0, loading: nearCulturePlaces == 'pause'}">
                        <label for="show-culture" v-show="nearCulturePlaces != 'pause'">
                            <div class="overview-checkbox-mask">
                                <div class="overview-checkbox-icon"></div>
                            </div>
                            Show near culture places</label>
                        <label v-show="nearCulturePlaces == 'pause'">
                            <div class="overview-checkbox-mask">
                                <div class="overview-checkbox-icon"></div>
                            </div>
                            Show near culture places</label>
                        <input type="checkbox" v-on:change="showNearPlaces(1)" v-model="nearCulturePlaces"
                               id="show-culture"
                               style="display: none">
                    </div>
                    <div class="overview-checkbox-warning" v-if="nearCulturePlaces == 'pause'">Please, wait</div>
                </div>
                <div>
                    <div class="overview-checkbox"
                         :class="{active: $parent.project.markers.restaurant.length > 0, loading: nearRestaurants == 'pause'}">
                        <label for="show-restaurants" v-show="nearRestaurants != 'pause'">
                            <div class="overview-checkbox-mask">
                                <div class="overview-checkbox-icon"></div>
                            </div>
                            Show near restaurants</label>
                        <label v-show="nearRestaurants == 'pause'">
                            <div class="overview-checkbox-mask">
                                <div class="overview-checkbox-icon"></div>
                            </div>
                            Show near restaurants</label>
                        <input type="checkbox" v-on:change="showNearPlaces(2)" v-model="nearRestaurants"
                               id="show-restaurants"
                               style="display: none">
                    </div>
                    <div class="overview-checkbox-warning" v-if="nearRestaurants == 'pause'">Please, wait</div>
                </div>
                <div>
                    <div class="overview-checkbox"
                         :class="{active: $parent.project.markers.sport.length > 0, loading: nearSport == 'pause'}">
                        <label for="show-sport" v-show="nearSport != 'pause'">
                            <div class="overview-checkbox-mask">
                                <div class="overview-checkbox-icon"></div>
                            </div>
                            Show near sport places</label>
                        <label v-show="nearSport == 'pause'">
                            <div class="overview-checkbox-mask">
                                <div class="overview-checkbox-icon"></div>
                            </div>
                            Show near sport places</label>
                        <input type="checkbox" v-on:change="showNearPlaces(3)" v-model="nearSport" id="show-sport"
                               style="display: none">
                    </div>
                    <div class="overview-checkbox-warning" v-if="nearSport == 'pause'">Please, wait</div>
                </div>
                <div>
                    <div class="overview-checkbox"
                         :class="{active: $parent.project.markers.nature.length > 0, loading: nearNature == 'pause'}">
                        <label for="show-nature" v-show="nearNature != 'pause'">
                            <div class="overview-checkbox-mask">
                                <div class="overview-checkbox-icon"></div>
                            </div>
                            Show near nature places</label>
                        <label v-show="nearNature == 'pause'">
                            <div class="overview-checkbox-mask">
                                <div class="overview-checkbox-icon"></div>
                            </div>
                            Show near nature places</label>
                        <input type="checkbox" v-on:change="showNearPlaces(4)" v-model="nearNature" id="show-nature"
                               style="display: none">
                    </div>
                    <div class="overview-checkbox-warning" v-if="nearNature == 'pause'">Please, wait</div>
                </div>
            </div>
        </div>
        <div class="map-container" v-show="mapActivate">
            <div class="input-container">
                <input v-if="!searchPause" type="text"  @focus="searchAddress" @blur="stopSearchAddress" v-on:keyup="searchAddress"
                       v-model="$parent.project.map.address" class="project-input">
                <div class="address-list" v-if="addressPredictions.length > 0">
                    <div class="address-info" v-for="address in addressPredictions" @click="appendAddress">{{address.description}}</div>
                </div>
                <input v-if="searchPause" type="text" disabled v-model="$parent.project.map.address"
                       class="project-input">
                <div class="search-icon" v-if="!searchPause"></div>
                <div class="cssload-container" v-if="searchPause">
                    <div class="cssload-double-torus"></div>
                </div>
            </div>
            <div class="google-map" id="map">

            </div>
        </div>
    </div>
</template>
<script>
  // Create the script tag, set the appropriate attributes
  import constants from "../../Constants";
  import dropdown from '@/components/simple/dropdown.vue'
  export default {
    name: 'ProjectMap',
    components: {
      dropdown,
    },
    props: ['name'],
    data: ()=>({
      mapActivate: true,
      searchingAddress: '',
      addressList: [],
      nearCulturePlaces: false,
      nearRestaurants: false,
      nearSport: false,
      nearNature: false,
      searchPause: false,
      addressPredictions: [],
      map: '',
      mapMarker: {},
      markerOption: constants.MARKER_TYPES,
      cultureMarker: [],
      sportMarker: [],
      restaurantMarker: [],
      natureMarker: [],
      openMarker: false,
      userMarker: {
        name: '',
        description: '',
        marker: '',
        type: '',
      },
      userMarkerType: '',
      userMarkerIcon: '',
      markerPause: false,
      userMarkers: [],
    }),
    methods: {
      inputSearch(e) {
        console.log(e);
      },
      showNearPlaces(type) {
        let res = 1;
        switch (Number.parseInt(type)) {
          case 1:
            if (this.$parent.project.markers.culture.length > 0) {
              res = 0;
            }
            this.nearCulturePlaces = 'pause';
            break;
          case 2:
            if (this.$parent.project.markers.restaurant.length > 0) {
              res = 0;
            }
            this.nearRestaurants = 'pause';
            break;
          case 3:
            if (this.$parent.project.markers.sport.length > 0) {
              res = 0;
            }
            this.nearSport = 'pause';
            break;
          case 4:
            if (this.$parent.project.markers.nature.length > 0) {
              res = 0;
            }
            this.nearNature = 'pause';
            break;
        }
        let data = {};
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        data.user_id = user.uid;
        data.token = token;
        data.project_id = this.$parent.project.id;
        data.type = type;
        data.show = res;
        let obj = this;
        $.ajax({
          url: constants.BACKEND_URL + 'marker/get-near-places',
          type: 'GET', // важно!
          data: data,
          cache: false,
          dataType: 'json',
          success: function (respond, status, jqXHR) {
            obj.stopSave = false;
            if (respond.ok === 1) {
              if (respond.show == 1) {
                obj.removeGoogleMarkers(respond.type);
                obj.createGoogleMarkers(respond.type, respond.places);
              } else {
                obj.removeGoogleMarkers(respond.type);
              }
            } else {
              console.log('ОШИБКА: ' + respond.data);
            }
          },
          error: function (jqXHR, status, errorThrown) {
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
          }
        });
      },
      createGoogleMarkers(type, markers){
        let arr = [];
        switch (Number.parseInt(type)) {
          case 1:
            arr = this.$parent.project.markers.culture;
            this.nearCulturePlaces = true;
            break;
          case 2:
            arr = this.$parent.project.markers.restaurant;
            this.nearRestaurants = true;
            break;
          case 3:
            arr = this.$parent.project.markers.sport;
            this.nearSport = true;
            break;
          case 4:
            this.nearNature = true;
            arr = this.$parent.project.markers.nature;
            break;
        }
        for (var i = 0; i < markers.length; i++) {
          let marker = this.$parent.createMarker(markers[i]);
          arr.push(marker);
        }
      },
      removeGoogleMarkers(type) {
        switch (Number.parseInt(type)) {
          case 1:
            for (var i = 0; i < this.$parent.project.markers.culture.length; i++) {
              this.$parent.project.markers.culture[i].setMap(null);
            }
            this.$parent.project.markers.culture = [];
            this.nearCulturePlaces = true;
            break;
          case 2:
            for (var i = 0; i < this.$parent.project.markers.restaurant.length; i++) {
              this.$parent.project.markers.restaurant[i].setMap(null);
            }
            this.$parent.project.markers.restaurant = [];
            this.nearRestaurants = true;
            break;
          case 3:
            for (var i = 0; i < this.$parent.project.markers.sport.length; i++) {
              this.$parent.project.markers.sport[i].setMap(null);
            }
            this.$parent.project.markers.sport = [];
            this.nearSport = true;
            break;
          case 4:
            for (var i = 0; i < this.$parent.project.markers.nature.length; i++) {
              this.$parent.project.markers.nature[i].setMap(null);
            }
            this.$parent.project.markers.nature = [];
            this.nearNature = true;
            break;
        }
      },
      selectMarkerType(e) {
        this.userMarkerType = e.val;
      },
      openAddMarker() {
        if (this.openMarker === false) {
          window.mapMarker = window.map.addListener("click", (e)=> {
            placeMarker(e.latLng, map);
          });
          this.openMarker = true;
        } else {
          google.maps.event.clearListeners(map, 'click');
          this.openMarker = false;
        }

        let obj = this;

        function placeMarker(location) {
          var icon = '';
          switch(Number.parseInt(obj.userMarkerType)) {
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
          if (obj.userMarker.marker == '') {
            obj.userMarker.marker = new google.maps.Marker({
              position: location,
              map: map,
              icon: icon,
            });
          } else {
            obj.userMarker.marker.setMap(null);
            obj.userMarker.marker = new google.maps.Marker({
              position: location,
              map: map,
              icon: icon,
            });
          }
        }
      },
      addMarker(){
        this.markerPause = true;
        let data = new FormData();
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        let marker = {};
        marker.lat = this.userMarker.marker.getPosition().lat();
        marker.lng = this.userMarker.marker.getPosition().lng();
        marker.name = this.userMarker.name;
        marker.description = this.userMarker.description;
        marker.type = this.userMarkerType;
        data.append('user_id', user.uid);
        data.append('token', token);
        data.append('project_id', this.$parent.project.id);
        data.append('marker', JSON.stringify(marker));
        let obj = this;
        $.ajax({
          url: constants.BACKEND_URL + 'marker/add-marker',
          type: 'POST', // важно!
          data: data,
          cache: false,
          dataType: 'json',
          processData: false,
          contentType: false,
          success: function (respond, status, jqXHR) {
            obj.stopSave = false;
            if (respond.ok === 1) {
              obj.userMarker.marker.id = respond.marker.id;
              obj.$parent.project.markers.user_markers.push(obj.userMarker.marker);
              obj.makeInfoWindow(obj.userMarker.marker, respond.marker);
              obj.userMarker = {
                name: '',
                description: '',
                marker: '',
                type: '',
              };
              obj.userMarkerType = '';
              google.maps.event.clearListeners(map, 'click');
              obj.openMarker = false;
              obj.markerPause = false;

            } else {
              console.log('ОШИБКА: ' + respond.data);
              obj.markerPause = false;
            }
          },
          error: function (jqXHR, status, errorThrown) {
            obj.stopSave = false;
            obj.markerPause = false;
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
          }
        });
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
        var button = document.createElement('div');
        button.classList.add('map-info-button');
        button.textContent = 'Delete marker';
        button.setAttribute('marker-id', info.id);
        button.addEventListener('click', this.deleteMarker);
        container.appendChild(name);
        container.appendChild(address);
        container.appendChild(description);
        container.appendChild(button);
        return container;
      },
      deleteMarker(e) {
        let obj = this;
        let marker_id = e.target.getAttribute('marker-id');
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        let project_id = window.location.href.split('project_id=');
        project_id = project_id[project_id.length - 1];
        let data = {
          user_id: user.uid,
          token: token,
          project_id: project_id,
          marker_id: marker_id,
        };

        $.ajax({
          url: constants.BACKEND_URL + 'marker/delete-marker',
          type: 'POST', // важно!
          data: data,
          cache: false,
          dataType: 'json',
          success: function (respond, status, jqXHR) {
            if (respond.ok === 1) {
              for (var i = 0; i < obj.$parent.project.markers.user_markers.length; i++) {
                if (obj.$parent.project.markers.user_markers[i].id == marker_id) {
                  obj.$parent.project.markers.user_markers[i].setMap(null);
                }
              }
            }
          },
          // функция ошибки ответа сервера
          error: function (jqXHR, status, errorThrown) {
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
          }
        });
      },
      makeInfoWindow(marker, info) {
        let obj = this;
        if (info.name == null) {
          info.name = '';
        }
        if (info.address == null) {
          info.address = '';
        }
        if (info.description == null) {
          info.description = '';
        }
        window.infowindow = new google.maps.InfoWindow();
        marker.addListener("click", ()=> {
          window.infowindow.setContent(this.createInfoWindowDom(info));
          window.infowindow.open(map, marker);
        });
      },
      cancelMarker(){
        if (this.userMarker.marker != '') {
          this.userMarker.marker.setMap(null);
        }
        this.userMarker.name = '';
        this.userMarker.description = '';
        google.maps.event.clearListeners(map, 'click');
        this.openMarker = false;
      },
      changeMapActive() {
        this.$parent.project.mapActivate = this.mapActivate;
      },
      mapCenter(lat, lng) {
        if (lat != '' && lng != '') {
          window.map.panTo({ lat: Number.parseFloat(lat), lng: Number.parseFloat(lng) });
        }
      },
      stopSearchAddress() {
        let obj = this;
       setTimeout(function () {
         obj.addressPredictions = [];
        }, 500)
      },
      searchAddress() {
        if (this.$parent.project.map.address.length == 0) {
          this.addressPredictions = [];
          return false;
        } else if(this.$parent.project.map.address.length < 3) {
          return false;
        }

        var obj = this;
        if (window.timer) {
          window.clearTimeout(window.timer);
        }
        window.timer = setTimeout(function () {
          let data = new FormData();
          let user = JSON.parse(localStorage.getItem('maagio_user'));
          let token = localStorage.getItem('token');
          data.append('user_id', user.uid);
          data.append('token', token);
          data.append('project_id', obj.$parent.project.id);
          data.append('address', obj.$parent.project.map.address);
          $.ajax({
            url: constants.BACKEND_URL + 'map/search-address',
            type: 'POST', // важно!
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function (respond, status, jqXHR) {
              obj.stopSave = false;
              if (respond.ok === 1) {
                for (var i = 0; i < respond.predictions.length; i++) {
                  obj.addressPredictions = respond.predictions;
                }
              }
            },
            error: function (jqXHR, status, errorThrown) {
              obj.stopSave = false;
              console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
            }
          });
        }, 500);
      },
      appendAddress(e) {
        this.searchPause = true;
        let data = new FormData();
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        data.append('user_id', user.uid);
        data.append('token', token);
        data.append('project_id', this.$parent.project.id);
        data.append('address', e.target.textContent);
        let obj = this;
        obj.addressPredictions = [];
        $.ajax({
          url: constants.BACKEND_URL + 'map/append-address',
          type: 'POST', // важно!
          data: data,
          cache: false,
          dataType: 'json',
          processData: false,
          contentType: false,
          success: function (respond, status, jqXHR) {
            obj.stopSave = false;
            obj.searchPause = false;
            if (respond.ok === 1) {
              obj.removeGoogleMarkers(1);
              obj.removeGoogleMarkers(2);
              obj.removeGoogleMarkers(3);
              obj.removeGoogleMarkers(4);
              obj.mapCenter(respond.map.lat, respond.map.lng);
              if (obj.$parent.project.map.marker != undefined) {
                obj.$parent.project.map.marker.setMap(null);
              }
              obj.$parent.project.map = respond.map;
              obj.$parent.project.map.marker = new google.maps.Marker({
                position: {
                  lat: Number.parseFloat(obj.$parent.project.map.lat),
                  lng: Number.parseFloat(obj.$parent.project.map.lng)
                },
                map: window.map,
                icon: constants.BACKEND_URL + '/img/Home.png'
              });
            } else {
            }
          },
          error: function (jqXHR, status, errorThrown) {
            obj.stopSave = false;
            obj.searchPause = false;
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
          }
        });
      },
    }
    ,
    mounted: function () {
      this.markerOption = constants.MARKER_TYPES;
      let obj = this;
      window.initMap = function () {
        // JS API is loaded and available
        var styledMapType = new google.maps.StyledMapType(constants.MAP_OPTIONS, { name: 'Styled Map' });
        window.map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: constants.DEFAULT_MAP_POSITION.lat, lng: constants.DEFAULT_MAP_POSITION.lng },
          zoom: 15,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        });
        window.map.mapTypes.set('styled_map', styledMapType);
        window.map.setMapTypeId('styled_map');
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        if (user.ip != undefined && (obj.$parent.project.map.lng != constants.DEFAULT_MAP_POSITION.lng && obj.$parent.project.map.lat != constants.DEFAULT_MAP_POSITION.lat)) {
          $.ajax({
            url: 'http://ipwhois.app/json/' + user.ip,
            type: 'GET', // важно!
            dataType: 'json',
            success: function (respond, status, jqXHR) {
              var center = new google.maps.LatLng(respond.latitude, respond.longitude);
              window.map.panTo(center);
            },
            error: function (jqXHR, status, errorThrown) {
              console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
            }
          });
        }
      };
      window.initMap();
    },
  }
</script>
