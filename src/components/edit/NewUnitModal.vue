<template>
    <div class="fullscreen-modal">
        <div class="project-unit">
            <div class="unit-create-header">Unit Info</div>
            <div class="project-unit-create">
                <div class="project-unit-left">
                    <div class="project-unit-line">
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label">Units Number*</div>
                            <div class=""><input type="text" v-model="templateUnit.unit_number" class="project-input">
                            </div>
                        </div>
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label">Floor*</div>
                            <dropdown :options="floorOption"
                                      :selected="{val: '', name: this.$parent.templateUnit.floor}"
                                      v-on:updateOption="selectNewFloor"
                                      :placeholder="'Select floor'"
                                      :closeOnOutsideClick="true"></dropdown>
                        </div>
                    </div>
                    <div class="project-unit-line">
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label">Bedroom*</div>
                            <div class=""><input type="number" min="0" max="99" v-model="templateUnit.bad"
                                                 class="project-input"></div>
                        </div>
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label">Bathroom*</div>
                            <div class=""><input type="number" min="0" max="99" v-model="templateUnit.bath"
                                                 class="project-input"></div>
                        </div>
                    </div>
                    <div class="project-unit-line">
                        <div style="width: 100%;">
                            <div class="subcomponent-label">Price*</div>
                            <div class=""><input type="number" min="1" v-model="templateUnit.price"
                                                 class="project-input"></div>
                        </div>
                    </div>
                    <div class="project-unit-line">
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label">Status*</div>
                            <dropdown v-if="templateUnit.status != ''" :options="statusOption"
                                      :selected="{val: templateUnit.status, name: statusOption[templateUnit.status].name}"
                                      v-on:updateOption="selectStatus"
                                      :placeholder="'Select status'"
                                      :closeOnOutsideClick="true"></dropdown>
                            <dropdown v-if="templateUnit.status == ''" :options="statusOption"
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
                            <div class="subcomponent-label">Interior sq. ft*</div>
                            <div class=""><input type="text" min="1" step="any" v-model="templateUnit.int_sq"
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
                    <div class="unit-image">
                        <div class="unit-image-header">Unit plan</div>
                        <div class="unit-image-preview">
                            <img :src="getUnitImage()" id="unit-preview" alt="">
                        </div>
                        <div class="unit-image-buttons">
                            <div class="button-container">
                                <div class="logo-upload" onclick="document.getElementById('image').click()">Upload
                                    photo
                                </div>
                            </div>
                            <input type="file" name="image" @change="uploadImage" style="display: none" multiple
                                   accept="image/png, image/jpeg" id="image">
                            <div class="remove-image" v-if="templateUnit.unitImagePreview != ''"
                                 @click="removeImage">Remove
                            </div>
                        </div>
                    </div>
                </div>
                <div class="project-unit-right">
                    <div class="unit-image-header">
                        <span>Unit Location*</span> Double click on the floor plates to add the unit location.
                        <div class="button-container"
                             @click="templateUnit.mark_x = ''; templateUnit.mark_y = ''">
                            <div class="logo-upload">Reset</div>
                        </div>
                    </div>

                    <div class="unit-image-container">
                        <img :src="floorPreview" @click="changeColumnDefinition" alt="">
                        <div class="unit-point"
                             v-if="templateUnit.mark_x != '' && templateUnit.mark_y != ''"
                             :style="{left: 'calc(' + templateUnit.mark_x + '% - 50px)', top: 'calc(' + templateUnit.mark_y + '% - 30px)'}">
                            <div class="unit-point-bedrooms"
                                 v-if="templateUnit.bad >= 0 && templateUnit.bad != ''">{{templateUnit.bad}}
                                bedroom
                            </div>
                            <div class="unit-point-number">
                                {{templateUnit.unit_number}}
                            </div>
                            <div class="unit-point-status" v-if="templateUnit.status !== ''">
                                {{statusOption[templateUnit.status].name}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="unit-create-controls">
                <div class="project-page-button blue-button" @click="saveUnit" v-if="checkSave()">Save</div>
                <div class="project-page-button inactive-button" v-if="!checkSave()">Save</div>
                <div class="project-page-button" @click="cancel">Cancel</div>
            </div>
        </div>
    </div>
</template>

<script>
  import dropdown from '@/components/simple/dropdown.vue'
  import constants from "../../Constants";
  export default {
    name: 'NewUnitModal',
    components: {
      dropdown,
    },
    data: ()=>({
      floorOption: [],
      floorPreview: '',
      stopSave: false,
      statusOption: [{ name: 'Available' }, { name: 'Reserved' }, { name: 'Sold' }],
      templateUnit: {
        id: '',
        unit_number: 0,
        floor: 1,
        bad: 1,
        bath: 1,
        price: '',
        status: 0,
        HOA: '',
        int_sq: '',
        ext_sq: '',
        bmr: 0,
        parking: 0,
        floorImage: '',
        mark_x: '',
        mark_y: '',
        unitImage: '',
        image: '',
      },
      counter: 0,  // count the clicks
      timer: null,

    }),
    methods: {
      resetTemplateUnit() {
        this.templateUnit = {
          id: '',
          unit_number: 0,
          floor: 1,
          bad: 1,
          bath: 1,
          price: '',
          status: 0,
          HOA: '',
          int_sq: '',
          ext_sq: '',
          bmr: 0,
          parking: 0,
          floorImage: '',
          mark_x: '',
          mark_y: '',
          unitImage: '',
          image: '',
        };
      },
      ChangeFloorPreview() {
        if(this.templateUnit.floor > 0) {
          if(this.$parent.$parent.project.floors[this.templateUnit.floor - 1].image != '') {
            this.floorPreview = this.$parent.$parent.project.floors[this.templateUnit.floor - 1].image;
          }
          if(this.$parent.$parent.project.floors[this.templateUnit.floor - 1].preview != '') {
            this.floorPreview = this.$parent.$parent.project.floors[this.templateUnit.floor - 1].preview;
          }
        }
      },
      removeImage(){
        this.templateUnit.unitImagePreview = '';
        this.templateUnit.unitImage = '';
        this.templateUnit.image_id = '';
        let file = document.getElementById('image');
        file.value = '';
      },
      getUnitImage(){
        let img = document.getElementById('unit-preview');
        if(img) {
          img.setAttribute('src',this.templateUnit.unitImagePreview);
        }
        return this.templateUnit.unitImagePreview;
      },
      saveUnit() {
        if (this.checkSave()) {
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
          console.log(unit);
            unit.unitImagePreview = '';
            data.append('user_id', user.uid);
            data.append('token', token);
            data.append('project_id', this.$parent.$parent.project.id);
            data.append('unit', JSON.stringify(unit));
            let obj = this;
            $.ajax({
              url: constants.BACKEND_URL + 'unit/create-new-unit',
              type: 'POST', // важно!
              data: data,
              cache: false,
              dataType: 'json',
              processData: false,
              contentType: false,
              success: function (respond, status, jqXHR) {
                obj.stopSave = false;
                if (respond.ok === 1) {
                  if(respond.new_image) {
                    respond.unit.image = respond.new_image;
                  }
                  obj.$parent.$parent.project.floors[obj.templateUnit.floor - 1].units.push(respond.unit);
                  obj.resetTemplateUnit();
                  obj.$parent.openAddUnit = false;

                } else {
                  console.log('ОШИБКА: ' + respond.data);
                }
              },
              error: function (jqXHR, status, errorThrown) {
                obj.stopSave = false;
                console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
              }
            });
        }
      },
      checkSave() {
        if (this.templateUnit.unit_number !== 0 && this.templateUnit.floor != '' && this.templateUnit.bad !== ''
          && this.templateUnit.price !== '' && this.templateUnit.status !== '' && this.templateUnit.bath !== ''
          && this.templateUnit.int_sq !== '' && this.stopSave === false) {
          return true;
        } else {
          return false;
        }
      },
      selectNewFloor(e){
        this.templateUnit.floor = e.name;
        this.ChangeFloorPreview();
      },
      cancel() {
        this.resetTemplateUnit();
        this.$parent.openAddUnit = false;
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
          let pixpercentX = (event.target.offsetWidth / 100);
          let pixpercentY = (event.target.offsetHeight / 100);
          let percentX = x / pixpercentX;
          let percentY = y / pixpercentY;
          this.templateUnit.mark_x = percentX;
          this.templateUnit.mark_y = percentY;
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
          obj.getUnitImage();
          obj.templateUnit.unitImageId = e.target.files[0].name + '_'+e.target.files[0].size;
        }.bind(this), false);
        if (this.file) {
          if (/\.(jpe?g|png)$/i.test(this.file.name)) {
            reader.readAsDataURL(this.file);
          }
        }
      }
    },
    mounted(){
      for (var i = 0; i < this.$parent.$parent.project.floors.length; i++) {
        this.floorOption.push({ name: i + 1, val: '' });
      }
     this.resetTemplateUnit();
    },
  }
</script>