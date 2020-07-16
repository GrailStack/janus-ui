<template>
  <div class="login">
    <div class="login-box">
      <div class="title">
        <span class="logo"><img src="../images/logo.svg" alt=""></span>
        <!--<span v-if="isShowTwoCode">请使用公司邮箱密码登录</span>-->
      </div>
      <el-form class="login-form" :model="loginViewModel" id="login-form" :rules="loginViewModelRules" ref="loginViewForm" auto-complete="off">
        <el-form-item prop="userName" label="用户名">
          <el-input type="text" v-model="loginViewModel.userName" auto-complete="off" placeholder="请输入用户名">
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input id="password" type="password" v-model="loginViewModel.password" placeholder="请输入用户密码"  @keyup.enter.native="login">
          </el-input>
        </el-form-item>
        <!-- <div class="is-admin">
          <el-checkbox v-model="isUserAdmin">是否是管理员</el-checkbox>
        </div> -->
        <el-form-item class="submit-form">
          <el-button class="submit" @click="loginBtn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  name: 'LoginIndexPage',
  data () {
    return {
      // form model
      loginViewModel: {
        userName: '',
        password: ''
      },
      loginViewModelRules: {
        userName: {required: true, message: '请输入用户名', trigger: 'change'},
        password: {required: true, message: '请输入用户密码', trigger: 'change'}
      }
    }
  },
  created () {
  },
  methods: {
    loginBtn: function () {
      let self = this
      this.$refs.loginViewForm.validate(valid => {
        if (valid) {
          self.$http.post('/admin/login', this.loginViewModel).then((res) => {
            console.log(1233,res)
            if (res && res.token) {
                self.$message.success('登录成功')
              localStorage.setItem('JANUS-TOKEN', res.token);
              setTimeout(()=>{this.$router.push({path: '/dashboard'})},1000)
            }
            // if (res.data.code === 200) {
            //   sessionStorage.setItem('login', 'show')
            //   this.$router.push({path: '/desktop'})
            // } else {
            //   self.$message({message: res.data.message, type: 'error'})
            // }
          }).catch(() => {
            // self.$message({message: '未登录！', type: 'error'})
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../styles/login.page.less";
</style>
<style lang="less">
@import "../styles/login.page.reset.less";
</style>
