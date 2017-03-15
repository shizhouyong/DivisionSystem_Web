<template>
  <modal :visible="visible" @close="close">
    <div class="box">
      <article class="media">
        <div class="media-content">
          <div class="content">
            <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
              <el-row :gutter="20">
                <el-col :span="12" :offset="6" class="sys_logo">
                  <img src="../assets/sys_logo.png" height="200" width="700">
                </el-col>
                <el-col :span="16" :offset="3">
                  <el-form-item label="学工号" prop="username">
                    <el-input type="number" v-model="ruleForm2.username" auto-complete="off" placeholder="请输入学工号"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="pass">
                    <el-input type="password" v-model="ruleForm2.pass" auto-complete="off" placeholder="请输入密码"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" :offset="5">
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm2')">登录</el-button>
                    <el-button @click="resetForm('ruleForm2')">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </article>
    </div>
  </modal>
</template>

<script>
import { Modal } from 'vue-bulma-modal'
import Store from './store'

export default {
  components: {
    Modal
  },

  props: {
    visible: Boolean
  },

  data() {

    var validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入学工号'));
      } else {
        if (this.ruleForm2.username !== '') {
          //this.$refs.ruleForm2.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm2.pass !== '') {
          //this.$refs.ruleForm2.validateField('checkPass');
        }
        callback();
      }
    };

    return {
      ruleForm2: {
        username: '',
        pass: ''
      },
      rules2: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    close () {
      this.$emit('close')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('http://127.0.0.1:8888/jg/user/login', {'number': this.ruleForm2.username, 'password': this.ruleForm2.pass}).then(response => {
            if (response.data.retCode === 0) {
                alert('登陆成功！');
                Store.save(response.data);
                Store.savePhone(response.data.telePhone);
                this.close();
            } else {
                alert('登陆失败！');
                this.resetForm('ruleForm2');
            }
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="scss">
  .sys_logo {
    margin-bottom: 20px;
    margin-top: 10px;
  }

</style>
