import Vue from 'vue'
import Dashboard from 'src/components/Dashboard/Dashboard'

describe('Dashboard Component', () => {
  it('should render correct contents', done => {
    Vue.nextTick(() => {
      const vm = new Vue(Dashboard).$mount()
      expect(vm.$el.querySelector('label[for="pressure"]').textContent)
        .to.equal('Pressure')
      expect(vm.$el.querySelector('label[for="temperature"]').textContent)
        .to.equal('Temperature')
      expect(vm.$el.querySelector('#temperature-value').textContent)
        .to.equal('20')
      expect(vm.$el.querySelector('#rainChance'))
        .to.not.equal(null)
      expect(vm.$el.querySelector('#rainFall'))
        .to.not.equal(null)
      done()
    })
  })

  it('sets the correct default data', done => {
    Vue.nextTick(() => {
      const vm = new Vue(Dashboard).$mount()
      expect(vm.$data.temperature).to.equal(20)
      done()
    })
  })
})
