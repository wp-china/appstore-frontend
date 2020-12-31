import { createApp } from 'vue'
import App from './App.vue'
import {
    Avatar,
    Breadcrumb,
    Button,
    Card,
    Col, Comment,
    Layout, List,
    Menu,
    Modal, Pagination,
    Radio,
    Rate,
    Row, Skeleton,
    Slider, Space, Spin, Table,
    Tabs,
    Tooltip,
    Collapse,
    Divider,
    Tag,
    Form,
    Input,
    Select,
} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import { createRouter, createWebHashHistory } from 'vue-router'
import Plugins from './components/Plugins'
import Themes from './components/Themes'
import HelloWorld from './components/HelloWorld'
import Account from './components/Account'
import EnterSupplier from './components/EnterSupplier'

import axios from 'axios'
import VueAxios from 'vue-axios'

const routes = [
    {path: '/', component: Plugins},
    {path: '/themes', component: Themes},
    {path: '/hello', component: HelloWorld},
    {path: '/account', component: Account},
    {path: '/enter', component: EnterSupplier}
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})


createApp(App)
    .use(Button)
    .use(Layout)
    .use(Menu)
    .use(Breadcrumb)
    .use(Slider)
    .use(Row)
    .use(Col)
    .use(Card)
    .use(Avatar)
    .use(Rate)
    .use(Modal)
    .use(Tabs)
    .use(Radio)
    .use(router)
    .use(Pagination)
    .use(Skeleton)
    .use(Space)
    .use(List)
    .use(Comment)
    .use(Spin)
    .use(Table)
    .use(Tooltip)
    .use(Collapse)
    .use(Divider)
    .use(Tag)
    .use(Form)
    .use(Input)
    .use(Select)
    .use(VueAxios, axios)
    .mount('#app')
