<template>
  <div>
    <div class='crumbs'>
      <el-breadcrumb separator='/'>
        <el-breadcrumb-item>
          <i class='el-icon-lx-people'></i>用户管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>用户详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class='container'>
      <div class='handle-box'>
        <el-input v-model='user.id' placeholder='用户id' clearable></el-input>&nbsp;&nbsp;&nbsp;
        <el-button @click='query'>查询</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        是否封号: {{ this.user.ban ? '是' : '否' }}
        <el-button type='danger' @click='ban'>{{ user.ban === true ? '解封' : '封禁' }}</el-button>
      </div>
      <div>基础信息</div>
      <br>
      <table style='border-collapse:collapse;border:none;'>
        <tr>
          <td>头像<br>
            <el-image
                class='cover'
                :src='user.headImage'
                :preview-src-list='[user.headImage]'></el-image>
          </td>
          <td>封面<br>
            <el-image
                class='table-td-cover'
                :src='user.cover'
                :preview-src-list='[user.cover]'></el-image>
          </td>
        </tr>
        <tr>
          <td>昵称: {{ user.nickName }}</td>
          <td colspan='2'>简介: {{ user.inShort }}</td>
          <td>
            消息数: {{ user.msgNum }}
            <el-button type='warning' @click='recalculateMsgNum'>重新计算未读消息数</el-button>
          </td>
          <td>
            积分: {{ user.integral }}<br>
              <el-button type='danger' @click='addIntegral'>添加积分
                  <i class='el-icon-top'></i>
              </el-button>
            <el-button type='danger' @click='subIntegral'>减少积分
              <i class='el-icon-bottom'></i>
            </el-button>
          </td>
        </tr>
        <tr>
          <td>用户id: {{ user.id }}</td>
          <td>账号id: {{ user.accountsId }}</td>
          <td>email: {{ user.email }}</td>
          <td>手机号: {{ user.phone }}
            <el-button type='primary' @click='updatePhone'>修改</el-button>
          </td>
          <td>最后一次ip: {{ user.ip }}</td>
        </tr>
        <tr>
          <td>生日: {{ user.birthday }}</td>
          <td>年龄: {{ user.age }}</td>
          <td>所在地: {{ user.location }}</td>
          <td>手机性能: {{ performance[user.performance] }}</td>
          <td>性别: {{ sex[user.sex] }}</td>
        </tr>
      </table>
      <br>
      <el-button type='danger' @click='dialog.transfer=true'>直接转账</el-button>
      <el-divider></el-divider>
      <h2>第三方账号</h2>
      <br>
      <div>微信</div>
      <br>
      <table style='border-collapse:collapse;border:none;'>
        <tr>
          <td style='width: 150px'>是否绑定: {{ user.weixin.has === true ? '是' : '否' }}</td>
          <td>创建时间: {{ user.weixin.createdAt }}</td>
          <td>头像<br>
            <el-image
                class='cover'
                :src='user.weixin.avatar'
                :preview-src-list='[user.weixin.avatar]'></el-image>
          </td>
          <td style='width: 150px'>省: {{ user.weixin.province }}</td>
          <td style='width: 150px'>城市: {{ user.weixin.city }}</td>
        </tr>
        <tr>
          <td style='width: 300px'>小程序Id: {{ user.weixin.appOpenId }}</td>
          <td style='width: 300px'>公众号Id: {{ user.weixin.offiOpenId }}</td>
          <td style='width: 300px'>webId: {{ user.weixin.openId }}</td>
          <td style='width: 300px'>unionId: {{ user.weixin.unionId }}</td>
          <td style='width: 100px'>
            <el-button type='primary' @click="delOauthDialog('WEIXIN')">重置第三方账号</el-button>
          </td>
        </tr>
      </table>
      <el-divider></el-divider>
      <div>QQ</div>
      <br>
      <table style='border-collapse:collapse;border:none;'>
        <tr>
          <td style='width: 150px'>是否绑定: {{ user.qq.has === true ? '是' : '否' }}</td>
          <td>创建时间: {{ user.qq.createdAt }}</td>
          <td>头像<br>
            <el-image
                class='cover'
                :src='user.qq.avatar'
                :preview-src-list='[user.qq.avatar]'></el-image>
          </td>
          <td style='width: 150px'>省: {{ user.qq.province }}</td>
          <td style='width: 150px'>城市: {{ user.qq.city }}</td>
          <td style='width: 400px'>openId: {{ user.qq.openId }}</td>
          <td style='width: 100px'>
            <el-button type='primary' @click="delOauthDialog('QQ')">重置第三方账号</el-button>
          </td>
        </tr>
      </table>
      <el-divider></el-divider>
      <div>微博</div>
      <br>
      <table style='border-collapse:collapse;border:none;'>
        <tr>
          <td style='width: 150px'>是否绑定: {{ user.weibo.has === true ? '是' : '否' }}</td>
          <td>创建时间: {{ user.weibo.createdAt }}</td>
          <td>头像<br>
            <el-image
                class='cover'
                :src='user.weibo.avatar'
                :preview-src-list='[user.weibo.avatar]'></el-image>
          </td>
          <td style='width: 400px'>openId: {{ user.weibo.openId }}</td>
          <td style='width: 100px'>
            <el-button type='primary' @click="delOauthDialog('WEIBO')">重置第三方账号</el-button>
          </td>
        </tr>
      </table>
      <el-divider></el-divider>
      <div>关注爱好
        <el-select v-model='selectedHobby' clearable placeholder='请选择'>
          <el-option
              v-for='item in hobbyList'
              :key='item.key'
              :label='item.value'
              :value='item.key'>
          </el-option>
        </el-select>
        <el-button @click='addHobbyDialog'>添加爱好</el-button>
      </div>
      <br>
      <el-table
          :data='hobby.hobbies' border class='table' ref='multipleTable' header-cell-class-name='table-header'>
        <el-table-column prop='id' label='id' width='200px'></el-table-column>
        <el-table-column prop='name' label='名字' width='200px'></el-table-column>
        <el-table-column label='图标'>
          <template slot-scope='scope'>
            <el-image
                class='cover'
                :src='scope.row.image'
                :preview-src-list='[scope.row.image]'
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label='操作'>
          <template slot-scope='scope'>
            <el-button type='primary' @click='subHobbyDialog(scope.row.id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-divider></el-divider>
      <div>公开爱好</div>
      <br>
      <el-table
          :data='hobby.openHobbies' border class='table' ref='multipleTable'
          header-cell-class-name='table-header'>
        <el-table-column prop='id' label='id' width='200px'></el-table-column>
        <el-table-column prop='name' label='名字' width='200px'></el-table-column>
        <el-table-column label='图标'>
          <template slot-scope='scope'>
            <el-image class='cover' :src='scope.row.image' :preview-src-list='[scope.row.image]'>
            </el-image>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title='添加爱好' :visible.sync='dialog.addHobby' width='30%'>
      <span>确定给该用户添加爱好吗</span>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='dialog.addHobby = false'>取 消</el-button>
        <el-button type='primary' @click='addHobby'>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title='删除爱好' :visible.sync='dialog.subHobby' width='30%'>
      <span>确定删除该用户的爱好吗</span>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='dialog.subHobby = false'>取 消</el-button>
         <el-button type='primary' @click='subHobby'>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title='重置第三方账号' :visible.sync='dialog.delOauth' width='30%'>
      <span>确定删除该用户的第三方账号吗</span>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='dialog.delOauth = false'>取 消</el-button>
         <el-button type='primary' @click='delOauth'>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title='直接转账' :visible.sync='dialog.transfer'>
      <el-form :model='transfer' ref='transfer' :rules='transferRules'>
        <el-form-item label='通道' :label-width="'300px'" prop='type'>
          <el-select v-model='transfer.type' placeholder='请选择'>
            <el-option label='微信' value='WEIXIN'></el-option>
            <el-option label='支付宝' value='ALIPAY'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='支付宝是账号, 微信是小程序openId' :label-width="'300px'" prop='cardNo'>
          <el-input v-model='transfer.cardNo' autocomplete='off'></el-input>
        </el-form-item>
        <el-form-item label='支付宝的姓名' :label-width="'300px'" v-if="transfer.type==='ALIPAY'">
          <el-input v-model='transfer.name'></el-input>
        </el-form-item>
        <el-form-item label='原因' :label-width="'300px'" prop='desc'>
          <el-input v-model='transfer.desc'></el-input>
        </el-form-item>
        <el-form-item label='金额(分)' :label-width="'300px'" prop='amount'>
          <el-input v-model.number='transfer.amount'></el-input>
        </el-form-item>
        <el-form-item label='转账密码' :label-width="'300px'" prop='password'>
          <el-input v-model='transfer.password'></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='closeTransfer'>取 消</el-button>
        <el-button type='danger' @click='transfer2User()'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import service from '@/utils/request';

