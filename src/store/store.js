import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from "vuex-persistedstate";
import modules from "~/modules";

Vue.use(Vuex)

export const key = "station-work-reception";
export const paths = ["Auth"];

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState({
      key,
      paths
      //storage
    })
  ],
  strict: process.env.NODE_ENV !== "production"
  })