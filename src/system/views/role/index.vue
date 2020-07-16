<template>
    <div class="container roleMgmt" id="roleMgmt">
        <!--<div class="roleMgmt-info">
          <p class="roleMgmt-title">角色管理</p>
          <p class="roleMgmt-desc">对中台的角色权限进行管理</p>
        </div>-->
        <div class="roleMgtInfo" v-if="activeIndex === 0">
            <div class="search-panel">
                <el-form :inline="true" size="small">
                    <el-form-item label="关键字:">
                        <el-input placeholder="关键字" v-model="searchData.searchKey" size="small"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch()">查询
                        </el-button>
                        <el-button type="primary" style="“background-color:#ff6a00”" size="small"
                                   @click="handleCreateRole()">创建
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table-content">
                <div class="table-container point-audit">
                    <Spin fix v-if="tableLoading"></Spin>
                    <el-table ref="table" :data="tableData" style="width:100%" header-cell-class-name="table-header">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <div class="expand-panel">
                                    <el-row class="expand-list">
                                        <el-col :span="12" v-for="(value, key, index) in props.row.perMissMap"
                                                :key="key">
                                            <el-row class="expand-item">
                                                <el-col :span="5">
                                                    <div class="authName">{{ key }}：</div>
                                                </el-col>
                                                <el-col :span="19">
                          <span class="auth-btn-group">
                            <span class="operation-btn" v-for="btn in value" :key="btn.desc">{{ btn.desc }}</span>
                          </span>
                                                </el-col>
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                v-for="(item, index) in tableField"
                                :key="index"
                                align="center"
                                :label="item.name"
                                :prop="item.data"
                                :width="item.width"
                                :sortable="item.sortable"
                        >
                            <template slot-scope="scope">
                                <div>
                                    <div v-if="item.data === 'operation'">
                                        <el-button type="success" size="small" @click="editModifiedRole(scope.row)">修改
                                        </el-button>
                                        <el-button type="danger" size="small" @click="delRole(scope.row)">删除</el-button>
                                    </div>
                                    <div v-else>
                                        <span>{{ scope.row[item.data] }}</span>
                                    </div>
                                </div>
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
        </div>
        <div class="editRole" v-if="activeIndex === 1">
            <div class="form-container">
                <el-form label-position="left" :model="roleInfo" label-width="120px" ref="roleMamtInfoForm">
                    <div class="dialog_row">
                        <el-form-item prop="name" :rules="rules.inputText" label="唯一识别码：">
                            <el-input
                                    class="dialog_row_input"
                                    type="text"
                                    style="width:100%;"
                                    size="small"
                                    placeholder="请填写唯一识别码"
                                    v-model="roleInfo.key"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div class="dialog_row">
                        <el-form-item prop="key" :rules="rules.inputText" label="角色名称：">
                            <el-input
                                    class="dialog_row_input"
                                    type="text"
                                    style="width:100%;"
                                    size="small"
                                    placeholder="请填写角色名称"
                                    v-model="roleInfo.name"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div class="dialog_row">
                        <el-form-item prop="desc" :rules="rules.inputText" label="角色描述：">
                            <el-input
                                    class="dialog_row_input"
                                    typeX="textarea"
                                    style="width:100%;"
                                    size="small"
                                    placeholder="请填写角色描述"
                                    v-model="roleInfo.desc"
                            ></el-input>
                        </el-form-item>
                    </div>
                    <div class="dialog_row">
                        <div class="checkbox-container">
                            <div class="perm-label">
                                <span>拥有权限：</span>
                            </div>
                            <div class="checkbox-group">
                                <div class="checkbox-item" v-for="item in permissionList" :key="item.roleGroup">
                                    <el-col :span="4" class="permission-title">{{ item.roleGroup }}：</el-col>
                                    <el-col :span="20" class="permission-list">
                    <span class="permission-item" v-for="cb in item.permList" :key="cb.desc">
                      <el-checkbox v-model="cb.related">{{ cb.desc }}</el-checkbox>
                    </span>
                                    </el-col>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="dialog_btns">
                        <el-button type="primary" size="medium" @click="editCancleStuInfo()">取消</el-button>
                        <el-button type="success" size="medium" @click="editSubmitStuInfo()">保存</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
    import {tableField} from './config';
    import {deleteUndefinedParams} from "../../../common/utils/paramsUtils";

    export default {
        name: 'roleMgmt',
        data() {
            return {
                page: 1,
                size: 15,
                sizes: [15, 20, 30, 50],
                tableDataTotal: 0,
                activeIndex: 0,
                tableLoading: false,
                tableData: [],
                tableField,
                rules: {
                    inputText: [{required: true, message: '必填项', trigger: 'blur'}],
                },
                searchData: {
                    searchKey: '',
                },
                roleInfo: {
                    key: '',
                    desc: '',
                    name: '',
                },
                currentId: null,
                permissionList: [],
            };
        },
        computed: {
            roleSearchData() {
                let option = {};
                option = {
                    ...this.searchData,
                    pageNo: this.page,
                    pageSize: this.size,
                };
                return option;
            },
        },
        mounted() {
            this.handleSearch();
        },
        methods: {
            async handleSearch() {
                await this.$axios.post('/admin/role/page',
                    deleteUndefinedParams(this.roleSearchData),
                ).then(data => {

                    if (data) {
                        this.tableDataTotal = data.totalCount;
                        this.tableData = data.list;
                    }
                    // else {
                    //   this.$message.warning('暂无数据');
                    // }
                });
            },
            handleSizeChange(pageSize) {
                this.size = pageSize;
                this.handleSearch();
            },
            handleCurrentChange(currentPage) {
                this.page = currentPage;
                this.handleSearch();
            },
            handleCreateRole() {
                for (const key in this.roleInfo) {
                    if (this.roleInfo.hasOwnProperty(key)) {
                        this.roleInfo[key] = '';
                    }
                }
                this.currentId = null;
                this.queryPermByRole();
            },
            editCancleStuInfo() {
                this.activeIndex = 0;
                for (const key in this.roleInfo) {
                    if (this.roleInfo.hasOwnProperty(key)) {
                        this.roleInfo[key] = '';
                    }
                }
            },
            editSubmitStuInfo() {
                const option = {...this.roleInfo};
                option.roleId = this.currentId;
                option.pids = [];
                this.permissionList.forEach(item => {
                    if (item.permList && item.permList.length > 0) {
                        item.permList.forEach(subItem => {
                            if (subItem.related) {
                                option.pids.push(subItem.id);
                            }
                        });
                    }
                });
                this.$refs.roleMamtInfoForm.validate().then(valid => {
                    this.$axios({
                        url: '/admin/role/addOrUpdate',
                        method: 'post',
                        data: option,
                    }).then(res => {
                        this.activeIndex = 0;
                        this.$message({
                            message: '保存成功！',
                            type: 'success',
                        });
                        this.handleSearch();
                    });
                });
            },
            editModifiedRole(row) {
                this.queryPermByRole(row);
                this.roleInfo.key = row.key;
                this.roleInfo.desc = row.desc;
                this.roleInfo.name = row.name;
                this.currentId = row.id;
            },
            queryPermByRole(row) {
                const opt = {
                    roleName: row ? row.key : '',
                };
                this.$axios({
                    url: '/admin/role/queryPermByRole',
                    method: 'get',
                    params: opt,
                }).then(data => {
                    if (data) {
                        this.permissionList = data;
                        this.activeIndex = 1;
                    } else {
                        this.tableData = [];
                        // this.$message.warning('暂无数据');
                    }
                });
            },
            delRole(row) {
                this.currentId = row.id;
                this.roleInfo.name = row.name;
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: '/admin/role/delete',
                        method: 'get',
                        params: {id: this.currentId},
                    }).then(data => {
                        this.currentId = null;
                        if (data === true) {
                            this.$message({
                                message: '删除角色成功',
                                type: 'success',
                            });
                            this.handleSearch();
                        }
                    }).catch(res => {
                        this.currentId = null;
                        this.$message({
                            message: '删除角色失败:',
                            type: 'error',
                        });
                    });
                })
            },
        },
    };
