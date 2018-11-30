import axios from '../../components/interceptor'
export default {
  queryOrgs: async (parentId) => {
    let rest = await axios.get(`/api/organizations/actions/queryOrganizations?parentId=${parentId}`)
    return rest.data
  },
  roles: async () => {
    let rest = await axios.get(`/api/organizations/actions/queryOrganizations?parentId`)
    return rest.data
  },
  create: async (form) => {
    let rest = await axios.post('/api/organizations', form)
    return rest.data
  },
  remove: async (id) => {
    let rest = await axios.delete(`/api/organizations/${id}`)
    return rest.data
  },
  update: async (editData) => {
    let rest = await axios.put('/api/organizations', editData)
    return rest.data
  }
}
