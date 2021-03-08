<template>
    <div class="fullscreen-modal">
      <UnitGalleryModal v-if="unitGalleryModal == true"></UnitGalleryModal>
        <div class="project-unit" v-else>
            <div class="close-modal" @click="cancel">+</div>
            <div class="unit-create-header">
                <span v-if="$parent.$parent.project.house_type == 1">Unit Info</span>
                <span v-if="$parent.$parent.project.house_type == 2">Lot Info</span></div>
            <div class="project-unit-create">
                <div class="project-unit-left">
                    <div class="project-unit-line">
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label"><span  v-if="$parent.$parent.project.house_type == 1">Units Number</span><span  v-if="$parent.$parent.project.house_type == 2">House Number</span><span class="red" v-if="templateUnit.unit_number == ''">*</span></div>
                            <div class=""><input type="text" @keyup="numberWarning = false" v-model="templateUnit.unit_number" class="project-input" :class="{warning: numberWarning}">
                            </div>
                        </div>
                        <div class="unit-subcomponent"  v-if="$parent.$parent.project.house_type == 1">
                            <div class="subcomponent-label">Floor<span class="red" v-if="this.templateUnit.floor == ''">*</span></div>
                            <dropdown :options="floorOption"
                                      :selected="{val: '', name: this.$parent.templateUnit.floor}"
                                      v-on:updateOption="selectNewFloor"
                                      :placeholder="'Select floor'"
                                      :closeOnOutsideClick="true"></dropdown>
                        </div>
                    </div>
                    <div class="project-unit-line">
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label">Bedroom<span v-if="templateUnit.bad == ''"
                                                                         class="red">*</span></div>
                            <div class=""><input type="number" min="0" max="99" v-model="templateUnit.bad"
                                                 class="project-input"></div>
                        </div>
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label">Bathroom<span v-if="templateUnit.bath == ''"
                                                                          class="red">*</span></div>
                            <div class=""><input type="number" min="0" max="99" v-model="templateUnit.bath"
                                                 class="project-input"></div>
                        </div>
                    </div>
                    <div class="project-unit-line">
                        <div style="width: 100%;">
                            <div class="subcomponent-label">Price<span v-if="templateUnit.price == ''"
                                                                       class="red">*</span></div>
                            <div class=""><input @keyup="priceWarning = false" type="number" min="1" v-model="templateUnit.price"
                                                 :class="{warning: priceWarning}" class="project-input"></div>
                        </div>
                    </div>
                    <div class="project-unit-line">
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label">Status<span v-if="templateUnit.status === ''"
                                                                        class="red">*</span></div>
                            <dropdown v-if="templateUnit.status !== ''" :options="statusOption"
                                      :selected="{val: templateUnit.status, name: statusOption[templateUnit.status].name}"
                                      v-on:updateOption="selectStatus"
                                      :placeholder="'Select status'"
                                      :closeOnOutsideClick="true"></dropdown>
                            <dropdown v-if="templateUnit.status === ''" :options="statusOption"
                                      :selected="{val: '', name: ''}"
                                      v-on:updateOption="selectStatus"
                                      :placeholder="'Select status'"
                                      :closeOnOutsideClick="true"></dropdown>
                        </div>
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label">HOA Fees</div>
                            <div class=""><input type="number" min="1" v-model="templateUnit.HOA" class="project-input">
                            </div>
                        </div>
                    </div>
                    <div class="project-unit-line">
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label">Interior sq. ft<span class="red"
                                                                                 v-if="templateUnit.int_sq === ''">*</span>
                            </div>
                            <div class=""><input @keyup="intWarning = false" type="text" :class="{warning: intWarning}" min="1" step="any" v-model="templateUnit.int_sq"
                                                 class="project-input"></div>
                        </div>
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label">Exterior sq.ft</div>
                            <div class=""><input type="text" min="1" step="any" v-model="templateUnit.ext_sq"
                                                 class="project-input"></div>
                        </div>
                    </div>
                    <div class="project-unit-line">
                        <div class="unit-subcomponent">
                            <div class="checkbox-component">
                                <div class="overview-checkbox" :class="{active: templateUnit.bmr}">
                                    <label for="bmr-checkbox">
                                        <div class="overview-checkbox-mask">
                                            <div class="overview-checkbox-icon"></div>
                                        </div>
                                        BMR</label>
                                    <input type="checkbox" v-model="templateUnit.bmr"
                                           id="bmr-checkbox" style="display: none">
                                </div>
                                <div class="overview-checkbox" :class="{active: templateUnit.parking}">
                                    <label for="parking-checkbox">
                                        <div class="overview-checkbox-mask">
                                            <div class="overview-checkbox-icon"></div>
                                        </div>
                                        Parking</label>
                                    <input type="checkbox" v-model="templateUnit.parking"
                                           id="parking-checkbox" style="display: none">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="unit-image"  v-if="$parent.$parent.project.house_type == 1">
                        <div class="unit-image-header">Unit plan</div>
                        <div class="unit-image-preview">
                            <img :src="templateUnit.unitImagePreview" alt="" id="unit-preview">
                        </div>
                        <div class="unit-image-buttons">
                            <div class="button-container">
                                <div class="logo-upload" onclick="document.getElementById('image').click()">Upload
                                    photo
                                </div>
                            </div>
                            <input type="file" name="image" @change="uploadImage" style="display: none"
                                   accept="image/png, image/jpeg" id="image">
                            <div class="remove-image" v-if="this.templateUnit.unitImagePreview != ''"
                                 @click="removeImage">Remove
                            </div>
                        </div>
                    </div>
                    <div class="unit-gallery" v-if="templateUnit.photos != undefined">
                        <div class="unit-gallery-button" @click="openUnitGallery">
                            <span v-if="templateUnit.photos != undefined && templateUnit.photos.length == 0">Create gallery</span>
                            <span v-if="templateUnit.photos != undefined && templateUnit.photos.length != 0">Edit gallery</span></div>
                    </div>
                </div>
                <div class="project-unit-right" v-if="$parent.$parent.project.house_type == 2">
                    <div class="unit-image">
                        <div class="unit-image-header">Lot Plan</div>
                        <div class="unit-image-preview">
                            <img :src="templateUnit.unitImagePreview" id="unit-preview" alt="">
                        </div>
                        <div class="unit-image-buttons">
                            <div class="button-container">
                                <div class="logo-upload" onclick="document.getElementById('image').click()">Upload
                                    photo
                                </div>
                            </div>
                            <input type="file" name="image" @change="uploadImage" style="display: none"
                                   accept="image/png, image/jpeg" id="image">
                            <div class="remove-image" v-if="templateUnit.unitImagePreview != ''"
                                 @click="removeImage">Remove
                            </div>
                        </div>
                    </div>
                </div>
                <!--  -->
                <div class="project-unit-right" v-if="$parent.$parent.project.house_type == 1">
                    <div class="unit-image-header" :class="{red: this.markWarning == true}"
                         v-if="this.templateUnit.floorImage != '' && this.templateUnit.floorImage != null">
                        <span>Unit Location<span class="red"
                                                 v-if="!(this.templateUnit.floorImage != '' && this.templateUnit.floorImage != null && this.templateUnit.mark == true)">*</span> </span>
                        You can added unit mark on this floor
                        <div class="button-container" v-if="templateUnit.mark == true && floorPreview != ''"
                             @click="templateUnit.mark = false; templateUnit.unit_mark.x = 0; templateUnit.unit_mark.y = 0; templateUnit.unit_mark.width = 15; templateUnit.unit_mark.height = 10">
                            <div class="logo-upload" v-if="">Remove unit mark</div>
                        </div>
                        <div class="button-container" @click="addUnitMark"
                             v-if="templateUnit.mark == false  && floorPreview != ''">
                            <div class="logo-upload">Add unit mark</div>
                        </div>
                    </div>
                    <div class="unit-image-container">
                        <vue-draggable-resizable v-if="templateUnit.mark == true && this.templateUnit.unit_mark != null" :x="Number.parseInt(templateUnit.unit_mark.x)" :y="Number.parseInt(templateUnit.unit_mark.y)"
                                                 :w="Number.parseInt(templateUnit.unit_mark.width)" :h="Number.parseInt(templateUnit.unit_mark.height)" @dragging="onDrag" @resizing="onResize" :parent="true">
                            <div class="unit-point" v-if="this.templateUnit.unit_mark != null">
                                <div class="unit-point-bedrooms" :style="{fontSize: this.templateUnit.unit_mark.font_size + 'px'}"
                                     v-if="templateUnit.bad >= 0 && templateUnit.bad != ''">{{templateUnit.bad}}
                                    bedroom
                                </div>
                                <div class="unit-point-number" :style="{fontSize: this.templateUnit.unit_mark.font_size + 'px'}">
                                    {{templateUnit.unit_number}}
                                </div>
                                <div class="unit-point-status" v-if="templateUnit.status !== ''" :style="{fontSize: this.templateUnit.unit_mark.font_size + 'px'}">
                                    {{statusOption[templateUnit.status].name}}
                                </div>
                            </div>
                        </vue-draggable-resizable>
                        <div class="image-block"><img id="floor-image" :src="floorPreview" alt=""></div>
                    </div>
                </div>
            </div>
            <div class="unit-create-controls">
                <div class="project-page-button inactive-button"  v-if="this.stopSave == true">Save</div>
                <div class="project-page-button blue-button" v-if="this.stopSave == false" @click="makeWarnings">Save</div>
                <div class="project-page-button" @click="cancel">Cancel</div>
            </div>
        </div>
    </div>
