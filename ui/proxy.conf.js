// eslint-disable-next-line @typescript-eslint/naming-convention
const PROXY_CONFIG = {
    "/api/*": {
        "target": process.env.API_TARGET || "http://localhost:3000",
        "secure": false,
        "changeOrigin": true,
        "logLevel": "debug",
        "onError": function(err, req, res) {
            console.log('Proxy Error:', err);
        },
        "onProxyReq": function(proxyReq, req, res) {
            console.log('Proxying request:', req.method, req.url);
        }
    }
};

module.exports = PROXY_CONFIG;