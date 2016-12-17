<template>
  <div class="chart-container">
    <label for="pressure">Pressure</label>
    <input v-model="pressure" type="range" id="pressure" min="970" max="1030" step="1" @change="processData">
    <label for="temperature">Temperature</label>
    <input v-model="temperature" type="range" id="temperature" min="10" max="35" step="1" @change="processData">
    <canvas id="myChart" width="100" height="100"></canvas>
  </div>

</template>

<script>
/*eslint-disable*/
import Chart from 'Chart.js'
import Resource from '../service/resource'
const resourceService = new Resource()

export default {
  name: 'dashboard',
  data () {
    return {
      pressure: 970,
      temperature: 20,
      rainAmount: [],
      meanProbability: [],
      lowestProbability: [],
      highestProbability: [],
      myChart: null
    }
  },
  mounted: function () {
    let ctx = document.getElementById("myChart").getContext("2d");
    this.myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: ["1", "2", "3", "4", "5", "6", "7"],
          datasets: [
            {
              fill: false,
              label: 'mean value of chance for rain',
              data: []
            },
            {
              fill: false,
              label: 'lower bound value of chance for rain',
              data: []
            },
            {
              fill: false,
              label: 'lower bound value of chance for rain',
              data: []
            }
          ]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true,
                      suggestedMax: 100
                  }
              }]
          }
      }
    })
    this.getRain();
  },
  methods: {
    processData: function () {
      this.meanProbability = this.rainAmount.map((object) => {
        return this.chanceOfRain(this.pressure, this.temperature, object.amount)
      })
      this.myChart.data.datasets[0].data = this.meanProbability;
      this.myChart.update()
    },
    getRain: function () {
      resourceService.getRain().then((rainAmount) => {
        this.rainAmount = rainAmount[0].days
        this.processData()
      })
    },
    chanceOfRain: function (pressure, temperature, amount) {
      var score = Math.log(amount + 1) * Math.log(pressure-929) * Math.log(temperature-9);
      var mean = Math.min(Math.max(score, 0), 100)
      //var upper_bound = Math.min(1.5 * mean, 100);
      //var lower_bound = Math.max(0.5 * mean, 0);
      return mean;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .chart-container {
    width: 500px;
    height: 500px;
  }
</style>
