<template>
  <a-modal :visible="noticeVisible" :closable="false" width="600px">
    <template #title>
      <div style="text-align: center">购买须知</div>
    </template>
    <div v-html="shopNoticeText"></div>
    <template v-slot:footer>
      <div style="text-align: center">
        <a-button type="primary" size @click="doPurchase" :loading="noticeModalLoading">同意</a-button>
        <a-button @click="cancelNoticeModal" :loading="noticeModalLoading">不同意</a-button>
      </div>
    </template>
  </a-modal>
</template>
<script>
import Common from '@/components/Common';
import queryString from 'querystring';
export default {

  components: {
  },
  name: "NoticeModal",
  props: {
    shopDetail: {
      default: null,
      type: Object,
    }
  },
  data() {
    return {
      noticeVisible:false,
      noticeModalLoading:false,
      shopNoticeText:'',
    }
  },
  methods:{
    getShopNoticeText(){
      this.axios.get('https://appstore.wp-china-yes.cn/wp-content/uploads/appstore/json/buy-clause.json').then((data)=>{
        this.shopNoticeText = data.data.text;
      })
    },
    doPurchase(){
      this.noticeModalLoading=true;
      // 下单
      const data = {
        payment_method: "alipay",
        payment_method_title: "支付宝",
        line_items: [
          {
            product_id: this.shopDetail.id,
            quantity: 1
          }
        ]
      };

      Common.WooCommerce.post("orders", data)
          .then((response) => {
            // 换取支付宝支付网关URL
            const params = {
              key: response.data.order_key,
              return_url: window.location.protocol + '//' + window.location.host + '/wp-admin/admin.php?page=wp-china-yes1%2Fwp-china-yes.php&appstore_path=account'
            };
            var paymentWindow = window.open();
            paymentWindow.location.href = 'https://mall.wp-china.org/checkout/order-pay/' + response.data.id + '?' + queryString.stringify(params);
            this.cancelNoticeModal();
          })
          .catch((error) => {
            console.log(error.response.data);
          });
    },
    cancelNoticeModal(){
      this.noticeModalLoading=false;
      this.noticeVisible=false;
    },
  },
  watch:{
    noticeVisible(){
      this.getShopNoticeText();
    }
  },
}
</script>