</template>

<script>
  import UnitGalleryModal from '@/components/edit/UnitGalleryModal.vue'
  import dropdown from '@/components/simple/dropdown.vue'
  import constants from "../../Constants";
  import VueDraggableResizable from 'vue-draggable-resizable'

  // optionally import default styles
  import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
  export default {
    name: 'EditUnitModal',
    components: {
      dropdown, VueDraggableResizable,UnitGalleryModal
    },
    data: ()=>({
      floorOption: [],
      floorPreview: '',
      stopSave: false,
      statusOption: constants.STATUS_OPTIONS,
      templateUnit: JSON.parse(JSON.stringify(constants.STANDART_UNIT)),
      counter: 0,  // count the clicks
      timer: null,
      numberWarning: false,
      floorWarning: false,
      bedWarning: false,
      priceWarning: false,
      statusWarning: false,
      bathWarning: false,
      markWarning: false,
      intWarning: false,
      unitGalleryModal: false,
    }),
    methods: {
      saveGallery() {
        var link = '';
        if(this.$parent.$parent.project.house_type == 1) {
          link = constants.BACKEND_URL + 'unit/update-photos';
        } else {
          link = constants.BACKEND_URL + 'lot-info/update-photos';
        }
        this.stopSave = true;
        let data = new FormData();
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        data.append('user_id', user.uid);
        data.append('token', token);
        data.append('unit_id', this.templateUnit.id);
        data.append('project_id', this.$parent.$parent.project.id);
        data.append('photos', JSON.stringify(this.templateUnit.photos));
        for (var i = 0; i < this.templateUnit.photos.length; i++) {
          if (this.templateUnit.photos[i].id == undefined && this.templateUnit.photos[i].image_link != '') {
            data.append('' + i, this.templateUnit.photos[i]);
          }
        }
        let obj = this;
        $.ajax({
          url: link,
          type: 'POST',
          data: data,
          cache: false,
          dataType: 'json',
          processData: false,
          contentType: false,
          success: function (respond, status, jqXHR) {
            obj.stopSave = false;
            if (respond.ok == 1) {
              obj.photos = respond.unit_photos;
              if(obj.$parent.$parent.project.house_type == 1) {
                for(var i = 0; i < obj.$parent.$parent.project.floors[obj.templateUnit.floor - 1].units.length; i++) {
                  if(obj.$parent.$parent.project.floors[obj.templateUnit.floor - 1].units[i].id == obj.templateUnit.id) {
                    obj.$parent.$parent.project.floors[obj.templateUnit.floor - 1].units[i].photos = respond.unit_photos;
                  }
                }
              } else {
                obj.$parent.$parent.project.lot_info.photos = respond.unit_photos;
              }
              obj.resetTemplateUnit();
              obj.$parent.openEditUnit = false;
            }
          },
          error: function (jqXHR, status, errorThrown) {
            obj.stopSave = false;
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
            obj.resetTemplateUnit();
            obj.$parent.openEditUnit = false;
          }
        });
      },
      makeMore() {
        console.log(this)
      },
      openUnitGallery() {
        this.unitGalleryModal = true;
      },
      makeWarnings() {
        this.numberWarning = false;
        this.floorWarning = false;
        this.bedWarning = false;
        this.bathWarning = false;
        this.priceWarning = false;
        this.statusWarning = false;
        this.intWarning = false;
        this.markWarning = false;
        var result = true;
        if(this.$parent.$parent.project.house_type == 1) {
          if (this.templateUnit.unit_number === 0) {
            this.numberWarning = true;
            result = false;
          }
          if (this.templateUnit.floor == '') {
            this.floorWarning = true;
            result = false;
          }
          if (this.templateUnit.bad === '') {
            this.bedWarning = true;
            result = false;
          }
          if (this.templateUnit.bath === '') {
            this.bathWarning = true;
            result = false;
          }
          if (this.templateUnit.price === '') {
            this.priceWarning = true;
            result = false;
          }
          if (this.templateUnit.status === '') {
            this.statusWarning = true;
            result = false;
          }
          if (this.templateUnit.int_sq === '') {
            this.intWarning = true;
            result = false;
          }
          if ((this.templateUnit.floorImage != null && this.templateUnit.floorImage != '') && this.templateUnit.mark != true) {
            this.markWarning = true;
            result = false;
          } else {
            this.markWarning = false;
          }
        } else {
          if (this.templateUnit.unit_number === 0) {
            this.numberWarning = true;
              result = false;
          }
          if (this.templateUnit.bad === '') {
            this.bedWarning = true;
              result = false;
          }
          if (this.templateUnit.bath === '') {
            this.bathWarning = true;
              result = false;
          }
          if (this.templateUnit.price === '') {
            this.priceWarning = true;
              result = false;
          }
          if (this.templateUnit.status === '') {
            this.statusWarning = true;
              result = false;
          }
          if (this.templateUnit.int_sq === '') {
            this.intWarning = true;
              result = false;
          }
        }
        if(!result) {
          $(this.$el).animate({ scrollTop: 0 }, 600);
        } else {
          this.saveUnit();
        }
      },
      calculateFontSize(){
        let fontSize = this.templateUnit.unit_mark.height / 3 / 2;
        let fontSize2 = this.templateUnit.unit_mark.width / 8;
        if(fontSize < fontSize2) {
          var min = fontSize;
        } else {
          var  min = fontSize2;
        }
        if(min > 14) {
          return Number.parseInt(min);
        } else {
          return 14;
        }
      },
      calculateX() {
        if(this.templateUnit.unit_mark == null || this.templateUnit.unit_mark.x == undefined) {
          return;
        }
        var imageContainer = $('#floor-image');
        var width = imageContainer.width();
        var percent = width / 100;
        var mark_x = this.templateUnit.unit_mark.x * percent;
        return Number.parseInt(mark_x);
      },
      calculateY() {
        if(this.templateUnit.unit_mark == null || this.templateUnit.unit_mark.y == undefined) {
          return;
        }
        var imageContainer = $('#floor-image');
        var height = imageContainer.height();
        var percent = height / 100;
        var mark_y = this.templateUnit.unit_mark.y * percent;
        return Number.parseInt(mark_y);
      },
      calculateWidth() {
        if(this.templateUnit.unit_mark == null || this.templateUnit.unit_mark.width == undefined) {
          return;
        }
        var imageContainer = $('#floor-image');
        var width = imageContainer.width();
        var percent = width / 100;
        var mark_width = this.templateUnit.unit_mark.width * percent;
        return Number.parseInt(mark_width);
      },
      calculateHeight() {
        if(this.templateUnit.unit_mark == null || this.templateUnit.unit_mark.height == undefined) {
          return;
        }
        var imageContainer = $('#floor-image');
        var width = imageContainer.height();
        var percent = width / 100;
        var mark_height = this.templateUnit.unit_mark.height * percent;
        return Number.parseInt(mark_height);
      },
      calculateXBack() {
        var imageContainer = $('#floor-image');
        var width = imageContainer.width();
        var percent = width / 100;
        var mark_x = this.templateUnit.unit_mark.x / percent;
        return Number.parseFloat(mark_x);
      },
      calculateYBack() {
        var imageContainer = $('#floor-image');
        var height = imageContainer.height();
        var percent = height / 100;
        var mark_y = this.templateUnit.unit_mark.y / percent;
        return Number.parseFloat(mark_y);
      },
      calculateWidthBack() {
        var imageContainer = $('#floor-image');
        var width = imageContainer.width();
        var percent = width / 100;
        var mark_width = this.templateUnit.unit_mark.width / percent;
        return Number.parseFloat(mark_width);
      },
      calculateHeightBack() {
        var imageContainer = $('#floor-image');
        var width = imageContainer.height();
        var percent = width / 100;
        var mark_height = this.templateUnit.unit_mark.height / percent;
        return Number.parseFloat(mark_height);
      },
      onResize: function (x, y, width, height) {
        this.templateUnit.unit_mark.x = x;
        this.templateUnit.unit_mark.y = y;
        this.templateUnit.unit_mark.width = width;
        this.templateUnit.unit_mark.height = height;
        this.templateUnit.unit_mark.font_size = this.calculateFontSize();
        this.templateUnit.unit_mark.x_prc = this.calculateXBack();
        this.templateUnit.unit_mark.y_prc = this.calculateYBack();
        this.templateUnit.unit_mark.width_prc = this.calculateWidthBack();
        this.templateUnit.unit_mark.height_prc = this.calculateHeightBack();
      },
      onDrag: function (x, y) {
        this.templateUnit.unit_mark.x = x;
        this.templateUnit.unit_mark.x_prc = this.calculateXBack();
        this.templateUnit.unit_mark.y = y;
        this.templateUnit.unit_mark.y_prc = this.calculateYBack();
        this.templateUnit.unit_mark.width_prc = this.calculateWidthBack();
        this.templateUnit.unit_mark.height_prc = this.calculateHeightBack();
      },
      resetTemplateUnit() {
        this.templateUnit = JSON.parse(JSON.stringify(constants.STANDART_UNIT));
      },
      ChangeFloorPreview() {
        if(this.$parent.$parent.project.house_type == 1) {
          if(this.templateUnit.floor > 0) {
            this.floorPreview = this.$parent.$parent.project.floors[this.templateUnit.floor - 1].image;
            this.templateUnit.floorImage = this.$parent.$parent.project.floors[this.templateUnit.floor - 1].image;
            this.floorPreview = this.$parent.$parent.project.floors[this.templateUnit.floor - 1].preview;
          }
        } else {
          if(this.$parent.$parent.project.lot_info != null) {
            this.templateUnit.unitImagePreview = this.$parent.$parent.project.lot_info.image;
          }
        }
      },
      removeImage(){
        this.templateUnit.image = '';
        this.templateUnit.unitImage = '';
        this.templateUnit.image_id = '';
        this.templateUnit.unitImagePreview ='';
        let file = document.getElementById('image');
        file.value = '';
        this.getUnitImage();
      },
      getUnitImage(){
        let img = document.getElementById('unit-preview');
        if(img) {
          if( this.templateUnit.unitImagePreview != '' && this.templateUnit.unitImagePreview != undefined) {
            img.setAttribute('src', this.templateUnit.unitImagePreview);
            return this.templateUnit.unitImagePreview;
          } else {
            img.setAttribute('src', this.templateUnit.image);
            return this.templateUnit.image;
          }
        }
      },
      addUnitMark: function () {
        this.templateUnit.unit_mark = {};
        this.templateUnit.unit_mark.x = 0;
        this.templateUnit.unit_mark.y = 0;
        this.templateUnit.unit_mark.width = 150;
        this.templateUnit.unit_mark.height = 100;
        this.templateUnit.unit_mark.font_size = this.calculateFontSize();
        this.templateUnit.mark = true;
      },
      saveUnit() {
        if(this.stopSave == true) {
          return;
        }
          this.stopSave = true;

          let data = new FormData();
          let user = JSON.parse(localStorage.getItem('maagio_user'));
          let token = localStorage.getItem('token');
          if(this.templateUnit.unitImage != '') {
            data.append('image', this.templateUnit.unitImage);
          }
          let unit = JSON.parse(JSON.stringify(this.templateUnit));
          for(var i = 0; i < this.$parent.$parent.project.floors.length; i++) {
            if(this.$parent.$parent.project.floors[i].number == this.templateUnit.floor) {
              unit.floor = this.$parent.$parent.project.floors[i].id;
            }
          }
          unit.unitImagePreview = '';
          data.append('user_id', user.uid);
          data.append('token', token);
          data.append('project_id', this.$parent.$parent.project.id);
          data.append('house_type', this.$parent.$parent.project.house_type);
          data.append('unit', JSON.stringify(unit));
          let obj = this;
          $.ajax({
            url: constants.BACKEND_URL + 'unit/update-unit',
            type: 'POST', // важно!
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function (respond, status, jqXHR) {
              obj.stopSave = false;
              obj.templateUnit.id = respond.unit.id;
              if (respond.ok === 1) {
                if(obj.$parent.$parent.project.house_type == 2) {
                  obj.$parent.$parent.project.lot_info = respond.unit;
                  if(respond.new_image) {
                    obj.$parent.$parent.project.lot_info.image = respond.new_image;
                  }
                  obj.saveGallery();
                  return;
                }
                if(respond.unit.newFloor != undefined) {
                  for (var i = 0; i < obj.$parent.$parent.project.floors.length; i++) {
                    for(var n = 0; n < obj.$parent.$parent.project.floors[i].units.length; n++) {
                      if(obj.$parent.$parent.project.floors[i].units[n].id == respond.unit.id) {
                        obj.$parent.$parent.project.floors[i].units.splice(n, 1);
                      }
                    }
                  }
                  obj.$parent.$parent.project.floors[respond.unit.newFloor - 1].units.push(respond.unit);
                }
                for(var i = 0; i < obj.$parent.$parent.project.floors[obj.templateUnit.floor - 1].units.length; i++) {
                  if(obj.$parent.$parent.project.floors[obj.templateUnit.floor - 1].units[i].id == respond.unit.id) {
                    obj.$parent.$parent.project.floors[obj.templateUnit.floor - 1].units[i] = respond.unit;
                    if(respond.new_image) {
                      obj.$parent.$parent.project.floors[obj.templateUnit.floor - 1].units[i].image = respond.new_image;
                    }
                  }
                }
                for(var i = 0; i < obj.$parent.$parent.project.unfloor_units.length; i++) {
                  if(obj.$parent.$parent.project.unfloor_units[i].id == respond.unit.id) {
                    obj.$parent.$parent.project.floors[obj.templateUnit.floor - 1].units.push(obj.$parent.$parent.project.unfloor_units[i]);
                    obj.$parent.$parent.project.unfloor_units.splice(i, 1);
                  }
                }
                obj.saveGallery();
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
      checkSave() {
        if (this.templateUnit.unit_number !== 0 && (this.templateUnit.house_type == 2 || this.templateUnit.floor != '') && this.templateUnit.bad !== ''
          && this.templateUnit.price !== '' && this.templateUnit.status !== '' && this.templateUnit.bath !== ''
          && this.templateUnit.int_sq !== '' && this.stopSave === false) {
          if ((this.templateUnit.floorImage != '' && this.templateUnit.floorImage != null)) {
            if (this.templateUnit.mark != false) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        } else {
          return false;
        }
      },
      selectNewFloor(e){
        this.templateUnit.floor = e.name;
        this.templateUnit.mark = false;
        this.templateUnit.unit_mark = {
          id: '',
          x: 0,
          y: 0,
          width: 15,
          height: 10,
          font_size: 16,
          x_prc: 0,
          y_prc: 0,
          width_prc: 15,
          height_prc: 10,
          font_size_prc: 16,
        };
        this.templateUnit.floor = e.name;
        this.ChangeFloorPreview();
      },
      cancel() {
        this.resetTemplateUnit();
        this.$parent.openEditUnit = false;
      },
      selectStatus(e) {
        switch (e.name) {
          case 'Available':
            this.templateUnit.status = 0;
            break;
          case 'Reserved':
            this.templateUnit.status = 1;
            break;
          case 'Sold':
            this.templateUnit.status = 2;
            break;
          case 'Unreleased':
            this.templateUnit.status = 3;
            break;
        }
      },
      changeColumnDefinition: function (event) {
        let self = this;
        this.counter++;

        if (this.counter === 1) {
          this.timer = setTimeout(function () {
            // DO NOTHING BUT RESET IN CASE THERES JUST ONE CLICK
            self.counter = 0
          }, 300);  // increase delay as you like
        } else {
          let target = event.target.getBoundingClientRect();
          let x = event.clientX - target.left;
          let y = event.clientY - target.top;
          this.templateUnit.unit_mark.x = x;
          this.templateUnit.unit_mark.y = y;
          this.templateUnit.mark = true;
          clearTimeout(this.timer);
          // COLUMN_DEFINITION[c]+=50
          self.counter = 0;
        }
      },
      uploadImage(e){
        this.file = e.target.files[0];
        let reader = new FileReader();
        let obj = this;
        reader.addEventListener("load", function () {
          obj.templateUnit.image = '';
          obj.templateUnit.unitImagePreview = reader.result;
          obj.templateUnit.unitImage = e.target.files[0];
          document.getElementById('unit-preview').setAttribute('src', obj.templateUnit.unitImagePreview);
          obj.templateUnit.unitImageId = e.target.files[0].name + '_'+e.target.files[0].size;
        }.bind(this), false);
        if (this.file) {
          if (/\.(jpe?g|png)$/i.test(this.file.name)) {
            reader.readAsDataURL(this.file);
          }
        }
      }
    },
    beforeDestroy() {
      document.body.parentNode.style.overflow = '';
    },
    mounted(){
      console.log('11')
      document.body.parentNode.style.overflow = 'hidden';
      },
    beforeMount() {
      for (var i = 0; i < this.$parent.$parent.project.floors.length; i++) {
        this.floorOption.push({ name: i + 1, val: '' });
      }

      this.templateUnit = JSON.parse(JSON.stringify(this.$parent.templateUnit));
      this.templateUnit.unitImagePreview = this.$parent.templateUnit.image;
      this.ChangeFloorPreview();
      var obj = this;
      if(obj.$parent.$parent.project.house_type == 1) {
        let timer = setTimeout(function () {
          obj.templateUnit.unit_mark.x = obj.calculateX();
          obj.templateUnit.unit_mark.y = obj.calculateY();
          obj.templateUnit.unit_mark.width = obj.calculateWidth();
          obj.templateUnit.unit_mark.height = obj.calculateHeight();
          obj.templateUnit.unit_mark.font_size = obj.calculateFontSize();
        }, 400);
      }

    },
  }
</script>
