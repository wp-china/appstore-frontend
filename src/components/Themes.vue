<template>
  <a-row :gutter="[16, 16]">
    <a-col :style="{paddingTop: 0}">
      <a-card>
        <p style="margin-bottom: 5px;">
          主题价格：
          <a-radio-group :value="a" @change="onChange">
            <a-radio-button value="a">
              全部
            </a-radio-button>
            <a-radio-button value="b">
              免费
            </a-radio-button>
            <a-radio-button value="c">
              付费
            </a-radio-button>
            <a-radio-button value="d">
              含免费
            </a-radio-button>
          </a-radio-group>
        </p>
        <p style="margin: 0;">
          主题分类：
          <a-radio-group :value="a" @change="onChange">
            <a-radio-button value="a">
              全部
            </a-radio-button>
            <a-radio-button value="b">
              ooxx
            </a-radio-button>
            <a-radio-button value="c">
              ooxx
            </a-radio-button>
            <a-radio-button value="d">
              ooxx
            </a-radio-button>
          </a-radio-group>
        </p>
      </a-card>
    </a-col>
  </a-row>
  <a-row :gutter="[16, 16]">
    <a-col :style="{textAlign: 'right'}">
      <a-pagination :current="2" :total="500" />
    </a-col>
  </a-row>
  <a-row :gutter="[16, 16]">
    <a-col
        style="min-width: 554px;"
        :span="8"
    >
      <a-card hoverable style="width: 300px">
        <template #cover>
          <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        </template>
        <template class="ant-card-actions" #actions>
          <span style="color: red;">￥100</span>
          <span>在线演示</span>
          <span>购买</span>
        </template>
        <a-card-meta title="aaaaaaa" description="This is theme.This is theme.This is theme.This is theme.This is theme.">
        </a-card-meta>
        <p style="margin-top: 5px; margin-bottom: 0;">
          开发者：<a>X某某</a>
        </p>
      </a-card>
    </a-col>
  </a-row>
  <a-row :gutter="[16, 16]">
    <a-col :style="{textAlign: 'right'}">
      <a-pagination :current="2" :total="500" />
    </a-col>
  </a-row>

  <a-modal :bodyStyle="{ paddingTop: '0px' }" :mask=false :closable=false width="800px" v-model:visible="shopInfoVisible" @ok="handleOk">
    <template v-slot:footer>
      <a-button key="back" @click="handleCancel">
        关闭
      </a-button>
      <a-button key="submit" type="primary" :loading="shopInfoLoading" @click="handleOk">
        <ShoppingOutlined /> 购买
      </a-button>
    </template>
    <a-tabs @change="callback">
      <a-tab-pane key="1" tab="描述">
        Content of Tab Pane 1
        Content of Tab Pane 1
        Content of Tab Pane 1
        Content of Tab Pane 1
        Content of Tab Pane 1
        Content of Tab Pane 1
        Content of Tab Pane 1
        Content of Tab Pane 1
        Content of Tab Pane 1
        Content of Tab Pane 1
        Content of Tab Pane 1
        Content of Tab Pane 1
        Content of Tab Pane 1
      </a-tab-pane>
      <a-tab-pane key="2" tab="截图">
        Content of Tab Pane 2
      </a-tab-pane>
      <a-tab-pane key="3" tab="安装">
        Content of Tab Pane 2
      </a-tab-pane>
      <a-tab-pane key="4" tab="修订历史">
        Content of Tab Pane 3
      </a-tab-pane>
      <a-tab-pane key="5" tab="评价">
        Content of Tab Pane 3
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import {
  ShoppingOutlined
} from '@ant-design/icons-vue';

export default {
  components: {
    ShoppingOutlined
  },
  name: "Plugins",
  data() {
    return {
      loading: false,
      shopInfoLoading: false,
      shopInfoVisible: false,
    };
  },
  methods: {
    handleClick() {
      this.loading = !this.loading;
    },
    showModal() {
      this.shopInfoVisible = true;
    },
    handleOk() {
      this.shopInfoLoading = true;
      setTimeout(() => {
        this.shopInfoVisible = false;
        this.shopInfoLoading = false;
      }, 3000);
    },
    handleCancel() {
      this.shopInfoVisible = false;
    },
    callback(key) {
      console.log(key);
    },
  },
}
</script>

<style scoped>

</style>