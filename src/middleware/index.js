import axios from 'axios'
import store from '@/store'
import router from '@/router'

let instance = axios.create({
  baseURL: process.env.REMOTE_BASE_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})

instance.interceptors.response.use(
  response => response,
  error => {
      if (error.response.status === 401 || error.response.status === 419) {
        window.alert('ユーザー認証に問題が発生しました。ログイン画面に移動します。')
        store.dispatch('setSkipScreenTransitionConfFlg', true).then(() => {
          router.push({ name: 'login' })
        })
      }

      if (error.response.status === 403) {
          window.alert(error.response.data.message || 'このリクエストをする権限がありません。')
      }

      return Promise.reject(error);
  }
)

instance.interceptors.request.use(
  config => {
    if (store.state.Auth.token) {
      config.headers = Object.assign(config.headers, {
        'X-Language': store.state.Auth.user.locale,
        'Authorization': `Bearer ${store.state.Auth.token}`
      });
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance
