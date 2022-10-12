<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='wejuai-icon-aihao'></i>爱好管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>添加爱好</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <el-form :model='hobby' :rules='rules' ref='addHobbyForm' label-width='100px' class='demo-ruleForm'>
                <el-form-item label='id' prop='id'>
                    <el-input v-model='hobby.id' placeholder='id一般为爱好的英文单词'></el-input>
                </el-form-item>
                <el-form-item label='爱好名称' prop='name'>
                    <el-input v-model='hobby.name' placeholder='爱好名称'></el-input>
                </el-form-item>
                <el-form-item label='图片' prop='avatar'>
                    <ImageBox :options='avatarOptions'></ImageBox>
                </el-form-item>
                <el-form-item
                    v-for='(domain, index) in hobby.domains'
                    :label="'搜索标签' + (index+1)"
                    :key='domain.key'
                    :prop="'domains.' + index + '.value'"
                    :rules="{required: true,type:'string',message:'标签必填'}">
                    <el-input v-model='domain.value' placeholder='爱好搜索关键字'></el-input>&nbsp;&nbsp;&nbsp;
                    <el-button @click.prevent='removeDomain(domain)'>删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' @click="submitForm('addHobbyForm')">提交</el-button>
                    <el-button @click='addDomain'>添加标签</el-button>
                    <el-button @click="resetForm('addHobbyForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import ImageBox from '@/components/common/ImageBox';
import Vue from 'vue';
import service from '@/utils/request';
import bus from '../common/bus';
import axios from 'axios';

const api = require('@/utils/api');
const StringUtils = require('@/utils/StringUtils');

export default {
    name: 'AddHobby',
    components: {
        ImageBox
    },
    data() {
        const avatarRule = (rule, value, callback) => {
            if (StringUtils.isBlank(value)) {
                callback(new Error('爱好图片必须上传'));
            } else {
                callback();
            }
        };
        return {
            avatarOptions: {
                maxUpdateSize: 5,
                minCropBoxWidth: 500,
                minCropBoxHeight: 500,
                zipNum: 0.5,
                showImage: '',
                type: 'HOBBY',
                beforeFn: this.imageUpdateBeforeFn,
                cancelFn: this.imageUpdateCancelFn,
                successFn: this.imageUpdateSuccessFn,
                credentialsUrl: api.updateSystemImage
            },
            hobby: {
                id: '',
                name: '',
                avatar: '',
                tabs: [''],
                domains: [{
                    value: ''
                }]
            },
            rules: {
                name: [
                    { required: true, message: '请输入爱好名称', trigger: 'change' }
                ],
                id: [
                    {
                        required: true,
                        type: 'string',
                        pattern: /^[a-z]{1,32}$/,
                        message: 'id必须是0到32位的小写英文',
                        trigger: 'change'
                    }
                ],
                avatar: [
                    { required: true, validator: avatarRule, trigger: 'change' }
                ]
            }
        };
    },
    activated() {
        this.resetForm('addHobbyForm');
    },
    created() {
        axios.get('/console/api/check').catch((err) => {
            if (err.response.status === 401) {
                this.$router.push('/');
            }
        });
    },
    methods: {
        imageUpdateBeforeFn(file) {
        },
        imageUpdateCancelFn() {
        },
        imageUpdateSuccessFn(imageId, base64url) {
            this.hobby.avatar = imageId;
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.hobby.tabs.length < 1) {
                        this.$message.error('爱好搜索标签最少也要有一个');
                        return;
                    }
                    this.hobby.tabs = this.hobby.domains.map(i => i.value);
                    Vue.delete(this.hobby, 'domains');
                    service.post(api.hobbyBase, this.hobby)
                        .then(res => {
                            this.$message.success('添加成功');
                            bus.$emit('close_current_tags', '/hobbyList');
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.hobby.domains = [{
                value: ''
            }];
            this.$refs[formName].resetFields();
        },
        removeDomain(item) {
            const index = this.hobby.domains.indexOf(item);
            if (index !== -1) {
                this.hobby.domains.splice(index, 1);
            }
        },
        addDomain() {
            this.hobby.domains.push({
                value: '',
                key: Date.now()
            });
        }
    }
};
</script>

<style scoped>
.el-input {
    width: 300px;
}
</style>
