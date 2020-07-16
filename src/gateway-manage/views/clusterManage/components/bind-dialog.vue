<template>
    <el-dialog class="selectAdminDialog" title="关联filter"
               :visible.sync="visible" width="600px">
        <div class="info">
            <el-transfer
                    filterable
                    :filter-method="filterMethod"
                    filter-placeholder="请输入Filter"
                    :titles="['filter','绑定的filter']"
                    v-model="selectedItems"
                    :data="availableItems">
            </el-transfer>
            <div class="buttons">
                <el-button class="btn reset-btn" @click="showHiddenBindGroup">取消</el-button>
                <el-button class="btn create-btn" @click="showHiddenSave">保存</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'bindDialog',
        props: ['bindGroupListParams'],
        data() {
            return {
                currentCluster: {},
                visible: false,
                availableItems: [],//{key,label,}
                selectedItems: [],// key
                filterMethod(query, item) {
                    return item.label.indexOf(query) > -1
                }
            }
        },
        created() {

        },
        methods: {
            async open(item) {

                this.visible = true
                this.currentCluster = JSON.parse(JSON.stringify(item))
                this.availableItems = []
                this.selectedItems = []
                await this.getAvailable()
                await this.getSelected(item.code)
            },
            async getAvailable() {
                let data = await this.$axios.get('/admin/filter/page',
                    {
                        params: {
                            // searchKey: this.searchKey,
                            pageNo: 1,
                            pageSize: 499,
                        },
                    })
                this.availableItems = (data.list || []).map(_ => ({
                    key: _.id,
                    label: _.name,
                    disabled: false,
                }))
            },
            async getSelected(clusterCode) {
                let data = await this.$axios.get('/admin/cluster/listFiltersByClusterCode',
                    {
                        params: {
                            "clusterCode": clusterCode,
                        }
                    })
                //{id,, userName}

                let userList = data || []
                this.selectedItems =
                    userList.map(item => item.id)
                        .filter(id =>
                            this.availableItems.findIndex(_ => _.key === id) !== -1
                        )

            },

            showHiddenBindGroup: function () {
                this.visible = false
            },
            async showHiddenSave() {
                let params = {
                    "filterIds": [],
                    "code": this.currentCluster.code,
                }

                params.filterIds = [...this.selectedItems]

                let data = await this.$axios.post('/admin/cluster/updateClusterFilter',params)

                this.$message.success('更新成功')
                this.visible = false
            }
        }
    }
</script>
<style lang="less" scoped>

    .buttons {
        margin-top: 30px;
        //width: 130px;
        margin-left: 210px;
    }
</style>
