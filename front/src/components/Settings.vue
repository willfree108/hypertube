<template>
  <div class="appFlex">
    <el-row type="flex" justify="space-around" class="fullScreenResponsive">
      <el-card class="box-card appMarginBottom box-cardResponsive fullScreenResponsive" v-loading="loading" element-loading-text="Loading...">
        <div slot="header" class="clearfix tcenter">
          <span style="line-height: 36px;">{{ ruleForm.username + ' - ' + $t('settings') }}</span>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="" class="demo-ruleForm form">
          <el-row type="flex" justify="space-around content" class="formImage">
            <el-col :span="8" :xs="24" class="sett">
              <label for="file" class="label-file">{{ $t('avatar') }}</label>
              <input id="file" class="input-file" type="file" accept="image/*" @change="upload($event)">
              <img v-if="imageExist" :src="ruleForm.avatar" alt="" class="label-file settings">
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
          <el-form-item :label="$t('language')">
            <el-select v-model="formInline.region" @change='changeLang($event)'>
              <el-option label="en" value="en"></el-option>
              <el-option label="fr" value="fr"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="tright">
            <el-button type="primary" @click="submitForm('ruleForm')">{{ $t('update') }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import {
  validateFirstName,
  validateLastName,
  validateUsername,
  validateEmail
  // validateLocal
} from './../api/validate'

import axios from 'axios'

var toggle = function (a, b, classA, classB) {
  a.classList.remove(classA)
  a.classList.add(classB)
  b.classList.remove(classB)
  b.classList.add(classA)
}

export default {
  data () {
    return {
      loading: false,
      formInline: {
        region: 'en'
      },
      ruleForm: {
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        avatar: ''
      },
      rules: {
        username: [{ validator: validateUsername.bind(this), trigger: 'blur,change' }],
        firstName: [{ validator: validateFirstName.bind(this), trigger: 'blur,change' }],
        lastName: [{ validator: validateLastName.bind(this), trigger: 'blur,change' }],
        email: [{ validator: validateEmail.bind(this), trigger: 'blur,change' }]
        // local: [{ validator: validateLocal.bind(this), trigger: 'blur,change' }]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.ruleForm.avatar !== '') {
          this.ruleForm.local = this.formInline.region
          axios.put('users', this.ruleForm)
            .then(() => {
              this.$notify({
                showClose: true,
                message: this.$t('messageSuccessUpdate'),
                type: 'success'
              })
            })
            .catch(() => {
              this.$notify({
                showClose: true,
                message: this.$t('messageEror'),
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
    },
    changeLang (value) {
      this.$i18n.locale = this.formInline.region
      let eng = document.getElementById('en')
      let fr = document.getElementById('fr')
      if (this.$i18n.locale === 'fr') {
        toggle(eng, fr, 'langSelect')
      } else {
        toggle(fr, eng, 'langSelect')
      }
    }
  },
  computed: {
    imageExist () {
      return this.ruleForm.avatar !== ''
    }
  },
  mounted () {
    this.ruleForm = this.$store.getters.GET_USER
    this.formInline.region = this.ruleForm.local
    this.$i18n.locale = this.formInline.region
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
   .formImage {
     padding-bottom: 15px;
   }
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
    z-index: 10;
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

    .settings {
      position: relative;
      top: -180px;
      z-index: 1;
    }

    .sett {
      height: 180px;
    }
</style>
