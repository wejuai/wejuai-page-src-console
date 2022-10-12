<template>
  <div>
    <div>&nbsp;</div>
    <div>财务统计</div>
    <div>&nbsp;</div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:223px;">
          <div class="user-info">
            <img src="../../assets/img/img.jpg" class="user-avatar" alt/>
            <div class="user-info-cont">
              <div class="user-info-name">{{ name }}</div>
              <div>{{ role }}</div>
            </div>
          </div>
          <div class="user-info-list">
            上次登录时间：
            <span>{{ lastLoginInfo.date }}</span>
          </div>
          <div class="user-info-list">
            上次登录地点：
            <span>{{ lastLoginInfo.address }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="wejuai-icon-chongzhi grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ chargeStatistics.rechargeCount }}</div>
                  <div>成功充值<a class="num-or-count">单数</a></div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="wejuai-icon-zhuanzhang grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ chargeStatistics.transferCount }}</div>
                  <div>直接转账<a class="num-or-count">单数</a></div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="wejuai-icon-tixian grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ chargeStatistics.withdrawalCount }}</div>
                  <div>成功提现<a class="num-or-count">单数</a></div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="wejuai-icon-chongzhi grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ chargeStatistics.rechargeAmount / 100 }}</div>
                  <div>成功充值单<a class="num-or-count">金额</a></div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="wejuai-icon-zhuanzhang grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ chargeStatistics.transferAmount / 100 }}</div>
                  <div>直接转账<a class="num-or-count">金额</a></div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="wejuai-icon-tixian grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ chargeStatistics.withdrawalAmount / 100 }}</div>
                  <div>成功提现单<a class="num-or-count">金额</a></div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row :gutter="20">
      <el-col :span="6">
        <div>订单统计</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-2">
            <i class="el-icon-lx-text grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{ ordersStatistics.articleCount }}</div>
              <div>文章订<a class="num-or-count">单数</a></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-4">
            <i class="wejuai-icon-xuanshang grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{ ordersStatistics.rewardDemandCount }}</div>
              <div>悬赏完成订<a class="num-or-count">单数</a></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-1">
            <i class="el-icon-lx-add grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{ ordersStatistics.transferAddCount }}</div>
              <div>直接添加积分<a class="num-or-count">单数</a></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-3">
            <i class="el-icon-lx-move grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{ ordersStatistics.transferSubCount }}</div>
              <div>直接减少积分<a class="num-or-count">单数</a></div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-2">
            <i class="el-icon-lx-text grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{ ordersStatistics.articleAmount }}</div>
              <div>文章订单<a class="num-or-count">积分数</a></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-4">
            <i class="wejuai-icon-xuanshang grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{ ordersStatistics.rewardDemandAmount }}</div>
              <div>悬赏完成订单<a class="num-or-count">积分数</a></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-1">
            <i class="el-icon-lx-add grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{ ordersStatistics.transferAddAmount }}</div>
              <div>直接添加积分订单<a class="num-or-count">积分数</a></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-3">
            <i class="el-icon-lx-move grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{ ordersStatistics.transferSubAmount }}</div>
              <div>直接减少积分订单<a class="num-or-count">积分数</a></div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row :gutter="20">
      <el-col :span="6">
        <div>用户统计</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-2">
            <i class="el-icon-lx-people grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{ userStatistics.userRegister }}</div>
              <div>注册用户数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-4">
            <i class="el-icon-lx-message grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{ userStatistics.imMsg }}</div>
              <div>聊天消息数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row :gutter="20">
      <el-col :span="6">
        <div>爱好活跃度统计</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-2">
            <i class="el-icon-lx-read grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{ hobbyStatistics.watched }}</div>
              <div>阅读数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-4">
            <i class="el-icon-lx-comment grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{ hobbyStatistics.commented }}</div>
              <div>评论数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-1">
            <i class="el-icon-lx-roundadd grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{ hobbyStatistics.created }}</div>
              <div>创建数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" :body-style="{padding: '0px'}">
          <div class="grid-content grid-con-3">
            <i class="el-icon-lx-favor grid-con-icon"></i>
            <div class="grid-cont-right">
              <div class="grid-num">{{ hobbyStatistics.followed }}</div>
              <div>关注数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import service from "@/utils/request";

const api = require("@/utils/api")

export default {
  name: 'dashboard',
  created() {
    this.getChargeStatistics();
    this.getOrdersStatistics();
    this.getUserStatistics();
    this.getHobbyStatistics();
    this.getLastLoginInfo();
  },
  methods: {
    getChargeStatistics() {
      service.get(api.chargeStatistics)
          .then((res) => {
            this.chargeStatistics = res.data
          });
    },
    getOrdersStatistics() {
      service.get(api.ordersStatistics)
          .then((res) => {
            this.ordersStatistics = res.data
          });
    },
    getUserStatistics() {
      service.get(api.userStatistics)
          .then((res) => {
            this.userStatistics = res.data
          });
    },
    getHobbyStatistics() {
      service.get(api.hobbyStatistics)
          .then((res) => {
            this.hobbyStatistics = res.data
          });
    },
    getLastLoginInfo() {
      service.get(api.lastLoginInfo)
          .then((res) => {
            this.lastLoginInfo = res.data
          });
    }
  },
  data() {
    return {
      name: localStorage.getItem('ms_username'),
      chargeStatistics: {
        rechargeCount: 0,
        rechargeAmount: 0,
        transferCount: 0,
        transferAmount: 0,
        withdrawalCount: 0,
        withdrawalAmount: 0
      },
      ordersStatistics: {
        articleCount: 0,
        articleAmount: 0,
        rewardDemandCount: 0,
        rewardDemandAmount: 0,
        transferAddCount: 0,
        transferAddAmount: 0,
        transferSubCount: 0,
        transferSubAmount: 0
      },
      userStatistics: {
        userRegister: 0,
        imMsg: 0
      },
      hobbyStatistics: {
        watched: 0,
        commented: 0,
        created: 0,
        followed: 0,
      },
      lastLoginInfo: {
        date: '',
        address: ''
      }
    }
  },
  computed: {
    role() {
      return this.name === 'admin' ? '超级管理员' : '管理员';
    }
  },
};
</script>


<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
  font-style: normal;
  margin: 0;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.grid-con-4 .grid-con-icon {
  background: rgb(254, 166, 35);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}

.num-or-count {
  font-size: 20px;
  color: red;
}
</style>
