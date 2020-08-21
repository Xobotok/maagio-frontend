import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
