import constants from "./Constants";
window.VueHelper = {};
window.VueHelper.getImageBlob = function (url, callback = null) {
  var xhr = new XMLHttpRequest();

  xhr.onload = function() {
    if(callback != null) {
      callback(xhr.response);
    }
  };
  xhr.open('GET', url, true);
  xhr.send();
};
window.VueHelper.saveImage = function (id, url) {
  if(id == null || url == undefined) {
    return;
  }
  window.VueHelper.getImageBlob(url, function (res) {
    window.db.setImage(id, res);
  })
};
window.VueHelper.stablePassword = function () {
  var entityMap = {
    '#': '№',
    '&': '*',
  };
  function escapeHtml(string) {
    return String(string).replace(/[&#]/g, function (s) {
      return entityMap[s];
    });
  }
  return escapeHtml(val);
};
window.VueHelper.stablePassword = function (val) {
  var entityMap = {
    '#': '№',
    '&': '*',
  };
  function escapeHtml(string) {
    return String(string).replace(/[&#]/g, function (s) {
      return entityMap[s];
    });
  }
  return escapeHtml(val);
};
window.VueHelper.stableInput = function (val) {
    var entityMap = {
      '"': '`',
      "'": '`',
      '/': '/',
      '<': '',
      '>': '',
      '`': '`',
      '#': '№',
      '&': '',
    };
    function escapeHtml(string) {
      return String(string).replace(/[<>&#"'`\/]/g, function (s) {
        return entityMap[s];
      });
    }
    return escapeHtml(val);
};
window.VueHelper.changeManifest = function () {
  var man = document.querySelector('[rel="manifest"]');
  var href = window.location.href;
  var data = {};
  data.href = href;
  $.ajax({
    url: constants.BACKEND_URL + 'app/change-manifest',
    type: 'GET', // важно!
    data: data,
    dataType: 'json',
    success: function (respond, status, jqXHR) {
      if (respond.ok === 1) {
        var manifest = JSON.parse(respond.manifest);
        function download(content, fileName, contentType) {
          var file = new Blob([content], {type: contentType});
          man.setAttribute('href', URL.createObjectURL(file));
        }
        download(respond.manifest, 'manifest.json', 'application/json');
        console.log(manifest);
      }
    },
    // функция ошибки ответа сервера
    error: function (jqXHR, status, errorThrown) {
      console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
    }
  });
};
window.VueHelper.loadFloorsImages = function (floors_array) {
  for(var i = 0; i < floors_array.length; i++) {
    var floor = floors_array[i];
    console.log(floor);
    if(floor.image_id != null && floor.image != null) {
      window.VueHelper.saveImage(floor.image_id, floor.image);
    }
    for(var n = 0; n < floor.units.length; n++) {
      var unit = floor.units[n];
      if(unit.image_id != null && unit.image != null) {
        window.VueHelper.saveImage(unit.image_id, unit.image);
      }
    }
  }
};
