/**
 * Created by shizhouyong on 2017/2/6.
 */
const STORAGE_KEY = 'SESSION'
const STORAGE_PHONE_KEY = "PHONE"
let user;

export default {
    fetchName () {
      user = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
      return user.name
    },
    fetchLimit () {
      user = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
      return user.limit
    },
    fetchPhone () {
      return JSON.parse(window.localStorage.getItem(STORAGE_PHONE_KEY) || '[]')
    },
    fetchSession () {
      user = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
      return user.session
    },
    fetchNumber () {
      user = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
      return user.number
    },
    fetch () {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    },
    save (items) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    },
    savePhone (phone) {
      window.localStorage.setItem(STORAGE_PHONE_KEY, JSON.stringify(phone))
    },
    clear () {
      window.localStorage.clear()
    }

}
