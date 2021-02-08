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
  <a-tabs v-if="true" v-model:activeKey="activeKey" @change="tabChange" >
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
            <a-select-option value="vendor">
              供应商名称
            </a-select-option>
          </a-select>
          <a-select v-if="searchType==='vendor'" style="width: 200px" placeholder="请选择供应商..." show-search :filter-option="filterOption" @change="inputPressEnter" allowClear>
            <a-select-option v-for="item in supplierList" :key="item.id" :value="item.name">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-input v-model:value="searchInput" style="width: 200px" :placeholder="'搜索'+getPlaceholder()+'...'" @pressEnter="inputPressEnter(null,null)" v-else />
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
      searchInput:'',
      supplierList:[],
    };
  },
  created() {
    this.getSupplierList();
  },

  methods:{
    filterOption(input,option){
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
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
      inputPressEnter(data,option){
        if( this.$refs[this.activeKey] ) {
          this.$refs[this.activeKey].pageReload(`&${this.searchType}=${data ? option.key : this.searchInput}`);
        }
      },
      getSupplierList(){
        this.axios.get('https://appstore.wp-china-yes.cn/wp-json/wp/v2/product-vendors?_fields=id,count,name,slug&search=test').then((data)=>{
          this.supplierList=data.data;
        })
      },

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
  :global(.ant-tabs-bar){
    border: 1px solid #ddd !important;
  }
</style>
