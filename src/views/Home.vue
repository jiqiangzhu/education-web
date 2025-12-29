<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">今日新增人数</span>
        </div>
        <div class="stat-content">
          <div class="stat-value">387</div>
          <div class="stat-detail">
            <span class="stat-label">昨日新增: 111</span>
            <span class="stat-change increase">较昨日+4.8%</span>
          </div>
        </div>
        <div class="stat-chart">
          <div ref="newUserChart" class="mini-chart"></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">今日加入人数</span>
        </div>
        <div class="stat-content">
          <div class="stat-value">223</div>
          <div class="stat-detail">
            <span class="stat-label">昨日加入: 248</span>
            <span class="stat-change decrease">较昨日-3.8%</span>
          </div>
        </div>
        <div class="stat-chart">
          <div ref="joinChart" class="mini-chart"></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">今日学习人数</span>
        </div>
        <div class="stat-content">
          <div class="stat-value">621</div>
          <div class="stat-detail">
            <span class="stat-label">今日学习: 60054</span>
            <span class="stat-change increase">较昨日+4.8%</span>
          </div>
        </div>
        <div class="stat-chart">
          <div ref="studyChart" class="mini-chart"></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-title">本周新增人数</span>
        </div>
        <div class="stat-content">
          <div class="stat-value">1,566</div>
          <div class="stat-detail">
            <span class="stat-label">上周新增: 1856</span>
            <span class="stat-change decrease">较昨日-6.4%</span>
          </div>
        </div>
        <div class="stat-chart">
          <div ref="weekChart" class="mini-chart"></div>
        </div>
      </div>
    </div>

    <!-- 中间行 -->
    <div class="middle-row">
      <!-- 人数统计柱状图 -->
      <div class="chart-card">
        <div class="card-header">
          <span class="card-title">人数统计</span>
          <div class="card-tabs">
            <el-button
              :type="userStatsTab === 'week' ? 'primary' : ''"
              size="small"
              @click="userStatsTab = 'week'"
            >
              本周
            </el-button>
            <el-button
              :type="userStatsTab === 'month' ? 'primary' : ''"
              size="small"
              @click="userStatsTab = 'month'"
            >
              本月
            </el-button>
          </div>
        </div>
        <div ref="userStatsChart" class="chart-container"></div>
      </div>

      <!-- 日历和待办事项 -->
      <div class="right-panel">
        <!-- 日历 -->
        <div class="calendar-card">
          <div class="card-header">
            <el-button
              icon="el-icon-arrow-left"
              size="mini"
              circle
              @click="prevMonth"
            ></el-button>
            <span class="card-title">{{ currentMonth }}</span>
            <el-button
              icon="el-icon-arrow-right"
              size="mini"
              circle
              @click="nextMonth"
            ></el-button>
          </div>
          <el-calendar v-model="calendarDate" class="custom-calendar">
            <template slot="dateCell" slot-scope="{ data }">
              <div
                :class="[
                  'calendar-day',
                  data.isSelected ? 'selected' : ''
                ]"
              >
                {{ data.day.split('-').slice(2).join('-') }}
              </div>
            </template>
          </el-calendar>
        </div>

        <!-- 待办事项 -->
        <div class="todo-card">
          <div class="card-header">
            <span class="card-title">待办事项</span>
            <el-link type="primary" :underline="false" class="view-more">查看更多</el-link>
          </div>
          <div class="todo-list">
            <div
              v-for="(item, index) in todoList"
              :key="index"
              class="todo-item"
            >
              <div class="todo-icon"></div>
              <div class="todo-content">
                <div class="todo-title">{{ item.title }}</div>
                <div class="todo-time">{{ item.time }}</div>
              </div>
              <i class="el-icon-arrow-right todo-arrow"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部行 -->
    <div class="bottom-row">
      <!-- 实时学习人数折线图 -->
      <div class="chart-card">
        <div class="card-header">
          <span class="card-title">实时学习人数</span>
          <div class="card-tabs">
            <el-button
              :type="realtimeTab === 'today' ? 'primary' : ''"
              size="small"
              @click="realtimeTab = 'today'"
            >
              今日
            </el-button>
            <el-button
              :type="realtimeTab === 'yesterday' ? 'primary' : ''"
              size="small"
              @click="realtimeTab = 'yesterday'"
            >
              昨日
            </el-button>
          </div>
        </div>
        <div ref="realtimeChart" class="chart-container"></div>
      </div>

      <!-- 课程学习占比饼图 -->
      <div class="chart-card">
        <div class="card-header">
          <span class="card-title">课程学习占比</span>
          <div class="card-tabs">
            <el-button
              :type="courseStatsTab === 'week' ? 'primary' : ''"
              size="small"
              @click="courseStatsTab = 'week'"
            >
              本周
            </el-button>
            <el-button
              :type="courseStatsTab === 'month' ? 'primary' : ''"
              size="small"
              @click="courseStatsTab = 'month'"
            >
              本月
            </el-button>
          </div>
        </div>
        <div ref="courseChart" class="chart-container"></div>
      </div>

      <!-- 常用功能 -->
      <div class="functions-card">
        <div class="card-header">
          <span class="card-title">常用功能</span>
        </div>
        <div class="functions-grid">
          <div
            v-for="(func, index) in functions"
            :key="index"
            class="function-item"
            @click="handleFunctionClick(func)"
          >
            <i :class="func.icon" class="function-icon"></i>
            <span class="function-label">{{ func.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import moment from 'moment'

export default {
  name: 'Home',
  data() {
    return {
      userStatsTab: 'week',
      courseStatsTab: 'week',
      realtimeTab: 'today',
      calendarDate: new Date(),
      todoList: [
        { title: '李星宇咨询', time: '07:00-9:00' },
        { title: '李星宇咨询', time: '07:00-9:00' },
        { title: '李星宇咨询', time: '07:00-9:00' },
        { title: '李星宇咨询', time: '07:00-9:00' }
      ],
      functions: [
        { icon: 'el-icon-user', label: '用户管理', path: '/student' },
        { icon: 'el-icon-notebook-2', label: '课程管理', path: '/course' },
        { icon: 'el-icon-refresh-left', label: '退款管理', path: '/marketing' },
        { icon: 'el-icon-s-order', label: '订单管理', path: '/marketing' }
      ],
      charts: {}
    }
  },
  computed: {
    currentMonth() {
      return moment(this.calendarDate).format('YYYY年MM月')
    }
  },
  mounted() {
    this.initCharts()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    // 销毁所有图表实例
    Object.values(this.charts).forEach(chart => {
      if (chart) {
        chart.dispose()
      }
    })
  },
  watch: {
    realtimeTab() {
      this.updateRealtimeChart()
    },
    userStatsTab() {
      this.updateUserStatsChart()
    },
    courseStatsTab() {
      this.updateCourseChart()
    }
  },
  methods: {
    initCharts() {
      this.initMiniCharts()
      this.initUserStatsChart()
      this.initRealtimeChart()
      this.initCourseChart()
    },
    initMiniCharts() {
      // 今日新增人数图表
      const newUserChart = echarts.init(this.$refs.newUserChart)
      newUserChart.setOption({
        grid: { left: 0, right: 0, top: 0, bottom: 0 },
        xAxis: { type: 'category', show: false, data: ['1', '2', '3', '4', '5', '6', '7'] },
        yAxis: { type: 'value', show: false },
        series: [{
          data: [120, 132, 101, 134, 90, 230, 210],
          type: 'line',
          smooth: true,
          lineStyle: { color: '#409EFF', width: 2 },
          areaStyle: { color: 'rgba(64, 158, 255, 0.1)' },
          symbol: 'none'
        }]
      })
      this.charts.newUserChart = newUserChart

      // 今日加入人数图表
      const joinChart = echarts.init(this.$refs.joinChart)
      joinChart.setOption({
        grid: { left: 0, right: 0, top: 0, bottom: 0 },
        xAxis: { type: 'category', show: false, data: ['1', '2', '3', '4', '5', '6', '7'] },
        yAxis: { type: 'value', show: false },
        series: [{
          data: [200, 180, 190, 170, 160, 180, 175],
          type: 'line',
          smooth: true,
          lineStyle: { color: '#E6A23C', width: 2 },
          areaStyle: { color: 'rgba(230, 162, 60, 0.1)' },
          symbol: 'none'
        }]
      })
      this.charts.joinChart = joinChart

      // 今日学习人数图表
      const studyChart = echarts.init(this.$refs.studyChart)
      studyChart.setOption({
        grid: { left: 0, right: 0, top: 0, bottom: 0 },
        xAxis: { type: 'category', show: false, data: ['1', '2', '3', '4', '5', '6', '7'] },
        yAxis: { type: 'value', show: false },
        series: [{
          data: [400, 450, 420, 480, 500, 550, 600],
          type: 'line',
          smooth: true,
          lineStyle: { color: '#67C23A', width: 2 },
          areaStyle: { color: 'rgba(103, 194, 58, 0.1)' },
          symbol: 'none'
        }]
      })
      this.charts.studyChart = studyChart

      // 本周新增人数图表
      const weekChart = echarts.init(this.$refs.weekChart)
      weekChart.setOption({
        grid: { left: 0, right: 0, top: 0, bottom: 0 },
        xAxis: { type: 'category', show: false, data: ['1', '2', '3', '4', '5', '6', '7'] },
        yAxis: { type: 'value', show: false },
        series: [{
          data: [300, 280, 290, 270, 260, 250, 240],
          type: 'line',
          smooth: true,
          lineStyle: { color: '#F56C6C', width: 2 },
          areaStyle: { color: 'rgba(245, 108, 108, 0.1)' },
          symbol: 'none'
        }]
      })
      this.charts.weekChart = weekChart
    },
    initUserStatsChart() {
      const chart = echarts.init(this.$refs.userStatsChart)
      chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        legend: {
          data: ['咨询', '加入'],
          top: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['06-07', '06-08', '06-09', '06-10', '06-11', '06-12', '06-13']
        },
        yAxis: {
          type: 'value',
          name: '万元'
        },
        series: [
          {
            name: '咨询',
            type: 'bar',
            data: [202, 230, 180, 250, 220, 280, 240],
            itemStyle: { color: '#409EFF' }
          },
          {
            name: '加入',
            type: 'bar',
            data: [161, 190, 150, 200, 180, 220, 200],
            itemStyle: { color: '#91CC75' }
          }
        ]
      })
      this.charts.userStatsChart = chart
    },
    initRealtimeChart() {
      const chart = echarts.init(this.$refs.realtimeChart)
      this.charts.realtimeChart = chart
      this.updateRealtimeChart()
    },
    updateRealtimeChart() {
      if (!this.charts.realtimeChart) return
      const hours = Array.from({ length: 12 }, (_, i) => String(i * 2).padStart(2, '0'))
      // 使用固定的模拟数据
      const todayData = [150, 180, 220, 280, 350, 420, 580, 720, 850, 780, 620, 450]
      const yesterdayData = [120, 150, 190, 250, 320, 390, 520, 650, 780, 720, 580, 420]
      
      // 同时显示两条线，根据选择的tab调整显示样式
      const series = [
        {
          name: '今日',
          type: 'line',
          smooth: true,
          data: todayData,
          lineStyle: { 
            color: '#409EFF', 
            width: this.realtimeTab === 'today' ? 2 : 1,
            opacity: this.realtimeTab === 'today' ? 1 : 0.6
          },
          areaStyle: { 
            color: this.realtimeTab === 'today' 
              ? 'rgba(64, 158, 255, 0.15)' 
              : 'rgba(64, 158, 255, 0.05)'
          },
          symbol: 'circle',
          symbolSize: this.realtimeTab === 'today' ? 5 : 3,
          z: this.realtimeTab === 'today' ? 2 : 1
        },
        {
          name: '昨日',
          type: 'line',
          smooth: true,
          data: yesterdayData,
          lineStyle: { 
            color: '#91CC75', 
            type: 'dashed',
            width: this.realtimeTab === 'yesterday' ? 2 : 1,
            opacity: this.realtimeTab === 'yesterday' ? 1 : 0.6
          },
          areaStyle: { 
            color: this.realtimeTab === 'yesterday' 
              ? 'rgba(145, 204, 117, 0.15)' 
              : 'rgba(145, 204, 117, 0.05)'
          },
          symbol: 'circle',
          symbolSize: this.realtimeTab === 'yesterday' ? 5 : 3,
          z: this.realtimeTab === 'yesterday' ? 2 : 1
        }
      ]
      
      this.charts.realtimeChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        legend: {
          data: ['今日', '昨日'],
          top: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: hours
        },
        yAxis: {
          type: 'value',
          name: '在线人数'
        },
        series
      })
    },
    updateUserStatsChart() {
      if (!this.charts.userStatsChart) return
      // 可以根据tab切换数据
      const option = this.charts.userStatsChart.getOption()
      // 这里可以更新数据，暂时保持原有逻辑
      this.charts.userStatsChart.resize()
    },
    updateCourseChart() {
      if (!this.charts.courseChart) return
      // 可以根据tab切换数据
      this.charts.courseChart.resize()
    },
    handleResize() {
      Object.values(this.charts).forEach(chart => {
        if (chart) {
          chart.resize()
        }
      })
    },
    initCourseChart() {
      const chart = echarts.init(this.$refs.courseChart)
      chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: ['政治', '英语', '公选课', '其他课']
        },
        series: [
          {
            name: '课程学习占比',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 51.5, name: '政治', itemStyle: { color: '#409EFF' } },
              { value: 23.5, name: '英语', itemStyle: { color: '#E6A23C' } },
              { value: 20, name: '公选课', itemStyle: { color: '#67C23A' } },
              { value: 5, name: '其他课', itemStyle: { color: '#91CC75' } }
            ]
          }
        ]
      })
      this.charts.courseChart = chart
    },
    prevMonth() {
      this.calendarDate = moment(this.calendarDate).subtract(1, 'month').toDate()
    },
    nextMonth() {
      this.calendarDate = moment(this.calendarDate).add(1, 'month').toDate()
    },
    handleFunctionClick(func) {
      if (func.path) {
        this.$router.push(func.path)
      }
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 0;
  background: transparent;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .middle-row {
    grid-template-columns: 1fr;
  }
  
  .bottom-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
  
  .stat-value {
    font-size: 28px;
  }
}

