<template>
  <div class="menu-panel">
    <div class="search-input">
      <el-input placeholder="请输入内容" size="small" v-model="filterCxt">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <div class="tree-wrapper">
      <ul class="menu-root">
        <li class="menu-submenu" v-for="item in menuList" :key="item.id">
          <div
            class="menu-root-title"
            @mouseenter="menuEditEnter(item)"
            @mouseleave="menuEditLeave(item)"
            @click.stop="handleMenuTableSearch(item)"
          >
            <span>
              <i class="icon-shouye"></i>
              <span>{{item.name}}</span>
            </span>
            <a class="root-group-btn" @click.stop="addMenu(item)">
              <i class="icon-jiahao"></i>
            </a>
          </div>
          <template v-if="item.subMenus && item.subMenus.length > 0">
            <ul class="submenus" v-for="subItem in item.subMenus" :key="subItem.id">
              <li class="menu-item-group">
                <div
                  class="menu-item-group-title"
                  @mouseenter="menuEditEnter(subItem)"
                  @mouseleave="menuEditLeave(subItem)"
                  @click.stop="handleMenuTableSearch(subItem)"
                >
                  <span>{{subItem.name}}</span>
                  <a
                    class="root-group-btn"
                    v-if="subItem.iconDisplay"
                    @click.stop="addMenu(subItem)"
                  >
                    <i class="icon-jiahao"></i>
                  </a>
                </div>
                <ul class="menu-item-group-list">
                  <li
                    class="menu-item"
                    v-for="menu in subItem.subMenus"
                    :key="menu.id"
                    @mouseenter="menuEditEnter(menu)"
                    @mouseleave="menuEditLeave(menu)"
                    @click.stop="handleMenuTableSearch(menu)"
                  >
                    {{menu.name}}
                    <!-- <a
                    class="root-group-btn"
                    v-if="menu.iconDisplay"
                    @click.stop="addMenu(menu)"
                  >
                    <i class="icon-jiahao"></i>
                    </a>-->
                  </li>
                </ul>
              </li>
            </ul>
          </template>
        </li>
      </ul>
    </div>
    <el-dialog :visible.sync="menuMgmtDialog" title="添加菜单" width="450px" class="dialog">
      <el-form
        label-position="right"
        label-width="100px"
        :model="menuMgmtInfo"
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
        <div class="dialog_btns">
          <el-button type="primary" size="medium" @click="cancleStuInfo()">取消</el-button>
          <el-button type="primary" size="medium" @click="submitStuInfo()">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'MenuList',
  data() {
    return {
      filterCxt: '',
      menuList: [],
      menuDisplayList: [],
      menuMgmtDialog: false,
      firstQuery: true,
      rules: {
        inputText: [{ required: true, message: '必填项', trigger: 'blur' }],
      },
      menuMgmtInfo: {
        icon: '',
        id: null,
        name: '',
        menuKey: '',
        sort: '',
        parentId: '',
        url: '',
      },
    };
  },
  watch: {
    filterCxt() {
      const newObj = this.deepClone(this.menuDisplayList);
      newObj.forEach((item, index) => {
        const arr1 = item.subMenus.filter(menu => {
          return menu.name.includes(this.filterCxt);
        });
        item.subMenus = arr1;
      });
      this.menuList = newObj;
    },
  },
  methods: {
    async queryAllMenu() {
      await this.$axios({
        url: '/admin/menu/manage/allMenu',
        method: 'get',
      }).then(res => {
        this.menuList = res.map(item => {
          item.iconDisplay = false;
          if (item.subMenus && item.subMenus.length > 0) {
            item.subMenus.forEach(subGroup => {
              subGroup.iconDisplay = false;
              if (subGroup.subMenus && subGroup.subMenus.length > 0) {
                subGroup.subMenus.forEach(menu => {
                  menu.iconDisplay = false;
                });
              }
            });
          }
          return item;
        });
        this.menuDisplayList = this.deepClone(this.menuList);
        const treesDisplayList = this.deepClone(this.menuList);
        this.$emit('treesDisplayFuc', treesDisplayList);
        if (this.firstQuery) {
          this.handleMenuTableSearch(this.menuList[0]);
          this.firstQuery = false;
        }
      });
    },
    deepClone(obj) {
      const objClone = Array.isArray(obj) ? [] : {};
      if (obj && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 判断ojb子元素是否为对象，如果是，递归复制
            if (obj[key] && typeof obj[key] === 'object') {
              objClone[key] = this.deepClone(obj[key]);
            } else {
              // 如果不是，简单复制
              objClone[key] = obj[key];
            }
          }
        }
      }
      return objClone;
    },
    menuEditEnter(item) {
      item.iconDisplay = true;
    },
    menuEditLeave(item) {
      item.iconDisplay = false;
    },
    handleMenuTableSearch(item) {
      this.$emit('menuTableSearch', item);
    },
    addMenu(item) {
      this.menuMgmtInfo.parentId = item.id;
      this.menuMgmtDialog = true;
    },
    submitStuInfo() {
      const that = this;
      this.$refs.appMamtInfoForm.validate().then(valid => {
        this.$axios({
          url: '/admin/menu/manage/upsert',
          method: 'post',
          data: this.menuMgmtInfo,
        }).then(data => {
          this.menuMgmtDialog = false;
          this.$message({
            message: '添加菜单成功',
            type: 'success',
          });
          that.$emit('refreshNavMenu');
          this.queryAllMenu();
        });
      });
    },
    cancleStuInfo() {
      this.menuMgmtDialog = false;
      for (const key in this.menuMgmtInfo) {
        if (this.menuMgmtInfo.hasOwnProperty(key)) {
          this.menuMgmtInfo[key] = '';
        }
      }
    },
  },
  mounted() {
    this.queryAllMenu();
  },
};
</script>
<style lang="less">
.menu-panel {
  font-size: 14px;
  padding: 24px 6px 0 2px;
  .menu-root {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    outline: none;
    margin-bottom: 0;
    padding-left: 0;
    padding-top: 16px;
    list-style: none;
    max-height: 720px;
    overflow-y: scroll;
    overflow-x: hidden;
    @import '../../../common/styles/theme/simple/webkitscroll';
    // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    // border-right: 1px solid #e2e2e2;
    color: #C1C5CF;
    .root-group-btn {
      color: #C1C5CF;
      margin-left: 10px;
    }
    .root-group-btn:hover {
      color: #ff6a00;
      opacity: 0.6;
    }
    .menu-submenu {
      .menu-root-title {
        padding: 0 16px;
        padding-left: 24px;
        line-height: 40px;
        height: 40px;
        font-size: 14px;
        line-height: 40px;
        height: 40px;
        margin-top: 4px;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        width: calc(100% + 1px);
        position: relative;
        font-weight: 600;
        cursor: pointer;
        .menu-icon {
          margin-right: 10px;
        }
        .icon-shouye {
          margin-right: 4px;
        }
      }
      .submenus {
        padding: 0;
        border: 0;
        border-radius: 0;
        cursor: pointer;
        box-shadow: none;
        .menu-item-group {
          .menu-item-group-title {
            color: #C1C5CF;
            font-size: 14px;
            line-height: 1.5;
            padding: 8px 16px;
            padding-left: 32px;
            transition: all 0.3s;
            overflow: hidden;
            text-overflow: ellipsis;
            position: relative;
            white-space: nowrap;
            font-weight: 600;
            .menu-group-btn {
              color: #C1C5CF;
              position: absolute;
              right: 16px;
              top: 8px;
            }
          }
          .menu-item-group-list {
            .menu-item {
              padding: 0 16px 0 48px;
              font-size: 13px;
              line-height: 40px;
              height: 40px;
              margin-top: 4px;
              margin-bottom: 8px;
              overflow: hidden;
              text-overflow: ellipsis;
              position: relative;
              white-space: nowrap;
              cursor: pointer;
              .menu-btn {
                color: #C1C5CF;
                position: absolute;
                right: 16px;
                top: 0px;
              }
            }
            .menu-item:hover {
              color: #ff6a00;
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
</style>


