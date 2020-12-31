<template>
  <a-modal v-model:visible="shopInfoVisible" title="Title" @ok="handleOk">
    <template v-slot:footer>
      <a-button key="back" @click="handleCancel">
        Return
      </a-button>
      <a-button key="submit" type="primary" :loading="shopInfoLoading" @click="handleOk">
        Submit
      </a-button>
    </template>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>
</template>

<script>
import Common from './Common';
export default {
  name: "ShopInfo",
  data() {
    return {

    };
  },
  methods: {

  },
  created() {
    console.log('老了老弟')
    Common.WooCommerce.get("products")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
  }
}
</script>

<style scoped>

</style>