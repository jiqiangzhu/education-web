# 教育数据管理系统

基于 Vue 2 框架开发的数据管理系统，包含学生管理、讲师管理、课程管理等功能模块。

## 技术栈

- Vue 2.6.14
- Vue Router 3.5.4
- Element UI 2.15.13
- Axios 0.27.2
- Moment.js 2.29.4

## 项目结构

```
education-web/
├── public/              # 静态资源目录
│   └── index.html      # HTML 模板
├── src/
│   ├── layout/         # 布局组件
│   │   └── index.vue   # 主布局（侧边栏+顶部栏）
│   ├── router/         # 路由配置
│   │   └── index.js
│   ├── views/          # 页面组件
│   │   ├── Home.vue           # 首页
│   │   ├── student/           # 学生管理
│   │   ├── instructor/        # 讲师管理
│   │   ├── course/            # 课程管理
│   │   ├── marketing/         # 营销管理
│   │   ├── class/             # 班级管理
│   │   ├── message/           # 消息管理
│   │   └── settings/          # 系统设置
│   ├── styles/         # 样式文件
│   │   └── common.css
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── .babelrc            # Babel 配置
├── .eslintrc.js        # ESLint 配置
├── package.json        # 项目依赖
└── vue.config.js       # Vue CLI 配置
```

## 安装依赖

```bash
npm install
```

## 开发运行

```bash
npm run serve
```

项目将在 `http://localhost:8080` 启动

## 构建生产版本

```bash
npm run build
```

## 功能特性

### 学生管理模块

- ✅ 学生筛选功能（状态、来源、时间、关键词）
- ✅ 学生列表展示（表格形式）
- ✅ 状态管理（未处理、已跟进、已转化、已流失）
- ✅ 批量操作（选择、详情、转为班级学生、添加跟进记录）
- ✅ 分页功能

### 布局功能

- ✅ 左侧导航栏（可折叠菜单）
- ✅ 顶部搜索栏和用户信息
- ✅ 响应式布局

## 开发说明

1. 项目使用 Element UI 作为 UI 组件库
2. 路由采用 Vue Router 的 history 模式
3. 样式使用 scoped 作用域，避免样式污染
4. 所有页面组件都放在 `src/views` 目录下

## 后续开发建议

- [ ] 完善其他管理模块（讲师、课程等）
- [ ] 添加数据接口对接
- [ ] 实现权限管理
- [ ] 添加数据导出功能
- [ ] 优化移动端适配

