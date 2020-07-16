<template>
  <div class="department-outer">
    <div class="zoom-box">
      <zoom-controller v-model="zoom" :min="20" :max="200"></zoom-controller>
    </div>
    <div class="view-box">
      <org-view v-if="data" :data="data" :zoom-handled="zoomHandled"></org-view>
    </div>
  </div>
</template>

<script>
import OrgView from './components/org-view.vue';
import ZoomController from './components/zoom-controller.vue';

const menuDic = {
  edit: '编辑部门',
  detail: '查看部门',
  new: '新增子部门',
  delete: '删除部门',
};
export default {
  name: 'orgTrees',
  componentName: 'orgTrees',
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  components: {
    OrgView,
    ZoomController,
  },
  data() {
    return {
      zoom: 100,
    };
  },
  computed: {
    zoomHandled() {
      return this.zoom / 100;
    },
  },
  methods: {
    setDepartmentData(data) {
      data.isRoot = true;
      return data;
    },
    handleMenuClick({ data, key }) {
      this.$Message.success({
        duration: 5,
        content: `点击了《${data.label}》节点的'${menuDic[key]}'菜单`,
      });
    },
  },
  mounted() {
    console.log(this.data);
  },
};
</script>

<style lang="less">
@import './index.less';
</style>


