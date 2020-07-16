<template>
    <el-dialog class="selectAdminDialog" title="绑定管理员"
               :visible.sync="visible" width="600px">
        <div class="info">
            <el-transfer
                    filterable
                    :filter-method="filterMethod"
                    filter-placeholder="请输入用户名"
                    :titles="['用户列表','绑定的管理员']"
                    v-model="selectedUserName"
                    :data="availableDatas">
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
        name: 'SelectAdminDialog',
        props: ['bindGroupListParams'],
        data() {
            return {
                currentCluster: {},
                visible: false,
                availableDatas: [],//{key,label,}
                selectedUserName: [],// key
                filterMethod(query, item) {
                    return item.label.indexOf(query) > -1
                }
            }
        },
        created() {

        },
        methods: {
            async openSelectAdminDialog(item) {

                this.visible = true
                this.currentCluster = JSON.parse(JSON.stringify(item))
                this.availableDatas = []
                this.selectedUserName = []
                await this.getAvailable()
                await this.getSelected(item.code)
            },
            async getAvailable() {
                let data = await this.$axios({
                    url: '/admin/user/page',
                    method: 'post',
                    data: {
                        // searchKey: this.searchKey,
                        pageNo: 1,
                        pageSize: 499,
                    },
                })
                this.availableDatas = (data.list || []).map(_ => ({
                    key: _.userName,
                    label: _.name,
                    disabled: false,
                }))
            },
            async getSelected(clusterCode) {
                let data = await this.$axios({
                    url: '/admin/user/getClusterUserPage',
                    method: 'post',
                    data: {
                        "clusterCode": clusterCode,
                        "pageNo": 1,
                        "pageSize": 100,
                    },
                })
                //{id,, userName}
                let userList = data.list || []
                this.selectedUserName =
                    userList.map(user => user.userName)
                    .filter(userName =>
                        this.availableDatas.findIndex(_ => _.key === userName) !== -1
                    )
                //console.log(data.list, this.selectedUserName)
            },

            showHiddenBindGroup: function () {
                this.visible = false
            },
            async showHiddenSave() {
                let params = {
                    "addList": [],
                    "clusterCode": this.currentCluster.code,
                }
                params.addList = [...this.selectedUserName]
                let data = await this.$axios({
                    url: '/admin/user/addUserCluster',
                    method: 'post',
                    data: params,
                })

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
