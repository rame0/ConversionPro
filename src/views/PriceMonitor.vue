<template>
  <div class="content" py="5" px="10">
    <el-row :m-t="5">
      <el-col :span="24">
        <el-button :type="item==selectedPair?'success':'primary'" @click="updateBtn(item)" v-for="item in pairs"
                   :disabled="!isReady">
          {{ item }}
        </el-button>
        <el-button :type="item==selectedDirection?'success':'primary'" @click="updateBtn(undefined,item)"
                   v-for="item in directions" :disabled="!isReady">
          {{ item }}
        </el-button>
      </el-col>
    </el-row>

    <el-row :m-t="5">
      <el-col :span="24">
        <div id="chart">
          <apexchart type="rangeArea" height="750" :options="chartOptions" :series="toRaw(series)"
                     v-if="isReady"></apexchart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import {Charts} from "~/data/charts";
import {TradeType} from "~/data/BinanceP2PAddsTypes";
import {ref, toRaw} from "vue";
import VueApexCharts from "vue3-apexcharts";

export type priceResponse = {
  pair: string
  direction: TradeType
  created_at: string
  price_min: number
  price_max: number
  price_avg: number
}
export default {
  name: "Chart",
  methods: {toRaw},

  components: {
    apexchart: VueApexCharts
  },

  setup() {
    const defaultChartOptions = {
      chart: {
        height: 700,
        type: 'rangeArea',
        // toolbar: {
        //   show: false
        // },
        // zoom: {
        //   enabled: false
        // }
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        min: 0,
        max: 1,
      },
      colors: ['#d4526e', '#33b2df', '#d4526e', '#33b2df'],
      dataLabels: {
        enabled: false
      },
      fill: {
        opacity: [0.24, 0.24, 1, 1]
      },
      stroke: {
        curve: 'smooth',
        width: [2, 2, 2, 2]
      },
      // title: {
      //   text: 'Range Area with Forecast Line (Combo)'
      // },
      tooltip: {
        theme: 'dark'
      },
    };


    const chartOptions = ref(defaultChartOptions)
    const isReady = ref(true)
    const series = ref([])
    let dataStore = []

    const pairs = ["USDT_RUB", "USDT_KGS"]
    const directions = [TradeType.BUY, TradeType.SELL]

    let selectedPair = ref(pairs[0])
    let selectedDirection = ref(directions[0])

    const updateChart = (pair: string, direction: TradeType) => {
      const response = Charts.fetcherPair(pair, direction) as Promise<priceResponse[]>

      response.then((data) => {
        isReady.value = false

        dataStore = data
        let min_price = 0;
        let max_price = 0;
        const dates = data.map((item: priceResponse) => {
          return new Date(item.created_at)
        })
        const dataRange = data.map((item: priceResponse, index) => {
          if (index === 0) {
            min_price = item.price_min
            max_price = item.price_max
          } else {
            if (item.price_min < min_price) {
              min_price = item.price_min
            }
            if (item.price_max > max_price) {
              max_price = item.price_max
            }
          }
          return {
            x: dates[index].getTime(),
            y: [+item.price_min.toFixed(2), +item.price_max.toFixed(2)]
          }
        })

        const avgLine = data.map((item: priceResponse, index) => {
          return {
            x: dates[index].getTime(),
            y: +item.price_avg.toFixed(2)
          }
        })

        const newOpts = {...defaultChartOptions}
        newOpts.yaxis.min = +min_price.toFixed(2) - .1
        newOpts.yaxis.max = +max_price.toFixed(2) + .1

        chartOptions.value = newOpts
        series.value = [
          {
            name: 'Price Range',
            type: 'rangeArea',
            data: dataRange,
          },
          {
            name: 'Average',
            type: 'line',
            data: [...avgLine],
          }
        ]
        isReady.value = true
      }).catch((err) => {
        console.log(err)
      })
    }

    updateChart(selectedPair.value, selectedDirection.value)

    const updateBtn = (pair?: string, direction?: TradeType) => {
      if (pair) selectedPair.value = pair
      if (direction) selectedDirection.value = direction
      updateChart(selectedPair.value, selectedDirection.value)
    }


    return {
      chartOptions,
      series,
      isReady,
      pairs,
      directions,
      selectedPair,
      selectedDirection,
      updateBtn
    }
  }

}
</script>

<style scoped>

</style>
