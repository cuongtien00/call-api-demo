import axios from "axios";
import i18n from "../../i18n";

const initialState = {
  requests: []
};

const state = {
  ...initialState
};

const mutations = {
  SET_LOADING(state, payload) {
    if (payload) {
      state.requests.push(true);
    } else {
      state.requests.pop();
    }
  }
};

const actions = {
  async request({ commit, rootState }, { method, url, data, params, error }) {
    //replace url
    if (!isEmptyObject(data.path)) {
        url = replaceUrl(url, data.path);
      }
    const headers = {};
    headers.contentType = "application/json";
    //check api import and export file
    // if(url === API_IMPORT){
    //     headers.contentType = "multipart/form-data";
    // }


    if (rootState.Auth.token) {
      headers.Authorization = `Bearer ${rootState.Auth.token}`;
    }
    

    const options = {
      method,
      // baseURL: process.env.VUE_APP_API_URL,
      // url: url,
      url: process.env.VUE_APP_API_URL + url,
      headers: {
        "X-TENANT-ID": process.env.VUE_APP_TENANT_ID,
        ...headers
      },
      data,
      params,
      timeout: process.env.VUE_APP_REQUEST_TIMEOUT
    };

    commit("SET_LOADING", true);

    return axios(options)
      .catch(err => {
        if (err.response) {
          switch (err.response.status) {
            case 401:
              err.message = i18n.t("error.401");
              break;
            case 403:
              err.message = i18n.t("error.403");
              break;
            case 404:
              err.message = i18n.t("error.404");
              break;
            case 500:
              err.message = i18n.t("error.500");
              break;
            case 503:
              err.message = i18n.t("error.503");
              break;
          }
        }

        var isOpen = true;
        var message = null;

        if (err.response) {
          isOpen = !(
            err.response.status === 422 || err.response.status === 429
          );
          message = error || err.response.data.message || err.message;
        } else {
          message = error || err.message;
        }

        if (isOpen) {
          this.dispatch("Dialog/open", {
            component: "alert-dialog",
            params: {
              title: i18n.t("label.error"),
              text: message
            }
          });
        }

        if (
          rootState.Auth.token &&
          err.response &&
          err.response.status === 401
        ) {
          this.commit("Auth/SIGNOUT");
        }

        throw err;
      })
      .finally(() => commit("SET_LOADING", false));
  },
  async get({ dispatch }, request) {
    request.method = "get";
    return dispatch("request", request);
  },
  async post({ dispatch }, request) {
    request.method = "post";
    return dispatch("request", request);
  },
  async put({ dispatch }, request) {
    request.method = "put";
    return dispatch("request", request);
  },
  async patch({ dispatch }, request) {
    request.method = "patch";
    return dispatch("request", request);
  },
  async delete({ dispatch }, request) {
    request.method = "delete";
    return dispatch("request", request);
  }
};

export default {
  state,
  mutations,
  actions
};
