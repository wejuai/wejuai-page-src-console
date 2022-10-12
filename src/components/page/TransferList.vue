<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="wejuai-icon-recharge"></i> 财务管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>出金记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="search.id" placeholder="id" clearable></el-input>&nbsp;&nbsp;
        <el-input v-model="search.user" placeholder="用户id" clearable></el-input>&nbsp;&nbsp;
        <el-select v-model="search.channelType" clearable placeholder="支付通道">
          <el-option :label="''" :value="''"></el-option>
          <el-option :label="'支付宝'" :value="'ALIPAY'"></el-option>
          <el-option :label="'微信'" :value="'WEIXIN'"></el-option>
        </el-select>&nbsp;&nbsp;
        <el-select v-model="search.status" clearable placeholder="状态">
          <el-option :label="''" :value="''"></el-option>
          <el-option :label="'成功的'" :value="'SUCCEEDED'"></el-option>
          <el-option :label="'未完成'" :value="'STARTED'"></el-option>
          <el-option :label="'失败的'" :value="'FAILED'"></el-option>
        </el-select>&nbsp;&nbsp;
        <el-date-picker :editable="false" v-model="search.createdAt" type="daterange" :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>&nbsp;&nbsp;
        <el-button @click="list(1)">查询</el-button>&nbsp;&nbsp;
        <el-button @click="clear" style="margin: 0">还原</el-button>
      </div>
      <el-table :data="tableData.content" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="id" label="id" width="200px"></el-table-column>
        <el-table-column label="创建时间" width='150px'>
          <template slot-scope="scope">
            {{ moment(new Date(scope.row.createdAt)).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="user" label="用户id" width='200px'></el-table-column>
        <el-table-column prop="amount" label="金额(分)" width='100px'></el-table-column>
        <el-table-column label="支付方式" width='100px'>
          <template slot-scope="scope">
            {{ channelType[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width='80px'>
          <template slot-scope="scope">
            {{ status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="errorMessage" label="错误原因" width='150px'></el-table-column>
        <el-table-column prop="channelTradeId" label="通道id"></el-table-column>
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
  </div>
</template>

<script>
import service from "@/utils/request";

const api = require("@/utils/api")
const StringUtils = require("@/utils/StringUtils")

const moment = require('moment');

export default {
  name: "TransferList",
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
          amount: '',
          channelTradeId: '',
          createdAt: '',
          errorMessage: '',
          id: '',
          status: '',
          type: '',
          user: ''
        }]
      },
      search: {
        channelType: '',
        id: '',
        status: '',
        createdAt: '',
        user: ''
      },
      channelType: {
        "ALIPAY": "支付宝",
        "WEIXIN": "微信",
      },
      status: {
        "FAILED": "失败的",
        "STARTED": "未完成",
        "SUCCEEDED": "成功的",
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
      },
      moment: moment
    }
  },
  methods: {
    list(page) {
      page = page > 0 ? page - 1 : 0;
      let start = '';
      let end = '';
      if (StringUtils.isNotBlank(this.search.createdAt)) {
        start = this.search.createdAt[0];
        end = this.search.createdAt[1];
      }
      service.get(api.chargeBase + "/transfer?start=" + start + "&end=" + end + "&page=" + page
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
        channelType: '',
        id: '',
        status: '',
        createdAt: '',
        userId: ''
      };
      this.list(1)
    },
  }
}
</script>

<style scoped>
.el-input {
  width: 200px;
}
</style>