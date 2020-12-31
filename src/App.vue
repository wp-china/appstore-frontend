<template>
  <a-layout style="background: transparent">
    <a-layout-header style="height: 52px; line-height: 52px; background: white; padding: 0 0;">
      <div style="display: flex;justify-content:space-between;width: 100%">
        <a-menu
          theme="white"
          mode="horizontal"
          v-model:selectedKeys="selectedKeys"
          style="height: 50px; line-height: 50px;"
          class="menu"
        >
          <a-menu-item key="1">
            <router-link to="/">
              插件
            </router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link to="/themes">
              主题
            </router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <router-link to="/account">
              已购
            </router-link>
          </a-menu-item>
          <a-menu-item key="4">
            <router-link to="enter">
              入驻
            </router-link>
          </a-menu-item>
        </a-menu>
        <div style="margin-top: 10px;width: 360px">
          <a-input-group compact v-if="selectedKeys[0] ==='1' || selectedKeys[0] ==='2'">
            <a-select default-value="1" style="width: 110px">
              <a-select-option value="1">
                {{getPlaceholder()}}名
              </a-select-option>
              <a-select-option value="2">
                {{getPlaceholder()}}slug
              </a-select-option>
              <a-select-option value="3">
                供应商名称
              </a-select-option>
            </a-select>
            <a-input style="width: 67%" :placeholder="'搜索'+getPlaceholder()+'...'"/>
          </a-input-group>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content style="padding: 0 0;">
      <div style="margin: 10px 0">
        此应用市场由<a href="https://wp-china.org" target="_blank" rel="noopener noreferrer" title="WP中国本土化社区">WP中国本土化社区</a>维护，系开源、公益、中立之项目，对开发者及用户双向免费，提供此平台意在繁荣国内WordPress之生态。
      </div>
      <div :style="{ paddingTop: '10px', minHeight: '400px' }">
        <router-view></router-view>
      </div>
    </a-layout-content>
    <!--
    <a-layout-footer style="background: transparent; padding: 0 0;">
      <h2>赞助商</h2>
      项目所有资金及资源需求均由赞助商及用户捐助，以下列出项目主要赞助者：
      <p>
        <a-card :bodyStyle="{padding: '10px'}">
          <a-space>
            <img loading="lazy" src="https://a0.wp-china-yes.net/wp-content/uploads/2020/08/weixiaoduo-logo-2020-300x134.png" width="120" height="50" alt="" class="wp-image-968 alignnone size-medium">
            <img loading="lazy" src="https://a0.wp-china-yes.net/wp-content/uploads/2020/10/1599017171-a6e6e4152170cfe-300x111.png" width="120" height="50" alt="" class="wp-image-1181 alignnone size-medium">
          </a-space>
        </a-card>
      </p>
    </a-layout-footer>
    -->
  </a-layout>
</template>
<script>
import QueryString from 'querystring'

export default {
  data() {
    return {
      selectedKeys: ['1'],
    };
  },
  created() {
    const store_url = 'https://mall.wp-china.org';
    const endpoint = '/wc-auth/v1/authorize';
    const params = {
      app_name: '挑大粪的啦',
      scope: 'read_write',
      user_id: 123,
      return_url: 'http://app.com/return-page',
      callback_url: 'https://app.com/callback-endpoint'
    };
    const query_string = QueryString.stringify(params).replace(/%20/g, '+');

    console.log(store_url + endpoint + '?' + query_string);

  },
  methods:{
      getPlaceholder(){
          return this.selectedKeys[0] === '1' ? '插件' : '主题';
      }
  }
};
</script>
<style scoped>
  :global(.ant-menu-horizontal){
     border: none !important;
  }
</style>
