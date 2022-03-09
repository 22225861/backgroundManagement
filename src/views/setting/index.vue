<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog=true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column type="index" align="center" label="序号" width="120" />
              <el-table-column prop="name" align="center" label="角色名称" width="240" />
              <el-table-column prop="description" align="center" label="描述" />
              <el-table-column label="操作" align="center">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                layout="prev,pager,next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.companyPhone" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCancel" >
      <el-form  ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input  v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input  v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small"  @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary"  @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      },
      formData: {
        name: '湖北天门教育科技有限公司',
        companyAddress: '湖北省天门市马湾镇',
        companyPhone: '12154562023',
        remarks: '做不一样的教育平台'
      },
      showDialog: false, // 控制弹层显示
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRoleList() // 获取角色列表
    // this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      // newPage 是当前点击的页码
      this.page.page = newPage // 将当前页码赋值给当前的最新页码
      this.getRoleList()
    },
    // 获取接口的公司信息
    // async getCompanyInfo() {
    //   this.formData = await getCompanyInfo(this.companyId)
    // }
    async deleteRole(id) {
      console.log(id)
      // 提示
      try {
        await this.$confirm('确认删除该角色吗')
        // 只有点击了确定 才能进入到下方
        await deleteRole(id) // 调用删除接口
        await this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (e) {
        console.log(e)
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id) // 数据回写
      this.showDialog = true // 显示弹层
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        // 校验通过 才会执行下方内容
        // roleForm 有id就是编辑 没有就是新建
        if (this.roleForm.id) {
          // 编辑
          await updateRole(this.roleForm)
        } else {
          // 新建
          await addRole(this.roleForm)
        }
        // 重新拉取数据
        await this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false // 关闭弹层 => 触发el-dialog的close事件
      } catch (e) {
        console.log('校验失败')
      }
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.showDialog = false
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  }
}
</script>

<style>

</style>
