<template>
    <div ref="cadlistWrapper" class="cadlistWrapper">

        <div class="frame-breadcrumb" v-if="cardlist.length!==0">
            <div v-show="isShowArrows" class="left-icon" @click="handleClickMoveRight">
                <img :src="require('!!file-loader!../../../images/left.png')" alt=''>
            </div>

            <transition-group class="bread-crumb-main" :class="{'active': !isShowArrows}"
                              ref='breadCrumbMainStyle'>
                <div class="bread-crumb-list" id="bread-crumb-list" key="home"
                     :style="listStyle"
                     ref="breadCrumbListStyle">
                    <div v-for="(itemChild, index) in cardlist" :key="index" class="grounp-list"
                         :class="{'active': isActive(index)}"
                         @click="clickCard(index)">
                        <div class="title">
                            <h5>{{itemChild.name}}</h5>
                            <span><i></i></span>
                        </div>
                        <div class="content">
                            <div class="desc">
                                <p>{{itemChild.filterCode}}</p>
                                <p>{{"是否全局:"}}{{itemChild.isGlobal|boolNumToString}}</p>
                            </div>
                            <div class="oper">
                                <span @click="clickEdit(index,itemChild)">编辑</span>
                                <span @click="clickDelete(index,itemChild)">删除</span>
                            </div>
                        </div>
                    </div>
                </div>
            </transition-group>

            <div v-show="isShowArrows" class="right-icon" @click="handleClickMoveLeft">
                <img :src="require('!!file-loader!../../../images/right.png')" alt=''>
            </div>
        </div>

        <div class="no-data" v-if="cardlist.length===0">暂无数据</div>
    </div>
</template>

<script>
    import {MetaUtils} from "../../../../system/views/metaData/metaUtils";


    const cardWidth = (260 + 15)
    export default {
        name: "CardList",
        props: {
            cardlist: {
                type: Array,
                default: () => []
            },
            metaConfig: {
                type: Object,
                default: () => {
                }
            },
            selectedIndex: {
                type: Number,
                default: () => 0
            }
        },
        data() {
            return {
                // 个数是否达到显示左右按钮
                isShowArrows: true,
                // 滑动的index
                viewIndex: 0,
                //
                maxViewWidth: 0,
            }
        },
        filters: {
            boolNumToString(val) {
                let str = {"1": "是", "0": "否"}['' + val]
                return str === undefined ? val : str;
            }
        },
        computed: {
            length() {
                return this.cardlist ? this.cardlist.length : 0
            },
            listStyle() {
                let left = -this.viewIndex * cardWidth
                return {left: `${left}px`}
            }
        },
        mounted() {
            // 页面发生变化计算屏幕宽度，判断是否显示左右按钮
            let self = this
            window.onresize = () => {
                self.resize(self.tabActiveName)
            }
            this.resize()
        },
        destroyed() {
            window.onresize = null
        },
        methods: {
            // $parent 调用
            reset() {
                this.viewIndex = 0;
                this.resize()
            },
            clickEdit() {
                this.$emit('edit')
            },
            // 删除组件
            clickDelete(index, item) {
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.$axios({
                            url: '/admin/filter/delete',
                            method: 'post',
                            data: {
                                id: item.id
                            },
                        }
                    )
                    //
                    this.$message.success('删除成功')
                    //
                    this.$parent.refresh()
                })
            },
            // 是否选中的卡片样式
            isActive(index) {
                return index === this.selectedIndex
            },

            //
            clickCard(index) {
                this.$parent.selectedIndex = index
            },

            //-----------------------
            resize() {
                // this.loadTabAt(tab.index)
                let cadlistWrapper = this.$refs.cadlistWrapper
                this.maxViewWidth = cadlistWrapper.getBoundingClientRect().width
                console.log('this.maxViewWidth', this.maxViewWidth, this.length * cardWidth + 100)
                this.isShowArrows = (this.maxViewWidth < this.length * cardWidth + 100)
            },
            // 点击做按钮动画
            handleClickMoveRight: function () {
                let i = this.viewIndex - 1
                this.viewIndex = i < 0 ? 0 : i
            },
            // 点击有按钮动画
            handleClickMoveLeft: function () {
                let i = this.viewIndex + 1
                let len = this.length ? this.length : 0
                len = len - Math.floor((this.maxViewWidth - 100) / cardWidth) + 1
                len = len > 1 ? len : 1
                console.log(len)
                this.viewIndex = i >= len ? len - 1 : i
            },
            //-------------
            // 根据config[key]里的options取出等于value的opt显示其label
            optValueToLabelOf(metaKey, value) {
                return MetaUtils.optValueToLabelOf(this.metaConfig[metaKey], value)
            },

        }
    }