/* 统计卡片行 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.stat-header {
  margin-bottom: 16px;
}

.stat-title {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-content {
  margin-bottom: 16px;
}

.stat-value {
  font-size: 36px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.stat-detail {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.stat-label {
  color: #999;
}

.stat-change {
  font-size: 12px;
  font-weight: 500;
}

.stat-change.increase {
  color: #67C23A;
}

.stat-change.decrease {
  color: #F56C6C;
}

.stat-chart {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  opacity: 0.8;
}

.mini-chart {
  width: 100%;
  height: 100%;
}

/* 中间行 */
.middle-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.card-tabs {
  display: flex;
  gap: 8px;
}

.card-tabs .el-button {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 13px;
}

.chart-container {
  width: 100%;
  height: 300px;
  min-height: 300px;
}

/* 右侧面板 */
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.calendar-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.calendar-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.custom-calendar {
  border: none;
}

.calendar-day {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-day.selected {
  background-color: #409EFF;
  color: #fff;
  border-radius: 4px;
}

.todo-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.todo-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.view-more {
  font-size: 12px;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.todo-item:hover {
  background: #e9ecef;
  border-color: #409EFF;
  transform: translateX(4px);
}

.todo-icon {
  width: 10px;
  height: 10px;
  background: #67C23A;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.2);
}

.todo-content {
  flex: 1;
}

.todo-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.todo-time {
  font-size: 12px;
  color: #999;
}

.todo-arrow {
  font-size: 16px;
  color: #999;
}

.functions-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.functions-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

/* 底部行 */
.bottom-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr;
  gap: 20px;
}

/* 常用功能网格 */
.functions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.function-item:hover {
  background: #e9ecef;
  border-color: #409EFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.function-icon {
  font-size: 32px;
  color: #409EFF;
  margin-bottom: 12px;
  transition: transform 0.3s ease;
}

.function-item:hover .function-icon {
  transform: scale(1.1);
}

.function-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}
</style>