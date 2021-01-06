<template>
  <a-skeleton :loading="loading" active/>
  <a-skeleton :loading="loading" active/>
  <a-skeleton :loading="loading" active/>
  <a-table v-if="!loading" :columns="tableColumns" :data-source="userData" bordered>
    <template #product_name="{ text, record, index }">
      <div class="list-item-title-container">{{text}}</div>
      <div style="display: flex">
        <div >
          <a-spin :spinning="installLoadingIds.indexOf(record.product_id) > -1">
            <template #indicator>
              <loading-outlined  style="font-size: 16px" spin />
            </template>
            <a style="width: 45px; display: block; float: left;text-align: center;" v-if="record.action_text !== '已启用'" @click="action(record,index)">{{record.action_text}}</a>
            <span v-else>已启用</span>
            <a-divider type="vertical" />
          </a-spin>
        </div>
        <div style="width: 90px; text-align: center">
          <a @click="showActivationCode(record)">激活码({{record.product_order_api_keys.length}}个)</a>
        </div>
        <div>
          <a-spin :spinning="detailLoadingIds.indexOf(record.product_id) > -1">
            <template #indicator>
              <loading-outlined  style="font-size: 18px" spin />
            </template>
          <a-divider type="vertical" />
          <a @click="getDetailByProductId(record.product_id)"> 详情</a>
          </a-spin>
          <!--
          <a-divider type="vertical" />
          <a>演示</a>
          -->
        </div>
      </div>
    </template>
    <template #product_short_description="{text}">
      <div class="list-item-content-container">
        {{ text}}
      </div>
    </template>
  </a-table>

    <a-modal :bodyStyle="{ paddingTop: '0px',padding:0 }" :mask=false :closable=false width="800px"
             v-model:visible="shopInfoVisible">
      <div class="dialogHead" :style="{backgroundImage: 'url('+ detailData.banner +')'}" v-if="detailData.banner">
        <div class="dialogHead-title">{{detailData.name}}</div>
      </div>

      <div v-else class="dialogHead-title-noImage">{{detailData.name}}</div>
      <Detail :detailData="detailData" />
      <template v-slot:footer>
        <a-button key="back" @click="handleCancel">
          关闭
        </a-button>
      </template>
    </a-modal>
    <a-modal :title="false" v-model:visible="activationCodeDialog" :mask=false width="630px">
      <a-table
        :columns="columns"
        :data-source="codeData"
        bordered style="margin-top: 20px;min-height: 430px"
        size="small"
        :rowKey="(row)=>row.key"
      >
      </a-table>
      <template #footer>
        <div>
          <a-button key="submit" type="primary" @click="cancelCodeDialog()">
            关闭
          </a-button>
        </div>
      </template>
    </a-modal>

</template>
<script>
import Common from "@/components/Common";
import { getQueryVariable } from '../utils/utils.ts';
import { notification } from 'ant-design-vue';
import Detail from "./Detail";
import queryString from "querystring";
import { LoadingOutlined } from '@ant-design/icons-vue';
const tableColumns = [
    {
        dataIndex: 'product_name',
        key: 'product_name',
        title: '名称',
        width:'220px',
        slots: { customRender: 'product_name' },
    },
    {
        title: '详情',
        dataIndex: 'product_short_description',
        key: 'product_short_description',
        slots: { customRender: 'product_short_description' },
    },

];

