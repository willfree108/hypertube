<template>
  <div class="appFlex">
    <el-row type="flex" justify="space-around" class="fullScreenResponsive">
      <el-card class="box-card appMarginBottom box-cardResponsive fullScreenResponsive" v-loading="loading" element-loading-text="Loading...">
        <div slot="header" class="clearfix tcenter">
          <span style="line-height: 36px;">{{ $t('signIn')}}</span>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="" class="demo-ruleForm form">
          <el-row type="flex" class="tcenter padbottom rowResponsive" justify="center">
            <el-col :span="4" class="colResponsive"><i id="github" class="fa fa-github strate colResponsive" aria-hidden="true" @click="changeStrate('github')"></i></el-col>
            <el-col :span="4" class="colResponsive"><i id="facebook" class="fa fa-facebook-square strate colResponsive" aria-hidden="true" @click="changeStrate('facebook')"></i></el-col>
            <el-col :span="4" class="colResponsive"><i id="google" class="fa fa-google-plus strate colResponsive" aria-hidden="true" @click="changeStrate('google')"></i></el-col>
            <el-col :span="4" class="colResponsive"><i id="42" class="fa fa-desktop strate " aria-hidden="true" @click="changeStrate('42')"></i></el-col>
          </el-row>
          <el-form-item :label="$t('username')" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item :label="$t('password')" prop="password">
            <el-input type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item class="tright">
            <el-button type="primary" @click="submitForm('ruleForm')">{{ $t('login')}}</el-button>
            <el-button @click="resetForm('ruleForm')">{{ $t('cancel')}}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { validateUsername, validatePassword } from './../api/validate'
import axios from 'axios'

export default {
  data () {
    return {
      loading: false,
      strate: 'local',
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ validator: validateUsername.bind(this), trigger: 'blur,change' }],
        password: [{ validator: validatePassword.bind(this), trigger: 'blur,change' }]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post('auth', this.ruleForm)
            .then(res => {
              if (res.status === 200) {
                this.$store.dispatch('signIn', res.data)
                this.$router.push('/Gallery')
                this.$notify({
                  showClose: true,
                  message: this.$t('messageSuccessSignIn'),
                  type: 'success'
                })
              } else {
                this.$notify({
                  showClose: true,
                  message: this.$t('messageWarningActivate'),
                  type: 'success'
                })
              }
            })
            .catch(() => {
              this.$notify({
                showClose: true,
                message: this.$t('messageError'),
                type: 'success'
              })
            })
        } else {
          this.$notify({
            showClose: true,
            message: this.$t('messageError'),
            type: 'error'
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    changeStrate (name) {
      if (name === '42') {
        window.location.href = 'http://localhost:8080/api/auth/42'
      } else if (name === 'facebook') {
        window.location.href = 'http://localhost:8080/api/auth/facebook'
      }
      document.getElementById('github').classList.remove('selected')
      document.getElementById('facebook').classList.remove('selected')
      document.getElementById('google').classList.remove('selected')
      document.getElementById('42').classList.remove('selected')
      document.getElementById(name).classList.add('selected')
      this.strate = name
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    @media (max-width: 570px) {
        .box-cardResponsive {
            border: none;
            background-color: transparent;
            box-shadow: none;
        }
        .form {
            min-width:100%;
        }
        .colResponsive {
            width: 50%;
        }
        .tright {
            text-align: center;
        }
        .fullScreenResponsive {
            width: 100%;
            height: 100%;
            overflow: auto;
        }
    }

    .strate {
        height: 30px;
        width: 30px;
        border: 1px dashed rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        line-height: 10px;
        line-height: 28px;
        cursor: pointer;
    }

    .padbottom {
        margin-bottom: 20px;
    }

    .selected {
        border-color: #20a0ff;
    }
</style>
