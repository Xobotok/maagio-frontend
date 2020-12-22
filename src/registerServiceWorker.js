/* eslint-disable no-console */

import { register } from 'register-service-worker'
if (process.env.NODE_ENV === 'production') {
  function checkPreload() {
    var CACHE_NAME = 'my-site-cache-v1';
    var location = window.location.href;
    location = location.split('/');
    location = location[location.length - 2];
    if(location == 'show') {
      const request = new Request(window.location.href);
      caches.open(CACHE_NAME)
      .then(function(cache) {
        cache.match(request).then(function (request) {
          if(request == undefined) {
            var body = document.body;
            var mask = $('<div class="fullscreen-preloader">' +
              '<div class="cssload-loader">'+
              '<div class="cssload-inner cssload-one"></div>'+
              '<div class="cssload-inner cssload-two"></div>'+
              '<div class="cssload-inner cssload-three"></div>'+
              '</div>Loading...</div>')
            $(body).append(mask);
          }
        });
      });
    }
  }
  checkPreload();
  window.addEventListener('load', () => {
    register(`${process.env.BASE_URL}service-worker.js`, {
      ready () {
        console.log(
          'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
        )
      },
      registered () {
        console.log('Service worker has been registered.')
        var CACHE_NAME = 'my-site-cache-v1';
        var location = window.location.href;
        location = location.split('/');
        location = location[location.length - 2];
        if(location == 'show') {
          const request = new Request(window.location.href);
          caches.open(CACHE_NAME)
          .then(function(cache) {
            cache.match(request).then(function (request) {
              if(request == undefined) {
                window.location.reload();
              }
            })
          });
        }
      },
      cached () {
        console.log('Content has been cached for offline use.')
      },
      updatefound () {
        console.log('New content is downloading.')
      },
      updated () {
        console.log('New content is available; please refresh.')
      },
      offline () {
        console.log('No internet connection found. App is running in offline mode.')
      },
      error (error) {
        console.error('Error during service worker registration:', error)
      }
    })
  });
}