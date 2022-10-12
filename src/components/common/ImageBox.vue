<template>
  <div class="clipBgBox" :style="{ height: options.minCropBoxHeight+ 'px', width:options.minCropBoxWidth + 'px' }"
       v-loading="imgLoading"
       element-loading-text="拼命上传中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="clipImgBox">
      <img ref="clipImg" class="afterLoad" :class="{ 'load': !isImgLoadEnd }" :src="showImage" alt=""
           @load="isImgLoadEnd = true" :onerror="errorImg">
    </div>
    <div class="clipEventBox" ref="clipEventBox">
      <el-button type="info" size="mini" @click="updateClipBgImg"
                 :class="[isCanClipSubmit ? '':'hide', 'btn-class']" round>
        确认上传
      </el-button>
      <el-button type="info" size="mini" :class="[isCanClipSubmit ? '':'hide', 'btn-class']" round @click="cancel">
        取消修改
      </el-button>
      <el-button type="info" size="mini" class="btn-class upload-input-Box" round>
        <input type="file" @change="initUpdateBgImg" class="upload-input">选择图片
      </el-button>
    </div>
  </div>
</template>
<script>

import service from "@/utils/request";
import axios from "axios";

import $ from 'jquery';
import 'cropperjs';
import 'cropperjs/dist/cropper.css';
import 'jquery-cropper';

let api = require("@/utils/api")

export default {
    /** options：
     maxUpdateSize:5,                                        //最大文件大小
     minCropBoxWidth:1000,                                   //图片宽度
     minCropBoxHeight:300,                                   //图片高度
     zipNum:0.5,                                             //图片压缩率
     showImage: '',                                          //原来要展示的图片链接
     type:'COVER',                                           //接口文件类型
     beforeFn: this.imageUpdateBeforeFn(file),               //上传前回调function(文件)
     cancelFn: this.imageUpdateCancelFn(),                   //上传取消回调function()
     successFn: this.imageUpdateSuccessFn(imageId,base64url) //文件上传成功回调function
     credentialsUrl: api.updateImage                         //上传授权地址
     */
    props: ['options'],
  data() {
    return {
      isCanClipSubmit: false,
      showImage: '',
      fileDataName: '',
      isImgLoadEnd: false,
      imgLoading: false,
      defaultImg: '',//'this.src="' + require('../../assets/logo.png') + '"',
      defaultImgMax: '',//'this.src="' + require('../../assets/img/default_max.png') + '"',
      defaultImgMaxMax: '',//'this.src="' + require('../../assets/img/default_max_max.jpg') + '"',
    }
  },
  computed: {
    errorImg() {
      if (this.options.minCropBoxWidth > 300) {
        if (this.options.minCropBoxHeight > 350) {
          return this.defaultImgMaxMax
        } else {
          return this.defaultImgMax
        }
      } else {
        return this.defaultImg;
      }
    }
  },
  watch: {
    'options.showImage': {
      immediate: true,
      handler(val) {
        this.showImage = val;
      }
    }
  },
  methods: {
    beforeUpload(file) {
      let isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      let isLt2M = file.size / 1024 / 1024 < this.options.maxUpdateSize
      if (!isJPG) {
        this.$message.warning('上传图片只能是 JPG、PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.warning('上传图片大小不能超过 ' + this.options.maxUpdateSize + 'MB!');
      }
      if (!!this.options.beforeFn) {
        this.options.beforeFn(file);
      }
      return isJPG && isLt2M
    },
    initUpdateBgImg: function (e) {
      let _this = this;
      let thisDom = e.currentTarget;
      let file = thisDom.files[0];
      _this.fileDataName = '';
      if (!_this.beforeUpload(file)) return;
      _this.fileDataName = file.name;
      if (window.FileReader) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        //监听文件读取结束后事件
        reader.onloadend = function (e) {
          _this.showImage = e.target.result;
          _this.isCanClipSubmit = true;
          _this.initClipBgImg();
        };
      } else {
        _this.$nextTick(() => {
          this.$message.info('文件预览失败！')
        });
      }
    },
    initClipBgImg: function () {
      let _this = this;
      $('.cropper-container.cropper-bg').css('display', 'block');
      console.log($(_this.$refs.clipImg))
      $(_this.$refs.clipImg).cropper('destroy');
      _this.$nextTick(() => {
        $(_this.$refs.clipImg).cropper({
          aspectRatio: this.options.minCropBoxWidth / this.options.minCropBoxHeight,
          viewMode: 3,
          resizable: false,
          minCropBoxWidth: this.options.minCropBoxWidth,
          minCropBoxHeight: this.options.minCropBoxHeight,
          minContainerWidth: this.options.minCropBoxWidth,
          minContainerHeight: this.options.minCropBoxHeight,
        });
      })
    },
    updateClipBgImg: function () {
      let _this = this;
      let cas = $(_this.$refs.clipImg).cropper('getCroppedCanvas');
      let base64url = cas.toDataURL('image/png', this.options.zipNum);

      _this.imgLoading = true;
      service.get(this.options.credentialsUrl + this.options.type).then((res) => {
        let data = res.data;
        let fd = new FormData();
        let fileDataName = _this.fileDataName;
        let ossKey = data.prefix;
        fd.append('name', fileDataName);
        fd.append('key', ossKey);
        fd.append('policy', data.policy);
        fd.append('OSSAccessKeyId', data.ossAccessKeyId);
        fd.append('success_action_status', data.successActionStatus);
        fd.append('callback', data.callback);
        fd.append('signature', data.signature);
        fd.append('file', _this.dataURItoBlob(base64url));

        axios.post(data.url, fd)
            .then(function (res) {
              console.log("请求oss", res)
              const imageId = res.data.imageId;
              if (!!_this.options.successFn) {
                _this.options.successFn(imageId, base64url);
              }
              _this.showImage = base64url;
              $(_this.$refs.clipImg).cropper('destroy');
              _this.isCanClipSubmit = false;
              _this.imgLoading = false;
            })
      }).catch(function () {
        _this.imgLoading = false;
      })
    },
    dataURItoBlob(dataURI) {
      let byteString = atob(dataURI.split(',')[1]);
      let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      let ab = new ArrayBuffer(byteString.length);
      let ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], {type: mimeString});
    },
    cancel() {
      if (this.options.showImage) {
        this.showImage = this.options.showImage;
      } else {
        let src = this.errorImg.match(/\/static.+\.jpg/);
        $(this.$refs.clipImg)[0].src = src[0];
      }
      this.isCanClipSubmit = false;
      $('.cropper-container.cropper-bg').css('display', 'none');
      $(this.$refs.clipImg).removeClass('cropper-hidden');
      this.options.cancelFn();
    },
  }
}
</script>
<style lang='less' scoped>
.clipBgBox {
  /*width: 100%;*/
  /*height: 100%;*/
  background-color: #bebebe;
  position: relative;

  .clipEventBox {
    display: none;
    flex-direction: column;
    align-items: flex-end;
  }

  &:hover {
    .clipEventBox {
      display: flex;
    }
  }
}

.afterLoad {
  transition: all 1500ms;
}

.load {
  filter: blur(30px);
}

.clipImgBox {
  width: 100%;
  height: 100%;
  overflow: hidden;

  > img {
    width: 100%;
  }
}

.clipEventBox {
  position: absolute;
  top: 3px;
  right: 0;

  .upload-input-Box {
    position: relative;
  }

  .el-button {
    margin: 5px;
  }
}

.upload-input {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.btn-class {
  color: #fff;
  background-color: #62d1ff;
  border-color: #62d1ff;
}

.hide {
  display: none;
}
</style>
