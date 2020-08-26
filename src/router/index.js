import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Projects',
    meta: { layout: 'constructor' },
    component: () => import('../views/MyProjects.vue'),
  },
  {
    path: '/projects',
    name: 'Projects',
    meta: { layout: 'constructor' },
    component: () => import('../views/MyProjects.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: { layout: 'constructor' },
    component: () => import('../views/Profile.vue'),
  },
  {
    path: '/new',
    name: 'NewProject',
    meta: { layout: 'constructor' },
    component: () => import('../views/NewProject.vue'),
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

export default router;
