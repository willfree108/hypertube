<template>
  <div class="appFlex">
    <el-row type="flex" justify="space-around" class="fullScreenResponsive">
      <el-card class="box-card appMarginBottom box-cardResponsive fullScreenResponsive" v-loading="loading" element-loading-text="Loading...">
        <div slot="header" class="clearfix tcenter">
          <span style="line-height: 36px;">{{ ruleForm.username }}</span>
        </div>
        <el-form label-width="" class="demo-ruleForm form grey">
          <el-row type="flex" justify="space-around content formImage">
            <el-col :span="8" :xs="24">
              <label v-if="!imageExist" for="file" class="label-file">{{ $t('avatar') }}</label>
              <img v-if="imageExist" :src="ruleForm.avatar" alt="" class="label-file">
            </el-col>
            <el-col :span="12" class="formName">
                <el-form-item :label="$t('firstName')" prop="firstName" class="nowidth" :show-message="false">
                  <el-input v-model="ruleForm.firstName" class="nowidth" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item :label="$t('lastName')" prop="lastName" class="nowidth" :show-message="false">
                  <el-input v-model="ruleForm.lastName" class="nowidth" :disabled="true"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      loading: false,
      value9: [4, 8],
      value: 0,
      ruleForm: {
        firstName: '',
        lastName: '',
        username: '',
        avatar: ''
      }
    }
  },
  computed: {
    imageExist () {
      return this.ruleForm.avatar !== ''
    }
  },
  beforeMount () {
    axios.get('users/' + this.$route.params.id)
      .then(res => {
        if (res.data.firstName) this.ruleForm = res.data
        else this.$router.push('/')
      })
      .catch(() => {
        this.$router.push('/')
      })
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

   .formImage {
     padding-bottom: 15px;
   }

   .label-file {
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

    .input-file {
        display: none;
    }

    .grey {
      color: rgba(0,0,0, 0.2);
    }

</style>
