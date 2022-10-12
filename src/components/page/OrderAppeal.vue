<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="wejuai-icon-dingdan"></i> 订单管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>订单申诉</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="search.userId" placeholder="用户id" clearable></el-input>&nbsp;&nbsp;
        <el-select v-model="search.type" clearable placeholder="申诉类型">
          <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>&nbsp;&nbsp;
        <el-select v-model="search.status" clearable placeholder="申诉状态">
          <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
        <el-table-column prop="createdAt" label="创建时间" width="150px"></el-table-column>
        <el-table-column prop="userId" label="用户id" width="190px"></el-table-column>
        <el-table-column label="类型" width="60x">
          <template slot-scope="scope">
            {{ typeMap[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="typeId" label="类型对应单id" width="190px"></el-table-column>
        <el-table-column label="状态" width="60px">
          <template slot-scope="scope">
            {{ statusMap[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column prop="question" label="用户问题"></el-table-column>
        <el-table-column prop="completedAt" label="处理时间" width="150px"></el-table-column>
        <el-table-column prop="rejectionReason" label="驳回原因"></el-table-column>
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
    <el-dialog title="处理" :visible.sync="dialog.handle">
      <el-form :model="handle" ref="handle" :rules="handleRules">
        <el-form-item label="是否通过" :label-width="'300px'" prop="pass">
          <el-select v-model="handle.pass" placeholder="请选择">
            <el-option :label="'通过'" :value="true"></el-option>
            <el-option :label="'驳回'" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="驳回原因" :label-width="'300px'" v-if="handle.pass===false" prop="rejectionReason">
          <el-input v-model="handle.rejectionReason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeHandle">取 消</el-button>
        <el-button type="danger" @click="handleFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import service from "@/utils/request";

const api = require("@/utils/api")
const StringUtils = require("@/utils/StringUtils")

export default {
  name: "OrderAppeal",
  created() {
    this.list(1)
  },
  data() {
    const rejectionReasonRule = (rule, value, callback) => {
      if (this.handle.pass === 'false' && StringUtils.isBlank(value)) {
        callback(new Error('驳回原因必填'));
      } else {
        callback();
      }
    };
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
          userId: '',
          type: '',
          typeId: '',
          question: '',
          status: '',
          completedAt: '',
          rejectionReason: ''
        }]
      },
      search: {
        status: '',
        createdAt: '',
        type: '',
        userId: ''
      },
      type: [
        {label: "订单", value: "ORDERS"},
        {label: "充值", value: "RECHARGE"},
        {label: "提现", value: "WITHDRAWAL"},
      ],
      typeMap: {
        "ORDERS": "订单",
        "RECHARGE": "充值",
        "WITHDRAWAL": "提现"
      },
      status: [
        {label: "未通过", value: "NOT_PASS"},
        {label: "通过", value: "PASS"},
        {label: "未处理", value: "UNTREATED"},
      ],
      statusMap: {
        "UNTREATED": "未处理",
        "NOT_PASS": "未通过",
        "PASS": "通过"
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
        },
      },
      dialog: {
        handle: false
      },
      handle: {
        pass: '',
        rejectionReason: '',
        id: ''
      },
      handleRules: {
        pass: [
          {required: true, message: '是否通过必须选择', trigger: 'change'}
        ],
        rejectionReason: [
          {required: true, validator: rejectionReasonRule}
        ],
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
      service.get(api.orderAppealList + "?start=" + start + "&end=" + end + "&page=" + page + "&status=" + this.search.status
          + "&size=" + this.query.size + '&type=' + this.search.type + '&userId=' + this.search.userId)
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
        status: '',
        createdAt: '',
        type: '',
        userId: ''
      };
      this.list(1)
    },
    handleDialog(id) {
      this.handle.id = id;
      this.dialog.handle = true;
    },
    closeHandle() {
      this.dialog.handle = false;
      this.handle = {};
      this.$refs['handle'].resetFields();
    },
    handleFn() {
      this.$refs['handle'].validate((valid) => {
        if (valid) {
          if (this.handle.pass) {
            service.put(api.orderAppealBase + this.handle.id + "/pass").then(res => {
              this.$message.success("提交成功")
              this.list(this.query.page)
            })
          } else {
            service.put(api.orderAppealBase + this.handle.id + "/unPass", {rejectionReason: this.handle.rejectionReason})
                .then(res => {
                  this.$message.success("提交成功")
                  this.list(this.query.page)
                })
          }
          this.dialog.handle = false;
          this.handle = {}
          this.$refs['handle'].resetFields();
        }
      });
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 200px;
}
</style>