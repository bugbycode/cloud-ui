module.exports = {
    devServer: {
        https: false,
		open: false,
        port: 8099,
        disableHostCheck: true,
        proxy: {
            '/login':{
                target: 'http://localhost:8092',
				ws: true,
				changeOrigin: true
            },
			'/oauth2':{
				target: 'http://localhost:8092',
				ws: true,
				changeOrigin: true
			},'/user':{
				target: 'http://localhost:8092',
				ws: true,
				changeOrigin: true
			},'/asset':{
				target: 'http://localhost:8092',
				ws: true,
				changeOrigin: true
			},'/rule':{
				target: 'http://localhost:8092',
				ws: true,
				changeOrigin: true
			}
        }
    }
}