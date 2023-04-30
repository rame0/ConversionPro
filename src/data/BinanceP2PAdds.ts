import axios, {AxiosResponse} from "axios"
import {
    Asset,
    Fiat,
    FilterConditionsResponse,
    requestParams,
    TradeType,
    SearchResponse
} from "./BinanceP2PAddsTypes";


export class BinanceP2PAdds {
    $http = axios.create()

    config = {
        "headers": {
            "cache-control": "no-cache",
            "content-type": "application/json",
            "accept": "*/*",
            "lang": "ru",
            "pragma": "no-cache",
        }
    }

    public async fetcherPair(asset: Asset, fiat: Fiat, banks: string[], maxAmount: number, tradeType: TradeType, rows: number = 10) {
        const params: requestParams = {
            "asset": asset,
            "fiat": fiat,
            "transAmount": maxAmount > 0 ? maxAmount.toString() : "",
            "tradeType": tradeType,
            "proMerchantAds": false,
            "page": 1,
            "rows": rows,
            "payTypes": banks,
            "countries": [],
            "publisherType": null,
            "merchantCheck": false
        }
        return await this.$http
            .post("/api/p2p", params, this.config)
            .then((res:AxiosResponse<SearchResponse>) => {
                return res.data
            })
    }
}