</script>
<style lang="less" scoped>
    #roleMgmt {
        background: #393e50;
        position: absolute;
        left: 15px;
        right: 15px;
        top: 70px;
        bottom: 10px;
        padding: 0 13px 13px 13px;
        overflow-y: auto;
        transition: all .25s ease;

        .roleMgmt-info {
            background: #fff;
            padding: 12px 8px;

            .roleMgmt-title {
                font-size: 20px;
                font-weight: 600;
            }

            .roleMgmt-desc {
            }
        }

        .search-panel {
            padding: 34px 0 26px;
        }

        .table-content {
            padding: 1px;
            // background: #fff;
            .operation {
                padding: 16px 0 16px 20px;
            }

            .table-header {
                // background: #fafafa;
            }

            .expand-panel {
                padding: 0 48px;

                .expand-list {
                    .expand-item {
                        height: 28px;
                        line-height: 28px;
                        padding: 8px 0;

                        .authName {
                            padding: 0 12px;
                        }

                        .auth-btn-group {
                            padding: 0 6px;

                            .operation-btn {
                                display: inline-block;
                                border: 1px solid #ef4c4f;
                                border-radius: 3px;
                                padding: 0px 8px;
                                // background: #ffe0cb;
                                height: 24px;
                                line-height: 24px;
                                margin: 0 3px;
                            }
                        }
                    }
                }
            }
        }

        .editRole {
            //background: #fff;
            margin-top: 32px;

            .form-container {
                width: 90%;
                padding: 24px 48px;
                margin: 0 auto;

                .checkbox-container {
                    display: flex;

                    .perm-label {
                        width: 120px;
                        padding-right: 12px;
                        vertical-align: top;
                        font-size: 14px;
                        color: #c1c5cf;
                        line-height: 40px;
                        padding: 0 12px 0 0;
                    }

                    .checkbox-group {
                        flex: 1;

                        .checkbox-item {
                            height: 32px;
                            line-height: 32px;
                            margin: 6px 0;
                            white-space: nowrap;

                            .permission-title {
                                padding: 0 6px;
                                font-size: 14px;
                                color: #c1c5cf;
                                //color: rgba(0, 0, 0, 0.65);
                            }

                            .permission-list {
                                white-space: initial;

                                .permission-item {
                                    padding: 0 6px;
                                }
                            }
                        }
                    }
                }
            }
        }

        .dialog_btns {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .dialog_del_btns {
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }

        .el-textarea__inner {
            background: none !important;
        }
    }
</style>
