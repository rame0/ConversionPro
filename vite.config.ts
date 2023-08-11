import * as path from 'path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

import Unocss from 'unocss/vite'
import {
    presetAttributify,
    presetIcons,
    presetUno,
    transformerDirectives,
    transformerVariantGroup,
} from 'unocss'

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '~/': `${pathSrc}/`,
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "~/styles/element/index.scss" as *;`,
            },
        },
    },
    server: {
        port: 8881,
        proxy: {
            '/api/p2p/filter': {
                target: 'https://p2p.binance.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/p2p\/filter/, '/bapi/c2c/v2/public/c2c/adv/filter-conditions'),
            },
            '/api/p2p': {
                target: 'https://p2p.binance.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/p2p/, '/bapi/c2c/v2/friendly/c2c/adv/search'),
            },
            '/api/get-prices': {
                target: 'http://localhost:8080',
            }
        }
    },
    plugins: [
        vue(),
        Components({
            // allow auto load markdown components under `./src/components/`
            extensions: ['vue', 'md'],
            // allow auto import and register components used in markdown
            include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
            resolvers: [
                ElementPlusResolver({
                    importStyle: 'sass',
                }),
            ],
            dts: 'src/components.d.ts',
        }),

        // https://github.com/antfu/unocss
        // see unocss.config.ts for config
        Unocss({
            presets: [
                presetUno(),
                presetAttributify(),
                presetIcons({
                    scale: 1.2,
                    warn: true,
                }),
            ],
            transformers: [
                transformerDirectives(),
                transformerVariantGroup(),
            ]
        }),
    ],
})
