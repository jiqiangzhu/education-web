<template>
  <div class="live-course-container">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <span>课程管理 / 直播课程</span>
    </div>

    <!-- 直播筛选 -->
    <div class="filter-section">
      <div class="section-title">
        <div class="title-bar"></div>
        <span>直播筛选</span>
      </div>
      <div class="filter-content">
        <div class="filter-row">
          <div class="filter-item">
            <label>直播状态:</label>
            <el-select v-model="filters.liveStatus" placeholder="全部" style="width: 150px">
              <el-option label="全部" value="all"></el-option>
              <el-option label="未开始" value="notStarted"></el-option>
              <el-option label="已开始" value="started"></el-option>
              <el-option label="已结束" value="ended"></el-option>
            </el-select>
          </div>
          <div class="filter-item">
            <label>课程名称:</label>
            <el-input
              v-model="filters.courseName"
              placeholder="请输入课程名称"
              style="width: 200px"
              clearable
            />
          </div>
          <div class="filter-item">
            <label>小程序:</label>
            <el-select v-model="filters.miniprogram" placeholder="请选择" style="width: 150px">
              <el-option label="全部" value="all"></el-option>
              <el-option label="小程序1" value="mp1"></el-option>
              <el-option label="小程序2" value="mp2"></el-option>
            </el-select>
          </div>
        </div>
        <div class="filter-row">
          <div class="filter-item">
            <label>起始时间:</label>
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
            />
          </div>
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
          <div class="filter-actions">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 直播列表 -->
    <div class="list-section">
      <div class="section-header">
        <div class="section-title">
          <div class="title-bar"></div>
          <span>直播列表</span>
        </div>
        <div class="header-actions">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">+ 新建课程</el-button>
          <el-button @click="handleShelf">上架</el-button>
          <el-button @click="handleUnshelf">下架</el-button>
          <el-button @click="handleBatch">批量操作</el-button>
        </div>
      </div>
      <div class="table-container">
        <el-table
          :data="liveCourseList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="直播信息" width="250">
            <template slot-scope="scope">
              <div class="course-info">
                <el-avatar :size="50" :src="scope.row.thumbnail" shape="square" class="course-thumbnail"></el-avatar>
                <span class="course-title">{{ scope.row.title }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="直播状态" width="120" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="getLiveStatusType(scope.row.liveStatus)"
                size="small"
              >
                {{ scope.row.liveStatusText }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="instructor" label="讲师" width="120" align="center"></el-table-column>
          <el-table-column label="预约人数" width="120" align="center">
            <template slot-scope="scope">
              <span class="reserved-count">{{ scope.row.reservedCount }}人</span>
            </template>
          </el-table-column>
          <el-table-column label="课程状态" width="120" align="center">
            <template slot-scope="scope">
              <div class="course-status">
                <span
                  class="status-dot"
                  :style="{ backgroundColor: getCourseStatusColor(scope.row.courseStatus) }"
                ></span>
                <span>{{ scope.row.courseStatusText }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开课时间" width="180" align="center"></el-table-column>
          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="handleEdit(scope.row)">编辑</el-link>
              <el-link type="danger" :underline="false" @click="handleDelete(scope.row)" style="margin-left: 16px">删除</el-link>
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
            <el-input
              v-model="jumpPage"
              size="small"
              style="width: 60px; margin: 0 8px"
              @keyup.enter.native="handleJumpPage"
            />
            <el-button type="primary" size="small" style="margin-left: 8px" @click="handleJumpPage">前往</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseLive',
  data() {
    return {
      filters: {
        liveStatus: 'all',
        courseName: '',
        miniprogram: 'all',
        dateRange: [],
        quickDate: 'today'
      },
      quickDates: [
        { label: '今天', value: 'today' },
        { label: '昨天', value: 'yesterday' },
        { label: '近7天', value: 'last7days' },
        { label: '近30天', value: 'last30days' }
      ],
      liveCourseList: [
        {
          id: 1,
          title: '爱吃素的猫',
          thumbnail: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          liveStatus: 'started',
          liveStatusText: '已开始',
          instructor: '赵晓莉',
          reservedCount: 300,
          courseStatus: 'onShelf',
          courseStatusText: '已上架',
          startTime: '2025/12/23 10:25'
        },
        {
          id: 2,
          title: '刘清水',
          thumbnail: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          liveStatus: 'ended',
          liveStatusText: '已结束',
          instructor: '张震',
          reservedCount: 60,
          courseStatus: 'offShelf',
          courseStatusText: '已下架',
          startTime: '2025/12/23 10:25'
        },
        {
          id: 3,
          title: '单恋一枝花',
          thumbnail: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          liveStatus: 'notStarted',
          liveStatusText: '未开始',
          instructor: '张红霞',
          reservedCount: 26,
          courseStatus: 'pending',
          courseStatusText: '待上架',
          startTime: '2025/12/23 10:25'
        },
        {
          id: 4,
          title: '不瘦10斤不改头像',
          thumbnail: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          liveStatus: 'started',
          liveStatusText: '已开始',
          instructor: '黄宝蓝',
          reservedCount: 69,
          courseStatus: 'onShelf',
          courseStatusText: '已上架',
          startTime: '2025/12/23 10:25'
        },
        {
          id: 5,
          title: '李炎',
          thumbnail: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          liveStatus: 'notStarted',
          liveStatusText: '未开始',
          instructor: '赵晓莉',
          reservedCount: 100,
          courseStatus: 'onShelf',
          courseStatusText: '已上架',
          startTime: '2025/12/23 10:25'
        },
        {
          id: 6,
          title: '张萌萌',
          thumbnail: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          liveStatus: 'ended',
          liveStatusText: '已结束',
          instructor: '张震',
          reservedCount: 36,
          courseStatus: 'offShelf',
          courseStatusText: '已下架',
          startTime: '2025/12/23 10:25'
        },
        {
          id: 7,
          title: '张胡',
          thumbnail: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          liveStatus: 'started',
          liveStatusText: '已开始',
          instructor: '张红霞',
          reservedCount: 336,
          courseStatus: 'onShelf',
          courseStatusText: '已上架',
          startTime: '2025/12/23 10:25'
        }
      ],
      selectedRows: [],
      currentPage: 1,
      pageSize: 10,
      total: 500,
      jumpPage: ''
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
        liveStatus: 'all',
        courseName: '',
        miniprogram: 'all',
        dateRange: [],
        quickDate: 'today'
      }
      this.currentPage = 1
      this.loadData()
    },
    handleAdd() {
      this.$message.info('新建课程功能')
    },
    handleShelf() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要上架的课程')
        return
      }
      this.$message.success(`已上架 ${this.selectedRows.length} 个课程`)
    },
    handleUnshelf() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要下架的课程')
        return
      }
      this.$message.success(`已下架 ${this.selectedRows.length} 个课程`)
    },
    handleBatch() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要操作的课程')
        return
      }
      this.$message.info('批量操作功能')
    },
    handleEdit(row) {
      this.$message.info(`编辑课程"${row.title}"`)
    },
    handleDelete(row) {
      this.$confirm(`确定要删除课程"${row.title}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.liveCourseList.findIndex(item => item.id === row.id)
        if (index > -1) {
          this.liveCourseList.splice(index, 1)
          this.total--
          this.$message.success('删除成功')
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    getLiveStatusType(status) {
      const statusMap = {
        'notStarted': 'info',
        'started': 'success',
        'ended': ''
      }
      return statusMap[status] || ''
    },
    getCourseStatusColor(status) {
      const colorMap = {
        'onShelf': '#67C23A', // 绿色
        'pending': '#E6A23C', // 橙色
        'offShelf': '#F56C6C' // 红色
      }
      return colorMap[status] || '#909399'
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
        this.jumpPage = ''
      } else {
        this.$message.error('请输入有效的页码')
        this.jumpPage = ''
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
.live-course-container {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.filter-section,
.list-section {
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

.title-bar {
  width: 4px;
  height: 16px;
  background-color: #409EFF;
  margin-right: 8px;
  border-radius: 2px;
}

.filter-content {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
}

.filter-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.filter-item label {
  margin-right: 8px;
  color: #666;
  font-size: 14px;
  white-space: nowrap;
}

.quick-date {
  display: flex;
  gap: 8px;
  margin-left: 20px;
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-left: auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.table-container {
  background-color: #fff;
}

.course-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.course-thumbnail {
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}

.course-title {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
  line-height: 1.5;
}

.reserved-count {
  color: #409EFF;
  font-weight: 500;
}

.course-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  color: #333;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.8);
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 16px 0;
}

.total {
  color: #666;
  font-size: 14px;
}

.page-jump {
  display: flex;
  align-items: center;
  margin-left: 16px;
  font-size: 14px;
  color: #666;
}

.el-link {
  margin-right: 16px;
}

.el-link:last-child {
  margin-right: 0;
}

/* 表格行悬停效果 */
::v-deep .el-table tbody tr:hover > td {
  background-color: #f5f7fa;
}

/* 优化按钮样式 */
.header-actions .el-button {
  border-radius: 4px;
  transition: all 0.3s;
}

.header-actions .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

/* 优化标签样式 */
::v-deep .el-tag {
  border-radius: 4px;
  font-weight: 500;
  padding: 0 10px;
}

/* 优化日期选择器样式 */
::v-deep .el-date-editor {
  border-radius: 4px;
}

/* 优化分页样式 */
::v-deep .el-pagination {
  font-weight: normal;
}

::v-deep .el-pagination .el-pager li.active {
  color: #409EFF;
  font-weight: 500;
}

/* 优化表格样式 */
::v-deep .el-table {
  border-radius: 4px;
  overflow: hidden;
}

::v-deep .el-table th {
  background-color: #fafafa;
  color: #333;
  font-weight: 500;
}

::v-deep .el-table td {
  padding: 12px 0;
}

/* 优化输入框样式 */
::v-deep .el-input__inner {
  border-radius: 4px;
  transition: all 0.3s;
}

::v-deep .el-input__inner:focus {
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

/* 优化选择器样式 */
::v-deep .el-select .el-input__inner {
  border-radius: 4px;
}

/* 优化链接样式 */
.el-link {
  transition: color 0.3s;
}

.el-link:hover {
  color: #66b1ff;
}

/* 优化预约人数显示 */
.reserved-count {
  font-size: 14px;
  font-weight: 500;
}
</style>
