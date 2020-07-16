<template>
    <el-dialog class="editorDialog" :visible.sync="visible" width="860px">
        <p slot="title" class="dialog-header">
            <span class="dialog-title">路由连通性测试</span>
        </p>
        <div class="section-container">
            <div class="section-content">
                <div class="test-info">
                    <div class="bar">
                        <el-select class="method" v-model="connectTestViewModel.requestMethod" slot="prepend" placeholder="请选择">
                            <el-option label="GET" value="GET"></el-option>
                            <el-option label="POST" value="POST"></el-option>
                        </el-select>
                        <el-input class="address" placeholder="请输入测试路由" v-model="connectTestViewModel.requestAddress"/>
                        <el-button class="testBtn" slot="append" @click="testRequest">测 试</el-button>
                    </div>
                    <el-input
                            type="textarea"
                            placeholder="请输入测试路由参数"
                            v-if="connectTestViewModel.requestMethod === 'POST'"
                            v-model="paramsInfoText">
                    </el-input>
                </div>
                <div class="test-resolve" :class="{'active': connectTestViewModel.requestMethod === 'POST'}">
                    <div class="info">respones</div>
                    <div class="respones-info">
                        <el-input class="responseInput"
                                  :disabled="true"
                                  type="textarea"
                                  v-model="responseInfoFormatJson">
                        </el-input>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'ConnecteTestDialog',
        data() {
            return {
                visible: false,
                connectTestViewModel: {
                    requestMethod: 'GET',
                    requestAddress: ''
                },
                responseInfoFormatJson: '',
                paramsInfoText: ''
            }
        },
        methods: {
            async testRequest() {
                this.responseInfoFormatJson = '';
                let postData = '', res = '', resData = '';
                if (this.connectTestViewModel.requestAddress === '') {
                    this.$message.error('请输入测试路由')
                    return
                }
                if (this.connectTestViewModel.requestMethod === 'POST' && this.paramsInfoText !== '') {
                    try {
                        postData = JSON.parse(this.paramsInfoText)
                    } catch (e) {
                        this.$message.error('请输入测试路由参数 JSON格式！')
                        return
                    }
                }

                try {
                    let http = axios.create({
                        timeout: 15000,
                        headers: {}
                    });
                    if (this.connectTestViewModel.requestMethod === "POST") {
                        res = await http.post(this.connectTestViewModel.requestAddress, postData)
                    } else {
                        res = await http.get(this.connectTestViewModel.requestAddress)
                    }
                    resData = res.data
                } catch (e) {
                    this.$message.error('请求失败')
                    return
                }

                if ((typeof resData).toLowerCase() === 'string') {
                    this.responseInfoFormatJson = resData
                } else {
                    this.responseInfoFormatJson = JSON.stringify(resData)
                }
            },
            /*formatJson(params) {
                this.responseInfoFormatJson = ''
                let k = 0
                let j = 0
                let ii = null
                let ele = null
                for (let i = 0; i < params.length; i++) {
                    ele = params.charAt(i)
                    if (j % 2 === 0 && ele === '}') {
                        k--
                        for (ii = 0; ii < k; ii++) {
                            ele = '    ' + ele
                        }
                        ele = '\n' + ele
                    } else if (j % 2 === 0 && ele === '{') {
                        ele += '\n'
                        k++
                        for (ii = 0; ii < k; ii++) {
                            ele += '    '
                        }
                    } else if (j % 2 === 0 && ele === ',') {
                        ele += '\n'
                        for (ii = 0; ii < k; ii++) {
                            ele += '    '
                        }
                    } else if (ele === '"') {
                        j++
                    }
                    this.responseInfoFormatJson += ele
                }
            }*/
        }
    }
</script>

<style lang="less" scoped>
    .bar {
        margin: 15px 0;
        display: flex;
        justify-content: space-between;

        .method {
            width: 150px;
            display: inline-block;
        }

        .address {
            margin-left: 2px;
            display: inline-block;
            flex-grow: 1;
        }

        .testBtn {
            margin-left: 3px;
            height: 40px;
        }
    }

    .test-resolve {
        .info {
            line-height: 35px;
            font-size: 16px;
        }

    }


</style>
<style lang="less">
    .test-resolve {
        .responseInput {
            .el-textarea__inner {
                height: 350px;
            }
        }
    }

</style>
