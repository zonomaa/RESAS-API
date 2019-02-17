<template>
  <div class="pref-component clearfix" v-if="prefs.length > 0">
      <label v-for="pref of prefs" class="pref-label">
        <input type="checkbox" v-model="selected" v-bind:value="pref" @change="prefChange">
        <span class="inner">
            {{ pref.prefName }}
        </span>
      </label>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { APIKEY } from "env.ts";
import axios from "axios";

@Component
export default class PrefComponent extends Vue {
  prefs: {}[] = [];
  selected: string[] = [];

  beforeMount(){
    axios.get('https://opendata.resas-portal.go.jp/api/v1/prefectures', {
      headers: {
        'X-API-KEY': APIKEY
      }
    })
    .then((res: any) => {
      if(res.status === 200 && res.data){
        this.prefs = Array.isArray(res.data.result)? res.data.result : [];
      }else{
        const errMeg = res.message || 'API ERROR';
        console.error(errMeg)
      }
    })
  }

  prefChange(){
    this.$emit('prefChange', this.selected);
  }

}
</script>

<style lang="scss">
.pref-component {
  padding: 1rem;
  .pref-label {
    float: left;
    padding: .5rem .7rem;
    margin: .2rem;
    border: 1px solid #eee;
    border-radius: 10px;
    background: #fdfdfd;
  }
}

.clearfix::after{
  content: "";
  display: block;
  clear: both;
}
</style>
