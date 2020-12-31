<script>
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import cookie from "js-cookie"

const WooCommerce = new WooCommerceRestApi({
  url: 'https://mall.wp-china.org',
  consumerKey: cookie.get('consumer_key'),
  consumerSecret: cookie.get('consumer_secret'),
  version: 'was/v1'
});

export default {
  name: "Common.vue",
  WooCommerce
}
</script>
