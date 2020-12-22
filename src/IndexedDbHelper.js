import * as $ from "jquery";
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
  baseName = "maggio",
  storeName = "localStore";
window.db = indexedDB.open(baseName, 1);

window.db.onupgradeneeded = function () {
  let db = window.db.result;
  if (!db.objectStoreNames.contains('draft_projects')) { // если хранилище "books" не существует
    db.createObjectStore('draft_projects', { keyPath: 'id' }); // создаем хранилище
  }
  if (!db.objectStoreNames.contains('published_projects')) { // если хранилище "books" не существует
    db.createObjectStore('published_projects', { keyPath: 'id' }); // создаем хранилище
  }
  if (!db.objectStoreNames.contains('subscribe')) { // если хранилище "books" не существует
    db.createObjectStore('subscribe', { keyPath: 'id' }); // создаем хранилище
  }
  if (!db.objectStoreNames.contains('actual_tariff')) { // если хранилище "books" не существует
    db.createObjectStore('actual_tariff', { keyPath: 'id' }); // создаем хранилище
  }
  if (!db.objectStoreNames.contains('tariffs')) { // если хранилище "books" не существует
    db.createObjectStore('tariffs', { keyPath: 'id' }); // создаем хранилище
  }
  if (!db.objectStoreNames.contains('units')) { // если хранилище "books" не существует
    db.createObjectStore('units', { keyPath: 'id' }); // создаем хранилище
  }
  if (!db.objectStoreNames.contains('floors')) { // если хранилище "books" не существует
    db.createObjectStore('floors', { keyPath: 'id' }); // создаем хранилище
  }
  if (!db.objectStoreNames.contains('user')) { // если хранилище "books" не существует
    db.createObjectStore('user', { keyPath: 'id' }); // создаем хранилище
  }
  if (!db.objectStoreNames.contains('project')) { // если хранилище "books" не существует
    db.createObjectStore('project', { keyPath: 'id' }); // создаем хранилище
  }
  if (!db.objectStoreNames.contains('images')) { // если хранилище "books" не существует
    db.createObjectStore('images', { keyPath: 'id' }); // создаем хранилище
  }
};
function logerr(err) {
  console.log(err);
}

function connectDB(f) {
  var request = indexedDB.open(baseName, 1);
  request.onerror = logerr;
  request.onsuccess = function () {
    f(request.result);
  }
  request.onupgradeneeded = function (e) {
    e.currentTarget.result.createObjectStore(storeName, { keyPath: "path" });
    connectDB(f);
  }
}

window.db.getFile = function getFile(file, f) {
  connectDB(function (db) {
    var request = db.transaction([storeName], "readonly").objectStore(storeName).get(file);
    request.onerror = logerr;
    request.onsuccess = function () {
      f(request.result ? request.result : -1);
    }
  });
};
window.db.actualProjects = function () {
  connectDB(function (db) {
    var request = db.transaction(['project'], "readwrite").objectStore('project').getAll();
    request.onerror = logerr;
    request.onsuccess = function () {
      var draft_projects = db.transaction(['draft_projects'], "readonly").objectStore('draft_projects').getAll();
      draft_projects.onsuccess = function () {
        var published_projects = db.transaction(['published_projects'], "readonly").objectStore('published_projects').getAll();
        published_projects.onsuccess = function () {
          for (var i = 0; i < request.result.length; i++) {
            var flag = false;
            for (var n = 0; n < draft_projects.result.length; n++) {
              if (draft_projects.result[n].id == request.result[i].id) {
                flag = true;
              }
            }
            for(var m = 0; m < published_projects.result.length; m++) {
              if(published_projects.result[m].id == request.result[i].id) {
                flag = true;
              }
            }
            if(!flag) {
              db.transaction(['project'], "readwrite").objectStore('project').delete(request.result[i].id);
            }
          }
        };
      };

      return request.result;
    }
  });
};
window.db.getStorage = function getStorage(f) {
  connectDB(function (db) {
    var rows = [],
      store = db.transaction([storeName], "readonly").objectStore(storeName);

    if (store.mozGetAll)
      store.mozGetAll().onsuccess = function (e) {
        f(e.target.result);
      };
    else
      store.openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        if (cursor) {
          rows.push(cursor.value);
          cursor.continue();
        }
        else {
          f(rows);
        }
      };
  });
}
window.db.clearStore = function (store) {
  connectDB(function (db) {
    var request = db.transaction([store], "readwrite").objectStore(store).clear();
    request.onerror = logerr;
    request.onsuccess = function () {
      return request.result;
    }
  });
};
window.db.delValue = function(store, id) {
  connectDB(function (db) {
    var request = db.transaction([store], "readwrite").objectStore(store).delete(id);
    request.onerror = logerr;
    request.onsuccess = function () {
      return request.result;
    }
  });
};
window.db.setValue = function (store, id, val) {
  connectDB(function (db) {
    console.log('setValue');
    var request = db.transaction([store], "readwrite").objectStore(store).put({'id': id, value: val});
    request.onerror = logerr;
    request.onsuccess = function () {
      return request.result;
    }
  });
}
window.db.updateProjectFloors = function (project_id, floors) {
  connectDB(function (db) {
    window.db.getValue('project', Number.parseInt(project_id), function (e) {
      var project = JSON.parse(e.value);
      project.floors = floors;
      console.log(project.floors);
      window.db.setValue('project', Number.parseInt(project_id), JSON.stringify(project))
    });
  });
}
window.db.getValue = function (store, id, callback = null) {
  connectDB(function (db) {
    var request = db.transaction([store], "readonly").objectStore(store).get(id);
    request.onerror = logerr;
    request.onsuccess = function () {
      if(callback != null) {
        callback(request.result);
      }
      return request.result;
    }
  });
};
window.db.getAllValues = function (store, callback) {
  connectDB(function (db) {
    var request = db.transaction([store], "readonly").objectStore(store).getAll();
    request.onerror = logerr;
    request.onsuccess = function () {
      callback(request.result);
    }
  });
};

window.db.setFile = function setFile(file) {
  connectDB(function (db) {
    var request = db.transaction([storeName], "readwrite").objectStore(storeName).put(file);
    request.onerror = logerr;
    request.onsuccess = function () {
      return request.result;
    }
  });
}
window.db.setImage = function (image_id, blob) {
  connectDB(function (db) {
    var request = db.transaction(['images'], "readwrite").objectStore('images').put({id: Number.parseInt(image_id), image: blob});
    request.onerror = logerr;
    request.onsuccess = function () {
      return request.result;
    }
  })
};
window.db.removeImage = function (image_id) {
  connectDB(function (db) {
    var request = db.transaction(['images'], "readwrite").objectStore('images').delete(Number.parseInt(image_id));
    request.onerror = logerr;
    request.onsuccess = function () {

    }
  })
};

window.db.delFile = function delFile(file) {
  connectDB(function (db) {
    var request = db.transaction([storeName], "readwrite").objectStore(storeName).delete(file);
    request.onerror = logerr;
    request.onsuccess = function () {
      console.log("File delete from DB:", file);
    }
  });
}
export default window.db;