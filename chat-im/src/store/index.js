import Vue from 'vue'
import Vuex from 'vuex'
// import VuexPersistence from 'vuex-persist'

import media from './module/media'

Vue.use(Vuex)
// 持久化储存
// const vuexLocal = new VuexPersistence({
//     storage: window.localStorage,
//
// })

export default new Vuex.Store({
    state: {
        //
    },
    mutations: {
        //
    },
    actions: {
        //
    },
    modules: {
        media,
    }
})
