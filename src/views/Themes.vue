<template>

      <a-card style="margin: 10px 0">
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

  <a-skeleton :loading="loading" active/>
  <a-skeleton :loading="loading" active/>
  <a-skeleton :loading="loading" active/>

  <div class="themes-all-container">
    <a-row :gutter="[24, 24]">
      <a-col
          :xxl="6"
          :xl="6"
          :lg="8"
          :md="8"
          :xs="12"
          v-for="item in themesList"
          :key="item"
      >
        <a-card hoverable class="themes-item-container">
          <template #cover>
            <div class="img_div">
              <img
                  alt="example"
                  style="width: 100%;height: 240px"
                  :src="item.thumbnail"
              />
              <a href="#">
                <div class="mask">
                  <span class="more-details">详情&预览</span>
                </div>
              </a>
            </div>
          </template>
          <div class="themes-item-bottom-container">
            <div class="themes-item-title">{{item.name}}</div>
            <div :class="buttonLoadingKeys.indexOf(item.id) > -1 ? '' : 'themes-item-handle-button-css'">
              <a-button
                  v-if="item.price==='0' || item.price===''"
                  style="margin-right: 10px"
                  :type="item.action_text === '启用' ? 'primary' :'default'"
                  :size="100"
                  :disabled="item.action_text === '已启用'"
                  @click="themesHandle(item)"
                  :loading="buttonLoadingKeys.indexOf(item.id) > -1"
              >
                {{ item.action_text }}
              </a-button>
              <a-button v-else>
                ￥{{ item.price }} 购买
              </a-button>
              <a-button>
                预览
              </a-button>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <div style="text-align: right;margin-top: 10px" v-if="!loading">
      <a-pagination  @change=getThemesList :total="shopTotal" :show-total="total => `共 ${total} 个项目`" :page-size="12" v-model:current="page"/>
    </div>
  </div>


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
  ShoppingOutlined,
} from '@ant-design/icons-vue';
import queryString from "querystring";
import Common from "@/components/Common";
import {getQueryVariable} from "@/utils/utils.ts";
export default {
  components: {
    ShoppingOutlined,
  },
  name: "Plugins",
  data() {
    return {
      shopInfoLoading: false,
      shopInfoVisible: false,

      loading: false,
      themesList:[],
      shopTotal: 0,
      page:1,
      searchQuery:'',
      buttonLoadingKeys:[],

    };
  },
  methods: {
    themesHandle(data){
      console.log(data);
      // 增加loading
      this.buttonLoadingKeys.push(data.id);
    },
    getThemesList(){
      this.themesList=[];
      this.loading=true;

      this.axios.get('/wp-json/wcy/v1/themes', {headers: {
          'X-WP-Nonce': getQueryVariable('_wpnonce')
        }}).then((response) => {
          if(response.data.success){
            const params = {
              page:this.page,
              per_page:12,
              category:17,
            };
            Common.WooCommerce.get("products/?" + queryString.stringify(params)+this.searchQuery)
                .then((all) => {
                  const allThemes = all.data;
                  const haveInstallThemes = response.data.data.themes;
                  const actives = response.data.data.actives;

                  allThemes.forEach((item)=>{
                    if (haveInstallThemes[item.slug]) { // 如果用户已经安装了该产品
                      item.action_text = '启用';
                      item.activate_url = haveInstallThemes[item.slug].activate_url;
                      if (actives.indexOf(item.slug) > -1) { // 如果用户已经启用了该产品
                        item.action_text = '已启用';
                        item.not_activate = true;
                      }
                    } else {
                      item.action_text = '安装';
                    }
                  })
                  this.themesList=all.data;
                  this.loading=false;
                  this.shopTotal = all.headers['x-wp-total'];
                }).catch((error) => {
              console.log(error.response.data);
            });
          }
      }).catch((e)=>{
        this.loading=false;
        console.log(e);
      })

    },
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
    pageReload(query){
      this.searchQuery=query;
      this.getThemesList();
    }
  },
  created() {
    this.getThemesList();
  }
}
</script>

<style scoped>
:global(.themes-all-container .ant-card-body){
  padding: 10px !important;
  background-color: #FAFAFA;
  border-top: 1px solid #ddd;
}
.themes-item-bottom-container{
  display: flex;
  justify-content: space-between;
  line-height: 32px;
}
.themes-item-title{
  font-size: 15px;
  font-weight: 600;
}
.themes-item-handle-button-css{
  display: none;
}

.themes-item-container:hover  .themes-item-handle-button-css{
  display: block;
}

.img_div {
  position: relative;
  width: 100%;
  height: 100%;
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(221,221,221, 0.5);
  color: #ffffff;
  opacity: 0;
}
.mask h3 {
  text-align: center;
}
.img_div a:hover .mask {
  opacity: 1;
}
.more-details{
  position: absolute;
  top: 35%;
  right: 20%;
  left: 20%;
  background: #23282d;
  background: rgba(0,0,0,.7);
  color: #fff;
  font-size: 15px;
  text-shadow: 0 1px 0 rgba(0,0,0,.6);
  font-weight: 600;
  padding: 12px 12px;
  text-align: center;
  border-radius: 3px;
  transition: opacity .1s ease-in-out;
}

</style>
