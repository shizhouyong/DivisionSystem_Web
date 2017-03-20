<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-4">
        <article class="tile is-child box">
          <h3 class="title">修改密码</h3>
          <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="60px" class="demo-ruleForm">
            <el-col :span="20" :offset="2">
              <el-form-item label="原密码" prop="pass">
                <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16" :offset="4">
              <el-form-item>
                <el-button type="info" @click="submitForm('ruleForm2')">提交</el-button>
                <el-button @click="resetForm('ruleForm2')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </article>
      </div>
    </div>
  </div>
</template>
<style>

</style>
<script>
import Vue from 'vue'
import Message from 'vue-bulma-message'

    export default{

        data(){
            var validatePass = (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入原密码'));
              } else {
                if (this.ruleForm2.checkPass !== '') {
                  this.$refs.ruleForm2.validateField('checkPass');
                }
                callback();
              }
            };
            var validatePass2 = (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'));
              } else if (value === this.ruleForm2.pass) {
                callback(new Error('两次输入密码一致!'));
              } else {
                callback();
              }
            };
            return{
                ruleForm2: {
                  pass: '',
                  checkPass: '',
                  phone: ''
                },
                rules2: {
                  pass: [
                    { validator: validatePass, trigger: 'blur' }
                  ],
                  checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                  ]
                },
                numberValidateForm: {
                  phone: ''
                }
            };
        },
        methods: {
          updatePassword: function () {
            var ss = Store.fetchSession()
            this.$http.post('http://division.backend:8888/jg/v/user/password/update?ss='+ss, {'oldPassword': this.ruleForm2.pass, 'newPassword': this.ruleForm2.checkPass}).then(response => {
              var retCode = response.data.retCode;
              if (retCode === 0) {
                  alert("密码更新成功！");
                  this.open3();
                  location.href = "http://localhost:8080";
              } else if (retCode === 65540){
                  alert("原密码错误");
              }
            })
          },
          openUpdatePwdMessage (msg) {
            if (msg === 'success') {
              openMessage({
                title : '消息',
                message : '添加成功!',
                type : type
              })
            } else {
              openMessage({
                title : '消息',
                message : msg,
                type : type
              })
            }
          },
          submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                alert('submit!');
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

