<template>
    <div class="submitApplyPage page">
        <div class="card" style="height: 100px" v-if="!hasList">
            <div class="title">变更内容:无</div>
        </div>
        <div class="card" v-else>
            <div class="title">变更内容</div>
            <InfoList :changeInfoList="changeInfoList"></InfoList>
            <el-tabs v-model="activeTab" type="card" @tab-click="handleClickTab">
                <el-tab-pane v-for="(item,index) in changeInfoList" :key="index" :label="item.sourceName" :name="''+index">
                    <APITable v-if="item.sourceCode==='API'" ref='apiSelectTable' :tableData="tabelData" :meta-config="metaConfig" :isReadOnly="isReadOnly" :isDraft="true"></APITable>
                    <!--<APITable v-else-if="item.sourceCode==='xxx'" ref='selectTable' :tableData="tabelData" :isDraft="true"></APITable>-->
                    <div v-else>无</div>
                </el-tab-pane>
                <!--<el-tab-pane label="其他" name="second">其他</el-tab-pane>-->
            </el-tabs>
        </div>
        <div class="bg-empty"></div>
        <div class="card" v-if=" hasList ">
            <el-form class="stepForm" :model="formData" ref="form" :disabled="isReadOnly"
                     label-position="center" label-width="70px" :rules="formRules">

                <el-form-item prop="description" label="描述：">
                    <el-input v-model="formData.description" type="textarea" placeholder="请输入描述" size="small"/>
                </el-form-item>
            </el-form>

            <div style="text-align: center">
                <el-button type="primary" size="medium" @click="clickConfirm()">确定</el-button>
                <el-button v-if="!isReadOnly" type="primary" size="medium" @click="back()">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script>

    import InfoList from "./component/InfoList";
    import APITable from "./component/APITable";
    import MetaConfigMixin from "../../../system/views/metaData/MetaConfigMixin";

    export default {
        name: "changeSubmitPage",
        components: {InfoList, APITable},
        mixins: [MetaConfigMixin],
        data() {
            return {
                //只查看模式
                isReadOnly: false,
                activeTab: "0",
                changeInfoList: [
                    /*{
                        "addCount": 0,
                        "changeItems": [
                            {
                                "changeTypeCode": "string",
                                "changeTypeDesc": "string",
                                "newData": {},
                                "oldData": {},
                                "resourceId": 0
                            }
                        ],
                        "deleteCount": 0,
                        "sourceCode": "string",
                        "sourceName": "string",
                        "totalCount": 0,
                        "updateCount": 0
                    }*/
                ],
                metaConfig: {
                    api_draft_status: []
                },
                formData: {description: "",},
                formRules: {description: [{required: true, message: '必填项', trigger: 'change'}],}
            }
        },
        computed: {
            clusterCode() {
                let {query} = this.$route
                let clusterCode = query.clusterCode ? query.clusterCode : ''
                return clusterCode
            },
            //是否有变更的内容
            hasList() {
                return this.changeInfoList.length > 0
            },
            tabelData() {
                let changeItems = []
                if (this.changeInfoList[0]) {
                    changeItems = this.changeInfoList[0].changeItems || []
                    changeItems = changeItems.map(item => ({
                        ...item.newData,
                        resourceId: item.resourceId
                    }))
                }
                return changeItems
            },
        },
        async mounted() {
            //
            await this.loadConfig()
            //
            let {query} = this.$route
            let applyId = query.applyId ? query.applyId : ''
            if (applyId !== '') {
                // 查看模式
                this.isReadOnly = true
                await this.loadChanges(applyId)
                this.formData.description = query.description || ""
            } else {
                //
                this.isReadOnly = false
                await this.loadData()
            }
        },
        methods: {
            // 回现
            async loadChanges(applyId) {
                let data = await this.$axios.post("/admin/change/changeDetail", {applyId: applyId})
                this.changeInfoList = data.changeInfoList || []
            },
            //
            async loadData() {
                let data = await this.$axios.post("/admin/change/collectChanges", {clusterCode: this.clusterCode,})
                this.changeInfoList = data.changeInfoList || []
            },
            handleClickTab(index) {

            },
            back() {
                this.$router.push(`/myGate/APIManage?isDraft=true`)
            },
            clickConfirm() {
                if (this.isReadOnly) {
                    this.$router.back()
                } else {
                    this.submit()
                }
            },
            submit() {
                if (this.changeInfoList.length > 0) {
                    if (!this.collectSourcesList().length) {
                        this.$message.error("请选择至少一个变更！")
                        return
                    }
                    this.$refs.form.validate(v => {
                        if (v) {
                            this.$axios.post('/admin/change/submitChanges', {
                                clusterCode: this.clusterCode,
                                ...this.formData,
                                submitChanges: this.collectSourcesList()
                            }).then(() => {
                                this.$message.success("提交成功！")
                                this.loadData()
                                setTimeout(() => {
                                    this.back()
                                }, 100)
                            })
                        }
                    })
                }
            },
            collectSourcesList() {
                let submitChanges = []
                let apiTable = this.$refs.apiSelectTable
                if (apiTable) {
                    let itemApi = apiTable[0].getSeletedSource()
                    submitChanges.push(itemApi)
                }
                return submitChanges.filter(item => item.resourceIdList.length > 0)
            }
        }
    }
</script>

<style scoped lang="less">
    .submitApplyPage {
        color: #C1C5CF;


        .card {
            /*max-width: 550px;*/
            padding: 10px 25px;

            .title {
                font-size: 18px;
                line-height: 38px;
            }


        }
    }
</style>
<style lang="less">
    .submitApplyPage {
        .el-tabs__header.is-top {
            border-bottom: none;

            .el-tabs__nav.is-top {
                background: none;
                border: none;


                .el-tabs__item.is-top {
                    font-size: 13px;
                    border-bottom: none;
                    color: gray;
                    background-color: white;

                    &:first-child {
                        border-radius: 5px 0 0 5px;
                    }

                    &:last-child {
                        border-radius: 0 5px 5px 0;
                    }

                    &:only-child {
                        border-radius: 5px 5px 5px 5px;
                    }

                    &.is-active {
                        background-color: #ff6a00;
                        color: white;
                        // border-bottom-color: transparent !important;
                    }
                }
            }
        }
    }
</style>