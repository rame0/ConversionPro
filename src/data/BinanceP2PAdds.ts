import axios from "axios"


export enum TradeType {
    BUY = "BUY",
    SELL = "SELL"
}

export enum Fiat {
    RUB = "RUB",
    USD = "USD",
    EUR = "EUR",
    UAH = "UAH",
    KGS = "KGS",
}

export enum Asset {
    BTC = "BTC",
    ETH = "ETH",
    USDT = "USDT",
    BNB = "BNB",
    BUSD = "BUSD",
}

export interface TradeMethod {
    "payId": number | null,
    "payMethodId": string,
    "payType": string | null,
    "payAccount": string | null,
    "payBank": string | null,
    "paySubBank": string | null,
    "identifier": string | null,
    "iconUrlColor": string | null,
    "tradeMethodName": string | null,
    "tradeMethodShortName": string | null,
    "tradeMethodBgColor": string | null
}

export interface adv {
    "advNo": number
    "classify": string,
    "tradeType": string,
    "asset": string,
    "fiatUnit": string,
    "advStatus": string | null,
    "priceType": string | null,
    "priceFloatingRatio": string | null,
    "rateFloatingRatio": string | null,
    "currencyRate": string | null,
    "price": number,
    "initAmount": string | null,
    "surplusAmount": number,
    "amountAfterEditing": string | null,
    "maxSingleTransAmount": number,
    "minSingleTransAmount": number,
    "buyerKycLimit": string | null,
    "buyerRegDaysLimit": string | null,
    "buyerBtcPositionLimit": string | null,
    "remarks": string | null,
    "autoReplyMsg": string,
    "payTimeLimit": number,
    "tradeMethods": TradeMethod[],
    "userTradeCountFilterTime": string | null,
    "userBuyTradeCountMin": string | null,
    "userBuyTradeCountMax": string | null,
    "userSellTradeCountMin": string | null,
    "userSellTradeCountMax": string | null,
    "userAllTradeCountMin": string | null,
    "userAllTradeCountMax": string | null,
    "userTradeCompleteRateFilterTime": string | null,
    "userTradeCompleteCountMin": string | null,
    "userTradeCompleteRateMin": string | null,
    "userTradeVolumeFilterTime": string | null,
    "userTradeType": string | null,
    "userTradeVolumeMin": string | null,
    "userTradeVolumeMax": string | null,
    "userTradeVolumeAsset": string | null,
    "createTime": string | null,
    "advUpdateTime": string | null,
    "fiatVo": string | null,
    "assetVo": string | null,
    "advVisibleRet": string | null,
    "assetLogo": string | null,
    "assetScale": number,
    "fiatScale": number,
    "priceScale": number,
    "fiatSymbol": string,
    "isTradable": true,
    "dynamicMaxSingleTransAmount": number,
    "minSingleTransQuantity": number,
    "maxSingleTransQuantity": number,
    "dynamicMaxSingleTransQuantity": number,
    "tradableQuantity": number,
    "commissionRate": number,
    "tradeMethodCommissionRates": [],
    "launchCountry": string | null,
    "abnormalStatusList": string | null,
    "closeReason": string | null,
    "storeInformation": string | null
}

export interface advertiser {
    "userId": string | null,
    "userNo": string,
    "realName": string | null,
    "nickName": string,
    "margin": string | null,
    "marginUnit": string | null,
    "orderCount": string | null,
    "monthOrderCount": number,
    "monthFinishRate": number,
    "positiveRate": number,
    "advConfirmTime": string | null,
    "email": string | null,
    "registrationTime": string | null,
    "mobile": string | null,
    "userType": string,
    "tagIconUrls": [],
    "userGrade": number,
    "userIdentity": string,
    "proMerchant": string | null,
    "isBlocked": false,
    "activeTimeInSecond": number
}

export interface advData {
    adv: adv,
    advertiser: advertiser
}

export interface apiResponse {
    code: string,
    success: string,
    message: string | null,
    messageDetail: string | null,
    data: advData[],
    total: number

}

export interface requestParams {
    asset: Asset,
    fiat: Fiat,
    tradeType: TradeType,
    transAmount: string,
    rows: number,
    page: number,
    payTypes: string[],
    countries: string[],
    publisherType: string | null,
    merchantCheck: boolean,
    proMerchantAds: boolean
}


export class BinanceP2PAdds {
    $http = axios.create()

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
            .post(
                "/api/p2p",
                params,
                {
                    "headers": {
                        "cache-control": "no-cache",
                        "content-type": "application/json",
                        "accept": "*/*",
                        "lang": "ru",
                        "pragma": "no-cache",
                    },
                })
            .then(res => res.data as apiResponse)
    }
}

