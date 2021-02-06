<template>
  <div v-if="pageDisable">
    <a-card style="margin: 10px 0; border:1px solid #ddd">
      <p style="margin-bottom: 5px;">
        插件价格：
        <a-radio-group  @change="searchPriceChange" default-value="0" >
          <a-radio-button value="0">
            全部
          </a-radio-button>
          <a-radio-button value="1">
            付费
          </a-radio-button>
          <a-radio-button value="2">
            免费
          </a-radio-button>
        </a-radio-group>
      </p>
      <p style="margin-bottom: 5px;">
        排序方式：
        <a-radio-group default-value="a" @change="searchSortChange">
          <a-radio-button value="a">
            更新日期
          </a-radio-button>
          <a-radio-button value="b">
            价格
          </a-radio-button>
          <a-radio-button value="c">
            销量
          </a-radio-button>
        </a-radio-group>
      </p>
      <div class="hot-label-container">
        热门标签：
          <a-tag v-for="item in labelList" :key="item.id" :color=" selectedLabelIds.indexOf(item.id) > -1 ?  'blue' : ''" @click="hotLabelTagClick(item.id)" >
            {{item.name}}
          </a-tag>
      </div>
    </a-card>

  <a-skeleton :loading="loading" active/>
  <a-skeleton :loading="loading" active/>
  <a-skeleton :loading="loading" active/>

  <a-row :gutter="[10, 10]" type="flex">
    <a-col
        v-for="(shop, i) in shops"
        :key='shop'
        :xxl="8"
        :xl="12"
        :lg="12"
        :md="24"
        :xs="24"
    >
      <a-spin tip="下单中" :spinning="shop.spinning">
        <a-card style="border: 1px solid #ddd;" body-style="border-bottom: 1px solid #ddd;">
          <div style="display: flex;justify-content: space-between">
            <div style="width: 140px">
              <a-card-meta>
                <template v-slot:avatar>
                  <a-avatar shape="square" :size="128" :src="shop.thumbnail"/>
                </template>
              </a-card-meta>
            </div>
            <div class="card-title-content-container">
                <div class="card-title-container" v-html="shop.name"></div>
                <div style="
                min-height: 70px;
                height: 70px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;"
                     v-html="shop.short_description">
                </div>
              <div class="card-author-container">开发者：<a>{{ shop.author && shop.author.name ? shop.author.name : shop.sold_by}}</a></div>
            </div>
            <div style="width: 120px;text-align: center">
              <div>
                <span v-if="shop.price==='0' || shop.price===''" style="font-size: 18px; color: #093;">免费</span>
                <span v-else style="font-size: 18px; color: #d93d2e;">￥{{ shop.price }}</span>
              </div>
              <a-button
                  v-if="shop.price==='0' || shop.price===''"
                  style="margin-top: 5px; margin-bottom: 5px;"
                  :type="shop.action_text === '启用' ? 'primary' :'default'"
                  shape="round"
                  :size="100"
                  @click="action(shop,i)"
                  :disabled="shop.action_text === '已启用'"
                  :loading="buttonLoadingIds.indexOf(shop.id) > -1"
              >
                <template v-slot:icon>
                  <CloudDownloadOutlined v-if="shop.action_text === '安装'"/>
                  <SettingOutlined v-if="shop.action_text === '启用'"  />
                  <LikeOutlined v-if="shop.action_text === '已启用'"  />
                  {{ shop.action_text }}
                </template>
              </a-button>
              <a-button
                v-else
                style="margin-top: 5px; margin-bottom: 5px;"
                shape="round"
                :size="100"
                @click="newOrder(i)"
              >
                <template v-slot:icon>
                  <ShoppingOutlined/>
                  购买
                </template>
              </a-button>
              <div>
                <a-button type="link" @click="showModal(shop,i)">
                  查看详情
                </a-button>
              </div>
            </div>
          </div>
          <template v-slot:actions>
            <a-rate :value="shop.average_rating" disabled/>
            <div style="line-height: 24px;">{{ shop.total_count }}活跃安装</div>
            <div style="line-height: 24px;">{{ shop.date_modified }}前更新</div>
          </template>
        </a-card>
      </a-spin>
    </a-col>
  </a-row>
    <div style="text-align: right;margin-top: 10px" v-if="!loading">
      <a-pagination :disabled="paginationDisable" @change=loadPageData :total="shopTotal"
                    :show-total="total => `共 ${total} 个项目`" :page-size="12" v-model:current="page"/>
    </div>
  <!--  modal  -->
    <a-modal :bodyStyle="{ paddingTop: '0px',padding:0 }" :mask=false :closable=false width="800px"
             v-model:visible="shopInfoVisible" @ok="handleOk">

        <div class="dialogHead" :style="{backgroundImage: 'url('+ detailData.banner +')'}" v-if="detailData.banner">
          <div class="dialogHead-title">{{detailData.name}}</div>
        </div>

        <div v-else class="dialogHead-title-noImage">{{detailData.name}}</div>

       <Detail :detailData="detailData" />

      <template v-slot:footer>
      <a-button key="back" @click="handleCancel">
        关闭
      </a-button>
      <a-button key="submit" type="primary" :loading="buttonLoadingIds.indexOf(detailData.id) > -1" @click="action(detailData,detailData.index)" :disabled="detailData.action_text === '已启用'">
  <!--      <ShoppingOutlined/>-->
        <CloudDownloadOutlined v-if="detailData.action_text === '安装'"/>
        <SettingOutlined v-if="detailData.action_text === '启用'"  />
        <LikeOutlined v-if="detailData.action_text === '已启用'"  />
        {{ detailData.action_text }}
      </a-button>
    </template>
    </a-modal>
    <a-modal :mask="payment" :footer="null" :visible="false" title="支付宝扫码支付" @ok="handleOk">
      <p>这里是支付宝支付二维码……</p>
    </a-modal>
  </div>
