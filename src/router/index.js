import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index.js'
import Home from '../views/Home.vue';

Vue.use(VueRouter);


const routes = [
  {
    path: '/',
    name: 'Projects',
    meta: { layout: 'constructor', requiresAuth: true},
    component: () => import('../views/MyProjects.vue'),
  },
  {
    path: '/projects',
    name: 'Projects',
    meta: { layout: 'constructor',  requiresAuth: true },
    component: () => import('../views/MyProjects.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: { layout: 'constructor',  requiresAuth: true },
    component: () => import('../views/Profile.vue'),
  },
  {
    path: '/new',
    name: 'NewProject',
    meta: { layout: 'constructor',  requiresAuth: true },
    component: () => import('../views/NewProject.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/confirm',
    name: 'confirm',
    component: () => import('../views/Confirm.vue'),
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return
    }
    next('/login')
  } else {
    next()
  }
});
export default router;
