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
            <a-input v-model:value="form.vendor_name" placeholder="商家名称" />
          </a-form-item>
<!--          <span>重要：这是客户购买您的产品时看到的名称。请慎重选择。</span>-->
          <a-form-item ref="vendor_description" label="您的公司和您卖的东西" name="vendor_description" :label-col="{span:8}"  :wrapper-col="{ span: 16}">
            <a-textarea
              v-model:value="form.vendor_description"
              placeholder="请描述一下您的公司和您卖的东西"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
          </a-form-item>
          <div style="text-align: center">
            <a-button type="primary" @click="onSubmit">
              注册
            </a-button>
            <a-button style="margin-left: 10px;" @click="resetForm">
              重置
            </a-button>
          </div>
        </a-form>
      </div>
    </a-card>
    </a-col>
  </a-row>
</template>
<script>
    import queryString from 'querystring';
    export default {
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
                  firstname: '244348846@qq.com',
                  lastname: '244348846@qq.com',
                  username: '244348846@qq.com',
                  email: '244348846@qq.com',
                  confirm_email: '244348846@qq.com',
                  vendor_name: '244348846@qq.com',
                  vendor_description: '244348846@qq.com',
              },
              rules: {
                  firstname: [
                      { required: true, message: '名字为必填项', trigger: 'blur' },
                      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
                  ],
                  lastname: [
                      { required: true, message: '名字为必填项', trigger: 'blur' },
                      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
                  ],
                  username: [
                      { required: true, message: '用户名为必填项', trigger: 'blur' },
                      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
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
                      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
                  ],
                  vendor_description: [
                      { required: true, message: '简介为必填项', trigger: 'blur' },
                      // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
                  ],
              },
          }
      },
      methods:{

          onSubmit() {
              this.$refs.ruleForm
                  .validate()
                  .then(() => {
                      const formData = new FormData();
                      formData.append('action','wc_product_vendors_registration')
                      formData.append('form_items',encodeURI(queryString.stringify(this.form)))

                      console.log('values', this.form);
                      this.axios.post('https://mall.wp-china.org/wp-admin/admin-ajax.php', formData,{ headers: {
                              'Content-Type': 'multipart/form-data'}}).then((response)=>{
                          console.log(response)
                      }).catch( res => {
                          console.log(res)
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
