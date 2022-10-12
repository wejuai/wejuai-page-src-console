<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='el-icon-lx-apps'></i> 应用管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>文章详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <div class='handle-box'>
                <el-input v-model='article.id' placeholder='文章id' clearable></el-input>&nbsp;&nbsp;&nbsp;
                <el-button @click='query'>查询</el-button>
            </div>
            <table style='border-collapse:collapse;border:none;'>
                <tr>
                    <td>
                        封面图<br>
                        <el-image class='cover' :src='article.coverUrl'
                                  :preview-src-list='[article.coverUrl]'></el-image>
                    </td>
                    <td>
                        用户id: {{ article.userId }}<br>
                        用户昵称: {{ article.nickName }}<br>
                        <el-image class='avatar' :src='article.headImage'
                                  :preview-src-list='[article.headImage]'></el-image>
                    </td>
                    <td>
                        是否系统删除:
                        <a style='color: red'>{{ article.del === true ? '已删除' : '未删除' }}</a><br>
                        <el-button v-if='article.del===false' type='danger' @click='delArticle'>删除文章</el-button>
                        <el-button v-if='article.del===false&&article.authorDel===false' type='danger'
                                   @click='revokeArticle'>撤回文章
                        </el-button>
                    </td>
                    <td>
                        是否作者删除: {{ article.authorDel === true ? '已删除' : '未删除' }}
                    </td>
                </tr>
                <tr>
                    <td>id: {{ article.id }}</td>
                    <td>创建时间: {{ moment(new Date(article.createdAt)).format('YYYY-MM-DD HH:mm:ss') }}</td>
                    <td>标题: {{ article.title }}</td>
                    <td>爱好id: {{ article.hobbyId }}</td>
                    <td>积分: {{ article.integral }}</td>
                </tr>
                <tr>
                    <td>浏览数: {{ article.displayNum }}</td>
                    <td>评论数: {{ article.commentNum }}</td>
                    <td>点赞数: {{ article.starNum }}</td>
                    <td>收藏数: {{ article.collectNum }}</td>
                </tr>
            </table>
            <br>
            <br>
            主要内容
            <br>
            <br>
            <div style='border: #86878a 1px solid;width: 820px;margin: auto;'>
                <div v-html='article.text' class='content'></div>
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
    name: 'ArticleInfo',
    data() {
        return {
            article: {
                id: '',
                coverUrl: '',
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
                authorDel: ''
            },
            moment: moment
        };
    },
    activated() {
        const articleId = this.$route.params.articleId;
        if (StringUtils.isNotBlank(articleId)) {
            this.article.id = articleId;
            this.getInfo();
        }
    },
    methods: {
        getInfo() {
            service.get(api.articleBase + '/' + this.article.id)
                .then(res => {
                    this.article = res.data;
                });
        },
        query() {
            if (StringUtils.isBlank(this.article.id)) {
                this.$message.warning('没有文章id');
            } else {
                this.getInfo();
            }
        },
        delArticle() {
            this.$prompt('请输入删除原因', '删除文章', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{10,200}$/,
                inputErrorMessage: '删除原因必须输入10到200个字符'
            }).then(({ value }) => {
                service.delete(api.articleBase + '/' + this.article.id + '?reason=' + value)
                    .then(res => {
                        this.$message({ type: 'success', message: '删除成功' });
                        this.getInfo();
                    });
            }).catch(err => {
                console.log(err);
            });
        },
        revokeArticle() {
            this.$prompt('请输入撤回原因', '撤回文章', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9a-zA-Z\u4e00-\u9fa5]{10,200}$/,
                inputErrorMessage: '撤回原因必须输入10到200个字符'
            }).then(({ value }) => {
                service.post(api.articleBase + '/' + this.article.id + '/revoke', { reason: value })
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

<style scoped>
.el-input {
    width: 250px;
}

.cover {
    width: 500px;
    border: solid #DCDFE6 1px;
}

.avatar {
    width: 150px;
    border: solid #DCDFE6 1px;
}

td {
    padding: 10px 10px;
    border: solid #DCDFE6 1px;
    width: 300px;
    text-align: center;
    color: #606266;
}

.table-td-cover {
    width: 250px;
    border: solid #DCDFE6 1px;
}

.content >>> img{
    width: 800px;
}
</style>
