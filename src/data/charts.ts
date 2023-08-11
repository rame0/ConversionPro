import axios from "axios";
import {TradeType} from "~/data/BinanceP2PAddsTypes";

export class Charts {
    public static async fetcherPair(pair: string, direction: TradeType) {
        const params = {
            pair,
            direction,
        }
        return await axios
            .get("/api/get-prices", {params})
            .then((res) => {
                return res.data
            })
    }
}
