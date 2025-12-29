<template>
  <div class="student-container">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <span>用户管理 / 学生管理</span>
    </div>

    <!-- 学生筛选 -->
    <div class="filter-section">
      <div class="section-title">
        <div class="title-bar"></div>
        <span>学生筛选</span>
      </div>
      <div class="filter-content">
        <div class="filter-row">
          <div class="filter-item">
            <label>状态:</label>
            <el-select v-model="filters.status" placeholder="全部" style="width: 150px">
              <el-option label="全部" value="all"></el-option>
              <el-option label="未处理" value="unprocessed"></el-option>
              <el-option label="已跟进" value="followed"></el-option>
              <el-option label="已转化" value="converted"></el-option>
              <el-option label="已流失" value="lost"></el-option>
            </el-select>
          </div>
          <div class="filter-item">
            <label>来源:</label>
            <el-select v-model="filters.source" placeholder="小程序" style="width: 150px">
              <el-option label="小程序" value="miniprogram"></el-option>
              <el-option label="公众号" value="official"></el-option>
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
              placeholder="请输入姓名/手机号/微信筛选"
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

    <!-- 学生列表 -->
    <div class="list-section">
      <div class="section-header">
        <div class="section-title">
          <div class="title-bar"></div>
          <span>学生列表</span>
        </div>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </div>
      <div class="table-container">
        <el-table
          :data="studentList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="学生信息" width="180">
            <template slot-scope="scope">
              <div class="student-info">
                <el-avatar :size="40" :src="scope.row.avatar"></el-avatar>
                <span>{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="联系方式" width="150"></el-table-column>
          <el-table-column label="来源" width="120">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.source === '小程序' ? '' : 'info'"
                :effect="scope.row.source === '公众号' ? 'plain' : 'dark'"
              >
                {{ scope.row.source }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="consultTime" label="咨询时间" width="180"></el-table-column>
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
          <el-table-column prop="followTime" label="最近跟进时间" width="180"></el-table-column>
          <el-table-column label="操作" width="280">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="handleDetail(scope.row)">详情</el-link>
              <el-link type="primary" :underline="false" @click="handleTransfer(scope.row)">转为班级学生</el-link>
              <el-link type="primary" :underline="false" @click="handleFollow(scope.row)">添加跟进记录</el-link>
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
            <el-button type="primary" size="small" style="margin-left: 10px">前往</el-button>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentManagement',
  data() {
    return {
      filters: {
        status: 'all',
        source: 'miniprogram',
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
      studentList: [
        {
          id: 1,
          name: '爱吃素的猫',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          phone: '188 0982 8765',
          source: '小程序',
          consultTime: '2025/12/23 10:25',
          status: 'unprocessed',
          followTime: '2025/12/23 10:25'
        },
        {
          id: 2,
          name: '刘清水',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          phone: '188 0982 8765',
          source: '公众号',
          consultTime: '2025/12/23 10:25',
          status: 'followed',
          followTime: '2025/12/23 10:25'
        },
        {
          id: 3,
          name: '单恋一枝花',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          phone: '188 0982 8765',
          source: '小程序',
          consultTime: '2025/12/23 10:25',
          status: 'followed',
          followTime: '2025/12/23 10:25'
        },
        {
          id: 4,
          name: '不瘦10斤不改头像',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          phone: '188 0982 8765',
          source: '小程序',
          consultTime: '2025/12/23 10:25',
          status: 'followed',
          followTime: '2025/12/23 10:25'
        },
        {
          id: 5,
          name: '李炎',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          phone: '188 0982 8765',
          source: '小程序',
          consultTime: '2025/12/23 10:25',
          status: 'converted',
          followTime: '2025/12/23 10:25'
        },
        {
          id: 6,
          name: '张萌萌',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          phone: '188 0982 8765',
          source: '小程序',
          consultTime: '2025/12/23 10:25',
          status: 'converted',
          followTime: '2025/12/23 10:25'
        },
        {
          id: 7,
          name: '张胡',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          phone: '188 0982 8765',
          source: '小程序',
          consultTime: '2025/12/23 10:25',
          status: 'lost',
          followTime: '2025/12/23 10:25'
        }
      ],
      statusOptions: [
        { label: '未处理', value: 'unprocessed', icon: 'el-icon-circle-close', color: '#F56C6C' },
        { label: '已跟进', value: 'followed', icon: 'el-icon-warning', color: '#E6A23C' },
        { label: '已转化', value: 'converted', icon: 'el-icon-success', color: '#67C23A' },
        { label: '已流失', value: 'lost', icon: 'el-icon-remove', color: '#909399' }
      ],
      selectedRows: [],
      currentPage: 1,
      pageSize: 10,
      total: 500
    }
  },
  methods: {
    handleQuery() {
      console.log('查询', this.filters)
      // 这里添加查询逻辑
    },
    handleReset() {
      this.filters = {
        status: 'all',
        source: 'miniprogram',
        dateRange: [],
        quickDate: 'today',
        keyword: ''
      }
    },
    handleAdd() {
      this.$message.info('新增学生功能')
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    handleStatusChange(row) {
      console.log('状态变更', row)
    },
    handleDetail(row) {
      this.$message.info(`查看 ${row.name} 的详情`)
    },
    handleTransfer(row) {
      this.$message.info(`将 ${row.name} 转为班级学生`)
    },
    handleFollow(row) {
      this.$message.info(`为 ${row.name} 添加跟进记录`)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.loadData()
    },
    loadData() {
      // 加载数据逻辑
      console.log('加载数据', this.currentPage, this.pageSize)
    }
  }
}
</script>

<style scoped>
.student-container {
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
}

.filter-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-container {
  background-color: #fff;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
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

.el-link {
  margin-right: 16px;
}
</style>

