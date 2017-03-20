<template>
  <modal :visible="visible" @close="close">
    <article class="tile is-child box">
      <div class="block">
        <h4 class="title header-left">分流调整</h4>
        <el-form :label-position="labelPosition" :model="adjustForm" ref="adjustForm" label-width="140px" class="demo-dynamic" :rules="adminRules">
          <el-row :gutter="24">
            <el-col :span="22" :offset="1">
              <el-col :span="12">
                <el-form-item label="学号" prop="number">
                  <el-input v-model="adjustForm.number" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="adjustForm.name" :disabled="true"/>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="22" :offset="1">
              <el-col :span="12">
                <el-form-item label="专业" prop="newMajorId">
                  <el-select v-model="adjustForm.newMajorId" placeholder="请选择专业" @change="getClasses">
                    <el-option
                      v-for="newMajor in newMajors"
                      :label="newMajor.name"
                      :value="newMajor.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="班级" prop="newClassId">
                  <el-select v-model="adjustForm.newClassId" placeholder="请选择班级">
                    <el-option
                      v-for="newClass in newClasses"
                      :label="newClass.name"
                      :value="newClass.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8" :offset="8">
              <el-form-item class="el-form-item-my">
                <el-button type="info" @click="submitForm('adjustForm')">提交</el-button>
                <el-button @click="resetForm('adjustForm')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </article>
  </modal>
</template>
<script>
import Store from '../store'
import { Modal } from 'vue-bulma-modal'
export default {
  components: {
    Modal
  },
  props: {
    visible: Boolean,
    adjustForm: Object,
    newMajors: Array,
    newClasses: Array
  },
  data() {
    return {
      labelPosition: 'top',
      adminRules: {
        name: [
          {  required: true, message: '姓名不能为空！', trigger: 'blur' }
        ],
        number: [
          {  type: 'number', required: true, message: '工号不能为空！', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var ss = Store.fetchSession();
          this.$http.post('http://division.backend:8888/jg/v/operation/shunt/adjust?ss=' + ss,
            {'number': this.adjustForm.number,'newMajor':this.adjustForm.newMajorId,'newClass':this.adjustForm.newClassId}).then(response => {
              if (response.data.retCode === 0) {
                  this.successMsg('保存成功！');
                  this.$emit('close')
              } else {
                  this.errorMsg('保存失败！')
              }
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getClasses: function () {
      var ss = Store.fetchSession();
      this.adjustForm.newClassId = null
      this.$http.post('http://division.backend:8888/jg/v/operation/newClass/list?ss=' + ss, {'newMajor': this.adjustForm.newMajorId}).then(response => {
          this.newClasses = response.data.newClasses
      })
    },
    successMsg(msg) {
      this.$notify({
        title: '成功',
        message: msg,
        type: 'success'
      });
    },
    errorMsg(msg) {
      this.$notify.error({
        title: '错误',
        message: msg
      });
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">

  .table-responsive {
    display: block;
    width: 100%;
    min-height: .01%;
    overflow-x: auto;
  }
  .tile.is-child {
    width: 100%;
  }

  .collapse_header {
    margin-bottom: 10px;
  }

  .pagination {
    position: relative;

  }
  .pagination li{
    display: inline-block;
    margin:0 5px;
  }
  .pagination li a{
    padding:.5rem 1rem;
    display:inline-block;
    border:1px solid #ddd;
    background:#fff;
    color:#1ACBA3;
  }
  .pagination li a:hover{
    background:#eee;
  }
  .pagination li.active a{
    background:#1ACBA3;
    color:#fff;
  }

  .el-form-item-my {
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .el-select {
    width: 100%;
  }

</style>

