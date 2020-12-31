<script>
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import cookie from "js-cookie"

const getConsumerKey = () => {
    return  cookie.get('consumer_key');
}
const getConsumerSecret = () => {
    return  cookie.get('consumer_secret');
}
const WooCommerce = new WooCommerceRestApi({
  url: 'https://mall.wp-china.org',
  consumerKey: getConsumerKey,
  consumerSecret: getConsumerSecret,
  version: 'was/v1'
});

export default {
  name: "Common.vue",
  WooCommerce
}
</script>
