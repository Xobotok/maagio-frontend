export default {
  /*BACKEND_URL: 'https://backend.getmaggio.com/web/',*/
  FRONTEND_URL: 'http://hareapj.cluster051.hosting.ovh.net/',
  BACKEND_URL: 'http://web/',
  STATUS_OPTIONS: [{ name: 'Available' }, { name: 'Reserved' }, { name: 'Sold' }, { name: 'Unreleased' }],
  MARKER_TYPES: [{ val: '', name: 'Culture' }, { val: '', name: 'Restaurants' }, { val: '', name: 'Sport' }, {
    val: '',
    name: 'Parks & Recreations'
  }],
  MAP_OPTIONS: [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#000000"
        },
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#000000"
        },
        {
          "visibility": "on"
        }
      ]
    },
  ],
  STANDART_UNIT: {
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
    mark: false,
    unitImage: '',
    image: '',
    unit_mark: {
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
    },
  }
}