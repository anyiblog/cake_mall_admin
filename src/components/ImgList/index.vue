<template>
    <div v-loading="loadingStatus">
        <div class="image_list">
            <div class="image_list_item" v-for="(item,key) in imgList">
                <el-image
                    style="width: 100%; height: 100%;"
                    :src="item.img_url"
                    @click="thisImgUrl(key)">
                </el-image>
            </div>
        </div>
        <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="limit"
            layout="total, prev, pager, next, jumper"
            :total="count">
        </el-pagination>
    </div>
</template>

<script>
    import { getImgList } from '@/api/img'

    export default {
        name: 'img-list',
        data() {
            return {
                loadingStatus:false,
                tag: 0,
                limit: 8,
                page: 1,
                count: 0,
                imgList: [],
            }
        },
        created(){
            this.fetchImgList(this.tag,this.limit,this.page)
        },
        methods: {
            thisImgUrl(key){
                // console.log(this.imgList[key].img_url)
                this.$emit('imgList', this.imgList[key].img_url);
            },
            handleCurrentChange(e) {
                this.page = e
                this.fetchImgList(this.tag, this.limit, this.page)
                console.log('当前页：' + e)
            },
            fetchImgList(tag, limit, page) {
                console.log('触发加载')
                this.loadingStatus = true
                getImgList(tag, limit, page).then(response => {
                    let img_list = response.data.img_list
                    let count = response.data.count
                    this.imgList = []
                    this.imgList = img_list
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
        width: 200px;
        height: 180px;
        margin: 0 25px 30px 0;
        border: 1px solid #E4E7ED;
        padding: 5px;
    }
</style>
