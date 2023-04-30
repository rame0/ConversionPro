<template>
    <div class="content" py="5" px="10">
        <el-row :gutter="20">
            <el-col :span="4" class="text-a-right">
                <p>Amount:</p>
            </el-col>
            <el-col :span="4">
                <el-input-number class="m-2" v-model="amount"/>
            </el-col>
            <el-col :span="4" class="text-a-right">
                <p>Conversion rate:</p>
            </el-col>
            <el-col :span="4">
                <el-input-number class="m-2" id="bankRate" v-model="bankRate" :step="0.001"/>
            </el-col>

            <el-col :span="4" class="text-a-right">
                <p>Transfer comm.(%):</p>
            </el-col>
            <el-col :span="4">
                <el-input-number class="m-2" label="Bank commission (%)" v-model="bankCommission" :step="0.5"/>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="12" class="text-a-center">
                <p>FROM</p>
            </el-col>
            <el-col :span="12" class="text-a-center">
                <p>TO</p>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12"
                    v-loading="fromIsLoading"
                    element-loading-text="Loading..."
                    :element-loading-spinner="loadingSvg"
                    element-loading-svg-view-box="-10, -10, 50, 50"
                    element-loading-background="rgba(122, 122, 122, 0.8)"
            >
                <el-row>
                    <el-col :span="8">
                        <c-select label="From fiat" placeholder="Select fiat currency" :options="fiatOptions"
                                  v-model="fiatFrom" filterable/>
                    </el-col>
                    <el-col :span="16">
                        <c-select label="From bank" placeholder="Select fiat bank" w="100%" :options="fromBanks"
                                  v-model="bankFrom"
                                  :multiple="true" filterable :disabled="fromBanks.length < 1"/>
                    </el-col>
                </el-row>

            </el-col>

            <el-col :span="12"
                    v-loading="toIsLoading"
                    element-loading-text="Loading..."
                    :element-loading-spinner="loadingSvg"
                    element-loading-svg-view-box="-10, -10, 50, 50"
                    element-loading-background="rgba(122, 122, 122, 0.8)">
                <el-row>
                    <el-col :span="8">
                        <c-select label="To fiat" placeholder="Select fiat currency" :options="fiatOptions"
                                  v-model="fiatTo" filterable/>
                    </el-col>
                    <el-col :span="16">
                        <c-select label="To bank" placeholder="Select fiat currency" w="100%" :options="toBanks"
                                  v-model="bankTo"
                                  :multiple="true" filterable :disabled="toBanks.length < 1"/>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24">
                <el-card my="10" w="auto" shadow="always">
                    <p m="0">Through transfer: {{ amount }} {{ fiatFrom }} => {{ exchangedAmount }} {{ fiatTo }}</p>
                </el-card>
            </el-col>
        </el-row>
        <div>
            <el-button type="primary" @click="fetcherPair" :disabled="!canFetch">Fetch</el-button>
        </div>
        <h3 v-if="isFetching">Fetching data...</h3>

        <el-table :data="results" style="width: 100%"
                  v-if="!isFetching && results.length>0"
                  :row-class-name="tableRowClassName">
            <el-table-column :label="`Amount ${fiatFrom}`">
                <template #default="scope">
                    <span>{{ scope.row.amount }} {{ scope.row.from.fiatSymbol }}</span>
                    <br/>
                    <el-tag v-for="method in scope.row.to.tradeMethods">
                        {{ method.tradeMethodName }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column> =></el-table-column>
            <el-table-column label="In Asset">
                <template #default="scope">
                    <span>{{ round(scope.row.in_asset, -5) }} {{ scope.row.from.asset }}</span>
                </template>
            </el-table-column>
            <el-table-column> =></el-table-column>
            <el-table-column :label="`Receive ${fiatTo}`">
                <template #default="scope">
                    <span>{{ round(scope.row.receive, -2) }} {{ scope.row.to.fiatSymbol }}</span>
                    <br/>
                    <el-tag v-for="method in scope.row.to.tradeMethods">
                        {{ method.tradeMethodName }}
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import {BinanceP2PAdds} from "~/data/BinanceP2PAdds";
import {Adv, Asset, Fiat, SearchResponse, TradeType} from "~/data/BinanceP2PAddsTypes";
import {computed, Ref, ref} from "vue";
import {round} from "~/utils/round";
import {ElMessage,} from "element-plus";

export default {
    methods: {
        round,
    },
    components: {
        ElMessage,
    },
    data() {
        return {
            fiatOptions: [
                ...Object.values(Fiat)
                    .map((value) => {
                        return {label: value, value: value}
                    })
            ],
            loadingSvg: `
                <path class="path" d="
                  M 30 15
                  L 28 17
                  M 25.61 25.61
                  A 15 15, 0, 0, 1, 15 30
                  A 15 15, 0, 1, 1, 27.99 7.5
                  L 15 15
                " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
              `,
            fromIsLoading: false,
            toIsLoading: false,
        }
    },
    computed: {
        canFetch() {
            return this.fiatFrom && this.fiatTo && this.amount && this.bankRate && this.bankCommission
        },
    },
    watch: {
        fiatFrom() {
            this.fromIsLoading = true
            this.bankFrom = []
            this.fromBanks = []

            this.getTradingMethods(this.fiatFrom)
                .then((methods) => {
                    this.fromBanks = methods
                    this.fromIsLoading = false
                })
                .catch((e) => {
                    this.fromIsLoading = false
                    ElMessage.error(e.message)
                })
        },
        fiatTo() {
            this.toIsLoading = true
            this.bankTo = []
            this.toBanks = []

            this.getTradingMethods(this.fiatTo)
                .then((methods) => {
                    this.toBanks = methods
                    this.toIsLoading = false
                })
                .catch((e) => {
                    this.toIsLoading = false
                    ElMessage.error(e.message)
                })
        }
    },
    setup() {
        const fiatFrom = ref()
        const fiatTo = ref()
        const amount = ref(10000)
        const isFetching = ref(false)
        const results = ref<{ amount: number, from: Adv, to: Adv, in_asset: number, receive: number }[]>([])
        const bankFrom = ref([])
        const bankTo = ref([])
        const bankRate = ref(1.07)
        const bankCommission = ref(0.5)
        const fromBanks = ref([])
        const toBanks = ref([])

        const p2papi = new BinanceP2PAdds()

        const exchangedAmount = computed(() => {
            const result = bankRate.value * amount.value
            return round(result - result * bankCommission.value / 100, -4)
        })


        const fetcherPair = async () => {
            isFetching.value = true
            results.value = []
            for (const asset: Asset of Object.values(Asset)) {
                const BUY: SearchResponse | null = await p2papi.fetcherPair(asset, fiatFrom.value, bankFrom.value,
                    amount.value, TradeType.BUY, 2)

                if (!BUY?.data || BUY.data.length < 1) {
                    continue
                }
                const from = BUY.data[0].adv

                const SELL = await p2papi.fetcherPair(asset, fiatTo.value, bankTo.value,
                    exchangedAmount.value, TradeType.SELL, 2)
                if (!SELL?.data || SELL.data.length < 1) {
                    continue
                }
                const to = SELL.data[0].adv

                const in_asset = amount.value / from.price
                const receive = in_asset * to.price

                results.value.push({
                    amount: amount.value,
                    from: from,
                    to: to,
                    in_asset: in_asset,
                    receive: receive,
                })

                results.value.sort((a, b) => {
                    return b.receive - a.receive
                })
            }

            isFetching.value = false
        }

        const tableRowClassName = ({row, rowIndex,}) => {
            if (rowIndex === 0) {
                if (row.receive >= exchangedAmount.value) {
                    return 'success-row'
                } else {
                    return 'danger-row'
                }
            }
            return ''
        }


        const getTradingMethods = async (fiat: Fiat) => {
            const filters = await p2papi.fetchFilterConditions(fiat)
            if (filters?.data?.tradeMethods)
                return filters?.data?.tradeMethods.map((value) => ({
                    label: value.tradeMethodShortName,
                    value: value.identifier
                }))
            return []
        }

        return {
            fiatFrom,
            fiatTo,
            fromBanks,
            bankFrom,
            toBanks,
            bankTo,
            amount,
            bankRate,
            bankCommission,
            exchangedAmount,
            isFetching,
            results,
            fetcherPair,
            tableRowClassName,
            getTradingMethods
        }
    }
}
</script>

<style>
.ep-button {
    margin: 4px;
}

.ep-button + .ep-button {
    margin: 4px;
}

.content {
    height: calc(100vh - var(--header-height) - 1px);
    overflow-scrolling: auto;
}
</style>

