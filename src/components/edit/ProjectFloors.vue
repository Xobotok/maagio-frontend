<template>
    <div class="project-floors">
        <div class="project-floor" v-for="(floor, key) in this.$parent.project.floors">
            <div class="floor-upload-button" v-show="floor.image == ''">
                <div class="logo-upload" @click="uploadImage(key)">Upload floor image
                </div>
                <input type="file" :floor-number="key" accept="image/png, image/jpeg" @change="uploadFloorImage"
                       :id="'floor-image-' + key"
                       style="display: none">
            </div>
            <div class="floor-image" v-show="floor.image != ''" @click="uploadImage(key)"><img :src="floor.preview"
                                                                                               alt=""></div>
            <div class="floor-header">Floor {{key + 1}} Image {{floor.imageName}}</div>
            <div class="floor-controls">
                <div class="floor-button" v-if="$parent.project.floors.length > 1" onclick="this.style.display = 'none';
                this.parentNode.getElementsByClassName('dropdown-container')[0].style.display = 'block';">Replace
                </div>
                <div class="dropdown-container" style="display: none">
                    <specDropdown
                            :selected="object"
                            :elementid="key"
                            v-on:updateOption="selectNewFloor"
                            :placeholder="'Select an Item'"
                            :closeOnOutsideClick="true">
                    </specDropdown>
                </div>
                <div class="floor-button inactive" v-if="$parent.project.floors.length === 1">Replace</div>
                <div class="floor-button" @click="checkFloorRemove(key)">Remove</div>
                <div class="remove-floor-controls" style="display: none" :id="key + '-floor'">
                    <div class="remove-info" data-id="removeInfo" v-if="floor.units.length > 0">Attention! There are units ({{floor.units.length}}) on the floor. Would you like to delete them?</div>
                    <div class="remove-info" data-id="removeInfo" v-if="floor.units.length == 0">Would you like to delete this floor?</div>
                    <div class="remove-buttons">
                        <div class="remove-floor-button" data-id="accept" v-if="floor.units.length > 0" @click="removeFloor(key, true)">Yes</div>
                        <div class="remove-floor-button" data-id="decline" v-if="floor.units.length > 0" @click="removeFloor(key, false)">No</div>
                        <div class="remove-floor-button" data-id="decline" v-if="floor.units.length == 0" @click="removeFloor(key, false)">Yes</div>
                        <div class="remove-floor-button" data-id="cancel" @click="cancelRemove(key)">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="empty-floor" @click="addFloor">
            <div class="empty-floor-text"><span class="empty-floor-plus">+</span> Add</div>
        </div>
    </div>
</template>

