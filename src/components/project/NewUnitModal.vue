<template>
    <div class="fullscreen-modal">
        <div class="project-unit">
            <div class="unit-create-header">Unit Info</div>
            <div class="project-unit-create">
                <div class="project-unit-left">
                    <div class="project-unit-line">
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label">Units Number*</div>
                            <div class=""><input type="text" v-model="templateUnit.unitNumber" class="project-input">
                            </div>
                        </div>
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label">Floor*</div>
                            <dropdown :options="floorOption"
                                      :selected="templateUnit.floor"
                                      v-on:updateOption="selectNewFloor"
                                      :placeholder="'1'"
                                      :closeOnOutsideClick="true"></dropdown>
                        </div>
                    </div>
                    <div class="project-unit-line">
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label">Bedroom*</div>
                            <div class=""><input type="number" min="0" max="99" v-model="templateUnit.bedroom"
                                                 class="project-input"></div>
                        </div>
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label">Bathroom*</div>
                            <div class=""><input type="number" min="0" max="99" v-model="templateUnit.bathroom"
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
                            <dropdown :options="statusOption"
                                      :selected="templateUnit.status"
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
                            <div class=""><input type="text" min="1" step="any" v-model="templateUnit.interiorFootage"
                                                 class="project-input"></div>
                        </div>
                        <div class="unit-subcomponent">
                            <div class="subcomponent-label">Exterior sq.ft</div>
                            <div class=""><input type="text" min="1" step="any" v-model="templateUnit.exteriorFootage"
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
                        <div class="unit-image-preview" v-if="templateUnit.unitImagePreview != ''">
                            <img :src="templateUnit.unitImagePreview" alt="">
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
                             @click="templateUnit.imagePoint.X = ''; templateUnit.imagePoint.Y = ''">
                            <div class="logo-upload">Reset</div>
                        </div>
                    </div>

                    <div class="unit-image-container">
                        <img :src="floorPreview()" @click="changeColumnDefinition" alt="">
                        <div class="unit-point"
                             v-if="templateUnit.imagePoint.X != '' && templateUnit.imagePoint.Y != ''"
                             :style="{left: 'calc(' + templateUnit.imagePoint.X + '% - 50px)', top: 'calc(' + templateUnit.imagePoint.Y + '% - 30px)'}">
                            <div class="unit-point-bedrooms"
                                 v-if="templateUnit.bedroom >= 0 && templateUnit.bedroom != ''">{{templateUnit.bedroom}}
                                bedroom
                            </div>
                            <div class="unit-point-number">
                                {{templateUnit.unitNumber}}
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
                <div class="project-page-button" @click="closeModal">Cancel</div>
            </div>
        </div>
    </div>
</template>

<script>
  import dropdown from '@/components/simple/dropdown.vue'
  export default {
    name: 'NewUnitModal',
    components: {
      dropdown,
    },
    props: ['currentUnit'],
    data: ()=>({
      floorOption: [],
      statusOption: [{ name: 'Available' }, { name: 'Reserved' }, { name: 'Sold' }],
      templateUnit: {
        id: '',
        unitNumber: 0,
        floor: 1,
        bedroom: 1,
        bathroom: 1,
        price: '',
        status: '',
        HOA: '',
        interiorFootage: '',
        exteriorFootage: '',
        bmr: 0,
        parking: 0,
        floorImage: '',
        imagePoint: {
          X: '',
          Y: '',
        },
        unitImage: '',
        unitImagePreview: '',
      },
      counter: 0,  // count the clicks
      timer: null,

    }),
    methods: {
      floorPreview() {
        return this.$parent.$parent.project.floors[this.templateUnit.floor - 1].preview;
      },
      removeImage(){
        this.templateUnit.unitImagePreview = '';
        this.templateUnit.unitImage = '';
        let file = document.getElementById('image');
        file.value = '';
      },
      saveUnit() {
        if (this.checkSave()) {
          for (let i = 0; i < this.$parent.$parent.project.floors.length; i++) {
            for (let n = 0; n < this.$parent.$parent.project.floors[i].units.length; n++) {
              if (this.$parent.$parent.project.floors[i].units[n] === this.templateUnit) {
                this.$parent.$parent.project.floors[i].units.splice(n, 1);
                n--;
              }
            }
          }
          for (let i = 0; i < this.$parent.units.length; i++) {
            if (this.$parent.units[i] === this.templateUnit) {
              this.$parent.units.splice(i, 1);
              i--;
            }
          }
          this.$parent.units.push(this.templateUnit);
          this.$parent.$parent.project.floors[this.templateUnit.floor - 1]['units'].push(this.templateUnit);
          this.closeModal();
          console.log(this.$parent.$parent.project.floors);
        }
      },
      checkSave() {
        if (this.templateUnit.unitNumber !== 0 && this.templateUnit.bedroom !== 0 && this.templateUnit.bedroom !== ''
          && this.templateUnit.price !== '' && this.templateUnit.status !== '' && this.templateUnit.bathroom !== 0
          && this.templateUnit.interiorFootage !== '') {
          return true;
        } else {
          return false;
        }
      },
      selectNewFloor(e){
        this.templateUnit.floor = e.name;
      },
      closeModal() {
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
          this.templateUnit.imagePoint.X = percentX;
          this.templateUnit.imagePoint.Y = percentY;
          clearTimeout(this.timer);
          // COLUMN_DEFINITION[c]+=50
          self.counter = 0;
        }
      },
      uploadImage(e){
        this.file = e.target.files[0];
        let reader = new FileReader();
        reader.addEventListener("load", function () {
          this.templateUnit.unitImagePreview = reader.result;
          this.templateUnit.unitImage = e.target.files[0];
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
        this.floorOption.push({ name: i + 1 });
      }
      this.templateUnit = this.currentUnit;
    },
  }
</script>