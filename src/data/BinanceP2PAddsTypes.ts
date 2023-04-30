export enum TradeType {
    BUY = "BUY",
    SELL = "SELL"
}

export enum Fiat {
    None = '--',
    RUB = "RUB",
    USD = "USD",
    EUR = "EUR",
    UAH = "UAH",
    KGS = "KGS",
    KZT = "KZT",
}

export enum Asset {
    BTC = "BTC",
    ETH = "ETH",
    USDT = "USDT",
    BNB = "BNB",
    BUSD = "BUSD",
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


export interface SearchResponse {
    code: string;
    message?: null;
    messageDetail?: null;
    data?: (SearchData)[] | null;
    total: number;
    success: boolean;
}

export interface SearchData {
    adv: Adv;
    advertiser: Advertiser;
}

export interface Adv {
    advNo: string;
    classify: string;
    tradeType: string;
    asset: string;
    fiatUnit: string;
    advStatus?: null;
    priceType?: null;
    priceFloatingRatio?: null;
    rateFloatingRatio?: null;
    currencyRate?: null;
    price: string;
    initAmount?: null;
    surplusAmount: string;
    amountAfterEditing?: null;
    maxSingleTransAmount: string;
    minSingleTransAmount: string;
    buyerKycLimit?: null;
    buyerRegDaysLimit?: null;
    buyerBtcPositionLimit?: null;
    remarks?: null;
    autoReplyMsg: string;
    payTimeLimit: number;
    tradeMethods?: (TradeMethodsEntity)[] | null;
    userTradeCountFilterTime?: null;
    userBuyTradeCountMin?: null;
    userBuyTradeCountMax?: null;
    userSellTradeCountMin?: null;
    userSellTradeCountMax?: null;
    userAllTradeCountMin?: null;
    userAllTradeCountMax?: null;
    userTradeCompleteRateFilterTime?: null;
    userTradeCompleteCountMin?: null;
    userTradeCompleteRateMin?: null;
    userTradeVolumeFilterTime?: null;
    userTradeType?: null;
    userTradeVolumeMin?: null;
    userTradeVolumeMax?: null;
    userTradeVolumeAsset?: null;
    createTime?: null;
    advUpdateTime?: null;
    fiatVo?: null;
    assetVo?: null;
    advVisibleRet?: null;
    assetLogo?: null;
    assetScale: number;
    fiatScale: number;
    priceScale: number;
    fiatSymbol: string;
    isTradable: boolean;
    dynamicMaxSingleTransAmount: string;
    minSingleTransQuantity: string;
    maxSingleTransQuantity: string;
    dynamicMaxSingleTransQuantity: string;
    tradableQuantity: string;
    commissionRate: string;
    tradeMethodCommissionRates?: (null)[] | null;
    launchCountry?: null;
    abnormalStatusList?: null;
    closeReason?: null;
    storeInformation?: null;
}

export interface TradeMethodsEntity {
    payId?: null;
    payMethodId: string;
    payType?: null;
    payAccount?: null;
    payBank?: null;
    paySubBank?: null;
    identifier: string;
    iconUrlColor?: null;
    tradeMethodName: string;
    tradeMethodShortName: string;
    tradeMethodBgColor: string;
}

export interface Advertiser {
    userId?: null;
    userNo: string;
    realName?: null;
    nickName: string;
    margin?: null;
    marginUnit?: null;
    orderCount?: null;
    monthOrderCount: number;
    monthFinishRate: number;
    positiveRate: number;
    advConfirmTime?: null;
    email?: null;
    registrationTime?: null;
    mobile?: null;
    userType: string;
    tagIconUrls?: (null)[] | null;
    userGrade: number;
    userIdentity: string;
    proMerchant?: null;
    isBlocked?: null;
    activeTimeInSecond: number;
}


export interface FilterConditionsResponse {
    code: string;
    message?: null;
    messageDetail?: null;
    data: FilterConditions;
    success: boolean;
}

export interface FilterConditions {
    countries?: (CountriesEntity)[] | null;
    tradeMethods?: (TradeMethodsEntity)[] | null;
    preferredCountry: string;
}

export interface CountriesEntity {
    scode: string;
    name: string;
}