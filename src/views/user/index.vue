<template>
  <div>
    <!--工具条-->
    <section>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.username" placeholder="用户名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" circle @click="getUsers">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-circle-plus" circle @click="openDialog">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <div class="content-container">
        <el-table :data="userDate" highlight-current-row>
          <el-table-column label="用户id" prop="id"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="组织名称" prop="orgName"></el-table-column>
          <el-table-column label="操作" prop="id">
            <template slot-scope="scope">
              <el-button @click="removeUser(scope.row.id)" type="danger" circle>删除</el-button>
              <el-button type="primary" circle icon="el-icon-edit" @click="editUser(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-pagination
          layout="prev, pager, next" :total="total" style="float:right;" @current-change="pageChange">
        </el-pagination>
      </div>
    </section>
    <user-form :visible.sync="visible" :dialogStatus="dialogStatus" :title="title" @success="loadData"
               :editData="editData"></user-form>
  </div>
</template>
<script>
import UserForm from './form.vue'
import userApi from '@/api/user'

export default {
  components: {UserForm},
  name: 'userIndex',
  props: {
    orgId: {
      Type: Number
    }
  },
  watch: {
    orgId (val) {
      if (val) {
        this.checkId = this.orgId
      }
      this.loadData()
    }
  },
  data () {
    return {
      title: {
        update: '编辑页面',
        create: '新增页面'
      },
      checkId: 0,
      dialogStatus: '',
      filters: {
        username: ''
      },
      visible: false,
      userDate: [],
      editData: {
        orgId: null,
        orgName: null,
        id: null,
        username: null,
        password: null
      },
      total: 0,
      query: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    // async相当于异步请求
    // await 相当于等待调用
    async loadData () {
      let resp = await userApi.queryUserList(this.query, this.filters, this.checkId)
      this.userDate = resp.message.list
      console.log(resp)
      this.total = resp.message.total
      if (resp.status === 0) {
        console.log('查询成功')
      }
    },
    // 新增方法
    openDialog () {
      this.visible = true
      this.dialogStatus = 'create'
      this.editData = {
        orgId: null,
        orgName: null,
        id: null,
        username: null,
        password: null
      }
    },
    // 删除方法
    removeUser (id) {
      this.$confirm('确认删除该用户', '是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await userApi.remove(id)
        if (resp.status === 0) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
        this.loadData()
      }).catch(() => {
      })
    },
    // 编辑方法
    editUser (data) {
      this.dialogStatus = 'update'
      this.visible = true
      // 数据隔离
      this.editData.orgId = data.orgId
      this.editData.orgName = data.orgName
      this.editData.username = data.username
      this.editData.id = data.id
      this.editData.password = data.password
    },
    // 根据条件查询用户
    getUsers () {
      this.loadData()
    },
    pageChange (page) {
      this.query.pageIndex = page
      this.loadData()
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>

<style scoped>
  .content-container {
    margin-left: 30px;
  }
</style>
