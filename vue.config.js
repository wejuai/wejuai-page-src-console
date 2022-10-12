module.exports = {
    outputDir: './dist/html',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        open: false, //是否自动弹出浏览器页面
        host: 'console.wejuai.com',
        port: '443',
        https: true,
        hotOnly: true,
        proxy: {
            '/console': {
                target: 'https://console-service.wejuai.com',
                // target: 'http://127.0.0.1:8083',
                ws: true,  //代理websockets
                // changeOrigin: true, // 虚拟的站点需要更管origin
                pathRewrite: {   //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
                    '^/console': ''
                }
            }
        }
    },
};
