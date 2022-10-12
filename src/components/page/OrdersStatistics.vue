<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="wejuai-icon-tongji"></i> 统计
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务按日统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-date-picker :editable="false" v-model="ordersDate" type="daterange" :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-button @click="started">查询</el-button>
        <el-button @click="clear">还原</el-button>
      </div>
      <div>
        <el-card shadow="hover">
          <schart ref="line" class="schart" canvasId="line" :options="ordersChart"></schart>
        </el-card>
      </div>
    </div>
    <div>
      <el-table
          :data="tableData.content" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="articleCount" label="有积分文章订单数量"></el-table-column>
        <el-table-column label="有积分文章订单积分数量">
          <template slot-scope="scope">{{ scope.row.articleAmount / 100 }}</template>
        </el-table-column>
        <el-table-column prop="rewardDemandCount" label="完成的悬赏订单数量"> </el-table-column>
        <el-table-column label="完成的悬赏订单积分数量">
          <template slot-scope="scope">{{ scope.row.rewardDemandAmount / 100 }}</template>
        </el-table-column>
        <el-table-column prop="transferAddCount" label="直接转账积分单数量"> </el-table-column>
        <el-table-column label="直接转账积分数量">
          <template slot-scope="scope">{{ scope.row.transferAddAmount / 100 }}</template>
        </el-table-column>
        <el-table-column prop="transferSubCount" label="直接扣除积分单数量"> </el-table-column>
        <el-table-column label="直接扣除积分数量">
          <template slot-scope="scope">{{ scope.row.transferSubAmount / 100 }}</template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next"
                       :current-page="query.page"
                       :page-size="query.size"
                       :total="tableData.totalElements"
                       @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Schart from 'vue-schart';
import service from "@/utils/request";

const api = require("@/utils/api")
const StringUtils = require("@/utils/StringUtils")

export default {
  name: "OrdersStatistics",
  created() {
    this.started();
  },
  methods: {
    started() {
      this.getOrdersChart();
      this.getOrdersPage(1);
    },
    getOrdersChart() {
      let start = '';
      let end = '';
      if (StringUtils.isNotBlank(this.ordersDate)) {
        start = this.ordersDate[0];
        end = this.ordersDate[1];
      }
      service.get(api.ordersStatisticsByDay + "?start=" + start + "&end=" + end)
          .then((res) => {
            this.ordersChart.labels = res.data.labels;
            this.ordersChart.datasets = res.data.datasets;
          });
    },
    clear() {
      this.ordersDate = '';
      this.started();
    },
    getOrdersPage(page) {
      page = page > 0 ? page - 1 : 0;
      let start = '';
      let end = '';
      if (StringUtils.isNotBlank(this.ordersDate)) {
        start = this.ordersDate[0];
        end = this.ordersDate[1];
      }
      service.get(api.ordersStatisticsByDayPage + "?start=" + start + "&end=" + end + "&page=" + page + "&size=" + this.query.size)
          .then((res) => {
            this.tableData = res.data;
          });
    },
    handlePageChange(val) {
      this.getOrdersPage(val)
    }
  },
  data() {
    return {
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
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      ordersDate: '',
      ordersChart: {
        type: 'line',
        title: {
          text: ''
        },
        labels: ['6月', '7月', '8月', '9月', '10月'],
        datasets: [
          {
            label: '家电',
            data: [234, 278, 270, 190, 230]
          },
          {
            label: '百货',
            data: [164, 178, 150, 135, 160]
          },
          {
            label: '食品',
            data: [74, 118, 200, 235, 90]
          }
        ]
      },
      query: {
        page: 1,
        size: 10
      },
      tableData: {
        totalElements: 0,
        content: []
      },
    }
  },
  components: {
    Schart
  },
}
</script>

<style scoped>
.schart {
  width: 100%;
  height: 400px;
}

.table {
  width: 100%;
  font-size: 14px;
}

</style>