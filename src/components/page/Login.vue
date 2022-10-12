<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form :model="param" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="账号">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              placeholder="密码"
              v-model="param.password"
              @keyup.enter.native="login()">
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="login()">登录</el-button>
        </div>
        <p class="login-tips">Tips : 公告栏</p>
      </el-form>
    </div>
  </div>
</template>

<script>

import service from "@/utils/request";
import axios from 'axios';

const api = require("@/utils/api")

export default {
  data: function () {
    return {
      param: {
        username: '',
        password: '',
      }
    };
  },
  created() {
    this.checkLogin()
  },
  methods: {
    login() {
      service.post(api.login,
          {
            username: this.param.username,
            password: this.param.password
          })
          .then((res) => {
            this.$message.success('登录成功');
            localStorage.setItem('ms_username', this.param.username);
            this.$router.push('/dashboard');
          });
    },
    checkLogin() {
      axios.get(api.checkLogin).then((res) => {
        if (res.status === 200) {
          this.$router.push('/dashboard');
        }
      }).catch(err=>{
      });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: 100%;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>