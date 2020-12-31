<template>
  <a-row>
    <a-col
      :xxl="{span:9, offset:7}"
      :xl="{span:11, offset:6}"
      :lg="{span:13, offset:5}"
      :md="{span:15, offset:4}"
      :sm="{span:17, offset:3}"
      :xs="24"
    >
    <a-card title="供应商入驻">
      <a-spin :spinning="loading">
      <div>
        <a-form
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-item ref="firstname" label="名字" name="firstname">
            <a-input v-model:value="form.firstname" placeholder="名字"/>
          </a-form-item>
          <a-form-item ref="lastname" label="姓氏" name="lastname">
            <a-input v-model:value="form.lastname" placeholder="姓氏" />
          </a-form-item>
          <a-form-item ref="username" label="登陆用户名" name="username">
            <a-input v-model:value="form.username" placeholder="登陆用户名" />
          </a-form-item>
          <a-form-item ref="email" label="电子信箱" name="email">
            <a-input v-model:value="form.email" placeholder="电子信箱" />
          </a-form-item>
          <a-form-item ref="confirm_email" label="确认邮件地址" name="confirm_email">
            <a-input v-model:value="form.confirm_email" placeholder="确认邮件地址" />
          </a-form-item>
          <a-form-item ref="vendor_name" label="商家名称" name="vendor_name">
            <a-input v-model:value="form.vendor_name" placeholder="商家名称">
              <template #suffix>
                <a-tooltip title="这是客户购买您的产品时看到的名称。请慎重选择。">
                  <info-circle-outlined style="color: rgba(0,0,0,.45)" />
                </a-tooltip>
              </template>
            </a-input>
          </a-form-item>
<!--          <span>重要：这是客户购买您的产品时看到的名称。请慎重选择。</span>-->
          <a-form-item ref="vendor_description" label="商家介绍" name="vendor_description">
            <a-textarea
              v-model:value="form.vendor_description"
              placeholder="请描述一下您的公司和您卖的东西"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
          </a-form-item>
          <div style="text-align: center">
            <a-button type="primary" @click="onSubmit" shape="round">
              注册
            </a-button>
            <a-button style="margin-left: 10px;" @click="resetForm" shape="round">
              重置
            </a-button>
          </div>
        </a-form>
      </div>
      </a-spin>
    </a-card>
    </a-col>
  </a-row>
</template>
<script>
    import {InfoCircleOutlined} from '@ant-design/icons-vue'
    import queryString from 'querystring';
    import {notification} from "ant-design-vue";

    export default {
      components:{
          InfoCircleOutlined
      },
      data(){
          let validateEmail = async () => {
                  if (this.form.confirm_email !== '') {
                      this.$refs.ruleForm.validateField('confirm_email');
                  }
                  return Promise.resolve();
          };
          let validateEmail2 = async (rule, value) => {
              if (value !== this.form.email) {
                  return Promise.reject("确认邮件地址不正确");
              } else {
                  return Promise.resolve();
              }
          }
          return{
              labelCol: { span: 5 },
              wrapperCol: { span: 16 },
              form: {
                  firstname: '',
                  lastname: '',
                  username: '',
                  email: '',
                  confirm_email: '',
                  vendor_name: '',
                  vendor_description: '',
              },
              rules: {
                  firstname: [
                      { required: true, message: '名字为必填项', trigger: 'blur' },
                  ],
                  lastname: [
                      { required: true, message: '名字为必填项', trigger: 'blur' },
                  ],
                  username: [
                      { required: true, message: '用户名为必填项', trigger: 'blur' },
                  ],
                  email: [
                      { required: true, message: '电子信箱为必填项', trigger: 'blur' },
                      { type: 'email', message: '电子信箱格式不正确', trigger: 'blur' },
                      { validator:validateEmail, trigger: 'blur' },

                  ],
                  confirm_email: [
                      { required: true, message: '请确认电子信箱', trigger: 'blur' },
                      { type: 'email', message: '电子信箱格式不正确', trigger: 'blur' },
                      { validator:validateEmail2, trigger: 'blur' },
                  ],
                  vendor_name: [
                      { required: true, message: '商家名称为必填项', trigger: 'blur' },
                  ],
                  vendor_description: [
                      { required: true, message: '简介为必填项', trigger: 'blur' },
                  ],
              },
              loading:false,
          }
      },
      methods:{

          onSubmit() {
              this.$refs.ruleForm
                  .validate()
                  .then(() => {
                      const formData = new FormData();
                      formData.append('action','wc_product_vendors_registration')
                      formData.append('form_items',queryString.stringify(this.form))

                      this.loading=true;
                      this.axios.post('https://mall.wp-china.org/wp-admin/admin-ajax.php', formData,{ headers: {
                              'Content-Type': 'multipart/form-data'}}).then((response)=>{
                          if(response.data === 'success'){
                              notification.success({
                                  message: '提交成功',
                                  description:'',
                              });
                          }
                          this.loading=false;
                      }).catch( res => {
                          console.log(res)
                          this.loading=false;
                      })
                  })
                  .catch(error => {
                      console.log('error', error);
                  });
          },
          resetForm() {
              this.$refs.ruleForm.resetFields();
          },
      }

  }
</script>
