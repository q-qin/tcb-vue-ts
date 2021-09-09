<template>
  <div class="home">
    <a-skeleton v-show="!loaded" />
    <div v-show="loaded">
      <div
        ref="line"
        class="g2"
        :style="{ height: '300px', width: '800px' }"
      ></div>
      <div class="flex justify-around">
        <a-statistic
          title="今日工单"
          :value="36"
          suffix="单"
        ></a-statistic>
        <a-statistic
          title="剩余工单"
          :value="12"
          suffix="单"
        ></a-statistic>
        <a-statistic
          title="本月工单"
          :value="280"
          suffix="单"
          :value-style="{ color: '#3f8600' }"
        >
          <template #prefix>
            <a-icon type="arrow-down" />
          </template>
        </a-statistic>

        <a-statistic
          title="本月销售额"
          :value="90000"
          :precision="2"
          suffix="￥"
          :value-style="{ color: '#cf1322' }"
        >
          <template #prefix>
            <a-icon type="arrow-up" />
          </template>
        </a-statistic>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import * as echarts from "echarts";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  loaded = false;

  mounted() {
    setTimeout(() => {
      this.loaded = true;
      let myChart = echarts.init(this.$refs.line as HTMLCanvasElement);
      const option = {
        title:{
          text:'近7天修理工单'
        },
        tooltip:{},
        xAxis: {
          type: "category" as "category",
          data: ["6天前", "5天前", "4天前", "3天前", "2天前", "1天前", "今日"],
        },
        yAxis: {
          type: "value" as "value",
        },
        series: [
          {
            name:'工单数(单)',
            data: [15, 20, 32, 18, 35, 47, 36],
            type: "line" as "line"
          },
        ],
      };
      myChart.setOption(option);
    }, 1e3);
  }
}
</script>
