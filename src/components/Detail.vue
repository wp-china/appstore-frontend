<template>
  <div class="detail-container">
    <a-tabs @change="shopInfoCallback" v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="描述">
        <BasicInformation :detailData="detailData">
          <template v-slot:content>
            <div v-html="detailData.description"></div>
          </template>
        </BasicInformation>
      </a-tab-pane>
      <a-tab-pane key="2" tab="截图" v-if="detailData.images && detailData.images.length > 0">
        <BasicInformation :detailData="detailData" >
          <template v-slot:content>
            <div v-for="(item,i) in detailData.images" :key="i">
              <img :src="item.src" :alt="item.alt" style="max-width: 100%" />
              <div style="margin: 10px 0">{{item.alt}}</div>
            </div>
          </template>
        </BasicInformation>
      </a-tab-pane>
      <a-tab-pane key="3" tab="安装">
        <BasicInformation :detailData="detailData">
          <template v-slot:content>
            <div v-html="detailData.install"></div>
          </template>
        </BasicInformation>
      </a-tab-pane>
      <a-tab-pane key="4" tab="修订历史">
        <BasicInformation :detailData="detailData" >
          <template v-slot:content>
            <div v-html="detailData.change_log"></div>
          </template>
        </BasicInformation>
      </a-tab-pane>
      <a-tab-pane key="5" tab="常见问题" v-if="detailData && detailData.faqs && detailData.faqs.length>0">
        <BasicInformation :detailData="detailData" >
          <template v-slot:content>
            <a-collapse accordion>
              <a-collapse-panel v-for="( item, i ) in detailData.faqs" :key="i" :header="item.question">
                <p v-html="item.answer"></p>
              </a-collapse-panel>
            </a-collapse>
          </template>
        </BasicInformation>
      </a-tab-pane>
      <a-tab-pane key="6" tab="评价">
        <BasicInformation :detailData="detailData">
          <template v-slot:content>
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
          </template>
        </BasicInformation>
      </a-tab-pane>
    </a-tabs>
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
              activeKey:'1',
          }
        },
      watch:{
        detailData(){
        this.activeKey='1';
        }
      },
      methods:{
          shopInfoCallback(key) {
              if ('6' === key) {
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
