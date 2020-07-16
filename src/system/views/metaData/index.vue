<template>
    <div class="container metaMgmt" id="metaMgmt">
        <!--<div class="metaMgmt-info">
          <p class="metaMgmt-title">元数据管理</p>
          <p class="metaMgmt-desc">中台元数据增删改查</p>
        </div>-->
        <div class="search-panel">
            <el-form :inline="true" size="small">
                <el-form-item label="关键字:">
                    <el-input placeholder="关键字" v-model="searchData.searchKey" size="small"></el-input>
                </el-form-item>
                <el-button type="success" icon="el-icon-search" size="small" @click="handleSearch()">查询</el-button>
                <el-button type="success" icon="el-icon-plus" size="small" @click="handleCreateType">创建类型</el-button>
            </el-form>
        </div>
        <div class="table-content">
            <div class="table-container point-audit meta-data">
                <Spin fix v-if="tableLoading"></Spin>
                <el-table
                        ref="table"
                        :data="tableData"
                        style="width:100%"
                        border
                        header-cell-class-name="table-header"
                >
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <div class="expand-table">
                                <div class="expand-operation">
                                    <el-button type="success" size="small" @click="handleCreateOption(scope.row)">添加选项
                                    </el-button>
                                </div>
                                <div class="table-container point-audit">
                                    <el-table
                                            border
                                            ref="table"
                                            :data="scope.row.dictDataModelList"
                                            style="width:100%"
                                    >
                                        <el-table-column
                                                v-for="(item,index) in expandTableField"
                                                :key="index"
                                                align="center"
                                                :label="item.name"
                                                :prop="item.data"
                                                :width="item.width"
                                                :sortable="item.sortable"
                                                fixed="right"
                                        >
                                            <template slot-scope="scope">
                        <span>
                          <span v-if="item.data==='exdOperation'">
                            <el-button
                                    type="success"
                                    size="small"
                                    @click="editExdMeta(scope.row)"
                            >修改</el-button>
                            <el-button type="danger" size="small" @click="delExdMeta(scope.row)">删除</el-button>
                          </span>
                          <span v-else>
                            <span>{{ scope.row[item.data] }}</span>
                          </span>
                        </span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            v-for="(item,index) in tableField"
                            :key="index"
                            align="center"
                            :label="item.name"
                            :prop="item.data"
                            :width="item.width"
                            :sortable="item.sortable"
                    >
                        <template slot-scope="scope">
              <span>
                <span v-if="item.data==='operation'">
                  <el-button type="success" size="small" @click="editMeta(scope.row)">修改</el-button>
                  <el-button type="danger" size="small" @click="delMeta(scope.row)">删除</el-button>
                </span>
                <span v-else>
                  <span>{{ scope.row[item.data] }}</span>
                </span>
              </span>
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
        <el-dialog :visible.sync="mataDataMamtDialog" width="450px" class="dialog">
            <p slot="title" class="dialog-header">
                <span class="dialog-title">{{ modifiedMetaTitle }}</span>
            </p>
            <el-form
                    :model="metaMamtInfo"
                    ref="metaMamtInfoForm"
                    label-position="center"
                    label-width="120px"
            >
                <div class="dialog_row">
                    <el-form-item prop="dictName" :rules="rules.inputText" label="字典名称：">
                        <el-input
                                class="dialog_row_input"
                                type="text"
                                style="width:100%;"
                                size="small"
                                placeholder="字典名称"
                                v-model="metaMamtInfo.dictName"
                        ></el-input>
                    </el-form-item>
                </div>
                <div class="dialog_row">
                    <el-form-item prop="dictCode" :rules="rules.inputText" label="字典key：">
                        <el-input
                                class="dialog_row_input"
                                type="text"
                                style="width:100%;"
                                size="small"
                                placeholder="字典key"
                                v-model="metaMamtInfo.dictCode"
                        ></el-input>
                    </el-form-item>
                </div>
                <div class="dialog_row">
                    <el-form-item prop="status" :rules="rules.inputSelect" label="状态：">
                        <el-select v-model="metaMamtInfo.status" filterable placeholder="请选择字典状态" size="small">
                            <el-option
                                    v-for="item in statusOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="dialog_btns">
                    <el-button type="primary" size="medium" @click="cancleMetaInfo()">取消</el-button>
                    <el-button type="success" size="medium" @click="submitMetaInfo()">保存</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!--<el-dialog :visible.sync="deleteMetaDialogFlag" title="提示" width="450px">
            <div class="warning">
                <p class="warning-info">
                    <i class="el-icon-warning"></i>
                    <span>确认删除类型 {{ metaDictName }} 吗?</span>
                </p>
            </div>
            <div class="dialog_del_btns">
                <el-button class="confirm" type="primary" size="small" @click="cancleMetaDelete()">取消</el-button>
                <el-button class="confirm" type="danger" size="small" @click="confirmDelMeta()">确认</el-button>
            </div>
        </el-dialog>-->
        <el-dialog :visible.sync="expandDataMamtDialog" width="450px" class="dialog">
            <p slot="title" class="dialog-header">
                <span class="dialog-title">{{ modifiedExpandTitle }}</span>
            </p>
            <el-form
                    :model="expandMamtInfo"
                    ref="exdMamtInfoForm"
                    label-position="center"
                    label-width="120px"
            >
                <div class="dialog_row">
                    <el-form-item prop="itemName" :rules="rules.inputText" label="数据项名称：">
                        <el-input
                                class="dialog_row_input"
                                type="text"
                                style="width:100%;"
                                size="small"
                                placeholder="数据项名称"
                                v-model="expandMamtInfo.itemName"
                        ></el-input>
                    </el-form-item>
                </div>
                <div class="dialog_row">
                    <el-form-item prop="itemCode" :rules="rules.inputText" label="数据项key：">
                        <el-input
                                class="dialog_row_input"
                                type="text"
                                style="width:100%;"
                                size="small"
                                placeholder="数据项key"
                                v-model="expandMamtInfo.itemCode"
                        ></el-input>
                    </el-form-item>
                </div>
                <div class="dialog_row">
                    <el-form-item prop="itemValue" :rules="rules.inputText" label="数据项值：">
                        <el-input
                                class="dialog_row_input"
                                type="text"
                                style="width:100%;"
                                size="small"
                                placeholder="数据项值"
                                v-model="expandMamtInfo.itemValue"
                        ></el-input>
                    </el-form-item>
                </div>
                <div class="dialog_row">
                    <el-form-item prop="itemDesc" :rules="rules.inputText" label="描述：">
                        <el-input
                                class="dialog_row_input"
                                type="text"
                                style="width:100%;"
                                size="small"
                                placeholder="描述"
                                v-model="expandMamtInfo.itemDesc"
                        ></el-input>
                    </el-form-item>
                </div>
                <div class="dialog_row">
                    <el-form-item prop="itemSort" :rules="rules.inputText" label="排序：">
                        <el-input
                                class="dialog_row_input"
                                type="text"
                                style="width:100%;"
                                size="small"
                                placeholder="排序"
                                v-model="expandMamtInfo.itemSort"
                        ></el-input>
                    </el-form-item>
                </div>
                <div class="dialog_row">
                    <el-form-item prop="status" :rules="rules.inputSelect" label="状态：">
                        <el-select v-model="expandMamtInfo.status" filterable placeholder="状态" size="small">
                            <el-option
                                    v-for="item in statusOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="dialog_btns">
                    <el-button type="primary" size="medium" @click="cancleSubmitOption()">取消</el-button>
                    <el-button type="success" size="medium" @click="submitOption()">保存</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import {tableField, expandTableField} from "./config";

    export default {
        name: "MetaDataMgmt",
        data() {
            return {
                page: 1,
                size: 15,
                sizes: [15, 20, 30, 50],
                tableDataTotal: 0,
                tableLoading: false,
                tableData: [],
                tableField,
                expandTableField,
                rules: {
                    inputText: [{required: true, message: "必填项", trigger: "blur"}],
                    inputSelect: [{required: true, message: "必选项", trigger: "change"}]
                },
                toggleExpandStatus: false,
                expandDataMamtDialog: false,
                modifiedMetaTitle: "",
                modifiedExpandTitle: "",
                metaMamtInfo: {
                    dictName: "",
                    dictCode: "",
                    status: null
                },
                metaTypeId: null,

                metaDictName: "",
                deteleId: null,
                expandMamtInfo: {
                    itemName: "",
                    itemValue: "",
                    itemDesc: "",
                    itemCode: "",
                    itemSort: null,
                    dictCode: null,
                    status: null
                },
                metaOptionId: null,
                metaItemName: '',
                statusOption: [
                    {
                        label: "未启用",
                        value: 0
                    },
                    {
                        label: "已启用",
                        value: 1
                    }
                ],
                dictCodeOption: [
                    {
                        label: "未启用",
                        value: 0
                    },
                    {
                        label: "已启用",
                        value: 1
                    }
                ],
                mataDataMamtDialog: false,
                searchData: {
                    searchKey: ""
                }
            };
        },
        computed: {
            metaMgmtSearchData() {
                let option = {};
                option = {
                    ...this.searchData,
                    pageNo: this.page,
                    pageSize: this.size
                };
                return option;
            }
        },
        mounted() {
            this.handleSearch();
        },
        methods: {
            async handleSearch() {
                await this.$axios({
                    url: "/admin/metadata/page",
                    method: "post",
                    data: this.metaMgmtSearchData
                }).then(data => {
                    if (data) {
                        this.tableDataTotal = data.totalCount;
                        this.tableData = data.list;
                        this.tableData = data.list.map(item => {
                            item.dictDataModelList.forEach(ctx => {
                                ctx.statusStr =
                                    ctx.status === 0 ? "未启用" : ctx.status === 1 ? "已启用" : "";
                            });
                            item.statusTypeStr =
                                item.status === 0 ? "未启用" : item.status === 1 ? "已启用" : "";
                            return item;
                        });
                    }
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
            toggleExpand(row) {
                this.toggleExpandStatus = !this.toggleExpandStatus;
                this.$refs.table.toggleRowExpansion(row, this.toggleExpandStatus);
            },
            handleCreateType() {
                this.mataDataMamtDialog = true;
                this.modifiedMetaTitle = "创建类型";
                for (const key in this.metaMamtInfo) {
                    if (this.metaMamtInfo.hasOwnProperty(key)) {
                        this.metaMamtInfo[key] = "";
                    }
                }
            },
            editMeta(row) {
                this.mataDataMamtDialog = true;
                this.modifiedMetaTitle = "修改类型";
                for (const key in this.metaMamtInfo) {
                    if (this.metaMamtInfo.hasOwnProperty(key)) {
                        this.metaMamtInfo[key] = row[key];
                    }
                }
                this.metaTypeId = row.id;
            },
            delMeta(row) {
                this.metaDictName = row.dictName;
                this.deteleId = row.id;
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$axios({
                        url: `/admin/metadata/deleteDictType/${this.deteleId}`,
                        method: "get"
                    }).then(data => {
                        this.$message({
                            message: "删除类型成功！",
                            type: "success"
                        });
                        this.handleSearch();
                        this.$store.dispatch('GetSysConfig');
                    }).catch(err => {
                        console.log(err);
                    });
                })
            },
            cancleMetaInfo() {
                this.mataDataMamtDialog = false;
            },
            submitMetaInfo() {
                let url = "";
                if (this.modifiedMetaTitle == "修改类型") {
                    url = "/admin/metadata/updateDictType";
                    this.metaMamtInfo.id = this.metaTypeId;
                } else if (this.modifiedMetaTitle == "创建类型") {
                    url = "/admin/metadata/addDictType";
                    delete this.metaMamtInfo.id;
                }

                this.$axios({
                    url: url,
                    method: "post",
                    data: this.metaMamtInfo
                })
                    .then(data => {
                        //let { msgCode, msgContent, data } = res;
                        this.$message({
                            message: this.modifiedMetaTitle + "成功！",
                            type: "success"
                        });
                        this.mataDataMamtDialog = false;
                        this.handleSearch();
                        this.$store.dispatch('GetSysConfig');
                        /*else if (msgCode === "403") {
                          this.$message({
                            message: "权限不足！",
                            type: "error"
                          });
                        } else {
                          this.$message({
                            message: "请求失败" + msgContent,
                            type: "error"
                          });
                        }*/
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            handleCreateOption(row) {
                this.expandDataMamtDialog = true;
                for (const key in this.expandMamtInfo) {
                    if (this.expandMamtInfo.hasOwnProperty(key)) {
                        this.expandMamtInfo[key] = "";
                    }
                }
                this.expandMamtInfo.dictCode = row.dictCode
                this.modifiedExpandTitle = "添加字典选项"
            },
            editExdMeta(row) {
                this.expandDataMamtDialog = true;
                for (const key in this.expandMamtInfo) {
                    if (this.expandMamtInfo.hasOwnProperty(key)) {
                        this.expandMamtInfo[key] = row[key];
                    }
                }
                this.metaOptionId = row.id
                this.modifiedExpandTitle = "修改字典选项"
            },
            submitOption() {
                let url = "";
                if (this.modifiedExpandTitle == "修改字典选项") {
                    url = "/admin/metadata/updateDictData";
                    this.expandMamtInfo.id = this.metaOptionId;
                } else if (this.modifiedExpandTitle == "添加字典选项") {
                    url = "/admin/metadata/addDictData";
                    delete this.expandMamtInfo.id;
                }

                this.$axios({
                    url: url,
                    method: "post",
                    data: this.expandMamtInfo
                })
                    .then(data => {
                        //let { msgCode, msgContent, data } = res;
                        //if (msgCode === "200") {
                        this.$message({
                            message: this.modifiedMetaTitle + "成功！",
                            type: "success"
                        });
                        this.expandDataMamtDialog = false;
                        this.handleSearch();
                        this.$store.dispatch('GetSysConfig');
                        /*} else if (msgCode === "403") {
                          this.$message({
                            message: "权限不足！",
                            type: "error"
                          });
                        } else {
                          this.$message({
                            message: "请求失败," + msgContent,
                            type: "error"
                          });
                        }*/
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            cancleSubmitOption() {
                this.expandDataMamtDialog = false;
            },
            delExdMeta(row) {
                this.metaItemName = row.itemName;
                this.deteleId = row.id;

                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: `/admin/metadata/deleteDictData/${this.deteleId}`,
                        method: "get"
                    }).then(data => {
                        this.$message({
                            message: "删除类型成功！",
                            type: "success"
                        });
                        this.handleSearch();
                        this.$store.dispatch('GetSysConfig');
                    })
                        .catch(err => {
                            console.log(err);
                        });
                })
            },
        }
    };
</script>
<style lang="less" scoped>
    .metaMgmt {
        background: #393e50;
        position: absolute;
        left: 15px;
        right: 15px;
        top: 70px;
        bottom: 10px;
        padding: 0 13px 13px 13px;
        overflow-y: auto;
        transition: all .25s ease;
        /*.metaMgmt-info {
          background: #fff;
          padding: 12px 8px;
          .metaMgmt-title {
            font-size: 20px;
            font-weight: 600;
          }
          .metaMgmt-desc {
          }
        }*/

        .search-panel {
            padding: 34px 0 26px;
        }

        .table-content {
            width: 100%;
            // background: #fff;
            padding: 1px;

            .operation {
                padding: 16px 0 16px 20px;
            }

            .table-header {
                // background: #fafafa;
            }

            .expand-table {
                margin: 0 12px 0 42px;
                padding: 12px;
                border-left: 1px solid #ebeef5;

                .expand-operation {
                    padding: 12px 0;
                }
            }
        }

        .dialog-title {
            line-height: 24px;
            font-size: 18px;
            display: inline-block;
        }

        .dialog_btns {
            display: flex;
            justify-content: center;
        }

        .dialog_del_btns {
            display: flex;
            justify-content: flex-end;
        }

        .warning {
            margin-bottom: 24px;

            .warning-info {
                height: 36px;
                line-height: 36px;
                color: #ff6a00;
                border: 1px solid #ff6a00;
                background: #ffe0cb;
                padding-left: 8px;
            }
        }
    }
</style>




