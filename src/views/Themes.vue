<template>
      <a-card style="margin: 10px 0;border: 1px solid #ddd;">
        <p style="margin-bottom: 5px">
          主题价格：
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
        <p style="margin-bottom: 5px;"   @change="searchSortChange">
          排序方式：
          <a-radio-group default-value="0" >
            <a-radio-button value="0">
              综合
            </a-radio-button>
            <a-radio-button value="price">
              价格
            </a-radio-button>
            <a-radio-button value="include">
              销量
            </a-radio-button>
            <a-radio-button value="date">
              更新日期
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

  <div class="themes-all-container">
    <a-row :gutter="[50, 40]">
      <a-col
          :xxl="6"
          :xl="6"
          :lg="8"
          :md="12"
          :xs="12"
          v-for="(item,i) in themesList"
          :key="item"
      >
        <a-card hoverable class="themes-item-container">
          <template #cover>
            <div class="img_div">
              <div>
                <img
                    v-if="item.thumbnail"
                    alt="example"
                    style="width: 100%;height: 240px"
                    :src="item.thumbnail"
                />
              </div>
              <a @click="openDetailModal(i)">
                <div class="mask">
                  <span class="more-details">详情&预览</span>
                </div>
              </a>
            </div>
          </template>
          <div class="themes-item-bottom-container">
            <div class="themes-item-title">{{item.name}}</div>
            <div :class="buttonLoadingKeys.indexOf(item.id) > -1 ? '' : 'themes-item-handle-button-css'" :style="item.action_text === '启用' || item.action_text === '已启用' ? 'display:flex':''">
              <a-button
                  v-if="item.price==='0' || item.price===''"
                  style="margin-right: 10px"
                  :type="item.action_text === '启用' ? 'primary' :'default'"
                  :size="100"
                  :disabled="item.action_text === '已启用'"
                  @click="themesHandle(item,i)"
                  :loading="buttonLoadingKeys.indexOf(item.id) > -1"
              >
                {{ item.action_text }}
              </a-button>
              <a-button v-else style="margin-right: 10px">
                ￥{{ item.price }} 购买
              </a-button>
              <a-button @click="openPreviewPage(item.preview_url)">
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


  <a-modal :bodyStyle="{ paddingTop: '0px' }" :mask=false :closable=false :width="modalWidth" v-model:visible="shopInfoVisible" @ok="handleOk">
    <div>
      <div style="display: flex;justify-content: space-between" class="modal-title-container">
      <div style="display: flex;">
        <div :class=" detailIndex === 0 ? 'left-icon-container-disabled' : 'left-icon-container'" @click="leftDetail">
          <LeftOutlined />
        </div>
        <div :class="detailIndex+1 === themesList.length ? 'right-icon-container-disabled' : 'right-icon-container'" @click="rightDetail">
          <RightOutlined />
        </div>
      </div>
      <div class="close-icon-container" @click="handleCancel">
        <CloseOutlined />
      </div>
      </div>
      <div style="padding: 30px;height: 500px;overflow: auto;margin-right: -24px;">
        <a-row :gutter="20">
          <a-col :span="14">
            <img :src="themesList[detailIndex].thumbnail" alt="test" style="width: 100%"/>
          </a-col>
          <a-col :span="10">
            <h2>{{ themesList[detailIndex].name }}<span class="versions-container">版本：{{ themesList[detailIndex].app_version }}</span></h2>
            <h4>作者:<a :href="themesList[detailIndex].author ? themesList[detailIndex].author.home : ''"  target="_blank">{{themesList[detailIndex].author ?themesList[detailIndex].author.name:'WP中国本土应用市场'}}</a></h4>
            <p class="introduce-container">{{ themesList[detailIndex].description}}</p>
            <p class="tag-container"><span style="color: #444; font-weight: 600; margin-right: 5px;">标签:</span> 两栏、三栏、边栏在左侧、边栏在右侧、translation-ready、自定义背景、自定义标志、特色图像、页脚小工具、占满宽度的模板、博客、电商、娱乐</p>
          </a-col>
        </a-row>
      </div>
    </div>
    <template v-slot:footer>
      <a-button key="back" @click="handleCancel">
        关闭
      </a-button>
      <a-button @click="openPreviewPage(themesList[detailIndex].preview_url)">
        预览
      </a-button>
      <a-button
          v-if="themesList[detailIndex]&&(themesList[detailIndex].price==='0' || themesList[detailIndex].price==='')"
          style="margin-right: 10px"
          :type="themesList[detailIndex].action_text === '启用' ? 'primary' :'default'"
          :size="100"
          :disabled="themesList[detailIndex].action_text === '已启用'"
          @click="themesHandle(themesList[detailIndex],detailIndex)"
          :loading="buttonLoadingKeys.indexOf(themesList[detailIndex].id) > -1"
      >
        {{ themesList[detailIndex].action_text }}
      </a-button>
      <a-button v-else key="submit" type="primary" :loading="shopInfoLoading" @click="handleOk">
        <ShoppingOutlined /> ￥{{ themesList[detailIndex].price }} 购买
      </a-button>
    </template>
    <template v-slot:closeIcon>
      <CloseOutlined />
    </template>
  </a-modal>
  <notice-modal ref="noticeModal" :shopDetail="shopDetail"/>
</template>

