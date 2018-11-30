<template>
  <div>
    <el-dialog :title="title[dialogStatus]" width="600px" :visible.sync="show">
      <div>
        <el-form ref="forms" label-width="100px" :model="editData" :rules="rule">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="editData.username"></el-input>
          </el-form-item>
          <el-form-item label="组织id" prop="orgId" :hidden="true">
            <el-input v-model="editData.orgId"></el-input>
          </el-form-item>
          <el-form-item label="选择机构" prop="orgId">
            <el-cascader
              :props="treeRoles"
              :options="options"
              :show-all-levels="false"
              change-on-select
              @change="createList">
            </el-cascader>
          </el-form-item>
          <el-form-item label="密码" prop="password" :hidden="this.disabled">
            <el-input v-model="editData.password" :disabled="this.disabled"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click.native="show=false">取消</el-button>
        <el-button v-if="dialogStatus==='update'" type="primary" @click="editUser">确认修改</el-button>
        <el-button v-else type="primary" @click="saveUser">确认添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from '../../api/user'
import sysApi from '../../api/organization'

export default {
  name: 'forms',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editData: {
      Type: Array,
      required: true
    },
    dialogStatus: {
      Type: String,
      required: true
    },
    title: {
      Type: Map,
      required: true
    }
  },
  watch: {
    show (val) {
      if (!val) {
        this.$emit('update:visible', val)
        this.options = [{
          orgId: '100038',
          orgName: '普元总部',
          children: []
        }]
      }
    },
    visible (val) {
      if (val) {
        this.show = this.visible
      }
    },
    dialogStatus (val) {
      if (val === 'create') {
        this.$set(this.rule, 'password', this.password)
        this.$set(this.rule, 'orgId', this.orgId)
        this.disabled = false
      } else {
        this.disabled = true
        this.$delete(this.rule, 'password', this.password)
        this.$delete(this.rule, 'orgId', this.orgId)
      }
    }
  },
  data () {
    return {
      options: [{
        orgId: '100038',
        orgName: '普元总部',
        children: []
      }],
      optionId: null,
      show: this.visible,
      disabled: false,
      password: {required: true, trigger: '', message: '密码不能为空！'},
      orgId: {required: true, trigger: '', message: '组织不能为空'},
      rule: {
        username: [
          {required: true, trigger: '', message: '请输入姓名！'}
        ]
      },
      treeRoles: {
        value: 'orgId',
        label: 'orgName',
        children: 'children'
      }
    }
  },
  methods: {
    // 懒加载下拉选
    async createList (val) {
      if (val) {
        this.optionId = val[val.length - 1]
        this.editData.orgId = this.optionId
        let resp = await sysApi.queryOrgs(val[val.length - 1])
        if (resp.message.length > 0) {
          if (val.length === 1) {
            this.options[0].children = resp.message
          }
          if (val.length === 2) {
            this.options[0].children.forEach((items, index) => {
              if (this.optionId === items.orgId) {
                this.$set(items, 'children', resp.message)
              }
            })
          }
          if (val.length === 3) {
            this.options[0].children.forEach((items, index) => {
              if (items.children) {
                items.children.forEach((itemss, index) => {
                  if (this.optionId === itemss.orgId) {
                    this.$set(itemss, 'children', resp.message)
                  }
                })
              }
            })
          }
        }
      }
    },
    // 新增
    saveUser () {
      this.$refs.forms.validate(async valid => {
        if (valid) {
          let resp = await userApi.create(this.editData)
          if (resp.status === 0) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.show = false
            this.$emit('success')
          }
        }
      })
    },
    // 编辑
    editUser () {
      this.$refs.forms.validate(async valid => {
        if (valid) {
          debugger
          let resp = await userApi.update(this.editData)
          if (resp.status === 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.show = false
            this.$emit('success')
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
