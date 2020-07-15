import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const login = resolve => require(['@/views/login.vue'], resolve);
const main = resolve => require(['@/views/main.vue'], resolve);

const userList = resolve => require(['@/views/user/list.vue'], resolve);
const editUser = resolve => require(['@/views/user/edit.vue'], resolve);

const router = new Router({
	// base:'/seap/',
	routes: [
		{
			path: '/',
			component: login,
			name: 'login'
		},{
			path: '/main',
			component: main,
			name: 'main',
			children:[
				{
					path:'/',redirect:'userList',
					
				},{
					path:'userList',name:'userList',component:userList
				},{
					path:'editUser',name:'editUser',component:editUser
				}
			]
		}
	]
});

export default router
