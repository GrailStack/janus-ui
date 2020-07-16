<template>
    <div class="clusterConfig" id="clusterConfig">
        <div class="section-container">
            <div class="page-header">
                <el-form :inline="true" size="small" label-width="120px">
                    <el-form-item label="集群编码:">
                        <el-input type="text" auto-complete="off" placeholder="请输入集群编码"
                                  v-model="formData.clusterCode"></el-input>
                    </el-form-item>
                    <div style="margin-left: 15px;display: inline-block">
                        <el-button size="small" @click="handleClickSearch">查询</el-button>
                        <el-button class="resetBtn" size="small" @click="handleClickReset">重置</el-button>
                    </div>
                </el-form>
                <!--<div class="" style="margin-left: 50px;margin-bottom: 5px;">


                </div>-->
            </div>
            <div class="bg-empty"></div>
            <div class="section-content">
                <div class="btn-box">
                    <el-button class="refresh-btn" size="small" icon="el-icon-refresh" :loading="loadingRefresh"
                               @click="search">{{loadingRefresh?'加载中':'刷新'}}
                    </el-button>
                    <!--<el-button type="success" size="small"  @click="downloadRouteList">集群owner</el-button>-->
                    <el-button class="addBtn" type="success" size="small" @click="handleClickAddNew">新建配置</el-button>
                </div>
                <el-table :data="tableData" border style="width: 100%" class="task-manage-table">
                    <!--<el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>-->
                    <el-table-column prop="name" label="配置名称" min-width="120" align="center"/>
                    <!--<el-table-column prop="clusterName" label="集群名称" width="120" align="center"/>-->
                    <el-table-column label="集群编码" min-width="120" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.clusterCode }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="配置项" min-width="120" align="center">
                        <template slot-scope="scope">
                            <span>{{ optValueToLabelOf('cluster_config_keys',scope.row.configKey)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="配置类型" min-width="120" align="center">
                        <template slot-scope="scope">
                            <span>{{ optValueToLabelOf('cluster_config_type',scope.row.type)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="80" align="center">
                        <template slot-scope="scope">
                            <span>{{optValueToLabelOf('status',scope.row.status)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="creator" label="创建人" width="100" align="center">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="创建时间" width="150" align="center">
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleClickEdit(scope.row)">编辑</el-button>
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
                <TablePager :pagerData="pagerData" @pageChange="onPagerChange"/>
            </div>
        </div>

        <!--新增、编辑-->
        <EditorDialog ref="eidtorDialog"/>
    </div>
</template>

<script lang="jsx">

    import {deleteUndefinedParams} from "../../../common/utils/paramsUtils";
    import EditorDialog from "./components/edit-dialog";
    import {MetaUtils} from "../../../system/views/metaData/metaUtils";
    import {TablePager, createPagerData} from "../../../common/components/tabelPager/TablePager.jsx";
    import Vue from "vue";
    import {UserClusterService} from "../../../my-gate/views/api-manage/service";

    const emptyFormData = {
        clusterCode: undefined,
    }

    export default {
        name: 'ClusterManage',
        components: {EditorDialog, TablePager,},
        data() {
            return {
                metaConfig: {
                    cluster_config_keys: [],
                    cluster_config_type: [],
                    used_cluster:[]
                },
                loadingRefresh: false,
                formData: {...emptyFormData},
                pagerData: createPagerData(),
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
            this.handleClickSearch()
        },
        methods: {
            //
            async loadConfig() {
                let config = await MetaUtils.loadOptions(Object.keys(this.metaConfig))
                MetaUtils.transformOptionsFrom(config, ['cluster_config_keys', 'cluster_config_type',])
                config.used_cluster = await UserClusterService.getUserCluster()
                config.status = [{
                    label: '启用',
                    value: 1
                }, {
                    label: '禁用',
                    value: 0
                }]
                this.metaConfig = config
            },
            // ==========================================
            onPagerChange(pagerData) {
                this.pagerData = Object.assign(this.pagerData, {...pagerData})
                this.search()
            },
            handleClickSearch() {
                this.pagerData = Object.assign(this.pagerData, {page: 1})
                this.search()
            },
            handleClickReset() {
                this.formData = {...emptyFormData}
            },

            search() {
                this.loadingRefresh = true
                let params = {
                    ...deleteUndefinedParams(this.formData),
                    pageNo: this.pagerData.page,
                    pageSize: this.pagerData.size
                }
                this.$axios({
                    url: '/admin/clusterConfig/page',
                    method: 'get',
                    params: params,
                }).then(data => {
                    if (data) {
                        this.pagerData.total = data.totalCount;
                        this.tableData = data.list;
                    }
                    // else {
                    //   this.$message.warning('暂无数据');
                    // }
                }).finally(() => {
                    this.loadingRefresh = false
                })
            },
            // ==========================================
            handleClickAddNew() {
                this.$refs.eidtorDialog.openEditDialog(undefined, this.metaConfig)
            },
            handleClickEdit(row) {
                this.$refs.eidtorDialog.openEditDialog(row, this.metaConfig)
            },
            handleClickDelete(row) {
                this.$axios({
                    url: '/admin/clusterConfig/delete',
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
            // ==========================================
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