</script>

<style scoped lang="less">

    .cadlistWrapper {
        width: 100%;
    }

    .frame-breadcrumb {
        display: flex;
        flex: 1;
        height: 170px;
        // border-bottom: 1px solid #ccc;
        .left-icon {
            margin-right: 25px;
        }

        .left-icon, .right-icon {
            width: 30px;
            text-align: center;
            line-height: 170px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 900;
            color: #D0D0D0;
            font-size: 46px;
            font-weight: 900;

            span {
                color: #9B9B9B;
            }
        }

        .right-icon {
            margin-left: 25px;
        }

        .bread-crumb-main.active {
            margin-left: 55px;
        }

        .bread-crumb-main {
            flex: 1;
            overflow: hidden;
            position: relative;

            .bread-crumb-list::-webkit-scrollbar {
                display: none
            }

            .bread-crumb-list {
                position: absolute;
                left: 0;
                width: auto;
                height: 170px;
                transition: all 0.5s;
                white-space: nowrap;
                color: #999;
                overflow-x: auto;
                box-sizing: border-box;

                .grounp-list:not(:last-child) {
                    margin-right: 15px;
                }

                .grounp-list {
                    display: inline-block;
                    overflow: hidden;
                    cursor: pointer;
                    -webkit-transition: all 0.3s ease-in;
                    transition: all 0.3s ease-in;
                    width: 260px;

                    .title {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0 10px;
                        width: 100%;
                        height: 40px;
                        background: #1F2232;

                        h5 {
                            color: #ff6a00;
                            font-size: 14px;
                            padding: 0;
                            margin: 0;
                            height: 100%;
                            line-height: 40px;
                        }

                        span {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 15px;
                            height: 15px;
                            border-radius: 100%;
                            background: #fff;
                        }
                    }

                    .content {
                        height: 130px;
                        background: #292D40;
                        border: 1px solid #292D40;
                        border-top-width: 0;
                        border-radius: 0 0 2px 2px;

                        .desc {
                            height: 90px;
                            font-size: 14px;
                            color: #C1C5CF;
                            padding: 10px;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 4;
                            overflow: hidden;
                            white-space: normal;

                            p {
                                margin: 0;
                                padding: 0;

                                &:nth-child(1) {
                                    font-size: 15px;
                                    margin: 10px 0;
                                }
                            }
                        }

                        .oper {
                            height: 40px;
                            line-height: 40px;
                            text-align: right;

                            span {
                                color: #ff6a00;

                                &:nth-child(1) {
                                    margin-right: 10px;
                                    background: url('../../../images/bind.png') no-repeat left center;
                                    padding-left: 20px;
                                }

                                &:nth-child(2) {
                                    margin-right: 20px;
                                    background: url('../../../images/delete.png') no-repeat left center;
                                    padding-left: 20px;
                                }
                            }
                        }
                    }
                }

                .grounp-list.active {
                    .title {
                        background: #ff9733;

                        h5 {
                            color: #fff;
                        }

                        span {
                            background: #ff6a00;

                            i {
                                width: 5px;
                                height: 5px;
                                background: #fff;
                                border-radius: 100%;
                            }
                        }
                    }

                    .content {
                        border: 1px solid #ff862f;
                        border-top-width: 0;
                        box-sizing: border-box;
                    }
                }
            }
        }
    }

    .no-data {
        width: 100%;
        height: 100%;
        text-align: center;
    }
</style>