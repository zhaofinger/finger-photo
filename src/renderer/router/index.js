import Vue from 'vue';
import Router from 'vue-router';
const Index = () => import('@/components/Index');
Vue.use(Router);

// 保留访问页面的位置
const scrollBehavior = (to, from, savedPosition) => {
	if (savedPosition) {
		// savedPosition 用于 popstate 导航
		return savedPosition;
	} else {
		const position = {};
		// 通过锚点返回位置
		if (to.hash) {
			position.selector = to.hash;
		}
		// 根据meta判断是不是回到页面的顶部
		if (to.matched.some(m => m.meta.scrollToTop)) {
			position.x = 0;
			position.y = 0;
		}
		// 如果返回为空,保留原位置
		return position;
	}
};

export default new Router({
	mode: 'hash',
	scrollBehavior,
	routes: [
		// 登陆页
		{ path: '/', name: 'Index', title: '首页', component: Index }
	]
});
