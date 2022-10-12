<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-message"></i> 消息管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统消息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="search.groupPush" clearable placeholder="是否群发">
          <el-option :label="''" :value="''"></el-option>
          <el-option :label="'是'" :value="true"></el-option>
          <el-option :label="'否'" :value="false"></el-option>
        </el-select>&nbsp;&nbsp;&nbsp;
        <el-input v-model="search.userId" placeholder="用户id" clearable style="width: 300px;"></el-input>&nbsp;&nbsp;&nbsp;
        <el-date-picker :editable="false" v-model="search.createdAt" type="daterange" :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>&nbsp;&nbsp;&nbsp;
        <el-button @click="list(1)">查询</el-button>
        <el-button @click="clear">还原</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="primary" @click="dialog.message=true">发送系统消息</el-button>
      </div>
      <el-table :data="tableData.content" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="id" label="id" width="200px"></el-table-column>
        <el-table-column prop="createdAt" :formatter="dateFormat" label="创建时间" width='200px'></el-table-column>
        <el-table-column prop="userId" label="用户id" width='200px'></el-table-column>
        <el-table-column prop="groupPush" label="是否群发" width='100px'></el-table-column>
        <el-table-column prop="watch" label="是否已读" width='100px'></el-table-column>
        <el-table-column prop="text" label="内容"></el-table-column>
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
    <el-dialog title="发送系统消息" :visible.sync="dialog.message">
      <el-form :model="message" ref="sendMessage" :rules="messageRules">
        <el-form-item label="是否群发" :label-width="'300px'" prop="groupPush">
          <el-select v-model="message.groupPush" placeholder="请选择">
            <el-option label="是" value="true"></el-option>
            <el-option label="否" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户id" :label-width="'300px'" prop="userId" v-if="message.groupPush==='false'">
          <el-input v-model="message.userId" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="'300px'" prop="text">
          <el-input v-model="message.text" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSendMessage">取 消</el-button>
        <el-button type="danger" @click="sendMessage()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import service from "@/utils/request";

const api = require("@/utils/api")
const StringUtils = require("@/utils/StringUtils")
const moment = require('moment');

export default {
  name: "SystemMessage",
  created() {
    this.list(1)
  },
  data() {
    const userIdRule = (rule, value, callback) => {
      if (this.message.groupPush === 'true' && StringUtils.isBlank(this.message.userId)) {
        callback(new Error('单独发送系统消息用户id必填'));
      } else {
        callback();
      }
    };
    return {
      search: {
        createdAt: '',
        userId: '',
        groupPush: ''
      },
      query: {
        page: 1,
        size: 10
      },
      tableData: {
        totalElements: 0,
        content: [{
          id: '',
          createdAt: '',
          text: '',
          groupPush: '',
          watch: ''
        }]
      },
      message: {
        groupPush: '',
        text: '',
        userId: ''
      },
      dialog: {
        message: false
      },
      messageRules: {
        groupPush: [
          {required: true, message: '是否群发必选'},
        ],
        userId: [
          {required: true, validator: userIdRule}
        ],
        text: [
          {required: true, message: '发送内容必填'},
        ]
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
      service.get(api.systemMessageList + "?start=" + start + "&end=" + end + "&page=" + page
          + "&size=" + this.query.size + "&groupPush=" + this.search.groupPush + "&userId=" + this.search.userId)
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
        groupPush: ''
      };
      this.list(1)
    },
    dateFormat(row, column) {
      const date = row[column.property];
      if (date === undefined) {
        return ''
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss")
    },
    sendMessage() {
      console.log(this.message.groupPush === 'true')
      this.$refs['sendMessage'].validate((valid) => {
        if (valid) {
          service.post(api.sendSystemMessage, {
            groupPush: this.message.groupPush === 'true',
            text: this.message.text,
            userId: this.message.userId
          }).then(res => {
            this.$message.success("发送成功");
            this.dialog.message = false
            this.list(1);
          })
        }
      });
    },
    closeSendMessage() {
      this.dialog.message = false;
      this.message = {};
      this.$refs['sendMessage'].resetFields();
    }
  }
}
</script>

<style scoped>

</style>