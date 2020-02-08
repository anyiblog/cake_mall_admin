<template>
    <div class="app-container">
        <el-form :inline="true" :model="addTagName" class="demo-form-inline">
            <el-form-item label="分类名">
                <el-input v-model="addTagName.name" placeholder="图片分类名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">添加</el-button>
            </el-form-item>
        </el-form>
        <el-tabs
            :tab-position="tabPosition"
            type="card"
            v-loading="loadingStatus"
            @tab-click="changeTab">
            <template v-for="tab in tabList">
                <el-tab-pane
                    class="list_wrap"
                    :label="tab.tag_name"
                >
                    <div class="image_list">
                        <div class="image_list_item" v-for="(item,key) in imgList">
                            <el-image
                                style="width: 100%; height: 100%;"
                                :src="item.img_url"
                                :preview-src-list="previewList">
                            </el-image>
                            <div class="img_meta">
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="imgEdit(key)">编辑
                                </el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete" @click="imgDelete(key)">删除
                                </el-button>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </template>
        </el-tabs>
        <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="limit"
            layout="total, prev, pager, next, jumper"
            :total="count">
        </el-pagination>
        <el-dialog title="图片编辑" :visible.sync="dialogImgEditStatus">
            <el-form :model="form">
                <el-form-item label="所属分类">
                    <el-select v-model="form.tagId" placeholder="更改所属分类">
                        <template v-for="(tagItem,key) in tabList">
                            <el-option :label="tagItem.tag_name" :value="tabList[key].tag_name"></el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片链接">
                    <el-input
                        v-model="form.imgUrl"
                        :disabled="true">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogImgEditStatus = false">取 消</el-button>
                <el-button type="primary" @click="imgEditSave">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { deleteImgList, getImgList, getTagList, ImgTagUpdate } from '@/api/img'

    export default {
        data() {
            return {
                addTagName: {
                    name: ''
                },
                tag: 0,
                limit: 10,
                page: 1,
                count: 45,

                loadingStatus: false,
                tabPosition: 'first',
                tabList: [],
                imgList: [],
                previewList: [],

                dialogImgEditStatus: false,
                form: {
                    imgId: '',
                    oldTagId: '',
                    tagId: '',
                    imgUrl: ''
                }
            }
        },
        created() {
            this.fetchTagList()
            this.fetchImgList(this.tag, this.limit, this.page)
        },
        watch: {
            tag(newV) {
                this.page = 1
                this.tag = newV
                this.fetchImgList(newV, this.limit, this.page)
            },
            previewList(newV) {
                console.log(newV)
                console.log('变化')
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!')
            },
            tagIdToTagName(tagId) {
                let tagName = ''
                this.tabList.forEach(item => {
                    if (item.tag_id === tagId) {
                        tagId = item.tag_name
                    }
                })
                return tagName
            },
            tagNameToTagId(tagName) {
                let tagId = ''
                this.tabList.forEach(item => {
                    if (item.tag_name === tagName) {
                        tagId = item.tag_id
                    }
                })
                return tagId
            },
            // 图片删除
            async imgDelete(key) {
                this.loadingStatus = true
                console.log(this.imgList[key])
                let imgUrl = this.imgList[key].img_url
                try {
                    let msg = await this.fetchImgDelete(imgUrl).then(msg => msg)
                    this.$delete(this.imgList, key)
                    this.fetchImgList(this.tag, this.limit, this.page)
                    this.$message.success(msg)
                    this.loadingStatus = false
                } catch (e) {
                    this.$message.error(e)
                }
            },
            //图片编辑保存
            async imgEditSave() {
                let oldTagId = this.tagNameToTagId(this.form.oldTagId)
                let newTagId = this.tagNameToTagId(this.form.tagId)
                let imgId = this.form.imgId
                console.log(oldTagId, newTagId)
                try {
                    let msg = await this.fetchImgEdit(oldTagId, newTagId, imgId).then(msg => msg)
                    let thisKey = ''
                    this.imgList.map((item, key) => {
                        if (item.img_id === imgId) {
                            thisKey = key
                        }
                    })
                    this.$delete(this.imgList, thisKey)
                    this.$message.success(msg)
                    this.dialogImgEditStatus = false
                } catch (e) {
                    this.$message.error(e)
                    this.dialogImgEditStatus = false
                }
            },
            //图片编辑
            imgEdit(key) {
                this.form = {
                    imgId: this.imgList[key].img_id,
                    oldTagId: this.tabList[this.imgList[key].img_tag].tag_name,
                    tagId: this.tabList[this.imgList[key].img_tag].tag_name,
                    imgUrl: this.imgList[key].img_url
                }
                this.dialogImgEditStatus = true
            },
            // 选中当前分页函数
            handleCurrentChange(e) {
                this.page = e
                this.fetchImgList(this.tag, this.limit, this.page)
                console.log('当前页：' + e)
            },
            // Tab变化函数
            changeTab(e) {
                this.tag = e.index
                console.log(e.index)
            },
            // 图片编辑接口实现
            fetchImgEdit(oldTagId, newTagId, imgId) {
                return new Promise((resolve, reject) => {
                    ImgTagUpdate(oldTagId, newTagId, imgId).then(response => {
                        let res = response
                        !res.code ? resolve(res.msg) : reject(res.msg)
                    })
                })
            },
            // 图片删除接口实现
            fetchImgDelete(imgUrl) {
                return new Promise((resolve, reject) => {
                    deleteImgList(imgUrl).then(response => {
                        let res = response
                        !res.code ? resolve(res.msg) : reject(res.msg)
                    })
                })
            },
            // 获取图片标签列表接口实现
            fetchTagList() {
                getTagList().then(response => {
                    let res = response.data
                    this.tabList = res
                })
            },
            // 获取图片列表接口实现
            fetchImgList(tag, limit, page) {
                console.log('触发加载')
                this.loadingStatus = true
                getImgList(tag, limit, page).then(response => {
                    let img_list = response.data.img_list
                    let count = response.data.count
                    this.imgList = []
                    this.previewList = []
                    this.imgList = img_list
                    this.previewList = img_list.map(item => {
                        return item.img_url
                    })
                    this.count = count
                    this.loadingStatus = false
                })
            }
        }
    }
</script>

<style scoped>
    .img_meta {
        position: absolute;
        bottom: 5px;
        right: 5px;
    }

    .image_list {
        margin: 0 20px 0 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        align-content: flex-start;
        justify-content: flex-start;
    }

    .image_list_item {
        cursor: pointer;
        position: relative;
        width: 300px;
        height: 280px;
        margin: 0 25px 30px 0;
        border: 1px solid #E4E7ED;
        padding: 5px;
    }
</style>

