// @ts-ignore-file
// https://stackoverflow.com/a/63602976/470749
import express from "express";
import http from "http";
import {createProxyMiddleware} from "http-proxy-middleware";
import cron from "node-cron";
import pkg from "sqlite3";
import axios from "axios"

const app = express();
const server = http.createServer(app);
const proxyServerPort = process.env.PROXY_SERVER_PORT || 8080;
const targetUrl = 'https://p2p.binance.com';
const $http = axios.create({
    baseURL: targetUrl,
})

const sqlite3 = pkg.verbose();
const db = new sqlite3.Database('./data/db.sqlite3');

db.run(`CREATE TABLE IF NOT EXISTS "prices"
        (
            "id"         INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            "pair"       TEXT    NOT NULL,
            "direction"  TEXT    NOT NULL,
            "price_min"  REAL    NOT NULL,
            "price_max"  REAL    NOT NULL,
            "price_avg"  REAL    NOT NULL,
            "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
        );
`);


const assetsToMonitor = [
    ['USDT', 'RUB', ['TinkoffNew', 'RosBankNew']],
    ['USDT', 'KGS', ['DEMIRBANK', 'KompanionBank']],
];


/**
 * # ┌────────────── second (optional)
 * # │ ┌──────────── minute
 * # │ │ ┌────────── hour
 * # │ │ │ ┌──────── day of month
 * # │ │ │ │ ┌────── month
 * # │ │ │ │ │ ┌──── day of week
 * # │ │ │ │ │ │
 * # │ │ │ │ │ │
 * # * * * * * *
 *  */
cron.schedule('* * * * *', () => {
    const date = new Date();
    const baseConfig = {
        "page": 1,
        "rows": 10,
        "transAmount": 20000,
        "proMerchantAds": false,
        "publisherType": null,
        "merchantCheck": false
    };

    (['BUY', 'SELL']).forEach((tradeType) => {
        assetsToMonitor.forEach(([asset, fiat, payTypes]) => {
            $http.post('/bapi/c2c/v2/friendly/c2c/adv/search', {
                ...baseConfig,
                tradeType,
                asset,
                fiat,
                payTypes,
            }).then((response) => {
                let priceMin = 0;
                let priceMax = 0;
                let priceAvg = 0;

                response.data.data.forEach((item) => {
                    priceMin = priceMin === 0 ? +item.adv.price : Math.min(priceMin, +item.adv.price);
                    priceMax = priceMax === 0 ? +item.adv.price : Math.max(priceMax, +item.adv.price);
                    priceAvg += +item.adv.price;
                })
                priceAvg = +(priceAvg / response.data.data.length).toFixed(2);

                db.run(`INSERT INTO prices (pair, direction, price_min, price_max, price_avg, created_at)
                        VALUES (?, ?, ?, ?, ?, ?)`
                    , [`${asset}_${fiat}`, tradeType, priceMin, priceMax, priceAvg, date.toISOString()]
                    , (error) => {
                        if (error) {
                            console.log(error);
                        }
                    })
            }).catch((error) => {
                console.log(error);
            })
        })
    })
});


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


app.get('/api/get-prices', (req, res) => {
    db.all(`SELECT pair,
                   direction,
                   created_at,
                   price_min,
                   price_max,
                   price_avg
            FROM prices
            WHERE created_at > (SELECT DATETIME('now', '-7 day'))
              AND pair = '${req.query.pair}'
              AND direction = '${req.query.direction}'
    `, (error, rows) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json(rows);
        }
    })
})

app.use('/assets/', express.static('dist/assets'));

app.get('/', express.static('dist'));

server.listen(proxyServerPort);
// console.log(`Proxy server listening on port ${proxyServerPort}`);
