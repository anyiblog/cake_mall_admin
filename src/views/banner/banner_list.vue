<template>
    <div class="app-container">
        <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
        >
            <el-table-column
                type="selection"
            >
            </el-table-column>
            <el-table-column label="BannerID" width="300" align="center">
                <template slot-scope="scope">
                    {{ scope.row.banner_id }}
                </template>
            </el-table-column>
            <el-table-column label="Banner名称" width="150" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.banner_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="Banner描述" width="300" align="center">
                <template slot-scope="scope">
                    {{ scope.row.banner_description }}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="200" align="center">
                <template slot-scope="scope">
                    {{ scope.row.created_at | ReleaseParseTime }}
                </template>
            </el-table-column>
            <el-table-column label="更新时间" width="200" align="center">
                <template slot-scope="scope">
                    {{ scope.row.updated_at | ReleaseParseTime }}
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="删除权限" width="110" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.delete_permiss | statusFilter">{{ scope.row.delete_permiss | statusToText
                        }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="handleEditClick(scope.row)">编辑</el-button>
                    <el-button type="success" size="small" @click="handleAddClick(scope.row)">添加子项</el-button>
                    <template v-if="scope.row.delete_permiss ===0">
                        <el-button type="danger" disabled size="small">删除</el-button>
                    </template>
                    <template v-else>
                        <el-button type="danger" size="small" @click="handleDeleteClick(scope.row)">删除</el-button>
                    </template>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { parseTimeForRFC3339 } from '@/utils/index'
    import { DeleteBanner, GetBannerList } from '@/api/banner'

    export default {
        filters: {
            statusFilter(status) {
                if (status === 0) {
                    return 'danger'
                } else {
                    return 'success'
                }
            },
            statusToText(status) {
                if (status === 0) {
                    return '不可删除'
                } else {
                    return '可删除'
                }
            },
            /**
             * @return {string}
             */
            ReleaseParseTime(time) {
                return parseTimeForRFC3339(time)
            }
        },
        data() {
            return {
                listCount: null,
                list: null,
                listLoading: true
            }
        },
        created() {
            this.fetchBannerList()
        },
        methods: {
            handleEditClick(item) {
                this.$router.push({
                    name: 'bannerAdd',
                    params: item
                })
            },
            handleAddClick(item) {
                this.$router.push({
                    name: 'bannerItemAdd',
                    params: item
                })
            },
            async handleDeleteClick(item) {
                console.log(item)
                try {
                    let msg = await this.fetchDeleteBanner(item.banner_id).then(msg => msg)
                    this.$message.success(msg)
                    this.listLoading = false
                    this.fetchBannerList()
                } catch (e) {
                    this.$message.error(e)
                }
            },
            fetchDeleteBanner(bannerId){
                this.listLoading = true
                return new Promise((resolve, reject) => {
                    DeleteBanner(bannerId).then(res => {
                        !res.code ? resolve(res.msg) : reject(res.msg)
                    })
                })
            },
            fetchBannerList() {
                this.listLoading = true
                GetBannerList().then(res => {
                    res = res.data
                    this.list = res.banner_list
                    this.listCount = res.count
                    this.listLoading = false
                })
            }
        }
    }
</script>
