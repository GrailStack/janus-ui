<template>
  <div class="container menuMgmt  " id="mainMenu">
    <div class="main-content">
      <!--<div class="toggle-btn-group">
        <el-button-group>
          <el-button
            size="small"
            type="default"
            :class="[activeIndex === 0 ?'is-plain-btn' : '', 'tog-con-btn']"
            icon="el-icon-s-operation"
            @click="activeIndex = 0"
          ></el-button>
          <el-button
            size="small"
            type="default"
            :class="[activeIndex === 1 ?'is-plain-btn' : '', 'tog-con-btn']"
            icon="el-icon-menu"
            @click="activeIndex = 1"
          ></el-button>
        </el-button-group>
      </div>-->
      <el-row v-if="activeIndex === 0">
        <el-col :span="5">
          <div class="grid-content left-menu-list">
            <menu-list
              @menuTableSearch="menuTableSearch"
              @treesDisplayFuc="treesDisplayFuc"
              ref="menuListPanel"
            ></menu-list>
          </div>
        </el-col>
        <el-col :span="19">
          <div class="grid-content main-table-content">
            <div class="table-content">
              <div class="table-container point-audit">
                <Spin fix v-if="tableLoading"></Spin>
                <el-table
                  ref="table"
                  :data="tableData"
                  style="width:100%"
                  border
                  header-cell-class-name="table-header"
                >
                  <el-table-column
                    v-for="(item,index) in tableField"
                    :key="index"
                    align="center"
                    :label="item.name"
                    :prop="item.data"
                    :width="item.width"
                    :sortable="item.sortable"
                  ></el-table-column>
                  <el-table-column :label="'操作'" align="center" width="185" fixed="right">
                    <template slot-scope="scope">
                      <el-button type="success" size="small" @click="editModifiedMenu(scope.row)">修改</el-button>
                      <el-button type="danger" size="small" @click="delMenu(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="page"
                  :page-size="size"
                  :page-sizes="sizes"
                  layout="sizes, prev, pager, next, jumper"
                  v-bind:total="tableDataTotal"
                  background
                ></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="activeIndex === 1" class="org-container">
        <org-trees :data="treesDisplayData"></org-trees>
      </el-row>
    </div>
    <el-dialog :visible.sync="editMenuMgmtDialog" title="修改菜单" width="450px" class="dialog">
      <el-form
        label-position="right"
        :model="menuMgmtInfo"
        label-width="100px"
        ref="appMamtInfoForm"
      >
        <div class="dialog_row">
          <el-form-item prop="name" :rules="rules.inputText" label="菜单名称：">
            <el-input
              class="dialog_row_input"
              type="text"
              style="width:280px;"
              size="small"
              placeholder="请填写菜单名称"
              v-model="menuMgmtInfo.name"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dialog_row">
          <el-form-item prop="url" :rules="rules.inputText" label="菜单url：">
            <el-input
              class="dialog_row_input"
              type="text"
              style="width:280px;"
              size="small"
              placeholder="请填写菜单url"
              v-model="menuMgmtInfo.url"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dialog_row">
          <el-form-item prop="sort" :rules="rules.inputText" label="菜单序号：">
            <el-input
              class="dialog_row_input"
              type="text"
              style="width:280px;"
              size="small"
              placeholder="请填写菜单序号"
              v-model="menuMgmtInfo.sort"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dialog_row">
          <el-form-item prop="menuKey" :rules="rules.inputText" label="menuKey：">
            <el-input
              class="dialog_row_input"
              type="text"
              style="width:280px;"
              size="small"
              placeholder="请填写menuKey"
              v-model="menuMgmtInfo.menuKey"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dialog_row">
          <el-form-item prop="icon" :rules="rules.inputText" label="菜单图标：">
            <el-input
              class="dialog_row_input"
              type="text"
              style="width:280px;"
              size="small"
              placeholder="请填写菜单图标"
              v-model="menuMgmtInfo.icon"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dialog_row">
          <el-form-item prop="roleList" label="角色：">
            <el-select v-model="menuMgmtInfo.roleList" multiple>
              <el-option
                v-for="(item, i) in roleList"
                :key="i"
                :label="item.name"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dialog_btns">
          <el-button type="primary" size="medium" @click="editCancleStuInfo()">取消</el-button>
          <el-button type="success" size="medium" @click="editSubmitStuInfo()">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { tableField } from './config';
