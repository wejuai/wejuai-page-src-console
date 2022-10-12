<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='el-icon-lx-people'></i>用户管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>系统用户信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <div>基础信息</div>
            <br>
            <table style='border-collapse:collapse;border:none;'>
                <tr>
                    <td>
                        头像<br>
                        <ImageBox :options='avatarOptions' ref='avatar'></ImageBox>
                    </td>
                </tr>
                <tr>
                    <td>昵称: {{ user.nickName }}
                        <el-button type='primary' @click='updateNickname' class='el-icon-edit'></el-button>
                    </td>
                    <td colspan='2'>简介: {{ user.inShort }}</td>
                    <td>
                        消息数: {{ user.msgNum }}
                        <el-button type='warning' @click='recalculateMsgNum'>重新计算未读消息数</el-button>
                    </td>
                    <td>
                        积分: {{ user.integral }} <br>
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
                    <td>生日:
                        <el-date-picker
                            v-model='birthday'
                            type='date'
                            format='yyyy 年 MM 月 dd 日'
                            value-format='timestamp'
                            @change='updateInfo'
                            placeholder='选择日期'>
                        </el-date-picker>
                    </td>
                    <td>年龄: {{ user.age }}</td>
                    <td>所在地: {{ user.location }}
                        <el-button type='primary' @click='updateLocation' class='el-icon-edit'></el-button>
                    </td>
                    <td>手机性能: {{ performance[user.performance] }}</td>
                    <td>性别:
                        <el-select v-model='updateUser.sex' placeholder='请选择' @change='updateInfo'>
                            <el-option :label="'男'" :value="'MAN'"></el-option>
                            <el-option :label="'女'" :value="'WOMAN'"></el-option>
                            <el-option :label="'其他'" :value="'INTERSEX'"></el-option>
                        </el-select>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import service from '@/utils/request';
import ImageBox from '@/components/common/ImageBox';

const api = require('@/utils/api');
const StringUtils = require('@/utils/StringUtils');
const moment = require('moment');

export default {
    name: 'UserInfo',
    components: {
        ImageBox
    },
    data() {
        return {
            moment: moment,
            birthday: '',
            user: {
                headImage: '',
                nickName: '',
                integral: 0,
                inShort: '',
                msgNum: 0,
                id: 'system',
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
                ban: ''
            },
            updateUser: {
                nickname: '',
                inShort: '',
                location: '',
                birthday: '',
                sex: ''
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
            avatarOptions: {
                maxUpdateSize: 5,
                minCropBoxWidth: 150,
                minCropBoxHeight: 150,
                zipNum: 0.5,
                showImage: '',
                type: 'HEAD_IMAGE',
                successFn: this.imageUpdateSuccessFn,
                credentialsUrl: api.updateImage
            }
        };
    },
    activated() {
        this.getUserInfo(this.user.id, (avatar) => {
            this.avatarOptions.showImage = avatar;
        });
    },
    methods: {
        imageUpdateSuccessFn(imageId) {
            this.user.headImage = imageId;
            service.put(api.updateSystemUser + '/avatar', { value: imageId })
                .then(res => {
                    this.$message.success('修改成功');
                });
        },
        getUserInfo(userId, fn) {
            service.get(api.baseUserApi + userId)
                .then(res => {
                    this.user = res.data;
                    this.birthday = moment(this.user.birthday, 'YYYY年MM月DD日').toDate();
                    this.updateUser.sex = this.user.sex;
                    fn(res.data.headImage);
                });
        },
        updatePhone() {
            this.$prompt('请输入手机号', '修改手机号', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/,
                inputErrorMessage: '手机格式不正确'
            }).then(({ value }) => {
                service.put(api.baseUserApi + this.user.id + '/phone', {
                    value: value
                }).then(res => {
                    this.$message.success('修改成功');
                    this.getUserInfo(this.user.id, (avatar) => {
                        this.avatarOptions.showImage = avatar;
                    });
                });
            });
        },
        updateLocation() {
            this.$prompt('输入所在地', '修改所在地', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                this.user.location = value;
                this.updateInfo();
            });
        },
        updateNickname() {
            this.$prompt('输入昵称', '修改昵称', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                this.user.nickName = value;
                this.updateInfo();
            });
        },
        updateInfo() {
            if (this.birthday.constructor === Date) {
                this.birthday = this.birthday.getTime();
            }
            this.updateUser.nickname = this.user.nickName;
            this.updateUser.inShort = this.user.inShort;
            this.updateUser.location = this.user.location;
            this.updateUser.birthday = this.birthday;
            service.put(api.updateSystemUser, this.updateUser)
                .then(res => {
                    this.$message.success('修改成功');
                    this.getUserInfo(this.user.id, (avatar) => {
                        this.avatarOptions.showImage = avatar;
                    });
                });
        },
        addIntegral() {
            this.$prompt('请输入添加的积分数量', '添加积分', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9]*$/,
                inputErrorMessage: '数字格式不正确'
            }).then(({ value }) => {
                service.post(api.integral + value + '/add?userId=' + this.user.id)
                    .then(res => {
                        this.$message.success('修改成功');
                        this.getUserInfo(this.user.id, (avatar) => {
                            this.avatarOptions.showImage = avatar;
                        });
                    });
            });
        },
        subIntegral() {
            this.$prompt('请输入减少的积分数量', '减少积分', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9]*$/,
                inputErrorMessage: '数字格式不正确'
            }).then(({ value }) => {
                if (value > this.user.integral) {
                    this.$message.warning('没有那么多积分');
                    return;
                }
                service.post(api.integral + value + '/sub?userId=' + this.user.id)
                    .then(res => {
                        this.$message.success('修改成功');
                        this.getUserInfo(this.user.id, (avatar) => {
                            this.avatarOptions.showImage = avatar;
                        });
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
                        this.getUserInfo(this.user.id, (avatar) => {
                            this.avatarOptions.showImage = avatar;
                        });
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
