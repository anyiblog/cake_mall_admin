<template>
    <div class="app-container">
        <el-dialog title="媒体库" :visible.sync="openMediaLib" width="52%">
            <img-list @imgList="imgList"/>
        </el-dialog>
        <el-form ref="form" :model="form" label-width="90px" style="width: 40%" label-position="right">
            <el-form-item label="展示图片">
                <div class="flex">
                    <el-input v-model="form.imgUrl"></el-input>
                    <el-button size="small" type="primary" class="mg5_left" @click="openMediaLib = true">从媒体库选择</el-button>
                </div>
            </el-form-item>
            <el-form-item label="Banner模块">
                <el-select v-model="form.bannerId" placeholder="请选择Banner模块">
                    <template v-for="bannerModuleItem in bannerModule">
                        <el-option :label="bannerModuleItem.banner_name" :value="bannerModuleItem.banner_id"></el-option>
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="跳转类型">
                <el-select v-model="form.jumpType" placeholder="请选择跳转类型">
                    <el-option label="无导向" value="0"></el-option>
                    <el-option label="商品" value="1"></el-option>
                    <el-option label="专题" value="2"></el-option>
                    <el-option label="外部链接" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="展示图片">
                <el-input v-model="form.imgUrl"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { CreateBannerItem, GetBannerList } from '@/api/banner'
    import ImgList from '@comp/ImgList/index'
    export default {
        name: 'banner_item_add',
        components: { ImgList },
        comments:{
            ImgList
        },
        data() {
            return {
                openMediaLib:false,
                form: {
                    imgUrl: '',
                    bannerId: '',
                    jumpType:'',
                },
                bannerModule:null,
            }
        },
        created(){
            this.getBannerModule()
        },
        mounted() {
            if (Object.keys(this.$route.params).length !== 0) {
                this.form.bannerId = this.$route.params.banner_id
            }
        },
        methods: {
            imgList(e){
                this.openMediaLib = false;
                this.form.imgUrl = e
            },
            async onSubmit() {
                try {
                    let msg = await this.createBannerItem(this.form.imgUrl, this.form.bannerId, this.form.jumpType)
                    this.$message.success(msg)
                    this.form = {}
                }catch (e) {
                    this.$message.error(e)
                }
            },
            getBannerModule(){
                GetBannerList().then(res => {
                    res = res.data
                    this.bannerModule = res.banner_list
                })
            },
            createBannerItem(imgUrl,bannerId,jumpType){
                return new Promise((resolve, reject) => {
                    CreateBannerItem(imgUrl,bannerId,jumpType).then(res=>{
                        !res.code ? resolve(res.msg) : reject(res.msg)
                    })
                })
            }
        }
    }
</script>

<style scoped>
    .mg5_left {
        margin-left: 10px;
    }

    .flex {
        display: flex;
    }
</style>
