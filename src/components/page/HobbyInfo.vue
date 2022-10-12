<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='wejuai-icon-aihao'></i>爱好管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>爱好详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <div>图片(可修改)</div>
            <br>
            <div>
                <ImageBox :options='avatarOptions' ref='avatar'></ImageBox>
            </div>
            <el-divider></el-divider>
            <div>基础信息</div>
            <div>
                <table class='table'>
                    <tr>
                        <td>id: {{ hobby.id }}</td>
                        <td>名字: {{ hobby.name }}</td>
                        <td>热度点数: {{ hobby.point }}</td>
                        <td>阅读数: {{ hobby.watched }}</td>
                        <td>评论数: {{ hobby.commented }}</td>
                        <td>创建数: {{ hobby.created }}</td>
                        <td>关注数: {{ hobby.followed }}</td>
                    </tr>
                </table>
                <el-divider></el-divider>
                <div>星球信息</div>
                <table class='table'>
                    <tr>
                        <td>图片<br>
                            <el-image
                                class='cover'
                                :src='hobby.celestialBodyImage'
                                :preview-src-list='[hobby.celestialBodyImage]'></el-image>
                        </td>
                        <td>大小: {{ hobby.size }}km</td>
                        <td>坐标: [{{ hobby.x }}, {{ hobby.y }}]</td>
                    </tr>
                </table>
                <el-divider></el-divider>
                <div>搜索标签&nbsp;&nbsp;&nbsp;
                    <el-button type='primary' @click='addTab'>添加标签</el-button>
                </div>
                <el-table
                    :data='hobby.tabs' border class='table' header-cell-class-name='table-header'>
                    <el-table-column prop='id' label='id'></el-table-column>
                    <el-table-column prop='createdAt' :formatter='dateFormat' label='创建时间'></el-table-column>
                    <el-table-column prop='tab' label='搜索标签'></el-table-column>
                    <el-table-column label='操作'>
                        <template slot-scope='scope'>
                            <el-button type='danger' @click='delTab(scope.row.id)'>删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>

import ImageBox from '@/components/common/ImageBox';

import service from '@/utils/request';

const api = require('@/utils/api');
const moment = require('moment');

export default {
    name: 'HobbyInfo',
    components: {
        ImageBox
    },
    activated() {
        this.hobby.id = this.$route.params.hobbyId;
        this.getHobby((avatar) => {
            this.avatarOptions.showImage = avatar;
        });
    },
    data() {
        return {
            avatarOptions: {
                maxUpdateSize: 5,
                minCropBoxWidth: 500,
                minCropBoxHeight: 500,
                zipNum: 0.5,
                showImage: '',
                type: 'HOBBY',
                successFn: this.imageUpdateSuccessFn,
                credentialsUrl: api.updateSystemImage
            },
            hobby: {
                id: '',
                name: '',
                avatar: '',
                point: '',
                watched: '',
                commented: '',
                created: '',
                followed: '',
                celestialBodyImage: '',
                size: '',
                x: '',
                y: '',
                tabs: [{
                    id: '',
                    createdAt: '',
                    tab: ''
                }]
            }
        };
    },
    methods: {
        imageUpdateSuccessFn(imageId) {
            this.hobby.avatar = imageId;
            service.put(api.hobbyBase2 + this.hobby.id + '/avatar', { value: imageId })
                .then(res => {
                    this.$message.success('修改成功');
                });
        },
        getHobby(fn) {
            service.get(api.hobbyBase2 + this.hobby.id)
                .then(res => {
                    this.hobby = res.data;
                    if (fn !== undefined) {
                        fn(res.data.avatar);
                    }
                });
        },
        dateFormat(row, column) {
            const date = row[column.property];
            if (date === undefined) {
                return '';
            }
            return moment(date).format('YYYY-MM-DD HH:mm:ss');
        },
        delTab(id) {
            this.$confirm('是否真的要删除这个搜索标签', '删除标签', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                service.put(api.hobbyBase2 + this.hobby.id + '/tabs/sub', { tab: id })
                    .then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getHobby();
                    });
            }).catch(err => {
                console.log(err);
            });
        },
        addTab() {
            this.$prompt('请输出要添加的搜索标签', '添加标签', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{1,10}$/,
                inputErrorMessage: '搜索标签只能输入1到10个字符'
            }).then(({ value }) => {
                service.put(api.hobbyBase2 + this.hobby.id + '/tabs/add', { tab: value })
                    .then(res => {
                        this.$message({ type: 'success', message: '添加成功' });
                        this.getHobby();
                    });
            }).catch(err => {
                console.log(err);
            });
        }
    }
};
</script>

<style lang='scss'>

.table {

    margin-top: 30px;
    border-collapse: collapse;
    border: none;

    td {
        padding: 10px 10px;
        border: solid #DCDFE6 1px;
        width: 300px;
        text-align: center;
        color: #606266;
    }
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
