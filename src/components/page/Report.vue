<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-edit"></i> 反馈相关
        </el-breadcrumb-item>
        <el-breadcrumb-item>举报记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model='search.type' clearable placeholder='类型'>
          <el-option :label="''" :value="''"></el-option>
          <el-option :label="'应用'" :value='"APP"'></el-option>
          <el-option :label="'用户'" :value='"USER"'></el-option>
        </el-select>&nbsp;&nbsp;
        <el-input v-model="search.userId" placeholder="举报人" clearable></el-input>&nbsp;&nbsp;
        <el-input v-model="search.beUserId" placeholder="被举报人" clearable></el-input>&nbsp;&nbsp;
        <el-input v-model="search.appId" placeholder="应用id" clearable></el-input>&nbsp;&nbsp;
        <el-date-picker :editable="false" v-model="search.createdAt" type="daterange" :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>&nbsp;&nbsp;
        <el-button @click="list(1)">查询</el-button>&nbsp;&nbsp;
        <el-button @click="clear" style="margin: 0">还原</el-button>
      </div>
      <el-table :data="tableData.content" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="id" label="id" width="200px"></el-table-column>
        <el-table-column prop="createdAt" label="时间" width='170px'></el-table-column>
        <el-table-column prop="userId" label="用户id" width='200px'></el-table-column>
        <el-table-column label="举报类型" width='100px'>
          <template slot-scope="scope">
            {{ scope.row.type === 'APP' ? '应用' : '用户' }}
          </template>
        </el-table-column>
        <el-table-column prop="beUserId" label="被举报用户id" width='200px'></el-table-column>
        <el-table-column label="应用类型" width='100px'>
          <template slot-scope="scope">
            {{ scope.row.appType === 'ARTICLE' ? '文章' : '悬赏' }}
          </template>
        </el-table-column>
        <el-table-column prop="appId" label="应用id" width='200px'></el-table-column>
        <el-table-column prop="reason" label="举报原因" width='500px'></el-table-column>
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
  name: "Report",
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
        userId: '',
        beUserId: '',
        type: '',
        appId: '',
      },
      moment: moment,
      StringUtils: StringUtils,
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
      this.query.page = page;
      page = page > 0 ? page - 1 : 0;
      let start = '';
      let end = '';
      if (StringUtils.isNotBlank(this.search.createdAt)) {
        start = this.search.createdAt[0];
        end = this.search.createdAt[1];
      }
      service.get(api.report + "?start=" + start + "&end=" + end + "&page=" + page + "&size=" + this.query.size
          + "&handle=" + this.search.handle + "&userId=" + this.search.userId + "&type=" + this.search.type + "&beUserId=" + this.search.beUserId
          + "&appId=" + this.search.appId)
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
        userId: '',
        type: '',
        appId: '',
        beUserId: '',
      };
      this.list(1);
    },
  }
}
</script>

<style scoped>
.el-input {
  width: 300px;
}
</style>
