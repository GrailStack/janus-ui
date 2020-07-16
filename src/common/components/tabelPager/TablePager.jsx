import {Component, Prop, Vue} from "vue-property-decorator";

export const createPagerData = () => ({
    page: 1,
    size: 15,
    sizes: [15, 20, 30, 50],
    total: 0,
    layout: "prev, pager, next, jumper,sizes"
})

@Component({name: "TablePager"})
export class TablePager extends Vue {
    @Prop({
        default: createPagerData
    })
    pagerData;

    render() {
        return (
            <el-pagination
                onsize-change={this.handleSizeChange}
                oncurrent-change={this.handleCurrentChange}
                current-page={this.pagerData.page}
                page-size={this.pagerData.size}
                page-sizes={this.pagerData.sizes}
                total={this.pagerData.total}
                layout={this.pagerData.layout}
                background/>
        )
    }

    handleSizeChange(pageSize) {
        let p = {...this.pagerData, size: pageSize}
        this.$emit('pageChange', p)
    }

    handleCurrentChange(currentPage) {
        let p = {...this.pagerData, page: currentPage}
        this.$emit('pageChange', p);
    }
}