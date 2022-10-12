<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="wejuai-icon-recharge"></i> 财务管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>提现申请列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="search.id" placeholder="id" clearable></el-input>&nbsp;&nbsp;
        <el-input v-model="search.userId" placeholder="用户id" clearable></el-input>&nbsp;&nbsp;
        <el-select v-model="search.channelType" clearable placeholder="支付通道">
          <el-option :label="''" :value="''"></el-option>
          <el-option :label="'支付宝'" :value="'ALIPAY'"></el-option>
          <el-option :label="'微信'" :value="'WEIXIN'"></el-option>
        </el-select>&nbsp;&nbsp;
        <el-select v-model="search.status" clearable placeholder="状态">
          <el-option :label="''" :value="''"></el-option>
          <el-option :label="'通过'" :value="'SUCCEEDED'"></el-option>
          <el-option :label="'驳回'" :value="'NOT_PASS'"></el-option>
          <el-option :label="'未处理'" :value="'UNTREATED'"></el-option>
        </el-select>&nbsp;&nbsp;
        <el-date-picker :editable="false" v-model="search.createdAt" type="daterange" :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>&nbsp;&nbsp;
        <el-button @click="list(1)">查询</el-button>&nbsp;&nbsp;
        <el-button @click="clear" style="margin: 0">还原</el-button>
      </div>
      <el-table :data="tableData.content" border style="width: 100%">
        <el-table-column prop="id" label="id" width="180" fixed="left"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width='140'></el-table-column>
        <el-table-column prop="userId" label="用户id" width='180'></el-table-column>
        <el-table-column prop="integral" label="积分" width='80'></el-table-column>
        <el-table-column label="提现方式" width='70'>
          <template slot-scope="scope">
            {{ channelType[scope.row.channelType] }}
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width='70'>
          <template slot-scope="scope">
            {{ status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="auditedAt" label="审核时间" width='140'></el-table-column>
        <el-table-column prop="rejectionReason" label="驳回原因" width="300"></el-table-column>
        <el-table-column label="转账状态" width='70'>
          <template slot-scope="scope">
            {{ scope.row.tradeStatus ? '成功' : '失败' }}
          </template>
        </el-table-column>
        <el-table-column prop="transferredAt" label="转账时间" width='140'></el-table-column>
        <el-table-column prop="lastTransferId" label="转账id" width='180'></el-table-column>
        <el-table-column prop="channelTradeId" label="通道id" width="240"></el-table-column>
        <el-table-column fixed="right" label="操作" width="260">
          <template slot-scope="scope">
            <el-button type="info" v-if="scope.row.status==='UNTREATED'" @click="syncUserIntegral(scope.row.userId)">
              获取积分信息
            </el-button>
            <el-button type="success" v-if="scope.row.status==='UNTREATED'" @click="pass(scope.row.id)">通过</el-button>
            <el-button type="warning" v-if="scope.row.status==='UNTREATED'" @click="reject(scope.row.id)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next"
                       :current-page="query.page"
                       :page-size="query.size"
                       :total="tableData.totalElements"
                       @current-change="list">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="积分详情" :visible.sync="dialog.userIntegralInfo" width="300px">
      <table>
        <tr>
          <td>不可提现积分：{{ userIntegralInfo.notWithdrawable }}</td>
        </tr>
        <tr>
          <td>提现中积分：{{ userIntegralInfo.processingWithdrawal }}</td>
        </tr>
        <tr>
          <td>空闲积分：{{ userIntegralInfo.total }}</td>
        </tr>
      </table>
    </el-dialog>

  </div>
</template>

<script>
import service from "@/utils/request";

const api = require("@/utils/api")
const StringUtils = require("@/utils/StringUtils")

export default {
  name: "WithdrawalList",
  created() {
    this.list(1);
  },
  data() {
    return {
      query: {
        page: 1,
        size: 10
      },
      tableData: {
        totalElements: 0,
        content: [{
          id: '',
          createdAt: '',
          userId: '',
          integral: '',
          channelType: '',
          completedAt: '',
          status: '',
          auditedAt: '',
          rejectionReason: '',
          tradeStatus: '',
          lastTransferId: '',
          channelTradeId: '',
          transferredAt: ''
        }]
      },
      search: {
        channelType: '',
        id: '',
        status: '',
        createdAt: '',
        userId: ''
      },
      channelType: {
        "ALIPAY": "支付宝",
        "WEIXIN": "微信",
      },
      status: {
        "NOT_PASS": "驳回",
        "PASS": "通过",
        "UNTREATED": "未处理",
      },
      dialog: {
        userIntegralInfo: false
      },
      userIntegralInfo: {
        notWithdrawable: '',
        processingWithdrawal: '',
        total: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            end.setTime(end.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三十天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            end.setTime(end.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', [start, end]);
          }
        }],
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      }
    }
  },
  methods: {
    list(page) {
      this.query.page = page
      page = page > 0 ? page - 1 : 0;
      let start = '';
      let end = '';
      if (StringUtils.isNotBlank(this.search.createdAt)) {
        start = this.search.createdAt[0];
        end = this.search.createdAt[1];
      }
      service.get(api.withdrawalList + "?start=" + start + "&end=" + end + "&page=" + page
          + "&size=" + this.query.size + "&channelType=" + this.search.channelType + "&id="
          + this.search.id + '&status=' + this.search.status + '&userId=' + this.search.userId)
          .then((res) => {
            this.tableData = res.data;
          });
    },
    clear() {
      this.query = {
        page: 1,
        size: 10
      };
      this.search = {
        id: '',
        status: '',
        userId: '',
        createdAt: '',
        channelType: ''
      };
      this.list(1)
    },
    syncUserIntegral(userId) {
      service.put(api.withdrawalBase + "/" + userId + "/sync")
          .then((res) => {
            this.userIntegralInfo = res.data;
          });
      this.dialog.userIntegralInfo = true;
    },
    pass(id) {
      service.post(api.withdrawalBase + "/" + id + "/pass")
          .then((res) => {
            this.$message.success("通过提现成功")
            this.list(this.query.page)
          });
    },
    reject(id) {
      this.$prompt('请输入驳回原因', '驳回提现', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{10,200}$/,
        inputErrorMessage: '驳回原因必须输入10到200个字符'
      }).then(({value}) => {
        service.post(api.withdrawalBase + "/" + id + "/unPass?rejectionReason=" + value)
            .then((res) => {
              this.$message.success("驳回提现成功")
              this.list(this.query.page)
            });
      }).catch(err => {
        console.log(err);
      });
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 200px;
}
</style>
