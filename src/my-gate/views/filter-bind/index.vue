<template>
    <div class="page paddingPage" id="filterBindPage">
        <div class="headTitle">基本信息</div>
        <div class="box">
            <div class="formWraper">
                <el-form label-position="center" label-width="100px" :rules="formRules">
                    <el-form-item label="API名称：">
                        {{apiInfo.name}}
                        <!--<el-input v-model="apiInfo.name" placeholder="API名称" disabled size="small"/>-->
                    </el-form-item>
                    <el-form-item label="URL：">
                        {{apiInfo.path}}
                        <!--<el-input v-model="apiInfo.path" placeholder="path" disabled size="small"/>-->
                    </el-form-item>

                    <el-form-item styleXXX="width: 41.66666667% !important;" prop="filters" label="Filter名称：">
                        <el-select :value="selectedFilters" multiple placeholder="选择filter" size="small" @change="onSelectFilter">
                            <el-option v-for="item in availableFilter" :key="item.filterCode" :label="item.filterName" :value="item.filterCode"/>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="gap"></div>
        <div class="headTitle">Filter配置:</div>
        <div class="box">

            <template v-if="formFilters.length">
                <el-tabs v-model="selectedIndex" class="tab">
                    <el-tab-pane v-for="item in formFilters" :key="item.filterCode" :label="item.filterName" :name="item.filterCode"/>
                </el-tabs>

                <div v-for="item,index in formFilters" class="formWraper" :key="item.filterCode">
                    <component ref="subComponents" v-show="item.filterCode===selectedIndex" v-bind="{...tabComponet(item,index)}"/>
                </div>

            </template>
            <template v-else>
                暂无
            </template>

        </div>
        <div style="text-align: center;margin: 15px">
            <el-button type="text" size="mini" @click="submit()">确定</el-button>
            <el-button type="text" size="mini" @click="cancel()">取消</el-button>
        </div>
    </div>
</template>

