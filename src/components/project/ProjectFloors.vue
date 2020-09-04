<template>
    <div class="project-floors">
        <div class="project-floor" v-for="(floor, key) in floors">
            <div class="floor-upload-button" v-show="floor.image == ''">
                <div class="logo-upload" @click="uploadImage(key)">Upload floor image
                </div>
                <input type="file" :floor-number="key" accept="image/png, image/jpeg" @change="uploadFloorImage" :id="'floor-image-' + key"
                       style="display: none">
            </div>
            <div class="floor-image" v-show="floor.image != ''" @click="uploadImage(key)"><img :src="floor.preview" alt=""></div>
            <div class="floor-header">Floor {{key + 1}} Image {{floor.imageName}}</div>
            <div class="floor-controls">
                <div class="floor-button" v-if="floors.length > 1" onclick="this.style.display = 'none';
                this.parentNode.getElementsByClassName('dropdown-container')[0].style.display = 'block';">Replace
                </div>
                <div class="dropdown-container" style="display: none">
                    <specDropdown
                            :options="arrayOfObjects"
                            :selected="object"
                            :elementid="key"
                            v-on:updateOption="selectNewFloor"
                            :placeholder="'Select an Item'"
                            :closeOnOutsideClick="true">
                    </specDropdown>
                </div>
                <div class="floor-button inactive" v-if="floors.length === 1">Replace</div>
                <div class="floor-button" @click="removeFloor(key)">Remove</div>
            </div>
        </div>
        <div class="empty-floor" @click="addFloor">
            <div class="empty-floor-text"><span class="empty-floor-plus">+</span> Add</div>
        </div>
    </div>
</template>

<script>
  import specDropdown from '@/components/simple/specDropdown.vue'
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
      this.floors = this.$parent.project.floors;
    },
    methods: {
      uploadFloorImage(e) {
        let number = e.target.getAttribute('floor-number');
        this.floors[number].imageName = name;
        let file = e.target.files[0];
        let reader = new FileReader();

        reader.addEventListener("load", function () {
          this.floors[number].preview = reader.result;
          this.floors[number].image = file;

        }.bind(this), false);
        if (file) {
          if (/\.(jpe?g|png)$/i.test(file.name)) {
            reader.readAsDataURL(file);
          }
        }


      },
      selectNewFloor(element) {
        if (element.selectedOption) {
          let elementId = element.$attrs.elementid;
          let newId = element.selectedOption.val;
          let obj = this.floors[elementId];
          this.floors.splice(elementId, 1);
          this.floors.splice(newId, 0, obj);
          this.closeDropDown();
        }

      },
      addFloor() {
        let floor = {
          image: '',
          imageName: '',
          preview: '',
          units: [],
        };
        this.floors.push(floor);
        this.arrayOfObjects = [];
        for (var i = 0; i < this.floors.length; i++) {
          this.arrayOfObjects.push({ name: 'Floor ' + (i + 1), val: i });
        }
        this.$parent.project.floors = this.floors;
        this.$parent.checkActive();
        this.$parent.checkNext();
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
      removeFloor: function (key) {
        this.closeDropDown();
        this.floorNumbers = [];
        for (let i = 0; i < this.floors.length - 1; i++) {
          this.floorNumbers.push('Floor ' + (i + 1));
        }
        this.floors.splice(key, 1);
        this.arrayOfObjects = [];
        for (let i = 0; i < this.floors.length; i++) {
          this.arrayOfObjects.push({ name: 'Floor ' + (i + 1), val: i });
        }
        this.$parent.project.floors = this.floors;

        this.$parent.checkActive();
        this.$parent.checkNext();
      },
    }
  }
</script>