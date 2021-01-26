<template>
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
  <a-tabs v-if="true" v-model:activeKey="activeKey" @change="tabChange">
    <a-tab-pane key="plugins" tab="插件">
      <page-header-title />
      <Plugins ref="plugins" />
    </a-tab-pane>
    <a-tab-pane key="themes" tab="主题">
      <page-header-title />
      <Themes  ref="themes"/>
    </a-tab-pane>
    <a-tab-pane key="account" tab="已购">
      <page-header-title />
      <Account  ref="account"/>
    </a-tab-pane>
    <a-tab-pane key="enterSupplier" tab="入驻">
      <page-header-title />
     <EnterSupplier  ref="enterSupplier"/>
    </a-tab-pane>
    <template #tabBarExtraContent>
      <div style="margin-top: 10px;width: 360px">
        <a-input-group compact v-if="activeKey ==='plugins' || activeKey ==='themes'">
          <a-select default-value="search" style="width: 120px" v-model:value="searchType">
            <a-select-option value="search">
              {{getPlaceholder()}}名
            </a-select-option>
            <a-select-option value="slug">
              {{getPlaceholder()}}slug
            </a-select-option>
            <a-select-option value="3">
              供应商名称
            </a-select-option>
          </a-select>
          <a-select v-if="searchType==='3'" style="width: 200px" placeholder="请选择供应商...">
            <a-select-option value="Option2-1">
              Option2-1
            </a-select-option>
            <a-select-option value="Option2-2">
              Option2-2
            </a-select-option>
          </a-select>
          <a-input v-model:value="searchInput" style="width: 200px" :placeholder="'搜索'+getPlaceholder()+'...'" @pressEnter="inputPressEnter" v-else />
        </a-input-group>
      </div>
    </template>
  </a-tabs>
</template>

<script>
import Account from '@/views/Account.vue';
import Plugins from '@/views/Plugins.vue';
import EnterSupplier from '@/views/EnterSupplier.vue';
import Themes from '@/views/Themes.vue';
import PageHeaderTitle from '@/components/PageHeaderTitle.vue';

export default {
  components: {
    Themes,
    Account,
    Plugins,
    EnterSupplier,
    PageHeaderTitle,
  },
  data() {
    return {
      selectedKeys: ['1'],
      activeKey:'plugins',
      searchType:'search',
      searchInput:''
    };
  },
  created() {

  },
  methods:{
      getPlaceholder(){
          return this.activeKey === 'plugins' ? '插件' : '主题';
      },
      tabChange(key){
        this.searchInput='';
        this.searchType='search';
        if( this.$refs[key] ) {
          this.$refs[key].pageReload('');
        }
      },
      inputPressEnter(){
        if( this.$refs[this.activeKey] ) {
          this.$refs[this.activeKey].pageReload(`&${this.searchType}=${this.searchInput}`);
        }
      }
  },
  watch:{
    searchType(){
      this.searchInput='';
    }
  }
};
</script>
<style scoped>
  :global(.ant-menu-horizontal){
     border: none !important;
  }
  :global(.ant-tabs-bar){
    background-color: #FFF !important;
    height: 52px;
  }
  :global(.ant-tabs-nav .ant-tabs-tab){
    padding: 16px !important;
  }
</style>