<script>
  import specDropdown from '@/components/simple/specDropdown.vue'
  import constants from "../../Constants";
  export default {
    'name': 'ProjectFloors',
    components: {
      specDropdown,
    },
    data: ()=>({
      arrayOfObjects: [],
      object: {
        name: 'Select floor',
      },
      floors: [],
      floorNumbers: [],
    }),
    mounted() {
      if(this.$parent.project.floors != undefined) {
        for (var i = 0; i < this.$parent.project.floors.length; i++) {
          this.arrayOfObjects.push({ name: 'Floor ' + (i + 1), val: i });
        }
      }
    },
    methods: {
      removeThisFloor(floor_id) {
        this.loaded = true;
        let data = new FormData();
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        data.append('user_id', user.uid);
        data.append('token', token);
        data.append('floor_id', floor_id);
        let obj = this;
        $.ajax({
          url: constants.BACKEND_URL + 'floor/remove-floor',
          type: 'POST', // важно!
          data: data,
          cache: false,
          dataType: 'json',
          // отключаем обработку передаваемых данных, пусть передаются как есть
          processData: false,
          // отключаем установку заголовка типа запроса. Так jQuery скажет серверу что это строковой запрос
          contentType: false,
          // функция успешного ответа сервера
          success: function (respond, status, jqXHR) {
            obj.loaded = false;
            if (respond.ok === 1) {
              window.db.updateProjectFloors(obj.$parent.project.id, obj.$parent.project.floors);
            } else {
              console.log('ОШИБКА: ' + respond.data);
            }
          },
          error: function (jqXHR, status, errorThrown) {
            obj.loaded = false;
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
          }
        });
      },
      uploadFloorPhoto(floor_id, file) {
        this.loaded = true;
        let data = new FormData();
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        data.append('user_id', user.uid);
        data.append('token', token);
        data.append('floor_id', floor_id);
        data.append('project_id', this.$parent.project.id);
        data.append('image', file);
        let obj = this;
        $.ajax({
          url: constants.BACKEND_URL + 'floor/upload-photo',
          type: 'POST', // важно!
          data: data,
          cache: false,
          dataType: 'json',
          processData: false,
          contentType: false,
          success: function (respond, status, jqXHR) {
            obj.loaded = false;
            if (respond.ok === 1) {
                console.log(respond);
            } else {
              console.log('ОШИБКА: ' + respond.data);
            }
          },
          error: function (jqXHR, status, errorThrown) {
            obj.loaded = false;
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
          }
        });
      },
      uploadFloorImage(e) {
        let number = e.target.getAttribute('floor-number');
        this.$parent.project.floors[number].imageName = name;
        this.$parent.project.floors[number].image_id = '';
        let file = e.target.files[0];
        let reader = new FileReader();
        this.uploadFloorPhoto(this.$parent.project.floors[number].id, e.target.files[0]);
        reader.addEventListener("load", function () {
          this.$parent.project.floors[number].preview = reader.result;
          this.$parent.project.floors[number].image = file;

        }.bind(this), false);
        if (file) {
          if (/\.(jpe?g|png)$/i.test(file.name)) {
            reader.readAsDataURL(file);
          }
        }
      },
      selectNewFloor(element) {
        if (element.selectedOption) {
          let number = element.selectedOption.val;
          let tmp = this.$parent.project.floors[number];
          this.$parent.project.floors.splice(number, 1,  this.$parent.project.floors[element.$attrs.elementid]);
          this.$parent.project.floors.splice(element.$attrs.elementid, 1,  tmp);
          for(var i = 0; i < this.$parent.project.floors.length; i++) {
            this.$parent.project.floors[i].number = i + 1;
          }
          let floor_1 = {id: this.$parent.project.floors[number].id, number: this.$parent.project.floors[number].number};
          let floor_2 = {id: tmp.id, number: tmp.number};
          this.loaded = true;
          let data = new FormData();
          let user = JSON.parse(localStorage.getItem('maagio_user'));
          let token = localStorage.getItem('token');
          data.append('user_id', user.uid);
          data.append('token', token);
          data.append('floor_1', JSON.stringify(floor_1));
          data.append('floor_2', JSON.stringify(floor_2));
          let obj = this;
          $.ajax({
            url: constants.BACKEND_URL + 'floor/update-number',
            type: 'POST', // важно!
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function (respond, status, jqXHR) {
              obj.loaded = false;
              if (respond.ok === 1) {
                window.db.updateProjectFloors(obj.$parent.project.id, obj.$parent.project.floors);
              } else {
                console.log('ОШИБКА: ' + respond.data);
              }
            },
            error: function (jqXHR, status, errorThrown) {
              obj.loaded = false;
              console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
            }
          });
          this.closeDropDown();
        }
      },
      addFloor() {
        let floor = {
          image: '',
          imageName: '',
          preview: '',
          number: this.$parent.project.floors.length,
          units: [],
        };
        this.$parent.project.floors.push(floor);
        this.arrayOfObjects = [];
        for (var i = 0; i < this.$parent.project.floors.length; i++) {
          this.arrayOfObjects.push({ name: 'Floor ' + (i + 1), val: i });
        }
        this.createFloor(floor);
        this.$parent.checkActive();
        this.$parent.checkNext();

      },
      createFloor(floor) {
        this.loaded = true;
        let data = new FormData();
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        data.append('user_id', user.uid);
        data.append('token', token);
        data.append('project_id', this.$parent.project.id);
        data.append('floor_number', floor.number + 1);
        let obj = this;
        $.ajax({
          url: constants.BACKEND_URL + 'floor/create-new-floor',
          type: 'POST', // важно!
          data: data,
          cache: false,
          dataType: 'json',
          // отключаем обработку передаваемых данных, пусть передаются как есть
          processData: false,
          // отключаем установку заголовка типа запроса. Так jQuery скажет серверу что это строковой запрос
          contentType: false,
          // функция успешного ответа сервера
          success: function (respond, status, jqXHR) {
            obj.loaded = false;
            if (respond.ok === 1) {
              console.log(1);
                /*obj.published = true;*/
              floor.id = respond.floor.id;
              floor.number = respond.floor.number;
             window.db.updateProjectFloors(obj.$parent.project.id, obj.$parent.project.floors);
            }
            else {
              console.log('ОШИБКА: ' + respond.data);
            }
          },
          // функция ошибки ответа сервера
          error: function (jqXHR, status, errorThrown) {
            obj.loaded = false;
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
          }
        });
      },
      uploadImage(key) {
        document.getElementById('floor-image-' + key).click();
      },
      closeDropDown: function () {
        let buttons = document.getElementsByClassName('floor-button');
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].style.display = 'flex';
        }
        let selects = document.getElementsByClassName('dropdown-container');
        for (let i = 0; i < selects.length; i++) {
          selects[i].style.display = 'none';
        }
      },
      checkFloorRemove(key){
        let container = document.getElementById(key+'-floor');
        let textContainer = container.querySelector('[data-id="removeInfo"]');
        let unitsCount = this.$parent.project.floors[key].units.length;
        if(unitsCount > 0) {
          textContainer.textContent = 'Attention! There are units ('+unitsCount+') on the floor. Would you like to delete them?';
        } else {
          textContainer.textContent = 'Would you like to delete this floor?';
        }
        container.style.display = 'flex';
      },
      cancelRemove(key){
        let container = document.getElementById(key+'-floor');
        container.style.display = 'none';
      },
      removeFloor: function (key, flag) {
        this.closeDropDown();
        this.removeThisFloor(this.$parent.project.floors[key].id);
       if(flag === true) {
           this.$parent.project.floors.splice(key, 1);
       } else {
         for(var i = 0; i < this.$parent.project.floors[key].units.length; i++) {
           this.$parent.project.unfloor_units.push(this.$parent.project.floors[key].units[i]);
         }
         this.$parent.project.floors.splice(key, 1);
       }
        this.$parent.checkActive();
        this.$parent.checkNext();
        this.cancelRemove(key);
      },
    }
  }
</script>