const initialState = {
    token: null,
    receptionist: null
  };
  
  const state = {
    ...initialState
  };
  
  const mutations = {
    SIGNIN(state, payload) {
      state.token = payload.token;
      state.receptionist = payload.user;
    },
    SIGNOUT(state) {
      state.token = null;
      state.receptionist = null;
    }
  };
  
  const actions = {
    signin({ commit, dispatch }, data) {
      return dispatch(
        "Http/post",
        { url: "/auth/signin", data },
        { root: true }
      ).then(res => commit("SIGNIN", res.data));
    },
    signout({ commit }) {
      commit("SIGNOUT");
    }
  };
  
  export default {
    state,
    mutations,
    actions
  };
  