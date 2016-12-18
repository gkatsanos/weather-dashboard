<style src="./Dashboard.scss" lang="scss"></style>

<template>
  <div class="container">
    <div class="row">
      <div class="col col-quarter">
        <div class="control-box">
          <div class="range-slider">
            <label for="pressure">Pressure</label>
            <input class="range-slider__range" v-model="pressure" type="range" id="pressure" min="970" max="1030" step="1" @input="processData">
            <div id="pressure-value">{{ pressure }}</div>
          </div>
        </div>
        <div class="control-box">
          <label for="temperature">Temperature</label>
          <input class="range-slider__range" v-model="temperature" type="range" id="temperature" min="10" max="35" step="1" @input="processData">
          <div id="temperature-value">{{ temperature }}</div>
        </div>
      </div>
      <div class="col col-half">
        <canvas id="rainChance"></canvas>
        <canvas id="rainFall"></canvas>
      </div>
    </div>
    <div class="row">
      <div class="col-half">
      </div>
    </div>
  </div>

</template>

<script>
  import Chart from 'Chart.js'
  import Resource from '../../service/resource'
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
        rainChance: {},
        rainFall: {}
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        // initiliazing the two charts as soon as the Component has been mounted
        this.setupCharts()
      })
    },
    methods: {
      setupCharts: function () {
        let ctx = document.getElementById('rainChance').getContext('2d')
        let ctxb = document.getElementById('rainFall').getContext('2d')
        this.rainChance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [
              {
                borderColor: 'rgba(75,192,192,1)',
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                fill: false,
                label: 'mean value',
                data: []
              },
              {
                borderColor: 'rgba(255,205,86,1)',
                pointHoverBackgroundColor: 'rgba(255,205,86,1)',
                fill: false,
                label: 'lower bound',
                data: []
              },
              {
                borderColor: 'rgba(255,33,0,1)',
                pointHoverBackgroundColor: 'rgba(255,33,0,1)',
                fill: false,
                label: 'highter bound',
                data: []
              }
            ]
          },
          options: {
            tooltips: {
              mode: 'label'
            },
            responsive: true,
            scales: {
              yAxes: [{
                gridLines: {
                  color: 'rgba(255,255,255,0.1)'
                },
                scaleLabel: {
                  display: true,
                  labelString: '%'
                },
                ticks: {
                  beginAtZero: true,
                  suggestedMax: 100
                }
              }],
              xAxes: [{
                gridLines: {
                  color: 'rgba(255,255,255,0.1)'
                },
                scaleLabel: {
                  display: true,
                  labelString: 'days'
                }
              }]
            }
          }
        })
        this.rainFall = new Chart(ctxb, {
          type: 'bar',
          data: {
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [
              {
                backgroundColor: 'rgba(255,205,86,0.1)',
                borderColor: 'rgba(255,205,86,1)',
                borderWidth: 1,
                label: 'Rainfall amount',
                data: this.rainAmount
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              yAxes: [{
                gridLines: {
                  color: 'rgba(255,255,255,0.1)'
                },
                scaleLabel: {
                  display: true,
                  labelString: 'l/m²'
                },
                ticks: {
                  beginAtZero: true
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'days'
                }
              }]
            }
          }
        })
        // fetch rain amount information from server
        this.getRain()
      },
      getRain: function () {
        resourceService.getRain().then((rainAmount) => {
          this.rainAmount = rainAmount[0].days.map((obj) => obj.amount)
          this.processData()
        })
      },
      processData: function () {
        // display values of input range fields
        document.getElementById('temperature-value').textContent = this.temperature
        document.getElementById('pressure-value').textContent = this.pressure

        // convert rain amounts, pressure and temperature to rain probabilities
        this.probabilities = this.rainAmount.map((value) => {
          return this.chanceOfRain(this.pressure, this.temperature, value)
        })
        this.probabilities.map((object, index) => {
          this.meanProbability.splice(index, 1, object.mean)
          this.lowestProbability.splice(index, 1, object.lowerBound)
          this.highestProbability.splice(index, 1, object.upperBound)
        })

        // update chart datasets and render them
        this.rainChance.data.datasets[0].data = this.meanProbability
        this.rainChance.data.datasets[1].data = this.lowestProbability
        this.rainChance.data.datasets[2].data = this.highestProbability
        this.rainFall.data.datasets[0].data = this.rainAmount
        this.rainChance.update()
        this.rainFall.update()
      },
      chanceOfRain: function (pressure, temperature, amount) {
        var score = Math.log(amount + 1) * Math.log(pressure - 929) * Math.log(temperature - 9)
        var mean = Math.min(Math.max(score, 0), 100)
        var upperBound = Math.min(1.5 * mean, 100)
        var lowerBound = Math.max(0.5 * mean, 0)
        return { 'mean': mean, 'lowerBound': lowerBound, 'upperBound': upperBound }
      }
    }
  }
</script>
