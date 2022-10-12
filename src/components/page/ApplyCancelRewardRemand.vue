<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="wejuai-icon-dingdan"></i> 订单管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>申请返还全额悬赏积分</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="search.userId" placeholder="用户id" clearable></el-input>&nbsp;&nbsp;
        <el-select v-model="search.applyStatus" clearable placeholder="申诉状态">
          <el-option v-for="item in applyStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>&nbsp;&nbsp;
        <el-date-picker :editable="false" v-model="search.createdAt" type="daterange" :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>&nbsp;&nbsp;
        <el-button @click="list(1)">查询</el-button>&nbsp;&nbsp;
        <el-button @click="clear" style="margin: 0">还原</el-button>
      </div>
      <el-table :data="tableData.content" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="id" label="id" width="190px"></el-table-column>
        <el-table-column prop="createdAt" label="申请时间" width="150px"></el-table-column>
        <el-table-column label="申请状态" width="70px">
          <template slot-scope="scope">
            {{ applyStatusMap[scope.row.applyStatus] }}
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="用户问题"></el-table-column>
        <el-table-column prop="completedAt" label="处理时间" width="150px"></el-table-column>
        <el-table-column prop="rejectionReason" label="驳回原因"></el-table-column>
        <el-table-column prop="rewardRemandId" label="悬赏id" width="190px"></el-table-column>
        <el-table-column label="悬赏状态" width="70px">
          <template slot-scope="scope">
            {{ statusMap[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="integral" label="积分" width="70px"></el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleDialog(scope.row.id)" v-if="scope.row.status==='UNTREATED'">处理
            </el-button>
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
  </div>
</template>

<script>
//todo 未完成

import service from "@/utils/request";

const api = require("@/utils/api")
const StringUtils = require("@/utils/StringUtils")

export default {
  name: "ApplyCancelRewardRemand",
  created() {
    this.list(1)
  },
  data() {
    return {
      query: {
        page: 1,
        size: 5
      },
      tableData: {
        totalElements: 0,
        content: [{
          id: '',
          createdAt: '',
          applyStatus: '',
          status: '',
          completedAt: '',
          rejectionReason: '',
          reason: '',
          rewardRemandId: '',
          integral: '',
        }]
      },
      search: {
        applyStatus: '',
        createdAt: '',
        userId: ''
      },
      applyStatus: [
        {label: "未通过", value: "NOT_PASS"},
        {label: "通过", value: "PASS"},
        {label: "未处理", value: "UNTREATED"},
      ],
      applyStatusMap: {
        "UNTREATED": "未处理",
        "NOT_PASS": "未通过",
        "PASS": "通过"
      },
      statusMap: {
        "END": "已结束",
        "LOCKING": "已锁定",
        "NORMAL": "正常"
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
      service.get(api.applyCancelRewardRemandList + "?start=" + start + "&end=" + end + "&page=" + page
          + "&applyStatus=" + this.search.applyStatus + "&size=" + this.query.size + '&userId=' + this.search.userId)
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
        applyStatus: '',
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