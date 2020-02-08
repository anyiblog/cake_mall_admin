<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="90px" style="width: 40%" label-position="right">
            <el-form-item label="Banner名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="Banner描述">
                <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item label="删除权限">
                <el-radio-group v-model="form.permissionState">
                    <el-radio label="0" value="0">不可删除</el-radio>
                    <el-radio label="1" value="1">可删除</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">{{buttonMsg}}</el-button>
                <el-button @click="handleClear">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { CreateBanner, UpdateBanner } from '@/api/banner'

    export default {
        name: 'banner_add',
        data() {
            return {
                buttonMsg: '立即创建',
                fetchMethod: 'create',
                bannerId: '',
                form: {
                    name: '',
                    permissionState: '',
                    desc: ''
                }
            }
        },
        mounted() {
            if (Object.keys(this.$route.params).length !== 0) {
                this.buttonMsg = '立即更新'
                this.fetchMethod = 'update'
                this.bannerId = this.$route.params.banner_id
                this.form.name = this.$route.params.banner_name
                this.form.desc = this.$route.params.banner_description
                this.form.permissionState = this.$route.params.delete_permiss.toString()
            }
        },
        watch: {
            '$route'(to, from, next) {
                console.log(to)
                console.log(from)
                console.log(next)
            }
        },
        methods: {
            handleClear() {
                if (this.buttonMsg === '立即创建') {
                    this.form = {}
                }else if (this.buttonMsg === '立即更新'){
                    this.$router.replace({
                        name:'bannerList'
                    })
                }
            },
            async onSubmit() {
                if (this.buttonMsg === '立即创建') {
                    try {
                        let msg = await this.createBanner(this.form.name, this.form.desc, this.form.permissionState).then(msg => msg)
                        this.$message.success(msg)
                        this.form = {}
                        this.$router.replace({
                            name:'bannerList'
                        })
                    } catch (e) {
                        this.$message.error(e)
                    }
                } else if (this.buttonMsg === '立即更新') {
                    try {
                        let msg = await this.updateBanner(this.bannerId, this.form.name, this.form.desc, this.form.permissionState).then(msg => msg)
                        this.$message.success(msg)
                        this.$router.replace({
                            name:'bannerList'
                        })
                    } catch (e) {
                        this.$message.error(e)
                    }
                }
            },
            updateBanner(bannerId, bannerName, bannerDescription, deletePermiss) {
                return new Promise((resolve, reject) => {
                    UpdateBanner(bannerId, bannerName, bannerDescription, deletePermiss).then(res => {
                        !res.code ? resolve(res.msg) : reject(res.msg)
                    })
                })
            },
            createBanner(bannerName, bannerDescription, deletePermiss) {
                return new Promise((resolve, reject) => {
                    CreateBanner(bannerName, bannerDescription, deletePermiss).then(res => {
                        !res.code ? resolve(res.msg) : reject(res.msg)
                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>