</template>

<script>
import {
  ShoppingOutlined,
  CloudDownloadOutlined,
    SettingOutlined ,
    LikeOutlined,
} from '@ant-design/icons-vue';
import {Modal, notification} from 'ant-design-vue';

import Common from '@/components/Common';
import queryString from 'querystring';
import { getQueryVariable } from '@/utils/utils.ts';
import Detail from '@/components/Detail'

export default {
  components: {
    ShoppingOutlined,
    CloudDownloadOutlined,
      SettingOutlined ,
      LikeOutlined,
      Detail,
  },
  name: "Plugins",
  data() {
    return {
      shops: null,
      shopTotal: 0,
      searchPrice:'0',
      page: 1,
      loading: true,
      buttonLoadingIds:[],
      paginationDisable: false,
      shopInfoLoading: false,
      shopInfoVisible: false,
      payment: false,
      new_order: false,
      pageDisable:true,
      labelList:[],
      selectedLabelIds:[],
      searchQuery:'',
      detailData:{
        name:''
      },
    };
  },
    methods: {
    action(product_data,index) {
        this.buttonLoadingIds.push(product_data.id)
        if (product_data.action_text === '启用'){
            window.top.location.href = product_data.activate_url;
        }else{
            this.axios.post('/wp-json/wcy/v1/plugins/install', {
                slug: product_data.slug,
                downloadLink: product_data.download_url
            }, {headers: {
                    'X-WP-Nonce': getQueryVariable('_wpnonce')
                }}).then((response) => {
                if (response.data.success) {
                    this.shops[index].action_text = '启用';
                    this.shops[index].activate_url = response.data.data.activateUrl;
                    if(this.shopInfoVisible){
                        this.detailData.action_text = '启用';
                        this.detailData.activate_url = response.data.data.activateUrl;
                    }
                    notification.success({
                        message: '安装成功',
                        description:'',
                    });
                }
                this.buttonLoadingIds.splice(this.buttonLoadingIds.indexOf(product_data.id),1);
            }).catch((e) => {
                console.log(e);
                this.buttonLoadingIds.splice(this.buttonLoadingIds.indexOf(product_data.id),1);
            })
        }
    },
    newOrder(i) {
      this.shops[i].spinning = true;
      // 下单
      const data = {
        payment_method: "alipay",
        payment_method_title: "支付宝",
        line_items: [
          {
            product_id: this.shops[i].id,
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

            this.shops[i].spinning = false;

            console.log(response.data);
          })
          .catch((error) => {
            console.log(error.response.data);
          });
    },
    handleClick() {
      this.loading = !this.loading;
    },
   showModal(data,index) {
        console.log(data);
      this.detailData= {...data,index};
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

    loadPageData() {
      this.loading = true;
      this.paginationDisable = true;
      this.shops = null;

        this.axios.get('/wp-json/wcy/v1/plugins', {headers: {
                'X-WP-Nonce': getQueryVariable('_wpnonce')
            }}).then((response) => {

            if (response.data.success) {
              // 获取热门标签
              this.axios.get('https://mall.wp-china.org/wp-json/was/v1/products/tags?order=desc&orderby=count').then((data)=>{
                this.labelList=data.data;
              })
                this.cookie.set('consumer_key',response.data.data.appstore_key.consumer_key);
                this.cookie.set('consumer_secret',response.data.data.appstore_key.consumer_secret);
                const params = {
                    page: this.page,
                    per_page:12,
                    category:15,
                };
              // 插件价格
              if(this.searchPrice === '1'){
                params.min_price=0.01;
              }
              if(this.searchPrice==='2'){
                params.max_price=0.01;
              }

                queryString.stringify(params)
                Common.WooCommerce.get("products/?" + queryString.stringify(params)+this.searchQuery)
                    .then((all) => {
                        const shops = all.data;
                        const plugins = response.data.data.plugins;
                        const actives = response.data.data.actives;
                        shops.forEach((shop)=>{
                            if (plugins[shop.slug]) { // 如果用户已经安装了该产品
                                shop.action_text = '启用';
                                shop.activate_url = plugins[shop.slug].activate_url;
                                if (actives.indexOf(shop.slug) > -1) { // 如果用户已经启用了该产品
                                    shop.action_text = '已启用';
                                    shop.not_activate = true;
                                }
                            } else {
                                shop.action_text = '安装';
                            }
                        })
                      this.shops = shops;
                      this.shopTotal = all.headers['x-wp-total'];
                      this.loading = false;
                      this.paginationDisable = false;
                    }).catch((error) => {
                        console.log(error.response.data);
                    });
            }else{
                this.pageDisable=false;
                Modal.info({
                    title: '初次访问请先授权当前站点访问本土应用市场',
                    content:'',
                    width:'450px',
                    okText:'前往授权',
                    onOk() {
                        window.top.location.href = response.data.data.auth_url;
                    },
                });
            }
        })
    },

    searchPriceChange(e){
      this.searchPrice=e.target.value
      this.page=1;
      this.loadPageData();
    },
      searchSortChange(e){
        console.log(e);
        // this.searchPrice=e.target.value
        // this.page=1;
        // TODO 调用接口
    },

    hotLabelTagClick(id){
      if(this.selectedLabelIds.indexOf(id) >-1){
        this.selectedLabelIds.splice(this.selectedLabelIds.indexOf(id),1);
      }else{
        this.selectedLabelIds.push(id);
      }
      // TODO 调用查询
    },
      pageReload(query){
        this.searchQuery=query;
       this.loadPageData();
      }
  },

  created() {
    this.loadPageData();
  }
}
</script>

<style scoped>
.card-title-content-container{
  width: calc(100% - 220px);
}
  .card-title-container{
    font-size: 16px;
    font-weight: 500;
    color: #000000;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .card-author-container{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .dialogHead{
    height: 250px;
    width: 800px;
    background-repeat: round;
  }
  .dialogHead-title{
    position: relative;
    font-family: "Helvetica Neue",sans-serif;
    display: inline-block;
    font-size: 24px;
    line-height: 1.68;
    box-sizing: border-box;
    max-width: 100%;
    padding: 0 15px;
    margin-top: 200px;
    color: #fff;
    background: rgba(30,30,30,.9);
    text-shadow: 0 1px 3px rgba(0,0,0,.4);
    box-shadow: 0 0 30px rgba(255,255,255,.1);
    border-radius: 8px;
    margin-left: 20px;
  }
  .dialogHead-title-noImage{
    padding: 20px 10px;
    border: 1px solid #f0f0f0;
    font-size: 24px;
    font-weight: 600;
    color: #000;
  }
  :global(.ant-tabs-bar){
    margin:0 !important;;
  }
  :global(.ant-modal-confirm .ant-modal-confirm-btns){
    float: none;
    text-align: center;
  }
  .hot-label-container{
    line-height: 32px;
  }
  :global(.hot-label-container .ant-tag){
    padding: 4px 8px !important;
    cursor: pointer;
    font-size: 14px !important;
    margin-bottom: 8px;
    background: #ffffff;
  }
:global(.hot-label-container .ant-tag:hover){
  padding: 4px 8px !important;
  cursor: pointer;
  color:#1890ff;
  font-size: 14px !important;
  margin-bottom: 8px;
}

</style>
