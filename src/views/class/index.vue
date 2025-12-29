<template>
  <div class="class-container">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <span>班级管理</span>
    </div>

    <!-- 班级筛选 -->
    <div class="filter-section">
      <div class="section-title">
        <div class="title-bar"></div>
        <span>班级筛选</span>
      </div>
      <div class="filter-content">
        <div class="filter-row">
          <div class="filter-item">
            <label>状态:</label>
            <el-select v-model="filters.status" placeholder="全部" style="width: 150px">
              <el-option label="全部" value="all"></el-option>
              <el-option label="进行中" value="ongoing"></el-option>
              <el-option label="已结束" value="finished"></el-option>
              <el-option label="未开始" value="notStarted"></el-option>
              <el-option label="已暂停" value="paused"></el-option>
            </el-select>
          </div>
          <div class="filter-item">
            <label>课程:</label>
            <el-select v-model="filters.course" placeholder="全部" style="width: 150px">
              <el-option label="全部" value="all"></el-option>
              <el-option label="前端开发" value="frontend"></el-option>
              <el-option label="后端开发" value="backend"></el-option>
              <el-option label="全栈开发" value="fullstack"></el-option>
              <el-option label="UI设计" value="ui"></el-option>
            </el-select>
          </div>
          <div class="filter-item">
            <label>时间:</label>
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
            />
          </div>
        </div>
        <div class="filter-row">
          <div class="quick-date">
            <el-button
              v-for="item in quickDates"
              :key="item.value"
              :type="filters.quickDate === item.value ? 'primary' : ''"
              size="small"
              @click="filters.quickDate = item.value"
            >
              {{ item.label }}
            </el-button>
          </div>
        </div>
        <div class="filter-row">
          <div class="filter-item">
            <label>其他:</label>
            <el-input
              v-model="filters.keyword"
              placeholder="请输入班级名称/讲师姓名筛选"
              style="width: 300px"
            />
          </div>
        </div>
        <div class="filter-actions">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 班级列表 -->
    <div class="list-section">
      <div class="section-header">
        <div class="section-title">
          <div class="title-bar"></div>
          <span>班级列表</span>
        </div>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </div>
      <div class="table-container">
        <el-table
          :data="classList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="班级信息" width="200">
            <template slot-scope="scope">
              <div class="class-info">
                <div class="class-name">{{ scope.row.name }}</div>
                <div class="class-code">编号: {{ scope.row.code }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="课程" width="150">
            <template slot-scope="scope">
              <el-tag type="primary" effect="plain">{{ scope.row.course }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="讲师" width="150">
            <template slot-scope="scope">
              <div class="instructor-info">
                <el-avatar :size="32" :src="scope.row.instructorAvatar"></el-avatar>
                <span>{{ scope.row.instructor }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="学生数量" width="120" align="center">
            <template slot-scope="scope">
              <span class="student-count">{{ scope.row.studentCount }}人</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="150">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.status"
                size="small"
                @change="handleStatusChange(scope.row)"
                style="width: 120px"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    <i :class="item.icon" :style="{ color: item.color }"></i>
                  </span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="开课时间" width="120"></el-table-column>
          <el-table-column prop="endDate" label="结课时间" width="120"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="280" fixed="right">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="handleDetail(scope.row)">详情</el-link>
              <el-link type="primary" :underline="false" @click="handleEdit(scope.row)">编辑</el-link>
              <el-link type="primary" :underline="false" @click="handleManageStudents(scope.row)">管理学生</el-link>
              <el-link type="danger" :underline="false" @click="handleDelete(scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <div class="total">共计{{ total }}条</div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="sizes, prev, pager, next"
            :total="total"
          >
          </el-pagination>
          <div class="page-jump">
            <span>前往</span>
            <el-input
              v-model="jumpPage"
              size="small"
              style="width: 60px; margin: 0 8px"
              @keyup.enter.native="handleJumpPage"
            />
            <span>页</span>
            <el-button type="primary" size="small" style="margin-left: 8px" @click="handleJumpPage">前往</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑班级对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form :model="classForm" :rules="formRules" ref="classForm" label-width="100px">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="classForm.name" placeholder="请输入班级名称"></el-input>
        </el-form-item>
        <el-form-item label="班级编号" prop="code">
          <el-input v-model="classForm.code" placeholder="请输入班级编号"></el-input>
        </el-form-item>
        <el-form-item label="所属课程" prop="course">
          <el-select v-model="classForm.course" placeholder="请选择课程" style="width: 100%">
            <el-option label="前端开发" value="frontend"></el-option>
            <el-option label="后端开发" value="backend"></el-option>
            <el-option label="全栈开发" value="fullstack"></el-option>
            <el-option label="UI设计" value="ui"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授课讲师" prop="instructor">
          <el-select v-model="classForm.instructor" placeholder="请选择讲师" style="width: 100%">
            <el-option
              v-for="instructor in instructorList"
              :key="instructor.id"
              :label="instructor.name"
              :value="instructor.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开课时间" prop="startDate">
          <el-date-picker
            v-model="classForm.startDate"
            type="date"
            placeholder="选择开课时间"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结课时间" prop="endDate">
          <el-date-picker
            v-model="classForm.endDate"
            type="date"
            placeholder="选择结课时间"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="班级状态" prop="status">
          <el-select v-model="classForm.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="未开始" value="notStarted"></el-option>
            <el-option label="进行中" value="ongoing"></el-option>
            <el-option label="已暂停" value="paused"></el-option>
            <el-option label="已结束" value="finished"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级描述">
          <el-input
            v-model="classForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入班级描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ClassManagement',
  data() {
    return {
      filters: {
        status: 'all',
        course: 'all',
        dateRange: [],
        quickDate: 'today',
        keyword: ''
      },
      quickDates: [
        { label: '今天', value: 'today' },
        { label: '昨天', value: 'yesterday' },
        { label: '近7天', value: 'last7days' },
        { label: '近30天', value: 'last30days' }
      ],
      classList: [
        {
          id: 1,
          name: '前端开发基础班',
          code: 'FE202501',
          course: '前端开发',
          instructor: '张老师',
          instructorAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          studentCount: 25,
          status: 'ongoing',
          startDate: '2025/01/15',
          endDate: '2025/04/15',
          createTime: '2025/01/10 09:30'
        },
        {
          id: 2,
          name: '后端开发进阶班',
          code: 'BE202501',
          course: '后端开发',
          instructor: '李老师',
          instructorAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          studentCount: 30,
          status: 'ongoing',
          startDate: '2025/01/20',
          endDate: '2025/04/20',
          createTime: '2025/01/15 10:20'
        },
        {
          id: 3,
          name: '全栈开发实战班',
          code: 'FS202501',
          course: '全栈开发',
          instructor: '王老师',
          instructorAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          studentCount: 20,
          status: 'notStarted',
          startDate: '2025/02/01',
          endDate: '2025/05/01',
          createTime: '2025/01/20 14:15'
        },
        {
          id: 4,
          name: 'UI设计精品班',
          code: 'UI202501',
          course: 'UI设计',
          instructor: '赵老师',
          instructorAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          studentCount: 18,
          status: 'finished',
          startDate: '2024/10/01',
          endDate: '2024/12/31',
          createTime: '2024/09/25 11:00'
        },
        {
          id: 5,
          name: '前端开发高级班',
          code: 'FE202502',
          course: '前端开发',
          instructor: '张老师',
          instructorAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          studentCount: 22,
          status: 'paused',
          startDate: '2025/01/10',
          endDate: '2025/04/10',
          createTime: '2025/01/05 08:45'
        },
        {
          id: 6,
          name: '后端开发基础班',
          code: 'BE202502',
          course: '后端开发',
          instructor: '李老师',
          instructorAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          studentCount: 28,
          status: 'ongoing',
          startDate: '2025/01/25',
          endDate: '2025/04/25',
          createTime: '2025/01/18 16:30'
        },
        {
          id: 7,
          name: '全栈开发基础班',
          code: 'FS202502',
          course: '全栈开发',
          instructor: '王老师',
          instructorAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          studentCount: 15,
          status: 'notStarted',
          startDate: '2025/02/10',
          endDate: '2025/05/10',
          createTime: '2025/01/25 13:20'
        }
      ],
      statusOptions: [
        { label: '未开始', value: 'notStarted', icon: 'el-icon-time', color: '#909399' },
        { label: '进行中', value: 'ongoing', icon: 'el-icon-loading', color: '#409EFF' },
        { label: '已暂停', value: 'paused', icon: 'el-icon-warning', color: '#E6A23C' },
        { label: '已结束', value: 'finished', icon: 'el-icon-success', color: '#67C23A' }
      ],
      selectedRows: [],
      currentPage: 1,
      pageSize: 10,
      total: 50,
      jumpPage: '',
      dialogVisible: false,
      dialogTitle: '新增班级',
      isEdit: false,
      classForm: {
        name: '',
        code: '',
        course: '',
        instructor: '',
        startDate: '',
        endDate: '',
        status: '',
        description: ''
      },
      formRules: {
        name: [
          { required: true, message: '请输入班级名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入班级编号', trigger: 'blur' }
        ],
        course: [
          { required: true, message: '请选择课程', trigger: 'change' }
        ],
        instructor: [
          { required: true, message: '请选择讲师', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择开课时间', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结课时间', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      instructorList: [
        { id: 1, name: '张老师' },
        { id: 2, name: '李老师' },
        { id: 3, name: '王老师' },
        { id: 4, name: '赵老师' }
      ]
    }
  },
  methods: {
    handleQuery() {
      console.log('查询', this.filters)
      this.currentPage = 1
      this.loadData()
    },
    handleReset() {
      this.filters = {
        status: 'all',
        course: 'all',
        dateRange: [],
        quickDate: 'today',
        keyword: ''
      }
      this.currentPage = 1
      this.loadData()
    },
    handleAdd() {
      this.dialogTitle = '新增班级'
      this.isEdit = false
      this.dialogVisible = true
      this.classForm = {
        name: '',
        code: '',
        course: '',
        instructor: '',
        startDate: '',
        endDate: '',
        status: '',
        description: ''
      }
    },
    handleEdit(row) {
      this.dialogTitle = '编辑班级'
      this.isEdit = true
      this.dialogVisible = true
      this.classForm = {
        id: row.id,
        name: row.name,
        code: row.code,
        course: row.course,
        instructor: row.instructor,
        startDate: row.startDate,
        endDate: row.endDate,
        status: row.status,
        description: row.description || ''
      }
    },
    handleDelete(row) {
      this.$confirm(`确定要删除班级"${row.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里添加删除逻辑
        const index = this.classList.findIndex(item => item.id === row.id)
        if (index > -1) {
          this.classList.splice(index, 1)
          this.total--
          this.$message.success('删除成功')
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    handleDetail(row) {
      this.$message.info(`查看班级"${row.name}"的详情`)
      // 这里可以打开详情对话框或跳转到详情页
    },
    handleManageStudents(row) {
      this.$message.info(`管理班级"${row.name}"的学生`)
      // 这里可以打开学生管理对话框或跳转到学生管理页
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    handleStatusChange(row) {
      console.log('状态变更', row)
      this.$message.success(`班级"${row.name}"状态已更新`)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.loadData()
    },
    handleJumpPage() {
      const page = parseInt(this.jumpPage)
      if (page && page > 0 && page <= Math.ceil(this.total / this.pageSize)) {
        this.currentPage = page
        this.loadData()
      } else {
        this.$message.error('请输入有效的页码')
      }
    },
    loadData() {
      console.log('加载数据', this.filters, this.currentPage, this.pageSize)
      // 这里添加实际的数据加载逻辑
    }
  }
}
</script>

<style scoped>
.class-container {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.filter-section, .list-section {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
</style>