const columns = [
    {
        dataIndex: 'key',
        title: '激活码',
        key: 'key',
        align:'center'
    },
    {
        dataIndex: 'activationsTotal',
        title: '允许激活次数',
        key: 'activationsTotal',
        width:'120px',
        align:'center'
    },
    {
        dataIndex: 'active',
        title: '已激活次数',
        key: 'active',
        width:'120px',
        align:'center'
    },
]
export default {
  name: "Account",
  components:{
      Detail,
      LoadingOutlined,
  },
  data() {
    return {
      columns,
      tableColumns,
      codeData:[],
      page:1,
      loading: true,
      userData: [],
      shopInfoVisible:false,
      detailData:{},
      activationCodeDialog:false,
      installLoadingIds:[],
        detailLoadingIds:[],
  };
  },
  methods: {
      action(product_data,index) {
      if ('启用' === product_data.action_text) {
        window.top.location.href = product_data.activate_url;
      } else {
          this.installLoadingIds.push(product_data.product_id)
          this.axios.post('/wp-json/wcy/v1/plugins/install', {
          slug: product_data.product_slug,
          downloadLink: product_data.download_url
        }, {headers: {
            'X-WP-Nonce': getQueryVariable('_wpnonce')
          }}).then((response) => {
            if (response.data.success) {
                notification.success({
                    message: '安装成功',
                    description:'',
                });
                this.userData[index].action_text = '启用';
                this.userData[index].activate_url = response.data.data.activateUrl;
            }
              this.installLoadingIds.splice(this.installLoadingIds.indexOf(product_data.product_id),1);
        }).catch((response) => {
            console.log(response);
              this.installLoadingIds.splice(this.installLoadingIds.indexOf(product_data.product_id),1);
        })
      }
    },
      cancelCodeDialog(){
        this.activationCodeDialog=false;
      },
      showActivationCode(item){
          console.log(item)
          const data= [];
          item.product_order_api_keys.forEach((ele)=>{
            data.push({
                key:ele.product_order_api_key,
                activationsTotal:ele.activations_total === '0' ?  '无限制' :ele.activations_total,
                active:ele.active,
            })
          })
          this.codeData = data;
          this.activationCodeDialog=true;
      },
      getDetailByProductId(id){

          this.detailLoadingIds.push(id);
          Common.WooCommerce.get(`products/${id}`)
          .then((response) => {
              this.detailData = response.data;
              this.detailLoadingIds.splice(this.detailLoadingIds.indexOf(id),1);
              this.shopInfoVisible=true;
          })
      },
      handleCancel(){
          this.shopInfoVisible=false;
      },
    loadPageData() {
      this.loading = true;

        const params = {
            page: 1,
            per_page:1,
        };
        queryString.stringify(params)
      Common.WooCommerce.get("account/?"+ queryString.stringify(params))
          .then((account) => {
            const userData = account.data;

            this.axios.get('/wp-json/wcy/v1/plugins', {headers: {
              'X-WP-Nonce': getQueryVariable('_wpnonce')
            }}).then((response) => {
              if (response.data.success) {
                  const plugins = response.data.data.plugins;
                  const actives = response.data.data.actives;
                  userData.forEach((element)=>{
                      if (plugins[element.product_slug]) {
                          element.action_text = '启用';
                          element.activate_url = plugins[element.product_slug].activate_url;
                          if (actives.indexOf(element.product_slug) > -1) { // 如果用户已经启用了该产品
                              element.action_text = '已启用';
                              element.not_activate = true;
                          }
                      }else {
                          element.action_text = '安装';

                      }
                  })
                  this.userData = userData;
                  this.dataTotal = account.headers['x-wp-total'];
              } else {
                console.log(response.data.data.errorMessage)
              }
              this.loading = false;
            }).catch((e) => {
              console.log(e);
            })

          })
          .catch((error) => {
            console.log(error.response.data);
          });
    }
  },

  created() {
    this.loadPageData();
  }
};
</script>
<style scoped>
  :global(.ant-divider,.ant-divider-vertical){
    margin: 0 4px !important;
  }
  .list-item-container{
    border-bottom: 1px solid #f0f0f0;
    margin: 10px 0;
    padding-bottom: 10px;
  }
  .list-item-title-container{
    margin-bottom: 4px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 15px;
    line-height: 22px;
    width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #000000;
  }
  .list-item-content-container{
    height: 48px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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
    color: #000;
  }

</style>
