import {createApp} from "vue";
import App from "./App.vue";
import router from "~/router";
import VueApexCharts from "vue3-apexcharts";

import "~/styles/index.scss";
import "uno.css";

// If you want to use ElMessage, import it.
import "element-plus/theme-chalk/src/message.scss";

const app = createApp(App);
app.use(router)
app.use(VueApexCharts);
// app.component('apexchart', VueApexCharts)
app.mount("#app");
