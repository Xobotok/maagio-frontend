<template>
    <div class="project-units">
        <div class="project-units-header">
            <span>UNITS</span> Here you can submit details for each unit.
        </div>
        <div class="project-units-list">
            <div class="project-units-empty" v-if="units.length === 0">No units</div>
            <div class="units-list" v-if="units.length > 0">
                <div class="units-list-blocks">
                    <div class="units-list-header">Unit Number</div>
                    <div class="units-list-header">Status</div>
                    <div class="units-list-header">Price</div>
                    <div class="units-list-header">Floor</div>
                    <div class="units-list-header">Sq.ft (int.)</div>
                    <div class="units-list-header">Sq.ft (ext.)</div>
                    <div class="units-list-header">Bed</div>
                    <div class="units-list-header">Bath</div>
                    <div class="units-list-header">BMR</div>
                    <div class="units-list-header"></div>
                </div>
                <div class="units-list-blocks" v-for="unit in units">
                    <div class="units-list-value">{{unit.unit.unitNumber}}</div>
                    <div class="units-list-value">{{statusNames[unit.unit.status].name}}</div>
                    <div class="units-list-value">{{unit.unit.price}} $</div>
                    <div class="units-list-value">{{unit.unit.floor}}</div>
                    <div class="units-list-value">{{unit.unit.interiorFootage}}</div>
                    <div class="units-list-value">{{unit.unit.exteriorFootage}}</div>
                    <div class="units-list-value">{{unit.unit.bedroom}}</div>
                    <div class="units-list-value">{{unit.unit.bathroom}}</div>
                    <div class="units-list-value" v-if="unit.unit.bmr == 1">Да</div>
                    <div class="units-list-value" v-if="unit.unit.bmr == 0">Нет</div>
                    <div class="units-list-value units-icons">
                        <div class="units-edit-icon" @click="editUnit(unit.id)"></div>
                        <div class="units-remove-icon" @click="deleteUnit(unit.id)"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="project-units-control">
            <div class="logo-upload" @click="resetTemplateUnit(); openPopup()">Add a Unit</div>
        </div>
        <NewUnitModal :currentUnit="templateUnit" v-if="openAddUnit === true"></NewUnitModal>
    </div>
</template>

<script>
  import NewUnitModal from '@/components/project/NewUnitModal.vue'
    export default {
      name: 'ProjectUnits',
      components: {
        NewUnitModal,
      },
      data: ()=> ({
        statusNames: [{ name: 'Available' }, { name: 'Reserved' }, { name: 'Sold' }],
        templateUnit: {
          unitNumber: 0,
          floor: 1,
          bedroom: 1,
          bathroom: 1,
          price: '',
          status: '',
          HOA: '',
          interiorFootage: '',
          exteriorFootage: '',
          bmr: false,
          parking: false,
          floorImage: '',
          imagePoint: {
            X: '',
            Y: '',
          },
        },
        units: [{
          id: '100d',
          unit: {
            unitNumber: '100d',
            floor: 1,
            bedroom: 1,
            bathroom: 1,
            price: '120000',
            status: '0',
            HOA: '10000',
            interiorFootage: '32,2',
            exteriorFootage: '0',
            bmr: true,
            parking: true,
            floorImage: '',
            imagePoint: {
              X: '32.4204',
              Y: '38.8571',
            }
          }}
        ],
        openAddUnit: false,
      }),
      methods: {
        resetTemplateUnit() {
          this.templateUnit = {
            id: 0,
            unitNumber: 0,
            floor: 1,
            bedroom: 1,
            bathroom: 1,
            price: '',
            status: '',
            HOA: '',
            interiorFootage: '',
            exteriorFootage: '',
            bmr: false,
            parking: false,
            floorImage: '',
            imagePoint: {
              X: '',
              Y: '',
            },
          };
        },
        openPopup() {
          this.openAddUnit = true;
        },
        deleteUnit(id) {
          for(let i = 0; i < this.units.length; i++) {
            if(this.units[i].id === id) {
              this.units.splice(i, 1);
            }
          }
        },
        editUnit(id) {
          for(let i = 0; i < this.units.length; i++) {
            if(this.units[i].id === id) {
              this.templateUnit = this.units[i].unit;

              this.openPopup();
              break;
            }
          }
        }
      },
    }
</script>