<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-people"></i> 用户管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="search.id" placeholder="id" clearable></el-input>&nbsp;&nbsp;&nbsp;
        <el-input v-model="search.email" placeholder="email" clearable suffix-icon="el-icon-lx-mail"></el-input>&nbsp;&nbsp;&nbsp;
        <el-input v-model="search.phone" placeholder="手机号" clearable suffix-icon="el-icon-phone"></el-input>&nbsp;&nbsp;&nbsp;
        <el-input v-model="search.nickname" placeholder="昵称" clearable></el-input>&nbsp;&nbsp;&nbsp;
        <el-date-picker :editable="false" v-model="search.createdAt" type="daterange" :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>&nbsp;&nbsp;&nbsp;
        <el-button @click="list(1)">查询</el-button>
        <el-button @click="clear">还原</el-button>
      </div>
      <el-table
          :data="tableData.content" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="id" width="200px"></el-table-column>
        <el-table-column prop="accountsId" label="账号id" width="200px"></el-table-column>
        <el-table-column prop="createdAt" label="注册时间"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope">
            <el-image
                class='cover'
                :src="scope.row.headImage"
                :preview-src-list="[scope.row.headImage]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="birthday" label="生日"></el-table-column>
        <el-table-column prop="age" label="年龄"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            {{ scope.row.sex == null ? "" : sex[scope.row.sex] }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="gotoInfo(scope.row.id)">查看详情</el-button>
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
export default {
  name: "User",
  created() {
    this.list(1);
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
      service.get(api.userList + "?start=" + start + "&end=" + end + "&page=" + page
          + "&size=" + this.query.size + "&id=" + this.search.id + "&email=" + this.search.email + "&phone="
          + this.search.phone + "&nickname=" + this.search.nickname)
          .then((res) => {
            this.tableData = res.data;
          });
    },
    clear() {
      this.search.email = '';
      this.search.createdAt = '';
      this.search.id = '';
      this.search.phone = '';
      this.search.nickname = '';
      this.list(1);
    },
    gotoInfo(userId) {
      this.$router.push({
        path: '/userInfo',
        name: 'UserInfo',
        params: {
          userId: userId
        }
      })
    }
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
        email: '',
        createdAt: '',
        id: '',
        phone: '',
        nickname: ''
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
      sex: {
        "INTERSEX": '未知',
        "WOMAN": '女',
        "MAN": '男',
      }
    }
  }
}
</script>

<style scoped>

.el-input {
  width: 150px;
}

.cover {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}

</style>