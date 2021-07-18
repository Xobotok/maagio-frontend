import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import constants from '../Constants'

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    version: localStorage.getItem('last_version') || '',
    user: {},
    update: 0,
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, token, user) {
      state.status = 'success'
      state.token = token
      state.user = user
    },
    auth_error(state) {
      state.status = 'error'
    },
    set_need_update(state) {
      state.update = 1;
    },
    remove_need_update(state) {
      state.update = 0;
    },
    set_version(state, version) {
      state.version = version;
    },
    logout(state) {
      state.status = ''
      state.token = ''
    },
  },
  actions: {
    login({commit}, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({
          url: constants.BACKEND_URL + 'authorisation/login/?email=' + user.email + '&password=' + user.password,
          method: 'GET'
        })
          .then(resp => {
            if (resp.data.ok == 1) {
              const token = resp.data.token
              const user = resp.data.user
              localStorage.setItem('token', token)
              localStorage.setItem('maagio_user', JSON.stringify(user));
              axios.defaults.headers.common['Authorization'] = token
              commit('auth_success', token, user)
              resolve(resp)
            } else {
              user.obj.message = resp.data.message;
            }
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    register({commit}, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({
          url: constants.BACKEND_URL + 'authorisation/register/?email=' + user.email + '&name=' + user.name + '&last_name=' + user.last_name +
            '&company=' + user.company + '&password=' + user.password, method: 'GET'
        })
          .then(resp => {
            /* const token = resp.data.token
             const user = resp.data.user
             localStorage.setItem('token', token)
             axios.defaults.headers.common['Authorization'] = token
             commit('auth_success', token, user)
             resolve(resp)*/
            if (resp.data.ok == 1) {
              window.location.href = "/login/?message=" + resp.data.message;
            } else {
              alert(resp.data.error);
            }

          })
          .catch(err => {
            commit('auth_error', err)
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    logout({commit}) {
      return new Promise((resolve, reject) => {
        commit('logout')
        localStorage.removeItem('token')
        localStorage.removeItem('maagio_user')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    },
    setNeedUpdate({commit}) {
      commit('set_need_update')
    },
    updateVersion({commit}, version) {
      localStorage.setItem('last_version', version)
      commit('set_version', version);
    },
    removeNeedUpdate({commit}) {
      commit('remove_need_update');
    },
    updateVersionOnline({commit}, version) {
      return new Promise((resolve, reject) => {
        $.ajax({
          url: constants.BACKEND_URL + 'app/get-last-version',
          type: 'GET', // важно!
          dataType: 'json',
          success: function (resp, status, jqXHR) {
            if (resp.ok === 1) {
              localStorage.setItem('last_version', resp.last_version)
              commit('set_version', resp.last_version);
              commit('remove_need_update');
              window.location.reload();
            }
          },
          // функция ошибки ответа сервера
          error: function (jqXHR, status, errorThrown) {

          }
        });
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    needUpdate: state => state.update,
  },

})
