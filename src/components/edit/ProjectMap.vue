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
                        <!--<div class="marker-field-type">
                            <dropdown :options="markerOption"
                                      v-on:updateOption="selectMarkerType"
                                      :selected="{val: '', name: ''}"
                                      :placeholder="'Select marker type'"
                                      :closeOnOutsideClick="true"></dropdown>
                        </div>-->
                    </div>
                </div>
                <div class="marker-buttons">
                    <div class="marker-block-button save-button"
                         v-show="openMarker == true && userMarker != '' && markerPause == false"
                         @click="addMarker">Save
                    </div>
                    <div class="marker-block-button save-button" style="opacity: 0.3;"
                         v-show="(openMarker == true && userMarker == '')|| markerPause == true">Save
                    </div>
                    <div class="marker-block-button cancel-button" v-show="openMarker == true" @click="cancelMarker">
                        Cancel
                    </div>
                </div>
            </div>
        </div>
        <div class="neardy-marker-buttons">
            <div>
                <div class="overview-checkbox"
                     :class="{active: nearCulturePlaces == true, loading: nearCulturePlaces == 'pause'}">
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
                    <input type="checkbox" v-on:change="showNearPlaces(1)" v-model="nearCulturePlaces" id="show-culture"
                           style="display: none">
                </div>
                <div class="overview-checkbox-warning" v-if="nearCulturePlaces == 'pause'">Please, wait</div>
            </div>
            <div>
                <div class="overview-checkbox"
                     :class="{active: nearRestaurants == true, loading: nearRestaurants == 'pause'}">
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
                     :class="{active: nearSport == true, loading: nearSport == 'pause'}">
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
                     :class="{active: nearNature == true, loading: nearNature == 'pause'}">
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
      },
      userMarkerType: '',
      userMarkerIcon: '',
      markerPause: false,
      userMarkers: [],
    }),
    methods: {
      showNearPlaces(type) {
        let res = '';
        switch (type) {
          case 1:
            if(this.nearCulturePlaces == false) {
              res = false;
            } else {
              res = true;
            }
            this.nearCulturePlaces = 'pause';
            break;
          case 2:
            if(this.nearRestaurants == false) {
              res = false;
            } else {
              res = true;
            }
            this.nearRestaurants = 'pause';
            break;
          case 3:
            if(this.nearSport == false) {
              res = false;
            } else {
              res = true;
            }
            this.nearSport = 'pause';
            break;
          case 4:
            if(this.nearNature == false) {
              res = false;
            } else {
              res = true;
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
                if(respond.show == 1) {
                  for(var i = 0; i < respond.places.length; i++) {
                    let myLatLng = { lat: Number.parseFloat(respond.places[i].lat), lng: Number.parseFloat(respond.places[i].lng) };
                    let marker = new google.maps.Marker({
                      position: myLatLng,
                      map: window.map,
                    })
                  }
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
      selectMarkerType(e) {
        this.userMarkerType = e.name;
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
          if (obj.userMarker.marker == '') {
            obj.userMarker.marker = new google.maps.Marker({
              position: location,
              map: map,
            });
          } else {
            obj.userMarker.marker.setMap(null);
            obj.userMarker.marker = new google.maps.Marker({
              position: location,
              map: map,
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
              obj.$parent.project.markers.push(obj.userMarker.marker);
              obj.userMarkers.push(obj.userMarker);
              obj.makeInfoWindow(obj.userMarker.marker, respond.marker);
              obj.userMarker = {
                name: '',
                description: '',
                marker: '',
              };
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
              console.log(obj.$parent.project.markers);
              for (var i = 0; i < obj.$parent.project.markers.length; i++) {
                if (obj.$parent.project.markers[i].id == marker_id) {
                  obj.$parent.project.markers[i].setMap(null);
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
        let infowindow = new google.maps.InfoWindow();
        let content = this.createInfoWindowDom(info);
        infowindow.setContent(content);
        marker.addListener("click", ()=> {
          infowindow.open(map, marker);
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
          var marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map,
          });
          window.map.panTo(marker.getPosition());

          this.mapMarker = { lat: lat, lng: lng };
          this.$parent.project.map = { lat: lat, lng: lng };
          this.updateMap();
        }

      },
      updateMap() {
        let data = new FormData();
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        if (this.$parent.project.map.lat == this.$parent.project.oldMap.lat && this.$parent.project.map.lng == this.$parent.project.oldMap.lng) {
          return;
        }
        data.append('user_id', user.uid);
        data.append('token', token);
        data.append('project_id', this.$parent.project.id);
        data.append('map', JSON.stringify(this.$parent.project.map));
        let obj = this;
        $.ajax({
          url: constants.BACKEND_URL + 'map/update-map',
          type: 'POST', // важно!
          data: data,
          cache: false,
          dataType: 'json',
          processData: false,
          contentType: false,
          success: function (respond, status, jqXHR) {
            obj.stopSave = false;
            if (respond.ok === 1) {
              obj.userMarker = '';
            } else {
              console.log('ОШИБКА: ' + respond.data);
            }
          },
          error: function (jqXHR, status, errorThrown) {
            obj.stopSave = false;
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
          }
        });
      },
      searchAddress() {
        let callBackSearch = (callback)=> {
          let geo = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.searchingAddress + '&key=AIzaSyDEzKHEUbk3ocLvIgBGMOsJjguHEj0LR4s';
          this.$parent.project.oldMap = { lat: this.$parent.project.map.lat, lng: this.$parent.project.map.lng };
          let x = new XMLHttpRequest();
          x.open("GET", geo, true);
          x.onload = (e = this)=> {
            let result = JSON.parse(x.responseText);
            if (result.results.length > 0) {
              if (JSON.parse(x.responseText).results[0].geometry.location.lat && JSON.parse(x.responseText).results[0].geometry.location.lng) {
                let lat = JSON.parse(x.responseText).results[0].geometry.location.lat;
                let lng = JSON.parse(x.responseText).results[0].geometry.location.lng;
                callback(lat, lng)
              }
            } else {

            }
          };
          x.send(null);
        }
        if (this.searchingAddress.trim().length > 0) {
          callBackSearch(this.mapCenter)
        }
      },
    },
    mounted: function () {
      this.markerOption = constants.MARKER_TYPES;
      window.initMap = function () {
        // JS API is loaded and available
        var styledMapType = new google.maps.StyledMapType(constants.MAP_OPTIONS, { name: 'Styled Map' });
        window.map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 15,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        });
        window.map.mapTypes.set('styled_map', styledMapType);
        window.map.setMapTypeId('styled_map');
      };
      window.initMap();
    },
  }
</script>
