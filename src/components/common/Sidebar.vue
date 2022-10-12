<template>
  <div class="sidebar">
    <el-menu
        class="sidebar-el-menu"
        :default-active="onRoutes"
        :collapse="collapse"
        background-color="#324157"
        text-color="#bfcbd9"
        active-text-color="#20a0ff"
        unique-opened
        router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                  v-if="subItem.subs"
                  :index="subItem.index"
                  :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                    v-for="(threeItem,i) in subItem.subs"
                    :key="i"
                    :index="threeItem.index"
                >{{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item
                  v-else
                  :index="subItem.index"
                  :key="subItem.index"
              >{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus';

export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-lx-home',
          index: 'dashboard',
          title: '系统首页'
        },
        {
          icon: 'wejuai-icon-tongji',
          index: '2',
          title: '统计',
          subs: [
            {
              index: 'chargeStatistics',
              title: '财务按日统计'
            },
            {
              index: 'ordersStatistics',
              title: '积分按日统计'
            },
            {
              index: 'userStatistics',
              title: '用户按日统计'
            },
            {
              index: 'hobbyStatistics',
              title: '爱好统计'
            },
          ]
        },
        {
          icon: 'el-icon-lx-people',
          index: '3',
          title: '用户管理',
          subs: [
            {
              index: 'user',
              title: '用户列表'
            },
            {
              index: 'systemUser',
              title: '系统用户'
            },
          ]
        },
        {
          icon: 'wejuai-icon-aihao',
          index: '4',
          title: '爱好管理',
          subs: [
            {
              index: 'hobbyList',
              title: '爱好列表'
            },
          ]
        },
        {
          icon: 'el-icon-lx-global',
          index: 'celestialBody',
          title: '星球管理',
        },
        {
          icon: 'el-icon-lx-message',
          index: '8',
          title: '消息管理',
          subs: [
            {
              index: 'systemMessage',
              title: '系统消息'
            },
          ]
        },
        {
          icon: 'wejuai-icon-dingdan',
          index: '9',
          title: '积分相关管理',
          subs: [
            {
              index: 'ordersList',
              title: '订单列表'
            },
            {
              index: 'orderAppeal',
              title: '订单申诉'
            },
            {
              index: 'applyCancelRewardRemand',
              title: '申请返还全额悬赏积分'
            },
          ]
        },
        {
          icon: 'el-icon-lx-apps',
          index: '10',
          title: '应用管理',
          subs: [
            {
              index: 'articleList',
              title: '文章列表'
            },
            {
              index: 'rewardDemandList',
              title: '悬赏列表'
            },
            {
              index: 'sendSystemArticle',
              title: '发布系统文章'
            },
          ]
        },
        {
          icon: 'el-icon-lx-recharge',
          index: '11',
          title: '财务管理',
          subs: [
            {
              index: 'chargeList',
              title: '支付记录'
            },
            {
              index: 'transferList',
              title: '出金记录'
            },
            {
              index: 'withdrawalList',
              title: '提现申请'
            },
          ]
        },
        {
          icon: 'el-icon-lx-edit',
          index: '13',
          title: '反馈相关',
          subs: [
            {
              index: 'feedback',
              title: '意见反馈'
            },
            {
              index: 'hobbyApply',
              title: '爱好申请'
            },
            {
              index: 'report',
              title: '举报记录'
            },
          ]
        },
        {
          icon: 'el-icon-lx-settings',
          index: '12',
          title: '系统管理',
          subs: [
            {
              index: 'loginLog',
              title: '登录记录'
            },
            {
              index: 'operations',
              title: '操作记录'
            },
          ]
        },
        // {
        //   icon: 'el-icon-lx-cascades',
        //   index: 'table',
        //   title: '基础表格'
        // },
        // {
        //   icon: 'el-icon-lx-copy',
        //   index: 'tabs',
        //   title: 'tab选项卡'
        // },
        // {
        //   icon: 'el-icon-lx-calendar',
        //   index: '5',
        //   title: '表单相关',
        //   subs: [
        //     {
        //       index: 'form',
        //       title: '基本表单'
        //     },
        //     {
        //       index: '4-2',
        //       title: '三级菜单',
        //       subs: [
        //         {
        //           index: 'editor',
        //           title: '富文本编辑器'
        //         },
        //         {
        //           index: 'markdown',
        //           title: 'markdown编辑器'
        //         }
        //       ]
        //     },
        //     {
        //       index: 'upload',
        //       title: '文件上传'
        //     }
        //   ]
        // },
        // {
        //   icon: 'el-icon-lx-emoji',
        //   index: 'icon',
        //   title: '自定义图标'
        // },
        // {
        //   icon: 'el-icon-pie-chart',
        //   index: 'charts',
        //   title: 'schart图表'
        // },
        // {
        //   icon: 'el-icon-rank',
        //   index: '6',
        //   title: '拖拽组件',
        //   subs: [
        //     {
        //       index: 'drag',
        //       title: '拖拽列表'
        //     },
        //     {
        //       index: 'dialog',
        //       title: '拖拽弹框'
        //     }
        //   ]
        // },
        // {
        //   icon: 'el-icon-lx-global',
        //   index: 'i18n',
        //   title: '国际化功能'
        // },
        // {
        //   icon: 'el-icon-lx-warn',
        //   index: '7',
        //   title: '错误处理',
        //   subs: [
        //     {
        //       index: 'permission',
        //       title: '权限测试'
        //     },
        //     {
        //       index: '404',
        //       title: '404页面'
        //     }
        //   ]
        // },
        // {
        //   icon: 'el-icon-lx-redpacket_fill',
        //   index: '/donate',
        //   title: '支持作者'
        // }
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '');
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg;
      bus.$emit('collapse-content', msg);
    });
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>
