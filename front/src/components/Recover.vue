<template>
  <div class="appFlex ">
    <el-row type="flex" justify="space-around" class="fullScreenResponsive">
      <el-card class="box-card appMarginBottom box-cardResponsive fullScreenResponsive" v-loading="loading" element-loading-text="Loading...">
        <div slot="header" class="clearfix tcenter">
          <span style="line-height: 36px;">{{ $t('recover') }}</span>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="" class="demo-ruleForm form ">
          <el-form-item class="box-itemResponsive" :label="$t('email')" prop="email">
            <el-input v-model="ruleForm.email" @keyup.enter.stop.prevent></el-input>
          </el-form-item>
          <el-form-item class="tright">
            <el-button type="primary" @click="submitForm('ruleForm')">{{ $t('send') }}</el-button>
            <el-button @click="resetForm('ruleForm')">{{ $t('cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { validateEmail } from './../api/validate'
import axios from 'axios'

export default {
  data () {
    return {
      loading: false,
      ruleForm: {
        email: ''
      },
      rules: {
        email: [{ validator: validateEmail.bind(this), trigger: 'blur,change' }]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post('recover', this.ruleForm)
            .then(() => {
              this.$router.push('/')
              this.$notify({
                showClose: true,
                message: this.$t('messageSuccessRecover'),
                type: 'success'
              })
            })
            .catch(() => {
              this.$notify({
                showClose: true,
                message: this.$t('messageWarningRecover'),
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
