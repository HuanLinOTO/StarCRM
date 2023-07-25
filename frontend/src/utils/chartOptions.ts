const baseLine1 = {
  type: "line",
  smooth: true,
  label: {
    show: true,
    position: "top",
  },
};

const baseLine2 = {
  type: 'line',
  smooth: true,
  label: {
    show: true,
    position: "top",
  },
};

const chartOptions = {
  tooltip: {
    trigger: 'axis'
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      data: new Array(7)
            .fill(undefined)
            .map((_, i) => new Date(Date.now() - i * 24 * 60 * 60 * 1000))
            .map((date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
            .reverse(),
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      ...baseLine1,
      name: "日进库客户",
      data: [0, 0, 0, 0, 0, 0, 0],
    },
  ],
}

const chartOptions2 = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1, name: '加载中' },
      ]
    }
  ]
}

export {
  chartOptions,
  chartOptions2,
  baseLine1,
  baseLine2
}