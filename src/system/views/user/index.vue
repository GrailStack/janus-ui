<template>
  <div class="container userMgmt" id="userMgmt">
    <!--<div class="userMgmt-info">
      <p class="userMgmt-title">用户管理</p>
      <p class="userMgmt-desc">针对平台用户做统一管理</p>
    </div>-->
    <div class="search-panel">
      <el-form :inline="true" size="small">
        <el-form-item label="关键字:">
          <el-input
            placeholder="请输入关键字"
            v-model="searchKey"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            typeX="primary"
            icon="el-icon-search"
            size="small"
            @click="handleSearch()"
            >查询</el-button
          >
          <el-button
                  typeX="primary"
                  style="“background-color:#ff6a00”"
                  size="small"
                  @click="handleCreateUser()">
            创建</el-button>
        </el-form-item>
      </el-form>
    </div>
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
            v-for="(item, index) in tableField"
            :key="index"
            align="center"
            :label="item.name"
            :prop="item.data"
            :width="item.width"
            :sortable="item.sortable"
            v-if="!item.hide"
          ></el-table-column>
          <el-table-column
            :label="'操作'"
            align="center"
            width="150"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                typeX="primary"
                size="small"
                @click="Modifiedgmt(scope.row)"
                >修改</el-button
              >
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

    <el-dialog :visible.sync="userMamtDialog" width="640px" class="dialog">
      <p slot="title" class="dialog-header">
        <span class="dialog-title">{{ modifiedGmtTitle }}</span>
      </p>
      <el-form
        :model="userMamtInfo"
        ref="userMamtInfoForm"
        label-position="center"
        label-width="100px"
      >
        <div class="dialog_row">
          <el-form-item
            prop="name"
            :rules="rules.inputText"
            class="dialog-form-item"
            label="姓名："
          >
            <el-input
              class="dialog_row_input"
              type="text"
              style="width:100%;"
              size="small"
              placeholder="请填写姓名"
              v-model="userMamtInfo.name"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="userName"
            :rules="rules.inputText"
            class="dialog-form-item-right"
            label="用户ID："
          >
            <el-input
              class="dialog_row_input"
              type="text"
              style="width:100%;"
              size="small"
              placeholder="请填写用户名"
              :disabled="userMgtType === 'modified'"
              v-model="userMamtInfo.userName"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dialog_row">
          <el-form-item
            prop="email"
            :rules="rules.inputText"
            class="dialog-form-item"
            label="邮箱："
          >
            <el-input
              class="dialog_row_input"
              type="text"
              style="width:100%;"
              size="small"
              placeholder="请填写邮箱"
              v-model="userMamtInfo.email"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="password"
            :rules="userMgtType === 'modified' ? [] : rules.inputText"
            class="dialog-form-item"
            label="密码："
          >
            <el-input
              class="dialog_row_input"
              :type="pwdType"
              style="width:100%;"
              size="small"
              placeholder="请填写密码"
              :disabled="userMgtType === 'modified'"
              v-model="userMamtInfo.password"
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-view"
                style="cursor: pointer;"
                @mousedown="pwdType = 'text'"
                @mouseleave="pwdType = 'password'"
                @mouseup="pwdType = 'password'"
              ></i>
            </el-input>
          </el-form-item>
        </div>
        <div class="dialog_row">
          <el-form-item
            prop="status"
            :rules="rules.inputSelect"
            class="dialog-form-item"
            label="角色："
          >
            <el-select
              v-model="userMamtInfo.role"
              placeholder="请选择角色"
              size="small"
            >
              <el-option
                v-for="item in roleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            prop="status"
            :rules="rules.inputSelect"
            class="dialog-form-item"
            label="禁用状态："
          >
            <el-select
              v-model="userMamtInfo.status"
              placeholder="请选择禁用状态"
              size="small"
            >
              <el-option
                v-for="item in disableStatusOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dialog_btns">
          <el-button typeX="primary" size="medium" @click="cancleStuInfo()"
            >取消</el-button
          >
          <el-button typeX="primary" size="medium" @click="submitStuInfo()"
            >保存</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { tableField } from './config';
