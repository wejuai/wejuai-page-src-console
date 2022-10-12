import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/chargeStatistics',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/ChargeStatistics.vue'),
                    meta: { title: '财务按日统计' }
                },
                {
                    path: '/ordersStatistics',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/OrdersStatistics.vue'),
                    meta: { title: '积分按日统计' }
                },
                {
                    path: '/userStatistics',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/UserStatistics.vue'),
                    meta: { title: '用户按日统计' }
                },
                {
                    path: '/hobbyStatistics',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/HobbyStatistics.vue'),
                    meta: { title: '爱好统计' }
                },
                {
                    path: '/user',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/User.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/userInfo',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/UserInfo.vue'),
                    name: 'UserInfo',
                    meta: { title: '用户详情' }
                },
                {
                    path: '/systemUser',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/SystemUser.vue'),
                    name: 'SystemUser',
                    meta: { title: '系统用户' }
                },
                {
                    path: '/hobbyList',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/HobbyList.vue'),
                    meta: { title: '爱好列表' }
                },
                {
                    path: '/hobbyInfo',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/HobbyInfo.vue'),
                    name: 'HobbyInfo',
                    meta: { title: '爱好详情' }
                },
                {
                    path: '/addHobby',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/AddHobby.vue'),
                    meta: { title: '添加爱好' }
                },
                {
                    path: '/celestialBody',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/CelestialBody.vue'),
                    meta: { title: '星球管理' }
                },
                {
                    path: '/systemMessage',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/SystemMessage.vue'),
                    meta: { title: '系统消息' }
                },
                {
                    path: '/ordersList',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/OrdersList.vue'),
                    meta: { title: '订单列表' }
                },
                {
                    path: '/chargeList',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/ChargeList.vue'),
                    meta: { title: '支付单列表' }
                },
                {
                    path: '/transferList',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/TransferList.vue'),
                    meta: { title: '出金记录' }
                },
                {
                    path: '/withdrawalList',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/WithdrawalList.vue'),
                    meta: { title: '提现申请记录' }
                },
                {
                    path: '/orderAppeal',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/OrderAppeal.vue'),
                    meta: { title: '订单申诉' }
                },
                {
                    path: '/applyCancelRewardRemand',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/ApplyCancelRewardRemand.vue'),
                    meta: { title: '申请返还全额悬赏积分' }
                },
                {
                    path: '/articleList',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/ArticleList.vue'),
                    meta: { title: '文章列表' }
                },
                {
                    path: '/articleInfo',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/ArticleInfo.vue'),
                    name: 'ArticleInfo',
                    meta: { title: '文章详情' }
                },
                {
                    path: '/sendSystemArticle',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/SendSystemArticle.vue'),
                    name: 'SendSystemArticle',
                    meta: { title: '发布系统文章' }
                },
                {
                    path: '/rewardDemandList',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/RewardDemandList.vue'),
                    meta: { title: '悬赏列表' }
                },
                {
                    path: '/rewardDemandInfo',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/RewardDemandInfo.vue'),
                    name: 'RewardDemandInfo',
                    meta: { title: '悬赏详情' }
                },
                {
                    path: '/rewardDemandSubMissionInfo',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/RewardDemandSubMissionInfo.vue'),
                    name: 'RewardDemandSubMissionInfo',
                    meta: { title: '悬赏回答详情' }
                },
                {
                    path: '/loginLog',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/LoginLog.vue'),
                    meta: { title: '登录记录' }
                },
                {
                    path: '/operations',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Operations.vue'),
                    meta: { title: '操作记录' }
                },
                {
                    path: '/feedback',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Feedback.vue'),
                    meta: { title: '意见反馈' }
                },
                {
                    path: '/hobbyApply',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/HobbyApply.vue'),
                    meta: { title: '爱好申请' }
                },
                {
                    path: '/report',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Report.vue'),
                    meta: { title: '举报记录' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '支持作者' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
