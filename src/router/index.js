import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'student',
        name: 'Student',
        component: () => import('@/views/student/index.vue'),
        meta: { title: '学生管理' }
      },
      {
        path: 'instructor',
        name: 'Instructor',
        component: () => import('@/views/instructor/index.vue'),
        meta: { title: '讲师管理' }
      },
      {
        path: 'course/video',
        name: 'CourseVideo',
        component: () => import('@/views/course/video.vue'),
        meta: { title: '视频课程' }
      },
      {
        path: 'course/live',
        name: 'CourseLive',
        component: () => import('@/views/course/live.vue'),
        meta: { title: '直播课程' }
      },
      {
        path: 'course/audio',
        name: 'CourseAudio',
        component: () => import('@/views/course/audio.vue'),
        meta: { title: '音频课程' }
      },
      {
        path: 'marketing',
        name: 'Marketing',
        component: () => import('@/views/marketing/index.vue'),
        meta: { title: '营销管理' }
      },
      {
        path: 'class',
        name: 'Class',
        component: () => import('@/views/class/index.vue'),
        meta: { title: '班级管理' }
      },
      {
        path: 'message',
        name: 'Message',
        component: () => import('@/views/message/index.vue'),
        meta: { title: '消息管理' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/index.vue'),
        meta: { title: '系统设置' }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router

