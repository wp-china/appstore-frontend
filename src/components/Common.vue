<script>
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

const WooCommerce = new WooCommerceRestApi({
  url: 'https://mall.wp-china.org',
  consumerKey: 'ck_7142e56337599f361dc8ce1b5f60632b4621dca7',
  consumerSecret: 'cs_629d1344f4b86a0e3b8c4ad01f66736b2479e451',
  version: 'was/v1'
});


export default {
  name: "Common.vue",
  WooCommerce
}
</script>