<template>
    <div class="clusterManger" id="clusterManger">
        <div class="section-container">
            <div class="page-header">
                <el-form :inline="true" size="small" label-width="120px">
                    <el-form-item label="集群名称:">
                        <el-input type="text" auto-complete="off" placeholder="请输入集群名称"
                                  v-model="formData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="集群编码:">
                        <el-input type="text" auto-complete="off" placeholder="请输入集群编码"
                                  v-model="formData.code"></el-input>
                    </el-form-item>
                    <el-form-item label="集群owner:">
                        <el-input type="text" auto-complete="off" placeholder="请输入集群owner"
                                  v-model="formData.userName"></el-input>
                    </el-form-item>
                </el-form>
                <div class="" style="margin-left: 35%;margin-bottom: 5px;">
                    <el-button size="small" @click="handleClickSearch">查询</el-button>
                    <el-button class="resetBtn" size="small" @click="handleClickReset">重置</el-button>

                </div>
            </div>
            <div class="bg-empty"></div>
            <div class="section-content">
                <div class="btn-box">
                    <el-button class="refresh-btn" size="small" icon="el-icon-refresh" :loading="loadingRefresh"
                               @click="search">{{loadingRefresh?'加载中':'刷新'}}
                    </el-button>
                    <!--<el-button type="success" size="small"  @click="downloadRouteList">集群owner</el-button>-->
                    <el-button class="addBtn" type="success" size="small" @click="handleClickAddNew">新建集群</el-button>
                </div>
                <el-table :data="tableData" border style="width: 100%" class="task-manage-table">
                    <!--<el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>-->
                    <el-table-column prop="name" label="集群名称" width="120" align="center">
                    </el-table-column>
                    <el-table-column label="集群编码" min-width="180" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.code }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="业务线" min-width="180" align="center">
                        <template slot-scope="scope">
                            <span>{{ optValueToLabelOf('biz_name',scope.row.bizName)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="domainName" label="域名" min-width="180">
                    </el-table-column>
                    <el-table-column label="是否共享" width="180" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.isShare? "是":'否' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="80" align="center">
                        <template slot-scope="scope">
                            <span>{{ optValueToLabelOf('cluster_status',scope.row.state)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ownerName" label="负责人" width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="创建时间" width="150" align="center">
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="360" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleClickEdit(scope.row)">编辑</el-button>
                            <el-button type="text" size="small" @click="handleClickAddOwner(scope.row)">添加管理员</el-button>
                            <el-button type="text" size="small" @click="handleClickBind(scope.row)">关联filter</el-button>
                            <el-button type="text" size="small" @click="handleClickDelete(scope.row)">删除</el-button>
                            <!--<el-dropdown class="list-select">
                                  <span class="more-action">
                                    选项操作<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                                  </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="handleClickEdit(scope.row)">编辑</el-dropdown-item>
                                    <el-dropdown-item @click.native="handleClickAddOwner(scope.row)">添加管理员
                                    </el-dropdown-item>
                                    <el-dropdown-item @click.native="handleClickDelete(scope.row)">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>-->
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page"
                        :page-size="size"
                        :page-sizes="sizes"
                        layout="total, prev, pager, next, sizes, jumper"
                        v-bind:total="tableDataTotal"
                        background
                ></el-pagination>
            </div>
        </div>

        <bind-dialog ref="bindDialog"></bind-dialog>
        <!--选择管理员 -->
        <SelectAdminDialog ref="selectAdminDialog"></SelectAdminDialog>
        <!--新增、编辑-->
        <EditorDialog ref="eidtorDialog"/>
    </div>
</template>

<script>

    import {deleteUndefinedParams} from "../../../common/utils/paramsUtils";
    import SelectAdminDialog from "./components/select-admins-dialog";
    import BindDialog from "./components/bind-dialog";
    import EditorDialog from "./components/edit-dialog";
    import {MetaUtils} from "../../../system/views/metaData/metaUtils";

    const emptyFormData = {
        name: undefined,
        code: undefined,
        userName: undefined,
    }
    export default {
        name: 'ClusterManage',
        components: {EditorDialog, SelectAdminDialog,BindDialog},
        data() {
            return {
                metaConfig: {
                    cluster_codes: [],
                    biz_name: [],
                    cluster_status: [],
                },
                loadingRefresh: false,
                formData: {...emptyFormData},
                page: 1,
                size: 15,
                sizes: [15, 20, 30, 50],
                tableDataTotal: 0,
                tableData: [
                    /*{
                        "bizName": "业务名称",
                        "code": "编码",
                        "created": 0,
                        "description": "string",
                        "gmtCreate": "时间",
                        "gmtModified": "时间",
                        "id": 0,
                        "isDeleted": 0,
                        "isShare": 0,
                        "name": "集群名称",
                        "ownerId": "string",
                        "ownerName": "负责人",
                        "domainName": '域名',
                        "updated": 0,
                        "state"
                    }*/
                ],
            }
        },
        filters: {},
        async mounted() {
            await this.loadConfig()
            this.handleCurrentChange(1)
        },
        methods: {
            async loadConfig() {
                let config = await MetaUtils.loadOptions(Object.keys(this.metaConfig))
                MetaUtils.transformOptionsFrom(config, ['biz_name', 'cluster_status'])
                MetaUtils.transformOptionsFrom(config, ['cluster_codes'], MetaUtils.useValueTranfrom)
                this.metaConfig = config
            },
            ///
            search() {
                this.loadingRefresh = true
                let params = {
                    ...deleteUndefinedParams(this.formData),
                    pageNo: this.page,
                    pageSize: this.size
                }
                this.$axios({
                    url: '/admin/cluster/page',
                    method: 'get',
                    params: params,
                }).then(data => {
                    if (data) {
                        this.tableDataTotal = data.totalCount;
                        this.tableData = data.list;
                    }
                    // else {
                    //   this.$message.warning('暂无数据');
                    // }
                }).finally(() => {
                    this.loadingRefresh = false
                })
            },
            handleClickSearch() {
                this.handleCurrentChange(1)
            },
            handleClickReset() {
                this.formData = {...emptyFormData}
                // this.handleCurrentChange(1)
            },
            handleSizeChange(pageSize) {
                this.size = pageSize;
                this.search();
            },
            handleCurrentChange(currentPage) {
                this.page = currentPage;
                this.search();
            },
            handleClickAddNew() {
                this.$refs.eidtorDialog.openEditDialog(undefined, this.metaConfig)
            },
            handleClickEdit(row) {
                this.$refs.eidtorDialog.openEditDialog(row, this.metaConfig)
            },
            handleClickDelete(row) {
                this.$axios({
                    url: '/admin/cluster/delete',
                    method: 'post',
                    data: {id: row.id},
                }).then(data => {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                    });
                    this.handleClickSearch();
                });
            },

            handleClickBind(row){
                this.$refs.bindDialog.open(row)
            },
            handleClickAddOwner(row) {
                this.$refs.selectAdminDialog.openSelectAdminDialog(row)
            },

            // 根据config[key]里的options取出等于value的opt显示其label
            optValueToLabelOf(metaKey, value) {
                return MetaUtils.optValueToLabelOf(this.metaConfig[metaKey], value)
            }
        }
    }
</script>
<style lang="less" scoped>
    @import './index';
</style>
