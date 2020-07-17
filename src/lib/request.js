import axios from 'axios'
import { is } from './util'

axios.interceptors.response.use(response => {
	return response;	
},error => {
	if(error.response){
		return error.response;
	}
})

/**
 * 统一拦截错误码
 * @param vm vue实例
 * @param status 状态码
 * @param url 访问url
 */
let parseStatusCode = (vm, data, status,url) => {
	// 判断请求状态码
	if (status === 200) {
		return data.data
	}
	// 认证失败
	else if (status === 401) {
		//throw new Error(status);
		if(url != '/oauth2/oauth/token'){
			vm.$router.push({
				name:'login'
			});
		} else{
			vm.$alert(data.data.error_description, '温馨提示', {
			confirmButtonText: '确定'});
			throw new Error(status);
		}
		
	}
	// 权限不足
	else if (status === 403) {
		vm.$message({
			showClose: true,
			message: '您无权访问该功能',
			type: 'warning'
		});
		console.log(data.data.error_description)
		throw new Error(data.message ? data.message : data.data.error_description);
	}
	// 接口不存在
	else if (status === 404) {
		vm.$alert('您访问的页面不存在，请与管理员联系', '温馨提示', {
			confirmButtonText: '确定'});
		console.log(data.data.error_description)
		throw new Error(data.message ? data.message : data.data.error_description);
	}
	// 其他异常信息
	else if (status === 500) {
		vm.$alert('服务器内部错误，请与管理员联系', '温馨提示', {
			confirmButtonText: '确定'});
		console.log(data.data.error_description)
		throw new Error(data.message ? data.message : data.data.error_description);
	}
	// other
	else {
		throw new Error(status || data.message || 'request.js other error');
		// return data;
	}
}

/**
 * 统一处理请求 __log 的情况
 * @param vm vue实例
 * @param config 请求参数配置
 */
let supportRequestParam = (vm, url, config) => {

	let data = config.data || {}
	let ignore = ['/login', '/session/check']

	if (ignore.indexOf(url) !== -1) {
		return
	}

	/**
	 * 写法封装
	 */
	if (!data.__log) {
		data.__log = {
			trigger_page: vm.$route.meta.name || '',		// 触发页面
			trigger_event: config.action || '',					// 触发事件
		}
		if (url === '/action') {
			data.__log.trigger_event = ['select', 'update', 'insert', 'delete', 'export', 'import'].find(f => data[f]) || ''
		}
	}

}

export default {
	install: function (Vue) {
		Vue.prototype.$request = function (url, config, ignoreLoading) {
			

			// 指定浏览器前缀
			//const apiPrefix = '/api';
			const apiPrefix = '';
			// 补充套入 __log 用户操作日志相关信息
			supportRequestParam(this, url, config);

			// 请求默认配置
			config = config || {};
			config.headers = config.headers || {};
			if(localStorage.getItem("token") && url != '/oauth2/oauth/token'){
				config.headers.Authorization = "Bearer " + localStorage.getItem("token");
			}
			if (!config.ignoreApiPrefix) {
				config.url = apiPrefix + url;
			} else {
				config.url = url;
			}
			// 当请求开始, 自动设置loading状态
			!ignoreLoading && (this.loading = true);

			const loading = this.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			});

			return axios.request(config).then((response) => {
				loading.close();
				// 当请求成功, 自动设置loading状态
				!ignoreLoading && (this.loading = false);

				// 根据响应的状态码返回不同消息
				let data = response.data;

				// 二进制大对象 BLOB (binary large object)
				if (config.responseType === 'blob') {
					// console.log(data.type);
					// let suffix = data.type.match(/\/(.*)$/)[1];
					// 文件导出
					let fileName = decodeURI(escape(response.headers['content-disposition'].split('=')[1]));
					console.log(fileName)
					let url = URL.createObjectURL(new Blob([data]));
					let link = document.createElement('a');
					link.style.display = 'none';
					link.href = url;
					link.setAttribute('download', fileName);
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					return;
				}

				// 登录特殊处理
				/*
				if (url === '/login') {
					if (data.code === 500) {
						return data
					}
					return data.data
				}

				if(url == '/oauth2/oauth/token') {
					if(response.status == 401){
						return data;
					}
				}*/

				return parseStatusCode(this, response, response.status,url);

			}).catch((response) => {
				loading.close();
				// 当请求报错, 自动设置loading状态
				!ignoreLoading && (this.loading = false);

				// 根据响应的状态码返回不同消息
				return parseStatusCode(this, response, response.response && response.response.status,url);
			})
			// chrome 67 支持
			// .finally(() => {
			// 	// 当请求报错, 自动设置loading状态
			// 	!ignoreLoading && (this.loading = false);
			// })
		}
		Vue.prototype.$get = function (url, config, ignoreLoading) {
			config = Object.assign({}, config, { method: 'get' })
			return this.$request(url, config, ignoreLoading)
		}
		Vue.prototype.$post = function (url, config, ignoreLoading) {
			config = Object.assign({}, config, { method: 'post' })
			return this.$request(url, config, ignoreLoading)
		}
		Vue.prototype.$put = function (url, config, ignoreLoading) {
			config = Object.assign({}, config, { method: 'put' })
			return this.$request(url, config, ignoreLoading)
		}
		Vue.prototype.$delete = function (url, config, ignoreLoading) {
			config = Object.assign({}, config, { method: 'delete' })
			return this.$request(url, config, ignoreLoading)
		}
		Vue.prototype.$all = function (requestInfos) {
			if (!Array.isArray(requestInfos)) {
				requestInfos = [requestInfos]
			}
			this.loading = true
			return Promise.all(requestInfos.map(requestInfo => {
				if (is(String, requestInfo)) {
					requestInfo = [requestInfo]
				}
				const config = Object.assign({}, {method: 'post'}, requestInfo[1])
				const url = requestInfo[0]
				return this.$request(url, config, true)
			}))
				.then(responses => {
					this.loading = false
					return responses
				})
				.catch((response) => {
					if (response.response.status === 401) {
						this.$router.push({
							name: 'login'
						})
					} else {
						// this.$message.error(response.response.data.message)
					}
					this.loading = false
				})
		}
	}
}
