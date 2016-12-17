import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

export default class Resource {

  getRain () {
    return Vue.http.get('http://private-4945e-weather34.apiary-proxy.com/weather34/rain').then((response) => {
      return response.json()
    }).catch(function (e) {
      return false
    })
  }
}
