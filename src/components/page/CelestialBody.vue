<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-global"></i> 星球管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="search.type" clearable placeholder="星球类型">
          <el-option :label="''" :value="''"></el-option>
          <el-option :label="'爱好'" :value="'HOBBY'"></el-option>
          <el-option :label="'用户'" :value="'USER'"></el-option>
          <el-option :label="'无主之地'" :value="'UNOWNED'"></el-option>
        </el-select>&nbsp;&nbsp;&nbsp;
        <el-input v-model="search.typeId" placeholder="类型id" clearable style="width: 300px"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-input v-model="search.id" placeholder="星球id(星球id填写后其他参数忽略)" clearable style="width: 300px"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button @click="list(1)">查询</el-button>&nbsp;&nbsp;&nbsp;
        <el-button @click="clear">还原</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button @click="rebuild" type="danger">重建星球</el-button>
      </div>
      <el-table :data="tableData.content" border class="table" ref="multipleTable"
                header-cell-class-name="table-header">
        <el-table-column prop="id" label="id" width="200px"></el-table-column>
        <el-table-column label="图片" width="200px">
          <template slot-scope="scope">
            <div style="height: 160px">
              <div style="position:relative">
                <img :src="scope.row.smallBackground" style="position:absolute;left:20px;top:5px;width: 150px" alt=""/>
                <img :src="scope.row.smallTexture"
                     :style="'position:absolute;left:20px;top:5px;width: 150px;transform:rotate('+ scope.row.angle+'deg);'"
                     alt=""/>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100px">
          <template slot-scope="scope">
            {{ type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="point" label="点数" width="100px"></el-table-column>
        <el-table-column prop="size" label="星球大小" width="80px"></el-table-column>
        <el-table-column label="坐标" width="100px">
          <template slot-scope="scope">
            [{{ scope.row.x }}, {{ scope.row.y }}]
          </template>
        </el-table-column>
        <el-table-column label="类型id" width="200px">
          <template slot-scope="scope">
            <a v-if="scope.row.type!=='UNOWNED'">
              {{ scope.row.type === 'USER' ? scope.row.userInfo.id : scope.row.hobbyInfo.id }}
            </a>
          </template>
        </el-table-column>
        <el-table-column label="类型名称">
          <template slot-scope="scope">
            <a v-if="scope.row.type!=='UNOWNED'">
              {{ scope.row.type === 'USER' ? scope.row.userInfo.nickName : scope.row.hobbyInfo.name }}
            </a>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="updatePoint(scope.row.id)">修改点数</el-button>
            <el-button v-if="scope.row.type === 'USER'" type="warning" @click="syncPoint(scope.row.userInfo.id)">同步点数
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
import service from "@/utils/request";

const api = require("@/utils/api")
const StringUtils = require("@/utils/StringUtils")

export default {
  name: "CelestialBody",
  data() {
    return {
      search: {
        type: '',
        typeId: '',
      },
      query: {
        page: 1,
        size: 10
      },
      tableData: {
        totalElements: 0,
        content: [{
          id: '',
          smallImage: '',
          point: 0,
          size: 0,
          x: '',
          y: '',
          type: '',
          hobbyInfo: {
            id: '',
            name: '',
          },
          userInfo: {
            id: '',
            nickName: '',
          }
        }]
      },
      type: {
        "USER": "用户",
        "HOBBY": "爱好",
        "UNOWNED": "无主之地",
      },
      image: {
        back: '',
        up: '',
        angle: 0
      }
    }
  },
  created() {
    this.list(1);
  },
  methods: {
    list(page) {
      page = page > 0 ? page - 1 : 0;
      if ((StringUtils.isNotBlank(this.search.type) && StringUtils.isBlank(this.search.typeId))
          || StringUtils.isBlank(this.search.type) && StringUtils.isNotBlank(this.search.typeId)) {
        this.$message.error("类型和类型id必须同时填写");
        return;
      }
      service.get(api.celestialBodyList + "?page=" + page + "&size=" + this.query.size + "&type="
          + this.search.type + "&typeId=" + this.search.typeId)
          .then((res) => {
            this.tableData = res.data;
          });
    },
    clear() {
      this.search = {
        type: '',
        typeId: '',
      };
      this.list(1);
    },
    updatePoint(id) {
      this.$prompt('增加是正数(如10), 减少是负数(如-10)', '修改点数', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(\-?)\d+(\.\d+)?$/,
        inputErrorMessage: '点数只能输入正负整数'
      }).then(({value}) => {
        service.put(api.celestialBodyBase + id + "/point/" + value,)
            .then(() => {
              this.$message({type: 'success', message: '修改成功'});
              this.list(this.query.page);
            });
      }).catch(err => {
        console.log(err)
      })
    },
    syncPoint(userId) {
      service.post(api.celestialBodyBase + "/sync/user/" + userId)
          .then(res => {
            const message = res.data.correct ? '积分正确' : '积分有问题, 原积分: ' + res.data.hasIntegral + ", 实际积分: " + res.data.actualIntegral;
            if (res.data.correct) {
              this.$message({type: 'success', message: message});
            } else {
              this.$message({type: 'warning', message: message});
            }
            this.list(this.query.page);
          });
    },
    rebuild() {
      this.$confirm('此操作将创建重建无星球的爱好用户的星球', '是否重建', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.post(api.celestialBodyRebuild)
            .then(() => {
              this.$message({type: 'success', message: '操作成功'});
              this.list(this.query.page);
            });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  }
}
</script>

<style scoped>
.cover {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}

</style>