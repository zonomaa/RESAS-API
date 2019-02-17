<template>
  <div>
    <pref-component @prefChange="changeData"></pref-component>
    <div ref="container"></div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PrefComponent from "@components/pref.vue";
import { APIKEY } from "env.ts";
import axios from "axios";
import Highcharts from "highcharts";

@Component({
  components: {
    'PrefComponent': PrefComponent
  }
})
export default class GrafComponent extends Vue {
  grafOptions: any = {
    chart: {
      type: 'line'
    },
    title: {
      text: null
    },
    xAxis: {
      categories: [],
      title: {
        text: '年度'
      }
    },
    yAxis: {
      title: {
        text: '人口数'
      }
    },
    series: []
  };

  changeData(prefs: string[]){
    // 初期化
    this.grafOptions.series = [];
    let request: any[] = [];

    // リクエストオブジェクト作成
    prefs.forEach((pref: any) => request.push(this.getPopulationComposition(pref.prefCode)))

    // すべてのリクエストが終了するのを待つ
    axios.all(request).then(result => {
      // 描画ロジック
      result.forEach((res: any, index: number) => {
        const pref: any = prefs[index];
        if(res.status === 200 && res.data && res.data.result){
          const resData = res.data.result.data || {};
          const lineData = resData.find((d: any) => d['label'] === '総人口');
          let data: any[] = [];
          lineData.data.forEach((d:any) => {
            data.push(d.value)
            if(this.grafOptions.xAxis.categories.length !== lineData.data.length){
              this.grafOptions.xAxis.categories.push(d.year)
            }
          })
          this.grafOptions.series.push({
            "name": pref.prefName,
            "data": data
          })
        }else{
          const errMeg = res['message'] || 'API ERROR';
          console.error(errMeg)
        }
      })
      // 描画
      this.renderGraf();
    })
  }

  getPopulationComposition(prefCode: string){
    return axios.get(`https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefCode}`, {
      headers: {
        'X-API-KEY': APIKEY
      }
    })
  }

  renderGraf(){
    Highcharts.chart(<HTMLElement>this.$refs.container, this.grafOptions);
  }

  mounted() {
    this.renderGraf();
  }

}
</script>

<style lang="scss">

</style>
