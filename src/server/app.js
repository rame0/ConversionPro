// @ts-ignore-file
// https://stackoverflow.com/a/63602976/470749
import express from "express";
import {createProxyMiddleware} from "http-proxy-middleware";


const app = express();
const proxyServerPort = process.env.PROXY_SERVER_PORT || 8080;
const targetUrl = 'https://p2p.binance.com';


app.use('/api/p2p/filter', createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
        [`^/api/p2p/filter`]: '/bapi/c2c/v2/public/c2c/adv/filter-conditions',
    },
}));

app.use('/api/p2p', createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
        [`^/api/p2p`]: '/bapi/c2c/v2/friendly/c2c/adv/search',
    },
}));

app.use('/assets/', express.static('dist/assets'));

app.get('/', express.static('dist'));

app.listen(proxyServerPort);
// console.log(`Proxy server listening on port ${proxyServerPort}`);
