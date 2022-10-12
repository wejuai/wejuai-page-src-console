<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='el-icon-lx-apps'></i> 应用管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>悬赏列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <div class='handle-box'>
                <el-input v-model='search.id' placeholder='id' clearable></el-input>&nbsp;&nbsp;
                <el-input v-model='search.userId' placeholder='用户id' clearable></el-input>&nbsp;&nbsp;
                <el-select v-model='search.del' clearable placeholder='是否已删除'>
                    <el-option :label="''" :value="''"></el-option>
                    <el-option :label="'是'" :value='true'></el-option>
                    <el-option :label="'否'" :value='false'></el-option>
                </el-select>&nbsp;&nbsp;
                <el-select v-model='search.status' clearable placeholder='状态'>
                    <el-option :label="''" :value="''"></el-option>
                    <el-option :label="'正常'" :value='"NORMAL"'></el-option>
                    <el-option :label="'锁定'" :value='"LOCKING"'></el-option>
                    <el-option :label="'已结束'" :value='"END"'></el-option>
                </el-select>&nbsp;&nbsp;
                <el-select v-model='search.hobbyId' clearable placeholder='爱好类型'>
                    <el-option v-for='item in hobbyList' :key='item.key' :label='item.value' :value='item.key'>
                    </el-option>
                </el-select>&nbsp;&nbsp;
                <el-date-picker :editable='false' v-model='search.createdAt' type='daterange'
                                :picker-options='pickerOptions'
                                range-separator='至'
                                start-placeholder='开始日期' end-placeholder='结束日期' value-format='yyyy-MM-dd'>
                </el-date-picker>&nbsp;&nbsp;
                <el-button @click='list(1)'>查询</el-button>&nbsp;&nbsp;
                <el-button @click='clear' style='margin: 0'>还原</el-button>
            </div>
            <el-table :data='tableData.content' border class='table' ref='multipleTable'
                      header-cell-class-name='table-header'>
                <el-table-column prop='id' label='id'></el-table-column>
                <el-table-column prop='userId' label='用户id'></el-table-column>
                <el-table-column prop='hobbyId' label='爱好id'></el-table-column>
                <el-table-column prop='createdAt' label='创建时间'></el-table-column>
                <el-table-column prop='title' label='标题'></el-table-column>
                <el-table-column prop='integral' label='积分'></el-table-column>
                <el-table-column label='是否已删除'>
                    <template slot-scope='scope'>
                        {{ scope.row.del ? '是' : '否' }}
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

export default {
    name: 'RewardDemandList',
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
                content: [{
                    id: '',
                    createdAt: '',
                    hobbyId: '',
                    integral: '',
                    title: '',
                    userId: '',
                    del: ''
                }]
            },
            search: {
                id: '',
                hobbyId: '',
                createdAt: '',
                del: '',
                type: '',
                userId: '',
                status: ''
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
                    return time.getTime() > Date.now() - 8.64e6;
                }
            },
            hobbyList: [{
                key: '',
                value: ''
            }]
        };
    },
    methods: {
        hobbySelectedList() {
            service.get(api.hobbySelectedList)
                .then((res) => {
                    this.hobbyList = res.data;
                });
        },
        list(page) {
            page = page > 0 ? page - 1 : 0;
            let start = '';
            let end = '';
            if (StringUtils.isNotBlank(this.search.createdAt)) {
                start = this.search.createdAt[0];
                end = this.search.createdAt[1];
            }
            service.get(api.rewardDemandBase + '?start=' + start + '&end=' + end + '&page=' + page
                + '&size=' + this.query.size + '&del=' + this.search.del + '&status=' + this.search.status
                + '&id=' + this.search.id + '&userId=' + this.search.userId + '&hobbyId=' + this.search.hobbyId)
                .then((res) => {
                    this.tableData = res.data;
                });
        },
        clear() {
            Object.assign(this.$data.query, this.$options.data().query);
            Object.assign(this.$data.search, this.$options.data().search);
            this.list(1);
        },
        gotoInfo(rewardDemandId) {
            this.$router.push({
                path: '/rewardDemandInfo',
                name: 'RewardDemandInfo',
                params: {
                    rewardDemandId: rewardDemandId
                }
            });
        }
    }
};
</script>

<style scoped>
.el-input {
    width: 200px;
}
</style>