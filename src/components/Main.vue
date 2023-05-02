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
                        <c-multi-select label="From bank" placeholder="Select fiat bank" w="100%" :options="fromBanks"
                                        v-model="bankFrom" filterable/>
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
                        <c-multi-select label="To bank" placeholder="Select fiat currency" w="100%" :options="toBanks"
                                        v-model="bankTo" filterable/>
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
                    <el-tag v-for="method in scope.row.from.tradeMethods">
                        {{ method.tradeMethodName }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column width="50"> =></el-table-column>
            <el-table-column label="In Asset" width="180">
                <template #default="scope">
                    <span>{{ round(scope.row.in_asset, -5) }} {{ scope.row.from.asset }}</span>
                </template>
            </el-table-column>
            <el-table-column width="50"> =></el-table-column>
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

<script setup lang="ts">
import {BinanceP2PAdds} from "~/data/BinanceP2PAdds";
import {Adv, Asset, Fiat, SearchResponse, TradeType} from "~/data/BinanceP2PAddsTypes";
import {computed, Ref, ref, watch} from "vue";
import {round} from "~/utils/round";
import {ElMessage,} from "element-plus";
import {Option, Options} from "~/types/Optons";


const fiatOptions = [
    ...Object.values(Fiat)
        .map((value) => {
            return {label: value, value: value}
        })
]
const loadingSvg = `
                <path class="path" d="
                  M 30 15
                  L 28 17
                  M 25.61 25.61
                  A 15 15, 0, 0, 1, 15 30
                  A 15 15, 0, 1, 1, 27.99 7.5
                  L 15 15
                " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
              `
const fromIsLoading = ref(false)
const toIsLoading = ref(false)
const fiatFrom = ref<Fiat>(Fiat.None)
const fiatTo = ref<Fiat>(Fiat.None)
const amount = ref(10000)
const isFetching = ref<Boolean>(false)
const results = ref<{ amount: number, from: Adv, to: Adv, in_asset: number, receive: number }[]>([])
const bankFrom = ref<String[]>([])
const bankTo = ref<String[]>([])
const bankRate = ref(1.07)
const bankCommission = ref(0.5)
const fromBanks = ref<Option[]>([])
const toBanks = ref<Option[]>([])

const p2papi = new BinanceP2PAdds()

const canFetch = computed(() => {
    return fiatFrom.value && fiatTo.value && amount.value && bankFrom.value.length > 0 && bankTo.value.length > 0
})

watch(fiatFrom, async () => {
        await getTradingMethods(fiatFrom.value, fromIsLoading, bankFrom, fromBanks)
    }
)
watch(fiatTo, async () => {
        await getTradingMethods(fiatTo.value, toIsLoading, bankTo, toBanks)
    }
)


const exchangedAmount = computed(() => {
    const result = bankRate.value * amount.value
    return round(result - result * bankCommission.value / 100, -4)
})


const fetcherPair = async () => {
    isFetching.value = true
    results.value = []
    for (const asset of Object.values(Asset) as Asset[]) {
        const BUY: SearchResponse | null = await p2papi.fetcherPair(asset, fiatFrom.value,
            bankFrom.value as string[], amount.value, TradeType.BUY, 2)

        if (!BUY?.data || BUY.data.length < 1) {
            continue
        }
        const from = BUY.data[0].adv

        const SELL = await p2papi.fetcherPair(asset, fiatTo.value,
            bankTo.value as string[], exchangedAmount.value, TradeType.SELL, 2)
        if (!SELL?.data || SELL.data.length < 1) {
            continue
        }
        const to = SELL.data[0].adv

        const in_asset = amount.value / (+from.price)
        const receive = in_asset * (+to.price)

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


const getTradingMethods = async (fiat: Fiat, isLoadingRef: Ref<Boolean>, valueRef: Ref<String[]>, optionsRef: Ref<Options>) => {
    isLoadingRef.value = true
    valueRef.value = []
    optionsRef.value = []
    try {
        const filters = await p2papi.fetchFilterConditions(fiat)
        if (filters?.data?.tradeMethods) {
            optionsRef.value = filters?.data?.tradeMethods.map((value) => ({
                label: value.tradeMethodShortName,
                value: value.identifier
            }))
            isLoadingRef.value = false
        } else {
            isLoadingRef.value = false
        }
    } catch (e: any) {
        isLoadingRef.value = false
        ElMessage.error(e.message)
    }

}
</script>

<style>
.content {
    height: calc(100vh - var(--header-height) - 1px);
    overflow-scrolling: auto;
}
</style>

