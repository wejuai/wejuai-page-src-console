<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='el-icon-lx-apps'></i> 应用管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>发布系统文章</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <div>
                标题
                <el-input v-model='article.title' placeholder='请输入内容'></el-input>&nbsp;&nbsp;&nbsp;
                爱好
                <el-select v-model='article.hobbyId' clearable placeholder='爱好类型'>
                    <el-option
                        v-for='item in hobbyList'
                        :key='item.key'
                        :label='item.value'
                        :value='item.key'>
                    </el-option>
                </el-select>&nbsp;&nbsp;&nbsp;
                积分(整数):
                <el-input v-model='article.integral' placeholder='请输入内容' type='number'></el-input>&nbsp;&nbsp;&nbsp;
                <el-button type='warning' @click='clear'>清空</el-button>
            </div>
            <div>
                封面
                <ImageBox :options='coverOptions' ref='avatar'></ImageBox>
            </div>
            <div style='margin-top: 20px'>
                简介
                <el-input
                    type='textarea'
                    :rows='2'
                    placeholder='请输入内容'
                    v-model='article.inShort'>
                </el-input>
            </div>
            <br>
            <br>
            内容
            <div>
                <el-upload
                    :show-upload-list='false'
                    :on-success='uploadSuccess'
                    :on-error='uploadError'
                    :before-upload='uploadBefore'
                    :format="['jpg','jpeg','png','gif']"
                    :max-size='5000'
                    :data='uploadImageInfo'
                    :action='uploadUrl'
                    style='display: none'>
                    <el-button size='small' type='primary' id='text-upload'>点击上传</el-button>
                </el-upload>
            </div>

            <quill-editor
                v-model='article.text'
                :options='editorOption'
                ref='QuillEditor'>
            </quill-editor>
            <el-button class='editor-btn' type='primary' @click='submit'>提交</el-button>
        </div>
    </div>
</template>

<script>
import ImageBox from '@/components/common/ImageBox';
import service from '@/utils/request';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';

const api = require('@/utils/api');
const StringUtils = require('@/utils/StringUtils');

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']                                         // remove formatting button
];


export default {
    name: 'SendSystemArticle',
    components: {
        ImageBox,
        quillEditor
    },
    created() {
        this.hobbySelectedList();
    },
    activated() {
        const articleId = this.$route.params.articleId;
        if (StringUtils.isNotBlank(articleId)) {
            this.article.id = articleId;
            this.getInfo((cover) => {
                this.coverOptions.showImage = cover;
            });
        }
    },
    data() {
        return {
            article: {
                id: '',
                title: '',
                cover: '',
                hobbyId: '',
                inShort: '',
                text: '',
                integral: '',
                userId: 'system'
            },
            hobbyList: [{
                key: '',
                value: ''
            }],
            coverOptions: {
                maxUpdateSize: 5,
                minCropBoxWidth: 1000,
                minCropBoxHeight: 560,
                zipNum: 0.5,
                showImage: '',
                type: 'ARTICLE_HEAD',
                successFn: this.imageUpdateSuccessFn,
                credentialsUrl: api.updateImage
            },
            editorOption: {
                placeholder: '',
                modules: {
                    toolbar: {
                        container: toolbarOptions,  // 工具栏
                        handlers: {
                            'image': function(value) {
                                if (value) {
                                    document.getElementById('text-upload').click();
                                } else {
                                    this.quill.format('image', false);
                                }
                            }
                        }
                    }
                }
            },
            uploadUrl: '',
            uploadImageInfo: {
                name: '',
                key: '',
                ossAccessKeyId: '',
                policy: '',
                signature: '',
                callback: '',
                success_action_status: ''
            }
        };
    },
    methods: {
        getInfo(fn) {
            service.get(api.articleBase + '/' + this.article.id)
                .then(res => {
                    this.article = res.data;
                    this.article.cover = res.data.coverUrl;
                    fn(res.data.coverUrl);
                });
        },
        imageUpdateSuccessFn(imageId) {
            this.article.cover = imageId;
        },
        hobbySelectedList() {
            service.get(api.hobbySelectedList)
                .then((res) => {
                    this.hobbyList = res.data;
                });
        },
        submit() {
            service.post(api.sendSystemArticle + '?id=' + this.article.id, this.article)
                .then((res) => {
                    this.article.id = res.data.id;
                    this.$message.success('提交成功！');
                });

        },
        uploadError(err, file, fileList) {
            this.$message.error('图片上传失败！');
        },
        uploadSuccess(res, file, fileList) {
            // 如果上传成功
            if (res) {
                // 获取富文本组件实例
                let quill = this.$refs.QuillEditor.quill;
                // 获取光标所在位置
                let length = quill.getSelection().index;
                const imgTag = 'https://media.wejuai.com/' + res.url;
                // 插入图片，res为服务器返回的图片链接地址
                quill.insertEmbed(length, 'image', imgTag);
                quill.formatText(length, 1, { 'alt': '插图' });
                // 调整光标到最后
                quill.setSelection(length + 1);
            } else {
                // 提示信息，需引入Message
                this.$message.error('图片插入失败');
            }
        },
        clear() {
            this.article = {
                id: '',
                title: '',
                cover: '',
                hobbyId: '',
                inShort: '',
                text: '',
                integral: '',
                userId: 'system'
            };
        },
        async uploadBefore(file) {
            await service.get(api.updateImage + 'ARTICLE').then((res) => {
                const data = res.data;
                let fileName = data.prefix + file.name;//文件名，和后台约定
                this.uploadUrl = data.url;
                this.uploadImageInfo = {
                    name: file.name,
                    key: fileName,
                    ossAccessKeyId: data.ossAccessKeyId,
                    policy: data.policy,
                    signature: data.signature,
                    callback: data.callback,
                    success_action_status: data.successActionStatus
                };
            });
        }
    }
};
</script>

<style scoped>

.el-input {
    margin-left: 20px;;
    width: 300px;
}

.el-textarea {
    width: 500px;
}

.cover {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}

.editor-btn {
    margin-top: 20px;
}

.el-upload {
    display: none !important;
}
</style>
