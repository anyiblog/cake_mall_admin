<template>
    <div class="app-container">
        <el-upload
            action="http://cake.anyiblog.com:8080/UploadFile"
            list-type="picture-card"
            ref="upload"
            :auto-upload="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :multiple="true">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="uploadFile">上传</el-button>
    </div>
</template>

<script>
    export default {
        name: 'upload',
        methods: {
            // 上传成功
            uploadSuccess(response) {
                console.log(response)
                // this.fetchImgList(this.tag, this.limit, this.page)
                this.$message.success(response.msg)
                this.$refs.upload.clearFiles()
            },
            uploadError(err) {
                this.$message.success(err)
            },
            uploadFile() {
                this.$refs.upload.submit()
            },
        },
    }
</script>

<style scoped>

</style>
