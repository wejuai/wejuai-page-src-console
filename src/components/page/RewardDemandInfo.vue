<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='el-icon-lx-apps'></i> 应用管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>悬赏详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <div class='handle-box'>
                <el-input v-model='rewardDemand.id' placeholder='悬赏id' clearable></el-input>&nbsp;&nbsp;&nbsp;
                <el-button @click='queryInfo'>查询</el-button>
            </div>
            <br>
            发布者信息<br><br>
            <table class='table2'>
                <tr>
                    <td>发布者: {{ rewardDemand.userId }}</td>
                    <td>昵称: {{ rewardDemand.nickName }}</td>
                    <td>
                        <el-image class='cover' :src='rewardDemand.headImage'
                                  :preview-src-list='[rewardDemand.headImage]'></el-image>
                    </td>
                </tr>
            </table>
            <el-divider></el-divider>
            悬赏信息<br><br>
            <table class='table1'>
                <tr>
                    <td>id: {{ rewardDemand.id }}</td>
                    <td>标题: {{ rewardDemand.title }}</td>
                    <td>爱好id: {{ rewardDemand.hobbyId }}</td>
                    <td>积分: <a style='color: red'>{{ rewardDemand.integral }}</a></td>
                    <td>状态: {{ status[rewardDemand.status] }}</td>
                    <td>
                        <el-button type='danger' @click='del'>删除悬赏</el-button>
                    </td>
                </tr>
                <tr>
                    <td>创建时间: {{ moment(new Date(rewardDemand.createdAt)).format('YYYY-MM-DD HH:mm:ss') }}</td>
                    <td colspan='2'>
                        结束时间: {{ rewardDemand.deadline }}
                        <el-button type='warning' @click='extension'>延期(一次15天)</el-button>
                    </td>
                    <td>是否延期过: <a style='color: red'>{{ rewardDemand.extension ? '是' : '否' }}</a></td>
                    <td>是否已删除: <a style='color: red'>{{ rewardDemand.del ? '是' : '否' }}</a></td>
                </tr>
                <tr>
                    <td>回答数: {{ rewardDemand.scoreLimit }}</td>
                    <td>收藏数: {{ rewardDemand.collectNum }}</td>
                    <td>评论数: {{ rewardDemand.commentNum }}</td>
                    <td>阅读数: {{ rewardDemand.displayNum }}</td>
                    <td>点赞数: {{ rewardDemand.starNum }}</td>
                </tr>
            </table>
            <el-divider></el-divider>
            主要内容<br><br>
            <br>
            <div style='border: #DCDFE6 1px solid;width: 800px;margin: auto;'>
                <div v-html='rewardDemand.text' style='padding: 50px'></div>
            </div>
            <br>
            <el-divider></el-divider>
            悬赏回答<br><br>
            <div class='handle-box'>
                <el-input v-model='search.userId' placeholder='用户id' clearable></el-input>&nbsp;&nbsp;&nbsp;
                <el-button @click='searchPage()'>查询</el-button>
            </div>
            <el-table :data='tableData.content' border class='table' ref='multipleTable'
                      header-cell-class-name='table-header'>
                <el-table-column prop='id' label='id'></el-table-column>
                <el-table-column prop='user.id' label='用户id'></el-table-column>
                <el-table-column prop='user.nickName' label='用户昵称'></el-table-column>
                <el-table-column prop='createdAt' label='创建时间'></el-table-column>
                <el-table-column prop='inShort' label='简略内容'></el-table-column>
                <el-table-column label='是否被选择'>
                    <template slot-scope='scope'>
                        {{ scope.row.selected ? '是' : '否' }}
                    </template>
                </el-table-column>
                <el-table-column label='操作'>
                    <template slot-scope='scope'>
                        <el-button type='primary' @click='gotoInfo(scope.row.id)'>查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class='pagination'>
                <el-pagination background layout='total, prev, pager, next'
                               :current-page='query.page'
                               :page-size='query.size'
                               :total='tableData.totalElements'
                               @current-change='list'>
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import service from '@/utils/request';

const api = require('@/utils/api');
const StringUtils = require('@/utils/StringUtils');
const moment = require('moment');

export default {
    name: 'RewardDemandInfo',
    activated() {
        const rewardDemandId = this.$route.params.rewardDemandId;
        if (StringUtils.isNotBlank(rewardDemandId)) {
            this.rewardDemand.id = rewardDemandId;
            this.getInfo();
        }
    },
    data() {
        return {
            rewardDemand: {
                id: '',
                createdAt: '',
                title: '',
                hobbyId: '',
                integral: '',
                collectNum: '',
                commentNum: '',
                displayNum: '',
                starNum: '',
                userId: '',
                nickName: '',
                headImage: '',
                text: '',
                del: '',
                deadline: '',
                rewardSubmissionCount: '',
                extension: '',
                scoreLimit: '',
                status: ''
            },
            status: {
                'END': '已结束',
                'LOCKING': '锁定中',
                'NORMAL': '正常'
            },
            moment: moment,
            query: {
                page: 1,
                size: 10
            },
            tableData: {
                totalElements: 0,
                content: []
            },
            search: {
                userId: ''
            }
        };
    },
    methods: {
        getInfo() {
            service.get(api.rewardDemandBase + '/' + this.rewardDemand.id)
                .then(res => {
                    this.rewardDemand = res.data;
                });
            this.searchPage();
        },
        queryInfo() {
            if (StringUtils.isBlank(this.rewardDemand.id)) {
                this.$message.warning('没有悬赏id');
            } else {
                this.getInfo();
            }
        },
        extension() {
            this.$confirm('此操作将延期悬赏截止时间15天, 是否继续?', '延期', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                service.put(api.rewardDemandBase + '/' + this.rewardDemand.id + '/extension')
                    .then(res => {
                        this.$message({
                            type: 'success',
                            message: '延期成功!'
                        });
                        this.queryInfo();
                    });

            }).catch(() => {
                console.log('取消延期');
            });
        },
        del() {
            this.$prompt('请输入删除原因', '删除悬赏', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{10,200}$/,
                inputErrorMessage: '删除原因必须输入10到200个字符'
            }).then(({ value }) => {
                service.delete(api.rewardDemandBase + '/' + this.rewardDemand.id + '?reason=' + value)
                    .then(res => {
                        this.$message({ type: 'success', message: '删除成功' });
                        this.getInfo();
                    });
            }).catch(err => {
                console.log(err);
            });
        },
        gotoInfo(rewardDemandSubMissionId) {
            this.$router.push({
                path: '/rewardDemandSubMissionInfo',
                name: 'RewardDemandSubMissionInfo',
                params: {
                    rewardDemandSubMissionId: rewardDemandSubMissionId
                }
            });
        },
        list(page) {
            page = page > 0 ? page - 1 : 0;
            service.get(api.rewardDemandBase + '/' + this.rewardDemand.id + '/rewardSubmissions?page=' + page + '&size=' + this.query.size
                + '&userId=' + this.search.userId)
                .then((res) => {
                    this.tableData = res.data;
                });
        },
        searchPage() {
            service.get(api.rewardDemandBase + '/' + this.rewardDemand.id + '/rewardSubmissions?userId=' + this.search.userId)
                .then((res) => {
                    this.tableData = res.data;
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