import MenuList from './MenuList';
import OrgTrees from './org-trees';
import {deleteUndefinedParams} from "../../../common/utils/paramsUtils";
export default {
  name: 'MenuMgmt',
  data() {
    return {
      page: 1,
      size: 20,
      sizes: [15, 20, 30, 50],
      tableDataTotal: 0,
      activeIndex: 0,
      tableLoading: false,
      tableData: [],
      tableField,
      menuListData: [],
      parentId: '',
      rules: {
        inputText: [{ required: true, message: '必填项', trigger: 'blur' }],
      },
      menuMgmtInfo: {
        id: '',
        name: '',
        menuKey: '',
        icon: '',
        sort: '',
        url: '',
        parentId: '',
        roleList: [],
      },
      editMenuMgmtDialog: false,
      deleteMenuName: '',
      currentMenuId: '',
      treesDisplayData: [],
      roleList: [],
    };
  },
  components: { MenuList, OrgTrees },
  computed: {
    flowMgmtSearchData() {
      let option = {};
      option = {
        parentId: this.parentId,
        pageNo: this.page,
        pageSize: this.size,
      };
      return option;
    },
  },
  mounted() {
    this.$axios.post('/admin/role/page', {
        pageNo: 1,
        pageSize: 499,
      }).then(data => {
      if (data) {
        this.roleList = data.list;
      } else {
        this.$message.warning('暂无数据');
      }
    });
  },
  methods: {
    async setRoleList() {
      this.$axios.post('/admin/role/page', {
          pageNo: 1,
          pageSize: 499,
        }).then(data => {
        if (data) {
          this.roleList = data.list;
        } else {
          this.$message.warning('暂无数据');
        }
      });
    },
    async handleSearch() {
      await this.$axios({
        url: '/admin/menu/manage/querySubMenuByParentId',
        method: 'get',
        params: this.flowMgmtSearchData,
      }).then(data => {
        this.tableDataTotal = data.totalCount;
        this.tableData = data;
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
    menuTableSearch(item) {
      this.parentId = item.id;
      this.handleSearch();
    },
    // 给树形图传数据
    treesDisplayFuc(trees) {
      this.treesDisplayData = this.treeKeysSet(trees, 'subMenus', 'label');
      this.treesDisplayData = this.treesDisplayData[0];
    },
    // 属性数据key处理
    treeKeysSet(trees, key, key2) {
      const treesData = trees.map(item => {
        if (item[key] && item[key].length > 0) {
          item.children = item[key];
          item[key2] = item.name;
          this.treeKeysSet(item[key], key, key2);
        } else {
          item[key2] = item.name;
        }
        return item;
      });
      return treesData;
    },
    editModifiedMenu(row) {
      this.editMenuMgmtDialog = true;
      for (const key in this.menuMgmtInfo) {
        if (this.menuMgmtInfo.hasOwnProperty(key)) {
          this.menuMgmtInfo[key] = row[key];
        }
      }
    },
    editSubmitStuInfo() {
      this.$refs.appMamtInfoForm.validate().then(valid => {
        this.$axios({
          url: '/admin/menu/manage/upsert',
          method: 'post',
          data: deleteUndefinedParams(this.menuMgmtInfo),
        }).then(res => {
          this.$message({
            message: '修改菜单成功',
            type: 'success',
          });
          this.editMenuMgmtDialog = false;
          this.$refs.menuListPanel.queryAllMenu();
          this.handleSearch();
        });
      });
    },
    editCancleStuInfo() {
      this.editMenuMgmtDialog = false;
    },
    delMenu(row) {
      this.currentMenuId = row.id;
      this.deleteMenuName = row.name;

      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.$axios({
          url: '/admin/menu/manage/delete',
          method: 'post',
          data: { id: this.currentMenuId },
        }).then(data => {
          this.$message({
            message: '删除菜单成功',
            type: 'success',
          });
          this.$refs.menuListPanel.queryAllMenu();
          this.handleSearch();
        });
      })
    },
  },
};
</script>
<style lang="less" scoped>
.menuMgmt {
  position: absolute;
  left: 1px;
  right: 0;
  top: 70px;
  bottom: 10px;
  padding: 0 13px 13px 13px;
  overflow-y: auto;
  transition: all .25s ease;

  .menuMgmt-info {
    background: #393e50;
    padding: 12px 8px;
    margin-bottom: 10px;
    .menuMgmt-title {
      font-size: 20px;
      font-weight: 600;
    }
  }
  .search-panel {
    padding: 21px 0 12px;
  }
  .table-content {
    padding: 1px;
    .operation {
      padding: 16px 0 16px 20px;
    }
    .table-header {
      color: #fff;
      // background: #fafafa;

    }
  }
  .main-content {
    padding: 15px;
    background: #393e50;
    .main-table-content {
      margin-left: 6px;
      padding-top: 23px;
    }
    .org-container {
      height: 600px;
    }
  }
  .is-plain-btn {
    color: #ef4c4f;
    background: #f0f9eb;
    border-color: #c2e7b0;
  }
  .tog-con-btn:hover {
    color: #ef4c4f;
    background: #f0f9eb;
    border-color: #c2e7b0;
  }
  .warning {
    margin-bottom: 24px;
    .warning-info {
      height: 36px;
      line-height: 36px;
      color: #ef4c4f;
      border: 1px solid #ef4c4f;
      background: #ffe0cb;
      padding-left: 8px;
    }
  }
  .dialog_del_btns {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>




