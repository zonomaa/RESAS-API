import 'scss/index.scss';

// vueをインポート
import Vue from "vue";
import GrafComponent from '@components/graf.vue';

new Vue({
  el: "#grafArea",
  components: {
      GrafComponent
  },
});