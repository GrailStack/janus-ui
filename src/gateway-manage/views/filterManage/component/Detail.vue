<template>
    <div class="details-msg" v-if="visible">
        <h2><span></span><span>基本信息</span></h2>
        <ul class="list">
            <li>
              <span>
                <i>是否共享：</i>
                <i>{{detail.isShare|boolNumToString}}</i>
              </span>
                <span>
                <i>执行位置：</i>
                <i>{{ optValueToLabelOf('filter_execute_place',detail.executePlace ) }}</i>
              </span>
                <span>
                <i>优先级：</i>
                <i>{{detail.filterOrder}}</i>
              </span>
            </li>
            <li>
              <span>
                <i>状态：</i>
                <i>{{optValueToLabelOf('filter_status',detail.status ) }}</i>
              </span>
                <span>
                <i>更新时间：</i>
                <i>{{detail.gmtModified}}</i>
              </span>
                <span>
              </span>
            </li>
            <!--<li :class="{'bind':detail.context!=='' && groupManageDetails.context !== null && groupManageDetails.context.length!==0}">
              <span>
                <i>路由绑定：</i>
                <i v-if="groupManageDetails.context!=='' && groupManageDetails.context !== null">
                  <em v-for="(item,index) in groupManageDetails.context" :key="index" :label="item" v-if="item !== ''">{{item}}<i
                          class="el-icon-close" @click="unbindRouter(groupManageDetails, item)"></i></em>
                </i>
              </span>
            </li>-->
            <li>
              <span class="desc">
                <i class="desc">描述：</i>
                <i class="desc">{{detail.description}}</i>
              </span>
            </li>
        </ul>
    </div>
</template>

<script>
    import {MetaUtils} from "../../../../system/views/metaData/metaUtils";

    export default {
        name: "Detail",
        props: {
            metaConfig: {
                type: Object,
                default: () => {
                }
            },
            detail: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {}
        },
        filters: {
            boolNumToString(val) {
                let str = {"1": "是", "0": "否"}['' + val]
                return str === undefined ? val : str;
            }
        },
        computed: {
            visible() {
                return this.detail && this.detail.name
            }
        },
        methods: {

            // 根据config[key]里的options取出等于value的opt显示其label
            optValueToLabelOf(metaKey, value) {
                return MetaUtils.optValueToLabelOf(this.metaConfig[metaKey], value)
            },
        }
    }
</script>

<style scoped lang="less">
    .details-msg {
        padding: 0 55px;
        margin-top: 30px;

        h2 {
            margin: 0px 0 15px 0;

            span {
                color: #fff;

                &:nth-child(1) {
                    display: inline-block;
                    width: 9px;
                    height: 9px;
                    //background-image: linear-gradient(-135deg, #2DC9EB 0%, #14D2B8 100%);
                    background-image: linear-gradient(-135deg, #ff6a00 0%, #ff8026 100%);
                    border-radius: 100%;
                    margin-right: 10px;
                }

                &:nth-child(2) {
                    color: #fff;
                    font-size: 16px;
                }
            }
        }

        .list {
            li {
                display: flex;
                margin-bottom: 15px;

                span {
                    display: flex;
                    flex: 1;
                    padding-left: 17px;

                    & > i {
                        font-style: normal;
                        font-size: 14px;

                        &:nth-child(1) {
                            color: #C1C5CF;
                        }

                        &:nth-child(2) {
                            flex: 1;
                            color: #fff;

                            em {
                                font-style: normal;
                                padding: 1px 10px 3px;
                                background: #60BECA;
                                border-radius: 11px;
                                margin-right: 10px;
                                font-size: 14px;
                                margin-bottom: 7px;
                                white-space: nowrap;
                                display: inline-block;

                                i {
                                    font-size: 12px;
                                    cursor: pointer;
                                    padding: 0 5px;
                                }
                            }
                        }
                    }
                }

                span.desc {
                    i {
                        line-height: 25px;
                        white-space: pre-line;
                    }
                }
            }

            li.bind {
                margin-bottom: 5px;
            }
        }
    }
</style>