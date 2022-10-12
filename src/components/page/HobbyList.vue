<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='wejuai-icon-aihao'></i>爱好管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>爱好列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <div class='handle-box'>
                <el-button @click='addHobby'>添加爱好</el-button>
            </div>
            <el-table :data='tableData.content' border class='table' ref='multipleTable'
                      header-cell-class-name='table-header'>
                <el-table-column prop='id' label='id'></el-table-column>
                <el-table-column label='头像'>
                    <template slot-scope='scope'>
                        <el-image class='cover' :src='scope.row.avatar'
                                  :preview-src-list='[scope.row.avatar]'></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop='name' label='名称'></el-table-column>
                <el-table-column prop='commented' label='评论数'></el-table-column>
                <el-table-column prop='created' label='创建数'></el-table-column>
                <el-table-column prop='followed' label='关注数'></el-table-column>
                <el-table-column prop='watched' label='阅读数'></el-table-column>
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
                               @current-change='handlePageChange'>
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>

import service from '@/utils/request';

const api = require('@/utils/api');
const StringUtils = require('@/utils/StringUtils');

export default {
    name: 'HobbyList',
    created() {
        this.getChargePage(1);
    },
    methods: {
        clear() {
            this.chargeDate = '';
            this.query.page = 1;
            this.getChargePage(1);
        },
        getChargePage(page) {
            page = page > 0 ? page - 1 : 0;
            let start = '';
            let end = '';
            if (StringUtils.isNotBlank(this.chargeDate)) {
                start = this.chargeDate[0];
                end = this.chargeDate[1];
            }
            service.get(api.hobbyBase + '?start=' + start + '&end=' + end + '&page=' + page + '&size=' + this.query.size)
                .then((res) => {
                    this.tableData = res.data;
                });
        },
        handlePageChange(val) {
            this.getChargePage(val);
        },
        addHobby() {
            this.$router.push('/addHobby');
        },
        gotoInfo(hobbyId) {
            this.$router.push({
                path: '/hobbyInfo',
                name: 'HobbyInfo',
                params: {
                    hobbyId: hobbyId
                }
            });
        }
    },
    data() {
        return {
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
                    return time.getTime() > Date.now() - 8.64e7;
                }
            },
            chargeDate: '',
            query: {
                page: 1,
                size: 10
            },
            tableData: {
                totalElements: 0,
                content: [{
                    id: '',
                    name: '',
                    avatar: '',
                    created: 0,
                    commented: 0,
                    followed: 0,
                    watched: 0
                }]
            }
        };
    }
};
</script>

<style scoped>
.cover {
    display: block;
    margin: auto;
    width: 60px;
}
</style>
