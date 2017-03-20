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
                <el-button type="info" @click="updatePassword()">提交</el-button>
                <el-button @click="resetForm('ruleForm2')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </article>
      </div>
      <div class="tile is-parent is-4">
        <article class="tile is-child box">
          <h1 class="title">手机号</h1>
          <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
            <el-form-item
              label="手机号"
              prop="phone"
              :rules="[
                        { required: true, message: '手机号不能为空' }
                      ]">
              <el-input type="number" v-model.number="numberValidateForm.phone" auto-complete="off" :disabled="!showPhoneInput"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="toggleShowPhone()" v-if="!showPhoneInput">{{btnText}}</el-button>
              <el-button type="info" @click="updatePhone()" v-if="showPhoneInput">提交</el-button>
              <el-button @click="toggleShowPhone()" v-if="showPhoneInput">取消</el-button>
            </el-form-item>
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
import Store from '../store'

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
                showPhoneInput : false,
                btnText: '补充',
                ruleForm2: {
                  pass: '',
                  checkPass: ''
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
                  this.successMsg("密码更新成功！");
                  location.href = "http://localhost:8080";
              } else if (retCode === 65540){
                  this.errorMsg('密码更新失败：原密码错误！');
              } else {
                  this.errorMsg('密码更新失败！');
              }
            })
          },
          updatePhone: function () {
            var ss = Store.fetchSession()
            this.$http.post('http://division.backend:8888/jg/v/stu/phone/update?ss='+ss, {'telePhone': this.numberValidateForm.phone}).then(response => {
              var retCode = response.data.retCode;
              if (retCode === 0) {
                  Store.savePhone(this.numberValidateForm.phone);
                  this.showPhone();
                  this.showPhoneInput = !this.showPhoneInput;
                  this.successMsg("手机号更新成功！");
              } else if (retCode === 65540){
                  this.errorMsg("手机号更新失败！");
                  this.resetForm('numberValidateForm');
              } else {

              }
            });
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
          },
          showPhone() {
            let phone = Store.fetchPhone();
            if (phone === '' || phone === null || typeof(phone)=="undefined") {
              return;
            }
            this.btnText = "修改";
            this.numberValidateForm.phone = Store.fetchPhone();
          },
          toggleShowPhone() {
            this.showPhoneInput = !this.showPhoneInput;
          }
        },
        created: function() {
          this.showPhone();
        }
    }
</script>
