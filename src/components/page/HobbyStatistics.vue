<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="wejuai-icon-tongji"></i> 统计
        </el-breadcrumb-item>
        <el-breadcrumb-item>爱好统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-date-picker :editable="false" v-model="hobbyDate" type="daterange" :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-select v-model="selectedValue" clearable placeholder="请选择">
          <el-option
              v-for="item in hobbyList"
              :key="item.key"
              :label="item.value"
              :value="item.key">
          </el-option>
        </el-select>
        <el-button @click="dataInit">查询</el-button>
        <el-button @click="clear">还原</el-button>
      </div>
      <div>
        <el-card shadow="hover">
          <schart ref="line" class="schart" canvasId="line" :options="hobbyChart"></schart>
        </el-card>
      </div>
    </div>
    <div>
      <el-table
          :data="tableData.content" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="watched" label="阅读数"></el-table-column>
        <el-table-column prop="created" label="创建数"></el-table-column>
        <el-table-column prop="commented" label="评论数"></el-table-column>
        <el-table-column prop="followed" label="新关注数"></el-table-column>
        <el-table-column prop="unfollowed" label="取消关注数"></el-table-column>
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
  name: "HobbyStatistics",
  created() {
    this.dataInit();
    this.hobbySelectedList();
  },
  methods: {
    dataInit() {
      this.getHobbyChart();
      this.getHobbyPage(1);
    },
    getHobbyChart() {
      let start = '';
      let end = '';
      if (StringUtils.isNotBlank(this.hobbyDate)) {
        start = this.hobbyDate[0];
        end = this.hobbyDate[1];
      }
      service.get(api.hobbyStatisticsByDay + "?start=" + start + "&end=" + end + "&hobbyId=" + this.selectedValue)
          .then((res) => {
            this.hobbyChart.labels = res.data.labels;
            this.hobbyChart.datasets = res.data.datasets;
          });
    },
    clear() {
      this.hobbyDate = '';
      this.dataInit();
      this.selectedValue = '';
    },
    getHobbyPage(page) {
      page = page > 0 ? page - 1 : 0;
      let start = '';
      let end = '';
      if (StringUtils.isNotBlank(this.hobbyDate)) {
        start = this.hobbyDate[0];
        end = this.hobbyDate[1];
      }
      service.get(api.hobbyStatisticsByDayPage + "?start=" + start + "&end=" + end + "&page=" + page + "&size=" + this.query.size + "&hobbyId=" + this.selectedValue)
          .then((res) => {
            this.tableData = res.data;
          });
    },
    handlePageChange(val) {
      this.getHobbyPage(val)
    },
    hobbySelectedList() {
      service.get(api.hobbySelectedList)
          .then((res) => {
            this.hobbyList = res.data;
          });
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
      hobbyDate: '',
      hobbyChart: {
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
      hobbyList: [
        {
          key: '',
          value: ''
        }
      ],
      selectedValue: ''
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