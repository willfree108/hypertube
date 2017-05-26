<template>
  <div class="appFlex">
    <el-row type="flex" justify="space-around" class="fullScreenResponsive">
      <el-card class="box-card appMarginBottom box-cardResponsive fullScreenResponsive" v-loading="loading" element-loading-text="Loading...">
        <div slot="header" class="clearfix tcenter">
          <span style="line-height: 36px;">{{ $t('signUp') }}</span>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="" class="demo-ruleForm form">
          <el-row type="flex" justify="space-around content" class="formImage">
            <el-col :span="8" :xs="24">
              <label v-if="!imageExist" for="file" class="label-file">Upload your avatar</label>
              <input v-if="!imageExist" id="file" class="input-file" type="file" accept="image/*" @change="upload($event)">
              <img v-if="imageExist" :src="ruleForm.avatar" alt="" class="label-file">
            </el-col>
            <el-col :span="12" class="formName">
                <el-form-item :label="$t('firstName')" prop="firstName" class="nowidth">
                  <el-input v-model="ruleForm.firstName" class="nowidth"></el-input>
                </el-form-item>
                <el-form-item :label="$t('lastName')" prop="lastName" class="nowidth">
                  <el-input v-model="ruleForm.lastName" class="nowidth"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
          <el-form-item :label="$t('email')" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item :label="$t('username')" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item :label="$t('password')" prop="password">
            <el-input type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('confirm')" prop="confirmPassword">
            <el-input type="password" v-model="ruleForm.confirmPassword" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item class="tright" :show-message="false">
            <el-button type="primary" @click="submitForm('ruleForm')">{{ $t('create') }}</el-button>
            <el-button @click="resetForm('ruleForm')">{{ $t('cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>

<script>

import {
  validateUsername,
  validateFirstName,
  validateLastName,
  validateEmail,
  validateCheckPassword,
  validateConfirmPassword
} from './../api/validate'

import axios from 'axios'

export default {
  data () {
    return {
      loading: false,
      ruleForm: {
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        avatar: ''
      },
      rules: {
        username: [{ validator: validateUsername.bind(this), trigger: 'blur,change' }],
        password: [{ validator: validateCheckPassword.bind(this), trigger: 'blur,change' }],
        confirmPassword: [{ validator: validateConfirmPassword.bind(this), trigger: 'blur,change' }],
        firstName: [{ validator: validateFirstName.bind(this), trigger: 'blur,change' }],
        lastName: [{ validator: validateLastName.bind(this), trigger: 'blur,change' }],
        email: [{ validator: validateEmail.bind(this), trigger: 'blur,change' }]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.ruleForm.avatar !== '') {
          axios.post('users', this.ruleForm)
            .then(res => {
              this.$router.push('/')
              this.$notify({
                showClose: true,
                message: this.$t('messageSuccessSignUp'),
                type: 'success'
              })
            })
            .catch(() => {
              this.$notify({
                showClose: true,
                message: this.$t('messageWarningExist'),
                type: 'error'
              })
            })
        } else if (!valid) {
          this.$notify({
            showClose: true,
            message: this.$t('messageWarningForm'),
            type: 'warning'
          })
        } else if (this.ruleForm.avatar === '') {
          this.$notify({
            showClose: true,
            message: this.$t('messageWarningImage'),
            type: 'warning'
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
      this.ruleForm.avatar = ''
      this.$refs[formName].resetFields()
    },
    upload (e) {
      var size = e.target.files[0].size / 1024

      if (size < 500) {
        var file = e.target.files[0]
        var reader = new FileReader()
        reader.addEventListener('load', () => {
          this.ruleForm.avatar = reader.result
        }, false)

        if (file) {
          reader.readAsDataURL(file)
        }
      } else {
        this.$notify({
          showClose: true,
          message: 'You exceed the limit of 500kb.',
          type: 'warning'
        })
      }
    }
  },
  computed: {
    imageExist () {
      return this.ruleForm.avatar !== ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  @media (max-width: 570px) {
    .box-cardResponsive, .formName {
        width: 100%;
        border: none;
        background-color: transparent;
        box-shadow: none;
    }
    .form {
        min-width:100%;
        height: 100%;
    }
    .formImage {
        display: block;
        width: 100%;
        height: 100%;
        z-index: 1;
    }
    .box-itemResponsive {
        margin-bottom: 40px;
    }
    .tright {
        text-align: center;
    }
    .fullScreenResponsive {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .label-file {
        width: 100% !important;
    }
    .label-file::before{
        left: 50% !important;
        transform: translateX(-15px);
    }
  }

   .formImage {
     padding-bottom: 15px;
   }

   .label-file {
      cursor: pointer;
      color: rgba(0,0,0, 0.2);
      font-weight: bold;
      text-align: center;
      display: block;
      height: 180px;
      width: 180px;
      border-radius: 20px;
      border: 1px dashed rgba(0,0,0, 0.2);
      position: relative;
      line-height:160px;
      font-size: smaller;
    }

    .label-file::before {
      content: '+';
      font-size: 30px;
      position: absolute;
      top:30px;
      left: 80px;
    }

    .label-file:hover {
      color: #00b1ca;
      border-color: rgba(37, 165, 196, 0.6);
    }
    .input-file {
      display: none;
    }
</style>
