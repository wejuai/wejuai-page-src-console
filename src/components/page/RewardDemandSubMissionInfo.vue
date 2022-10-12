<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='el-icon-lx-apps'></i> 应用管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>悬赏回答详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <div class='handle-box'>
                <el-input v-model='rewardDemandSubmission.id' placeholder='悬赏回答id' clearable></el-input>&nbsp;&nbsp;&nbsp;
                <el-button @click='query'>查询</el-button>
            </div>
            <h1>回答详情</h1><br>
            <table class='table2'>
                <tr>
                    <td>id: {{ rewardDemandSubmission.id }}</td>
                    <td>创建时间:
                        {{ moment(new Date(rewardDemandSubmission.createdAt)).format('YYYY-MM-DD HH:mm:ss') }}
                    </td>
                    <td>回答者: {{ rewardDemandSubmission.user.id }}</td>
                    <td>回答者昵称: {{ rewardDemandSubmission.user.nickName }}</td>
                    <td>是否被选中: {{ rewardDemandSubmission.selected ? '是' : '否' }}</td>
                </tr>
                <tr>
                    <td colspan='4'>简略内容: {{ rewardDemandSubmission.inShort }}</td>
                    <td><el-button type='danger' @click='revokeSubmission'>撤回回答</el-button></td>
                </tr>
            </table>
            <br>
            主要内容
            <br>
            <br>
            <div style='border: #DCDFE6 1px solid;width: 800px;margin: auto;'>
                <div v-html='rewardDemandSubmission.text' style='padding: 50px'></div>
            </div>
            <el-divider></el-divider>
            <h1>悬赏信息</h1><br>
            <table class='table2'>
                <tr>
                    <td>id: {{ rewardDemandSubmission.rewardDemandInfo.id }}</td>
                    <td>发布者: {{ rewardDemandSubmission.rewardDemandInfo.userId }}</td>
                    <td>创建时间:
                        {{ moment(new Date(rewardDemandSubmission.rewardDemandInfo.createdAt)).format('YYYY-MM-DD HH:mm:ss') }}
                    </td>
                    <td>标题: {{ rewardDemandSubmission.rewardDemandInfo.title }}</td>
                    <td>状态: {{ status[rewardDemandSubmission.rewardDemandInfo.status] }}</td>
                </tr>
                <tr>
                    <td>爱好id: {{ rewardDemandSubmission.rewardDemandInfo.hobbyId }}</td>
                    <td>积分: <a style='color: red'>{{ rewardDemandSubmission.rewardDemandInfo.integral }}</a></td>
                    <td>状态: {{ status[rewardDemandSubmission.rewardDemandInfo.status] }}</td>
                    <td>结束时间: {{ rewardDemandSubmission.rewardDemandInfo.deadline }}</td>
                    <td>是否已删除: <a style='color: red'>{{ rewardDemandSubmission.rewardDemandInfo.del ? '是' : '否' }}</a>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import service from '@/utils/request';

const api = require('@/utils/api');
const StringUtils = require('@/utils/StringUtils');
const moment = require('moment');

export default {
    name: 'RewardDemandSubMissionInfo',
    activated() {
        const rewardDemandSubmission = this.$route.params.rewardDemandSubMissionId;
        if (StringUtils.isNotBlank(rewardDemandSubmission)) {
            this.rewardDemandSubmission.id = rewardDemandSubmission;
            this.getInfo();
        }
    },
    data() {
        return {
            rewardDemandSubmission: {
                createdAt: '',
                id: '',
                inShort: '',
                rewardDemandInfo: {
                    createdAt: '',
                    deadline: '',
                    del: '',
                    extension: '',
                    hobbyId: '',
                    id: '',
                    integral: '',
                    rewardSubmissionCount: '',
                    scoreLimit: '',
                    status: '',
                    title: '',
                    userId: ''
                },
                selected: '',
                text: '',
                user: {
                    buyerScore: '',
                    headImage: '',
                    id: '',
                    inShort: '',
                    nickName: '',
                    sellerScore: ''
                }
            },
            status: {
                'END': '已结束',
                'LOCKING': '锁定中',
                'NORMAL': '正常'
            },
            moment: moment
        };
    },
    methods: {
        getInfo() {
            service.get(api.rewardDemandBase + '/rewardSubmission/' + this.rewardDemandSubmission.id)
                .then(res => {
                    this.rewardDemandSubmission = res.data;
                });
        },
        query() {
            if (StringUtils.isBlank(this.rewardDemandSubmission.id)) {
                this.$message.warning('没有悬赏回答id');
            } else {
                this.getInfo();
            }
        },
        del() {
            this.$prompt('请输入删除原因', '删除悬赏', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{10,200}$/,
                inputErrorMessage: '删除原因必须输入10到200个字符'
            }).then(({ value }) => {
                service.delete(api.rewardDemandBase + '/' + this.rewardDemandSubmission.rewardDemandInfo.id + '?reason=' + value)
                    .then(res => {
                        this.$message({ type: 'success', message: '删除成功' });
                        this.getInfo();
                    });
            }).catch(err => {
                console.log(err);
            });
        },
        revokeSubmission() {
            this.$prompt('撤回回答会删除回答并且存入回答者的草稿箱，请输入撤回原因', '撤回回答', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{10,200}$/,
                inputErrorMessage: '撤回原因必须输入10到200个字符'
            }).then(({ value }) => {
                service.post(api.rewardDemandBase + '/rewardSubmission' + this.rewardDemandSubmission.id + '/revoke', { reason: value })
                    .then(res => {
                        this.$message({ type: 'success', message: '撤回成功' });
                        this.getInfo();
                    });
            }).catch(err => {
                console.log(err);
            });
        }
    }
};
</script>

<style lang='less' scoped>
.el-input {
    width: 250px;
}

.cover {
    width: 100px;
    border: solid #DCDFE6 1px;
}

.avatar {
    width: 150px;
    border: solid #DCDFE6 1px;
}

td {
    padding: 10px 10px;
    border: solid #DCDFE6 1px;
    text-align: center;
    color: #606266;
}

table {
    border-collapse: collapse;
    border: none;
}

.table1 {
    td {
        width: 250px;
    }
}

.table2 {
    td {
        width: 300px;
    }
}


</style>