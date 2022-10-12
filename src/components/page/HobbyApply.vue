<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-edit"></i> 反馈相关
        </el-breadcrumb-item>
        <el-breadcrumb-item>爱好申请</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model='search.handle' clearable placeholder='是否处理'>
          <el-option :label="''" :value="''"></el-option>
          <el-option :label="'是'" :value='true'></el-option>
          <el-option :label="'否'" :value='false'></el-option>
        </el-select>&nbsp;&nbsp;
        <el-input v-model="search.userId" placeholder="用户id" clearable></el-input>&nbsp;&nbsp;
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
        <el-table-column prop="contact" label="联系方式" width='300px'></el-table-column>
        <el-table-column prop="text" label="内容" width='500px'></el-table-column>
        <el-table-column label="是否处理" width='100px'>
          <template slot-scope="scope">
            {{ scope.row.handle ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="handle(scope.row)" v-if="!scope.row.handle">处理</el-button>
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

import service from "@/utils/request";

const api = require("@/utils/api")
const StringUtils = require("@/utils/StringUtils")

const moment = require('moment');

export default {
  name: "HobbyApply",
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
        handle: '',
        userId: ''
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
      service.get(api.hobbyApply + "?start=" + start + "&end=" + end + "&page=" + page + "&size=" + this.query.size
          + "&handle=" + this.search.handle + "&userId=" + this.search.userId)
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
        handle: '',
        userId: ''
      };
      this.list(1);
    },
    handle(row) {
      if (StringUtils.isBlank(row.userId)) {
        service.put(api.hobbyApply + "/" + row.id).then(res => {
          this.$message.success("处理成功");
          this.list(this.query.page);
        })
      } else {
        this.$prompt('请输入处理意见', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{10,200}$/,
          inputErrorMessage: '比如输入10到200字'
        }).then(({value}) => {
          service.put(api.hobbyApply + "/" + row.id + "?content=" + value).then(res => {
            this.$message.success("处理成功");
            this.list(this.query.page);
          })
        }).catch(() => {
          console.log("取消")
        });
      }
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 300px;
}
</style>
