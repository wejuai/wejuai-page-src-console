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
        <el-date-picker :editable="false" v-model="userDate" type="daterange" :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-button @click="started">查询</el-button>
        <el-button @click="clear">还原</el-button>
      </div>
      <div>
        <el-card shadow="hover">
          <schart ref="line" class="schart" canvasId="line" :options="userChart"></schart>
        </el-card>
      </div>
    </div>
    <div>
      <el-table
          :data="tableData.content" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="userRegister" label="用户注册数"></el-table-column>
        <el-table-column prop="imMsg" label="用户消息数"></el-table-column>
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
  name: "UserStatistics",
  created() {
    this.started();
  },
  methods: {
    started() {
      this.getUserChart();
      this.getUserPage(1);
    },
    getUserChart() {
      let start = '';
      let end = '';
      if (StringUtils.isNotBlank(this.userDate)) {
        start = this.userDate[0];
        end = this.userDate[1];
      }
      service.get(api.userStatisticsByDay + "?start=" + start + "&end=" + end)
          .then((res) => {
            this.userChart.labels = res.data.labels;
            this.userChart.datasets = res.data.datasets;
          });
    },
    clear() {
      this.userDate = '';
      this.started();
    },
    getUserPage(page) {
      page = page > 0 ? page - 1 : 0;
      let start = '';
      let end = '';
      if (StringUtils.isNotBlank(this.userDate)) {
        start = this.userDate[0];
        end = this.userDate[1];
      }
      service.get(api.userStatisticsByDayPage + "?start=" + start + "&end=" + end + "&page=" + page + "&size=" + this.query.size)
          .then((res) => {
            this.tableData = res.data;
          });
    },
    handlePageChange(val) {
      this.getUserPage(val)
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
      userDate: '',
      userChart: {
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