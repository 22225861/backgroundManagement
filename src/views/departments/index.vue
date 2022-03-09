<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 头部-->
      <el-card class="tree-card">
        <tree-tools :tree-node="company" :is-root='true' @addDepts='addDepts' />
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <tree-tools slot-scope="{ data }" @editDepts='editDepts' :tree-node="data" @delDepts='getDepartments' @addDepts='addDepts'/>
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹层组件-->
    <AddDept ref='addDept' :show-dialog.sync='showDialog' :tree-node='node' @addDepts='getDepartments'></AddDept>
  </div>
</template>

<script>
import treeTools from '@/views/departments/components/tree-tools'
import AddDept from '@/views/departments/components/add-dept'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

export default {
  components: {
    treeTools,
    AddDept
  },
  data() {
    return {
      company: { name: '湖北天门教育科技股份有限公司', manager: '负责人', id: '' }, // 头部数据结构
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      node: null,
      showDialog: false // 默认不显示弹层
    }
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      // this.company = { name: result.companyName, manager: '负责人' }
      this.departs = tranListToTreeData(result.depts, '') // 需要将其转化为树形结构
    },
    // node是点击的部门
    addDepts(node) {
      this.showDialog = true
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true // 弹出层
      this.node = node
      this.$refs.addDept.getDepartDetail(node.id)
    }
  },
  created() {
    this.getDepartments()
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
