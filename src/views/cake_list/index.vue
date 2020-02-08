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
            <el-table-column label="蛋糕ID" width="300" align="center">
                <template slot-scope="scope">
                    {{ scope.row.id }}
                </template>
            </el-table-column>
            <el-table-column label="蛋糕编号" width="110" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.no }}</span>
                </template>
            </el-table-column>
            <el-table-column label="蛋糕名称" width="190" align="center">
                <template slot-scope="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column label="蛋糕价格" width="80" align="center">
                <template slot-scope="scope">
                    {{ scope.row.price }}
                </template>
            </el-table-column>
            <el-table-column label="支持配送方式" width="250" align="center">
                <template slot-scope="scope">
                    {{ scope.row.shippingMethod | shippingMethodFilter }}
                </template>
            </el-table-column>
            <el-table-column label="蛋糕分类" width="110" align="center">
                <template slot-scope="scope">
                    {{ scope.row.category }}
                </template>
            </el-table-column>
            <el-table-column label="蛋糕品牌" width="110" align="center">
                <template slot-scope="scope">
                    {{ scope.row.brand }}
                </template>
            </el-table-column>
            <el-table-column label="蛋糕属性" width="110" align="center">
                <template slot-scope="scope">
                    {{ scope.row.attribute }}
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="蛋糕状态" width="110" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusToText }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="发布时间" width="230">
                <template slot-scope="scope">
                    <i class="el-icon-time"/>
                    <span>{{ scope.row.releaseTime | ReleaseParseTime }}</span>
                </template>
            </el-table-column>
            <!--            <el-table-column align="center" prop="created_at" label="操作">-->
            <!--                <template slot-scope="scope">-->
            <!--                    <el-button type="success" @click="handleClick(scope.row)" size="small">查看</el-button>-->
            <!--                    <el-button type="primary" size="small">编辑</el-button>-->
            <!--                </template>-->
            <!--            </el-table-column>-->
        </el-table>
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listCount">
        </el-pagination>
    </div>
</template>

<script>
    import { getCakeList } from '@/api/cake'
    import { parseTimeForRFC3339 } from '@/utils/index'

    export default {
        filters: {
            statusFilter(status) {
                if (status === 0) {
                    return 'success'
                } else {
                    return 'danger'
                }
            },
            statusToText(status) {
                if (status === 0) {
                    return '正常'
                } else {
                    return '软删除'
                }
            },
            shippingMethodFilter(status) {
                let dic = {
                    '10': '商家配送',
                    '20': '快递配送',
                    '30': '自提'
                }
                let statusArr = status.split('|')
                return statusArr.map(item => {
                    return dic[item]
                })
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
                limit: 10,
                page: 1,
                listCount: null,
                list: null,
                listLoading: true
            }
        },
        created() {
            this.fetchCakeList(this.limit, this.page)
        },
        methods: {
            fetchCakeList(limit, page) {
                this.listLoading = true
                getCakeList(limit, page).then(response => {
                    let res = response.data
                    this.list = res.cake_list
                    this.listCount = res.count
                    this.listLoading = false
                })
            },
            handleCurrentChange(e) {
                this.page = e
                this.fetchCakeList(this.limit, e)
            },
            handleSizeChange(e) {
                console.log('改变页码数字')
                this.limit = e
                this.fetchCakeList(e, this.page)
            }
        }
    }
</script>