<script>
    import {FilterTypeEnum} from "./enum";
    import KeyValueTable from './component/KeyValueTable'
    import AuthToken from "./component/AuthToken";
    import PathMapping from "./component/PathMapping";
    import ModifyPath from "./component/ModifyPath";
    import MockResponse from "./component/MockResponse";

    export default {
        name: "filterBindPage",
        components: {KeyValueTable, AuthToken, PathMapping, ModifyPath, MockResponse},
        data() {
            return {
                selectedIndex: '',
                availableFilter: [],//Object.keys(FilterTypeEnum).map(key => ({filterCode: key, filterId: 1, filterName: "xxx"})),
                formRules: {},
                formData: {
                    filters: [],
                },
                isNew: true,//是否新增 否则是编辑
                "apiInfo": {
                    "clusterCode": "JANUS_ORDER",
                    "clusterName": "",
                    "path": "/user/CreateOrder",
                }
            }
        },
        computed: {
            id() {
                let {query} = this.$route
                let id = query.id ? query.id : ''
                return id
            },
            formFilters() {
                return this.formData.filters || []
            },
            selectedFilters() {
                return this.formFilters.map(_ => _.filterCode)
            },

        },
        watch: {
            selectedIndex(selected) {
                setTimeout(() => {
                    (this.$refs.subComponents || []).forEach(
                        comp => {
                           // debugger
                            if (comp && comp.filterData.filterCode === selected && comp.tabActive) {
                                console.log(comp.filterData.filterCode)
                                comp.tabActive()
                            }
                        })
                }, 0)
            }
        },
        async mounted() {
            await this.loadStatus()
        },
        methods: {
            async loadStatus() {
                let data
                data = await this.$axios.get('/admin/filter/getAllFilterCodes')
                this.availableFilter = (data || []).map(_ => ({filterCode: _.filterCode, filterName: _.name, filterId: _.id,}))
                //
                data = await this.$axios.get('/admin/apiFilter/listByApiId', {params: {apiId: this.id}})
                this.formData.filters = data.filters || []
                this.apiInfo = data.apiInfo || {}
                this.isNew = this.formData.filters.length === 0
                //data = await this.$axios.get('/admin/cluster/listFiltersByClusterCode', {params: {clusterCode: data.apiInfo.clusterCode}})
                setTimeout(this.updateSelectedPanel, 10)
            },
            onSelectFilter(values,) {
                let newFilters = this.formFilters.filter(item => !!values.find(code => code === item.filterCode))
                values.forEach(code => {
                    if (!newFilters.find(i => i.filterCode === code)) {
                        let newItem = this.availableFilter.find(i => i.filterCode === code)
                        newFilters.push({...newItem})
                    }
                })
                this.formData.filters = newFilters
                this.updateSelectedPanel()
            },
            updateSelectedPanel() {
                if (this.formData.filters.length > 0) {
                    this.selectedIndex = this.formData.filters [this.formData.filters.length - 1].filterCode
                }
            },
            tabComponet(item, index) {
                const typeMap = new Map([
                    [MockResponse, [FilterTypeEnum.MockResponse,]],
                    [ModifyPath, [FilterTypeEnum.StripPath, FilterTypeEnum.PrefixPath]],
                    [PathMapping, [FilterTypeEnum.PathMapping,]],
                    [AuthToken, [FilterTypeEnum.AuthToken,]],
                    [KeyValueTable, [FilterTypeEnum.AddRequestHeader, FilterTypeEnum.AddResponseHeader, FilterTypeEnum.RemoveRequestHeader, FilterTypeEnum.RemoveResponseHeader]]
                ])
                //
                const Component = [...typeMap.keys()].find(key => typeMap.get(key).includes(item.filterCode));
                if (Component === undefined) {
                    this.$message.error(item.filterCode + "是什么？前端不认识")
                    throw new Error('没注册的组件？？')
                }
                return {
                    is: Component.name,
                    filterData: item,
                    //formData: formData
                }
            },
            async getSubData() {
                let subComponents = this.$refs.subComponents || []
                let formFilters = JSON.parse(JSON.stringify(this.formFilters)) || []
                for (let i = 0; i < subComponents.length; i++) {
                    let subComp = subComponents[i]
                    let subPromise = new Promise((resolve, reject) => {
                        subComp.$refs.form.validate(v => {
                            if (v) {
                                resolve(subComp.toFilterParamJson())
                            } else {
                                reject('验证不通过')
                            }
                        })
                    })
                    formFilters[i].filterParam = await subPromise
                    formFilters[i].apiId = this.id
                }
                return formFilters
            },
            async submit() {
                if (this.formFilters.length === 0) {
                    this.$message.error("请选择Filter类型")
                    return
                }
                //
                let filters
                try {
                    filters = await this.getSubData()
                    console.log('sending  ', filters)
                } catch (e) {
                    this.$message.error("请输入Filter对应参数")
                    return
                }


                let url = this.isNew ? '/admin/apiFilter/add' : '/admin/apiFilter/update'
                await this.$axios.post(url, {filters: filters})
                this.$message.success("保存成功")
                setTimeout(() => {
                    this.$router.back()
                }, 1000)
            },
            cancel() {
                this.$router.back()
            }
        }
    }
</script>

<style scoped lang="less">
    .headTitle {
        background: #585f77;
        /* border: 1px solid gray;*/
        border-left: #FF6A04 3px solid;
        font-size: 16px;
        padding: 8px 18px;
    }

    .page {
        padding: 16px;
    }


    .box {
        position: relative;
        padding: 25px;
        border: 1px solid #585f77;
    }

    .formWraper {
        max-width: 1025px;
        margin: 0 auto;

        .el-form-item {
            width: 100%;
        }

        .el-select {
            width: 100%;
        }
    }

    .tab {
        position: absolute;
        top: -40px;
        left: 80px;
    }

    .gap {
        height: 10px;
    }
</style>

<style lang="less">
    #filterBindPage {
        @bar-active-color: #ff6a00; // 头bar选中色
        .el-tabs {
            // tabs切换头部样式
            .el-tabs__header {
                margin: 0 0 25px;
                background: transparent;
                // 头部下边框隐藏
                .el-tabs__nav-wrap::after {
                    z-index: -1;
                }

                .el-tabs__nav-scroll {
                    padding-left: 25px;
                }

                // tabs每一项
                .el-tabs__nav {
                    // 每一项字体颜色
                    .el-tabs__item {
                        color: #fff;
                        font-size: 15px;
                        padding-right: 8px;
                        padding-left: 8px;
                    }

                    // 选择tab字体样色
                    .el-tabs__item.is-active {
                        color: @bar-active-color;
                    }

                    // 选中边框颜色
                    .el-tabs__active-bar {
                        background-color: @bar-active-color;
                    }
                }
            }
        }
    }
</style>