import moment from "moment";
export default {
  name: 'UserMgmt',
  data() {
    return {
      page: 1,
      size: 15,
      sizes: [15, 20, 30, 50],
      tableDataTotal: 0,
      tableLoading: false,
      tableData: [],
      tableField,
      searchKey: '',
      editTableDialog: false,
      userMamtDialog: false,
      modifiedGmtTitle: '',
      rules: {
        inputText: [{ required: true, message: '必填项', trigger: 'blur' }],
        inputSelect: [{ required: true, message: '必选项', trigger: 'change' }],
      },
      pwdType: 'password',
      userMgtUrl: '',
      userMgtType: 'add',
      userMamtInfo: {
        name: '',
        password: '',
        role: '',
        userName: '',
        email: '',
        status: null,
      },
      // 租户集合
      tanentList: [],
      roleOptions: [],
      disableStatusOption: [
        { value: 0, label: '禁用' },
        { value: 1, label: '启用' },
      ],
    };
  },
  computed: {
    usermgmtSearchData() {
      return {
        searchKey: this.searchKey,
        pageNo: this.page,
        pageSize: this.size,
      };
    },
  },
  mounted() {
    this.handleSearch();
    this.queryAllRole();
  },
  methods: {
    async handleSearch() {
      await this.$axios({
        url: '/admin/user/page',
        method: 'post',
        data: this.usermgmtSearchData,
      }).then(data => {
        if (data) {
          this.tableDataTotal = data.totalCount;
          this.tableData = data.list.map(item => {
            const opt = { ...item };
            opt.statusStr = item.status === 0 ? '禁用' : '启用';
            opt.gmtCreateStr = item.gmtCreate
              ? moment(item.gmtCreate).format('YYYY-MM-DD')
              : '';
            opt.gmtModifiedStr = item.gmtModified
                ? moment(item.gmtModified).format('YYYY-MM-DD')
              : '';
            return opt;
          });
        } else {
          this.tableData = [];
          this.$message({
            message: '数据请求失败，请重试！',
            type: 'warning',
          });
        }
      });
    },
    queryAllRole() {
      this.$axios({
        url: '/admin/user/manage/allRole',
        method: 'get',
      }).then(data => {
        if (data) {
          this.roleOptions = data.map(item => {
            const opt = {};
            opt.label = item.name;
            opt.value = item.key;
            return opt;
          });
        } else {
          this.roleOptions = [];
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
    handleCreateUser() {
      this.userMgtUrl = '/admin/user/update';
      this.userMgtType = 'add';
      for (const key in this.userMamtInfo) {
        if (this.userMamtInfo.hasOwnProperty(key)) {
          if (key === 'haloStatus' || key === 'status') {
            this.userMamtInfo[key] = null;
          } else {
            this.userMamtInfo[key] = '';
          }
        }
      }
      delete this.userMamtInfo.id;
      this.userMamtDialog = true;
      this.modifiedGmtTitle = '创建用户';
    },
    Modifiedgmt(row) {
      this.userMgtUrl = '/admin/user/update';
      this.userMgtType = 'modified';
      for (const key in this.userMamtInfo) {
        if (this.userMamtInfo.hasOwnProperty(key)) {
          this.userMamtInfo[key] = row[key];
        }
      }
      this.userMamtInfo.role = row.role;

      this.userMamtInfo.password = '';
      this.userMamtInfo.id = row.id;
      this.userMamtDialog = true;
      this.modifiedGmtTitle = '修改用户信息';
    },
    submitStuInfo() {
      this.$refs.userMamtInfoForm.validate().then(valid => {
        if (this.userMgtType === 'add') {
          delete this.userMamtInfo.id;
        } else {
          delete this.userMamtInfo.password;
        }
        this.$axios({
          url: this.userMgtType==='add' ? '/admin/user/add' : this.userMgtUrl,
          method: 'post',
          data: this.userMamtInfo,
        }).then(data => {
          this.$message({
            message: this.modifiedGmtTitle + '成功',
            type: 'success',
          });
          this.userMamtDialog = false;
          this.handleSearch();
        });
      });
    },
    cancleStuInfo() {
      this.userMamtDialog = false;
    },
  },
};
</script>
<style lang="less" scoped>
.userMgmt {
  background:  #393e50;
  position: absolute;
  left: 10px;
  right: 10px;
  top: 70px;
  bottom: 10px;
  padding: 0 13px 13px 13px;
  overflow-y: auto;
  transition: all .25s ease;
  @import '../../../common/styles/theme/simple/scroll';
  .userMgmt-info {
    background: #393e50;
    padding: 12px 8px;
    .userMgmt-title {
      font-size: 20px;
      font-weight: 600;
    }
    .userMgmt-desc {
    }
  }
  .search-panel {
    padding: 34px 0 26px;
  }
  .table-content {
    // background: #4b5061;
    padding: 1px;
    .operation {
      padding: 16px 0 16px 20px;
    }
    .table-header {
      background: #393e50;
    }
  }
  .dialog-title {
    line-height: 24px;
    font-size: 18px;
  }
  .dialog_row {
    .dialog-form-item {
      display: inline-block;
      width: 48%;
    }
    .dialog-form-item-right {
      display: inline-block;
      width: 48%;
      margin-left: 8px;
    }
  }
  .dialog_btns {
    display: flex;
    justify-content: center;
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
}
</style>