<script>
import {
  ShoppingOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons-vue';
import queryString from "querystring";
import Common from "@/components/Common";
import {getQueryVariable} from "@/utils/utils.ts";
import {notification} from "ant-design-vue";
import NoticeModal from '@/components/NoticeModal'

export default {
  components: {
    ShoppingOutlined,
    CloseOutlined,
    LeftOutlined,
    RightOutlined,
    NoticeModal,
  },
  name: "Plugins",
  data() {
    return {
      shopInfoLoading: false,
      shopInfoVisible: false,
      searchPrice:'0',
      detailIndex:0,
      modalWidth:'50%',
      loading: false,
      themesList:[],
      shopTotal: 0,
      page:1,
      searchQuery:'',
      orderBy:'0',
      buttonLoadingKeys:[],
      labelList:[],
      selectedLabelIds:[],
      shopDetail:{},
    };
  },
  methods: {
    openPreviewPage(url){
      // window.top.location.href = url;
      window.open(url);
    },
    themesHandle(theme_data,index){
      // 增加loading
      this.buttonLoadingKeys.push(theme_data.id);
      if (theme_data.action_text === '启用'){
        window.top.location.href = theme_data.activate_url;
      }else{
      this.axios.post('/wp-json/wcy/v1/themes/install', {
        slug: theme_data.slug,
        downloadLink: theme_data.download_url
      }, {headers: {
          'X-WP-Nonce': getQueryVariable('_wpnonce')
        }}).then((res)=>{
          if(res.data.success){
            this.themesList[index].action_text = '启用';
            this.themesList[index].activate_url = res.data.data.activateUrl;
            this.themesList.splice(this.themesList.indexOf(theme_data.id),1);
            notification.success({
              message: '安装成功',
              description:'',
            })
          }else{
            notification.error({
              message: '安装失败',
              description:res.data.errorMessage,
            })
          }
        this.buttonLoadingKeys.splice(this.buttonLoadingKeys.indexOf(theme_data.id),1);
      }).catch((e) => {
          console.log(e);
          this.buttonLoadingKeys.splice(this.buttonLoadingKeys.indexOf(theme_data.id),1);
        })
      }
    },
    getThemesList(){
      this.themesList=[];
      this.loading=true;

      this.axios.get('/wp-json/wcy/v1/themes', {headers: {
          'X-WP-Nonce': getQueryVariable('_wpnonce')
        }}).then((response) => {
          if(response.data.success){
            // 获取热门标签
            this.axios.get('https://appstore.wp-china-yes.cn/wp-content/uploads/appstore/json/theme/tags.json').then((data)=>{
              this.labelList=data.data;
            })
            const params = {
              page:this.page,
              per_page:12,
              category:17,
              order:'desc',
            };
            // 主题价格
            if(this.searchPrice === '1'){
              params.min_price=0.01;
            }
            if(this.searchPrice==='2'){
              params.max_price=0.01;
            }
            if(this.orderBy !== '0'){
              params.orderby=this.orderBy;
            }
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
    openDetailModal(index) {
      parent.window.scrollTo(0, 120);
      this.detailIndex=index;
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

    pageReload(query){
      this.searchQuery=query;
      this.getThemesList();
    },
    leftDetail(){
      if(this.detailIndex===0){
        return;
      }
      this.detailIndex-=1;
    },
    rightDetail(){
      if(this.detailIndex+1===this.themesList.length){
        return;
      }
      this.detailIndex+=1;
    },
    pageOnresize(){
      if(document.body.clientWidth > 1500){
        this.modalWidth='70%';
      }else if(document.body.clientWidth < 800){
        this.modalWidth='100%';
      }else if(document.body.clientWidth < 1300){
        this.modalWidth='80%';
      } else{
        this.modalWidth='80%';
      }
    },
    hotLabelTagClick(id){
      if(this.selectedLabelIds.indexOf(id) >-1){
        this.selectedLabelIds.splice(this.selectedLabelIds.indexOf(id),1);
      }else{
        this.selectedLabelIds.push(id);
      }
      // TODO 调用查询
    },
    newOrder(data) {
      this.shopDetail=data;
      this.$refs.noticeModal.noticeVisible=true;
    },
    searchPriceChange(e){
      this.searchPrice=e.target.value
      this.page=1;
      this.getThemesList();
    },
    searchSortChange(e){
      this.orderBy=e.target.value;
      this.page=1;
      this.getThemesList();
    }
  },

  created() {
    this.pageOnresize();
    this.getThemesList();
    window.onresize = () => {
      return (() => {
        console.log(document.body.clientWidth)
       this.pageOnresize();
      })()
    }
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
.themes-item-container{
 border: 2px solid #ddd !important;
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
.modal-title-container{
  display: flex;
  justify-content: space-between;
  height: 40px;
  margin: 0 -24px;
  border-bottom: 1px solid #ddd;
}

.left-icon-container,
.right-icon-container,
.close-icon-container,
.left-icon-container-disabled,
.right-icon-container-disabled{
  line-height: 40px;
  width: 40px;
  text-align: center;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 18px;
}

.left-icon-container:hover, .right-icon-container:hover,.close-icon-container:hover{
  background: #DDDDDD;
}
.left-icon-container,.left-icon-container-disabled{
  border-bottom: none;
  border-right: none;
}

.left-icon-container-disabled,.right-icon-container-disabled{
  color:#ddd
}

.right-icon-container,.close-icon-container,.right-icon-container-disabled{
  border-bottom: none;
}
.versions-container{
  color: #72777c;
  font-size: 13px;
  font-weight: 400;
  float: none;
  display: inline-block;
  margin-left: 10px;
}
.introduce-container{
  text-indent: 10px;
  color: #555;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.5;
  margin: 30px 0 0 0;
}
.tag-container{
  border-top: 3px solid #eee;
  color: #82878c;
  font-size: 13px;
  font-weight: 400;
  margin: 30px 0 0 0;
  padding-top: 20px;
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
