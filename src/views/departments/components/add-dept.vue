<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- native修饰符 可以找到原生元素的事件-->
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 遍历选项-->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }

  },
  data() {
    const checkNameRepeat = async(rule, value, callback) => {
      // value 是部门名称 要去和同级部门下的部门去比较 有没有相同的 有相同的 不能过 / 不相同的可以过
      const { depts } = await getDepartments()
      // 去找同级部门下 有没有和value相同的数据
      // 找到所有的子部门
      let isRepeat = false
      if (this.formData.id) {
        // 有id 就是编辑模式
        // 编辑的数据 在数据库里面有 同级部门下，我的名字不能和其他同级部门的名字重复
        // 首先要找到我的同级部门 this.formData.id 就是我当前的id 我的pid是 this.formData.pid
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 没有id就是新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // isRepeat为true 表示找到了一样的名字
      isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 新增模式
        // 要求编码 和所有的部门编码都不能重复 由于历史数据有可能没有code所以说这里加一个强制性条件 就是value值不能为空
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? callback(new Error(`组织架构下已经存在这个${value}编码`)) : callback()
    }
    return {
      // 定义一个表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门长度为1-50个字符', trigger: 'blur' }, {
            trigger: 'blur', validator: checkNameRepeat
          }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' }, {
          trigger: 'blur', validator: checkCodeRepeat
        }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍为1-300个字符', trigger: 'blur' }]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 获取详情办法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
      // 因为是父组件调用子组件方法 先设置了node数据 直接调用方法
      // props 传值是异步的
    },
    btnOK() {
      // 手动校验表单
      console.log(this.$refs.deptFrom)
      this.$refs.deptForm.validate(async isOk => {
        if (isOk) {
          if (this.formData.id) {
            // 编辑
            await updateDepartments(this.formData)
          } else {
            // 表单校验通过
            // 将id设成我的pid
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 告诉父组件
          this.$emit('addDepts') // 触发一个自定义事件
          // 此时应该去修改showDialog
          // update: props 名称
          this.$emit('update:showDialog', false)
        }
      })
    },
    btnCancel() {
      // // 清除校验
      // this.$refs.deptForm.resetFields() // 重置校验字段
      // // 关闭弹层
      // this.$emit('update:showDialog', false)
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 清除之前的校验  可以重置数据 只能重置 定义在data中的数据
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
