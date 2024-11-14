import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'front',
            component: () => import('../views/FrontView.vue'),
            children: [
                {
                    path: '/',
                    name: 'home',
                    component: HomeView
                },
                {
                    path: '/about',
                    name: 'about',
                    component: () => import('../views/AboutView.vue')
                },
                {
                    path: '/routes',
                    name: 'routes',
                    component: () => import('../views/RoutesView.vue')
                },
                {
                    path: '/route',
                    name: 'route',
                    component: () => import('../views/RouteView.vue')
                },
                {
                    path: '/policies',
                    name: 'policies',
                    component: () => import('../views/PolicyView.vue')
                }
            ]
        },
        {
            path: '/planner',
            name: 'planner',
            component: () => import('../views/PlannerView.vue')
        },
    ]
})

export default router
