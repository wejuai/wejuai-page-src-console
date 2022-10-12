<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-settings"></i> 系统管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>操作记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model='search.operation' placeholder='路径' clearable></el-input>&nbsp;&nbsp;
        <el-input v-model='search.method' placeholder='方法' clearable></el-input>&nbsp;&nbsp;
        <el-date-picker :editable="false" v-model="search.createdAt" type="daterange" :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>&nbsp;&nbsp;
        <el-button @click="list(1)">查询</el-button>&nbsp;&nbsp;
        <el-button @click="clear" style="margin: 0">还原</el-button>
      </div>
      <el-table :data="tableData.content" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="id" label="id" width="190px" fixed="left"></el-table-column>
        <el-table-column prop="createdAt" label="时间" width='150px'></el-table-column>
        <el-table-column prop="sessionId" label="sessionId" width='280px'></el-table-column>
        <el-table-column prop="ip" label="ip" width='210px'></el-table-column>
        <el-table-column prop="method" label="方法" width='70px'></el-table-column>
        <el-table-column prop="operation" label="路径" width='400px'></el-table-column>
        <el-table-column prop="content" label="请求内容" width='500px'></el-table-column>
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
  name: "Operations",
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
        content: []
      },
      search: {
        createdAt: '',
        operation: '',
        method: ''
      },
      moment: moment,
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
      service.get(api.systemBase + "/operations?start=" + start + "&end=" + end + "&page=" + page + "&size=" + this.query.size
          + "&method=" + this.search.method + "&operation=" + this.search.operation)
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
        createdAt: '',
        operation: '',
        method: ''
      };
      this.list(1)
    },
  }
}
</script>

<style scoped>
.el-input {
  width: 300px;
}
</style>