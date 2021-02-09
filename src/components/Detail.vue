<template>
  <div class="detail-container">
    <a-tabs @change="shopInfoCallback" v-model:activeKey="activeKey">
      <a-tab-pane key="description" tab="描述">
      </a-tab-pane>
      <a-tab-pane key="images" tab="截图" v-if="detailData.images && detailData.images.length > 0">
      </a-tab-pane>
      <a-tab-pane key="install" tab="安装">
      </a-tab-pane>
      <a-tab-pane key="change_log" tab="修订历史">
      </a-tab-pane>
      <a-tab-pane key="faqs" tab="常见问题" v-if="detailData && detailData.faqs && detailData.faqs.length>0">
      </a-tab-pane>
      <a-tab-pane key="comments" tab="评价">
      </a-tab-pane>
    </a-tabs>
    <BasicInformation :detailData="detailData" id="BasicInformation">
      <template v-slot:content>
<!--        描述-->
        <div v-html="detailData.description" style="width: 100%" v-if="activeKey === 'description'"></div>
<!--      截图  -->
        <div  v-if="activeKey === 'images'" style="width: 500px">
          <div v-for="(item,i) in detailData.images" :key="i" style="margin-right: 10px">
            <img :src="item.src" :alt="item.alt" style="max-width: 100%" />
            <div style="margin: 10px 0">{{item.alt}}</div>
          </div>
        </div>
<!--       安装 -->
        <div v-html="detailData.install" v-if="activeKey === 'install'" style="width: 500px"></div>
<!--        修订历史-->
        <div v-html="detailData.change_log" v-if="activeKey === 'change_log'"></div>
<!-- 常见问题-->
        <a-collapse accordion v-if="activeKey === 'faqs'">
          <a-collapse-panel v-for="( item, i ) in detailData.faqs" :key="i" :header="item.question">
            <p v-html="item.answer"></p>
          </a-collapse-panel>
        </a-collapse>
<!--      评价  -->
        <div v-if="activeKey === 'comments'">
          <a-tag color="blue">
            {{ commentTotal }} 条评价
          </a-tag>
          <a-skeleton v-if="comments.length === 0" :loading="commentLoading" active/>
          <a-skeleton v-if="comments.length === 0" :loading="commentLoading" active/>
          <a-list
              v-else
              class="comment-list"
              item-layout="horizontal"
              :data-source="comments"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-comment :author="item.author" :avatar="item.avatar">
                  <template #actions>
                    <a-rate :value="item.rating" disabled/>
                  </template>
                  <template #content>
                    <p>
                      {{ item.content }}
                    </p>
                  </template>
                  <template #datetime>
                    <a-tooltip :title="item.datetime">
                      <span>{{ item.datetime }}</span>
                    </a-tooltip>
                  </template>
                </a-comment>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </template>
    </BasicInformation>
  </div>
</template>
<script>
    import BasicInformation from "./BasicInformation";
    import Common from "./Common";
    import queryString from "querystring";
    export default {
      name: "Detail",
      components: {
          BasicInformation,
      },
        props: {
            detailData: {
                default: null,
                type: Array,
            }
        },
        data(){
          return{
              comments:[],
              commentTotal:0,
              activeKey:'description',
          }
        },
      watch:{
        detailData(){
        this.activeKey='description';
        }
      },
      methods:{
          shopInfoCallback(key) {
            document.getElementById('BasicInformation').scrollTo(0, 0)
              if ('comments' === key) {
                  let vm = this;

                  vm.commentLoading = true;
                  vm.comments = [];

                  const params = {
                      product: this.detailData.id,
                  };
                  Common.WooCommerce.get("products/reviews?" + queryString.stringify(params))
                      .then((response) => {
                          vm.comments = response.data;
                          vm.commentTotal = response.headers['x-wp-total'];
                          console.log(response.data);
                          console.log(response.headers);
                          vm.commentLoading = false;
                      })
                      .catch((error) => {
                          console.log(error.response.data);
                      });
              }
          },
      },
    };
</script>
<style scoped>
  .detail-container img{
      max-width: 100%;
  }
  iframe{
    width: 480px !important;
  }
</style>
