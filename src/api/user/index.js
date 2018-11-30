import axios from '../../components/interceptor'
import axioss from 'axios'
export default {
  login: async (param) => {
    let rest = await axios.post(`/api/users/actions/login`, param)
    return rest.data
  },

  queryUserList: async ({pageIndex, pageSize}, {username}, orgId) => {
    let rest = await axios.get(`/api/users?pageIndex=${pageIndex}&pageSize=${pageSize}&username=${username}&orgId=${orgId}`)
    return rest.data
  },
  create: async (userForm) => {
    let rest = await axios.post('/api/users', userForm)
    return rest.data
  },
  remove: async (id) => {
    let resp = await axioss.delete(`/api/users/${id}`)
    return resp.data
  },
  update: async (userForm) => {
    let rest = await axios.put('/api/users', userForm)
    return rest.data
  }
}
