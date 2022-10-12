<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="wejuai-icon-dingdan"></i> 订单管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="search.userId" placeholder="用户id" clearable></el-input>&nbsp;&nbsp;
        <el-select v-model="search.income" clearable placeholder="是否收入">
          <el-option :label="''" :value="''"></el-option>
          <el-option :label="'是'" :value="true"></el-option>
          <el-option :label="'否'" :value="false"></el-option>
        </el-select>&nbsp;&nbsp;
        <el-select v-model="search.type" clearable placeholder="订单类型">
          <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>&nbsp;&nbsp;
        <el-select v-model="search.notZero" clearable placeholder="是否不展示0积分订单">
          <el-option :label="''" :value="''"></el-option>
          <el-option :label="'是'" :value="true"></el-option>
          <el-option :label="'否'" :value="false"></el-option>
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
        <el-table-column prop="createdAt" label="创建时间" width='200px'></el-table-column>
        <el-table-column prop="userId" label="用户id" width='200px'></el-table-column>
        <el-table-column label="是否收入" width='100px'>
          <template slot-scope="scope">
            {{ scope.row.income === true ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="订单名称"></el-table-column>
        <el-table-column label="类型" width='130px'>
          <template slot-scope="scope">
            {{ typeMap[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="integral" label="积分" width='100px'></el-table-column>
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

export default {
  name: "OrdersList",
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
          goodsName: '',
          integral: '',
          type: '',
          userId: '',
          income: ''
        }]
      },
      search: {
        income: '',
        createdAt: '',
        notZero: '',
        type: '',
        userId: ''
      },
      type: [
        {label: "文章", value: "ARTICLE"},
        {label: "充值", value: "CHARGE"},
        {label: "提现", value: "CASH_WITHDRAWAL"},
        {label: "提现退回", value: "CASH_WITHDRAWAL_RETURN"},
        {label: "发布悬赏", value: "REWARD_DEMAND"},
        {label: "增加悬赏金", value: "ADD_REWARD"},
        {label: "选定悬赏", value: "SELECTED_REWARD"},
        {label: "系统发放", value: "SYSTEM_ADD"},
        {label: "系统扣除", value: "SYSTEM_SUB"},
        {label: "取消悬赏退回", value: "REWARD_DEMAND_RETURN"},
        {label: "回答的悬赏取消补偿", value: "REWARD_DEMAND_COMPENSATE"}
      ],
      typeMap: {
        "ARTICLE": "文章",
        "CASH_WITHDRAWAL": "提现",
        "REWARD_DEMAND_COMPENSATE": "回答的悬赏取消补偿",
        "REWARD_DEMAND_RETURN": "取消悬赏退回",
        "REWARD_DEMAND": "发布悬赏",
        "ADD_REWARD": "增加悬赏金",
        "SELECTED_REWARD": "选定悬赏",
        "CASH_WITHDRAWAL_RETURN": "提现退回",
        "CHARGE": "充值",
        "SYSTEM_ADD": "系统发放",
        "SYSTEM_SUB": "系统扣除"
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
      page = page > 0 ? page - 1 : 0;
      let start = '';
      let end = '';
      if (StringUtils.isNotBlank(this.search.createdAt)) {
        start = this.search.createdAt[0];
        end = this.search.createdAt[1];
      }
      service.get(api.orderList + "?start=" + start + "&end=" + end + "&page=" + page
          + "&size=" + this.query.size + "&income=" + (this.search.income === 'true') + "&notZero="
          + (this.search.notZero === 'true') + '&type=' + this.search.type + '&userId=' + this.search.userId)
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
        income: '',
        createdAt: '',
        notZero: 'false',
        type: '',
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