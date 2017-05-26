<template>
  <div class="appFlex">
    <el-row type="flex" justify="space-around" class="fullScreenResponsive">
      <el-card class="box-card appInit appMarginBottom box-cardResponsive fullScreenResponsive" v-loading="loading" element-loading-text="Loading...">
        <div slot="header" class="clearfix tcenter">
          <span style="line-height: 36px;">{{ $t("initialization") }}</span>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="" class="demo-ruleForm form">
          <el-form-item class="box-itemResponsive" :label="$t('newPassword')" prop="password">
            <el-input type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item class="box-itemResponsive" :label="$t('confirm')" prop="confirmPassword">
            <el-input type="password" v-model="ruleForm.confirmPassword" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item class="tright">
            <el-button type="primary" @click="submitForm('ruleForm')">{{ $t("send") }}</el-button>
            <el-button @click="resetForm('ruleForm')">{{ $t("cancel") }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { validateCheckPassword, validateConfirmPassword } from './../api/validate'
import axios from 'axios'

export default {
  data () {
    return {
      loading: false,
      ruleForm: {
        password: '',
        confirmPassword: ''
      },
      rules: {
        password: [{ validator: validateCheckPassword.bind(this), trigger: 'blur' }],
        confirmPassword: [{ validator: validateConfirmPassword.bind(this), trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post('save', { password: this.ruleForm.password, recoverToken: this.$route.params.token })
            .then(() => {
              this.$notify({
                showClose: true,
                message: this.$t('messageSuccessInit'),
                type: 'success'
              })
            })
            .catch(() => {
              this.$notify({
                showClose: true,
                message: this.$t('messageWarningInit'),
                type: 'warning'
              })
            })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
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
        margin-top: 0px;
    }
    .form {
        min-width:100%;
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
}
</style>