const api = require('@/utils/api');
const StringUtils = require('@/utils/StringUtils');

export default {
  name: 'UserInfo',
  data() {
    return {
      user: {
        headImage: '',
        cover: '',
        nickName: '',
        integral: 0,
        inShort: '',
        msgNum: 0,
        id: '',
        accountsId: '',
        email: '',
        phone: '',
        ip: '',
        birthday: '',
        age: '',
        location: '',
        performance: '',
        sex: '',
        hobbyNum: '',
        ban: '',
        qq: {
          avatar: '',
          createdAt: '',
          has: '',
          id: '',
          nickName: '',
          openId: ''
        },
        weibo: {
          avatar: '',
          createdAt: '',
          has: '',
          id: '',
          nickName: '',
          openId: ''
        },
        weixin: {
          avatar: '',
          city: '',
          createdAt: '',
          has: '',
          id: '',
          nickName: '',
          openId: '',
          appOpenId: '',
          offiOpenId: '',
          unionId: '',
          province: ''
        }
      },
      dialog: {
        addHobby: false,
        subHobby: false,
        delOauth: false,
        transfer: false
      },
      hobby: {
        hobbies: [
          {
            'id': '',
            'image': '',
            'name': ''
          }
        ],
        openHobbies: [
          {
            'id': '',
            'image': '',
            'name': ''
          }
        ]
      },
      sex: {
        'INTERSEX': '未知',
        'WOMAN': '女',
        'MAN': '男'
      },
      performance: {
        'HIGH': '高',
        'LOW': '低',
        'NEW': '未测试'
      },
      selectedHobby: '',
      hobbyList: [
        {
          key: '',
          value: ''
        }
      ],
      subHobbyId: '',
      delOauthType: '',
      transfer: {
        amount: null,
        cardNo: '',
        name: '',
        type: '',
        desc: '',
        password: ''
      },
      transferRules: {
        amount: [
          {required: true, message: '金额不能为空'},
          {type: 'number', message: '金额必须为数字值'}
        ],
        cardNo: [
          {required: true, message: '账号不能为空'}
        ],
        type: [
          {required: true, message: '通道必须选择'}
        ],
        desc: [
          {required: true, message: '原因必填'}
        ],
        password: [
          {required: true, message: '转账密码必填'}
        ]
      }
    };
  },
  activated() {
    const userId = this.$route.params.userId;
    if (StringUtils.isNotBlank(userId)) {
      this.user.id = userId;
      this.getUserInfo(this.user.id);
      this.getHobby(this.user.id);
      this.hobbySelectedList();
    }
  },
  methods: {
    query() {
      if (StringUtils.isBlank(this.user.id)) {
        this.$message.warning('没有用户id');
      } else {
        this.getUserInfo(this.user.id);
        this.getHobby(this.user.id);
      }
    },
    getUserInfo(userId) {
      service.get(api.baseUserApi + userId)
          .then(res => {
            this.user = res.data;
          });
    },
    getHobby(userId) {
      service.get(api.baseUserApi + userId + '/hobby')
          .then(res => {
            this.hobby = res.data;
          });
    },
    subHobby() {
      if (StringUtils.isBlank(this.subHobbyId)) {
        this.$message.error('没有选择爱好');
      }
      service.put(api.baseUserApi + this.user.id + '/hobby/' + this.subHobbyId + '/sub')
          .then(res => {
            this.getHobby(this.user.id);
            this.dialog.subHobby = false;
          });
    },
    hobbySelectedList() {
      service.get(api.hobbySelectedList)
          .then((res) => {
            this.hobbyList = res.data;
          });
    },
    subHobbyDialog(hobbyId) {
      this.dialog.subHobby = true;
      this.subHobbyId = hobbyId;
    },
    addHobbyDialog() {
      if (StringUtils.isBlank(this.selectedHobby)) {
        this.$message.error('没有选择爱好');
      } else {
        this.dialog.addHobby = true;
      }
    },
    addHobby() {
      if (StringUtils.isBlank(this.selectedHobby)) {
        this.$message.error('没有选择爱好');
      }
      this.dialog.addHobby = false;
      service.put(api.baseUserApi + this.user.id + '/hobby/' + this.selectedHobby + '/add')
          .then(res => {
            this.$message.success('添加成功');
            this.getHobby(this.user.id);
          });
    },
    delOauthDialog(type) {
      if (type === 'WEIXIN' && !this.user.weixin.has) {
        this.$message.warning('该用户并未绑定微信');
        return;
      }
      if (type === 'QQ' && !this.user.qq.has) {
        this.$message.warning('该用户并未绑定QQ');
        return;
      }
      if (type === 'WEIBO' && !this.user.weibo.has) {
        this.$message.warning('该用户并未绑定微博');
        return;
      }
      this.delOauthType = type;
      this.dialog.delOauth = true;
    },
    delOauth() {
      if (StringUtils.isBlank(this.delOauthType)) {
        this.$message.error('没有选择删除第三方账号类型');
      }
      this.dialog.delOauth = false;
      service.put(api.baseUserApi + this.user.id + '/resetOtherUser/' + this.delOauthType)
          .then(res => {
            this.$message.success('删除成功');
            this.getUserInfo(this.user.id);
          });
    },
    updatePhone() {
      this.$prompt('请输入手机号', '修改手机号', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/,
        inputErrorMessage: '手机格式不正确'
      }).then(({value}) => {
        service.put(api.baseUserApi + this.user.id + '/phone', {
          value: value
        }).then(res => {
          this.$message.success('修改成功');
          this.getUserInfo(this.user.id);
        });
      });
    },
    addIntegral() {
      this.$prompt('请输入添加的积分数量', '添加积分', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9]*$/,
        inputErrorMessage: '数字格式不正确'
      }).then(({value}) => {
        service.post(api.integral + value + '/add?userId=' + this.user.id)
            .then(res => {
              this.$message.success('修改成功');
              this.getUserInfo(this.user.id);
            });
      });
    },
    subIntegral() {
      this.$prompt('请输入减少的积分数量', '减少积分', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9]*$/,
        inputErrorMessage: '数字格式不正确'
      }).then(({value}) => {
        if (value > this.user.integral) {
          this.$message.warning('没有那么多积分');
          return;
        }
        service.post(api.integral + value + '/sub?userId=' + this.user.id)
            .then(res => {
              this.$message.success('修改成功');
              this.getUserInfo(this.user.id);
            });
      });
    },
    transfer2User() {
      this.$refs['transfer'].validate((valid) => {
        if (valid) {
          service.post(api.transfer + '?password=' + encodeURIComponent(this.transfer.password), {
            amount: this.transfer.amount,
            cardNo: this.transfer.cardNo,
            desc: this.transfer.desc,
            type: this.transfer.type,
            userId: this.user.id
          }).then(res => {
            this.$message.success('转账成功');
          });
        }
      });
    },
    closeTransfer() {
      this.dialog.transfer = false;
      this.transfer = {};
      this.$refs['transfer'].resetFields();
    },
    ban() {
      this.$confirm(this.user.ban ? '是否真的要解封该用户' : '是否真的要封禁该用户', this.user.ban ? '解封' : '封禁', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.put(api.baseUserApi + this.user.id + '/ban?ban=' + !this.user.ban)
            .then(res => {
              this.$message.success('操作成功');
              this.getUserInfo(this.user.id);
            });
      });
    },
    recalculateMsgNum() {
      this.$confirm('是否重新计算该用户未读消息数量', '重新计算消息数量', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.put(api.baseUserApi + this.user.id + '/recalculateMsgNum')
            .then(res => {
              this.$message.success('操作成功');
              this.getUserInfo(this.user.id);
            });
      });
    }
  }
};
</script>

<style scoped>
.el-input {
  width: 250px;
}

td {
  padding: 10px 10px;
  border: solid #DCDFE6 1px;
  width: 300px;
  text-align: center;
  color: #606266;
}

.cover {
  width: 150px;
  border: solid #DCDFE6 1px;
}

.table-td-cover {
  width: 250px;
  border: solid #DCDFE6 1px;
}


</style>
