export function initLandingCharts() {
  if (typeof Chart === "undefined") return;

  var font = "'Noto Sans TC', sans-serif";
  var rootStyles = getComputedStyle(document.documentElement);
  function token(name) {
    return rootStyles.getPropertyValue(name).trim();
  }

  Chart.defaults.font.family = font;
  Chart.defaults.font.size = 12;
  Chart.defaults.color = token("--color-text-800");

  new Chart(document.getElementById("chartBar"), {
    type: "bar",
    data: {
      labels: [
        "威尼斯雙人",
        "夏慕尼四人",
        "義大利三人",
        "保留房二人",
        "保留房四人",
      ],
      datasets: [
        {
          label: "今日可住",
          data: [10, 7, 12, 6, 3],
          backgroundColor: token("--color-chart-blue"),
          borderRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: token("--color-text-700"),
          callbacks: { label: (ctx) => "可住 " + ctx.parsed.y + " 間" },
        },
      },
      scales: {
        x: {
          ticks: { color: token("--color-text-800"), font: { size: 11 } },
          grid: { display: false },
          border: { display: false },
        },
        y: {
          min: 0,
          ticks: { color: token("--color-text-800"), stepSize: 5 },
          grid: { color: token("--color-border-default") },
          border: { display: false },
        },
      },
    },
  });

  new Chart(document.getElementById("chartLine"), {
    type: "line",
    data: {
      labels: ["12/21", "12/25", "12/29", "1/2", "1/5", "1/9", "1/15"],
      datasets: [
        {
          label: "訂單數",
          data: [45, 62, 55, 70, 48, 65, 58],
          borderColor: token("--color-chart-purple-red"),
          backgroundColor: token("--effect-chart-purple-red-soft"),
          borderWidth: 2,
          pointBackgroundColor: token("--color-chart-purple-red"),
          pointRadius: 3,
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: token("--color-text-700") },
      },
      scales: {
        x: {
          ticks: { color: token("--color-text-800"), font: { size: 11 } },
          grid: { display: false },
          border: { display: false },
        },
        y: {
          ticks: { color: token("--color-text-800") },
          grid: { color: token("--color-border-default") },
          border: { display: false },
        },
      },
    },
  });

  new Chart(document.getElementById("chartDiverging"), {
    type: "bar",
    data: {
      labels: [
        "威尼斯雙人",
        "夏慕尼四人",
        "義大利三人",
        "保留房二人",
        "保留房四人",
      ],
      datasets: [
        {
          label: "當日庫存",
          data: [10, 7, 12, 6, 3],
          backgroundColor: token("--color-text-400"),
          borderRadius: 2,
        },
        {
          label: "已賣出",
          data: [-10, null, -8, -5, null],
          backgroundColor: token("--color-surface-status-positive"),
          borderRadius: 2,
        },
        {
          label: "已超賣",
          data: [null, -9, null, null, null],
          backgroundColor: token("--color-surface-status-negative"),
          borderRadius: 2,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: token("--color-text-700"),
          displayColors: false,
          callbacks: {
            title: function (items) {
              return items[0].dataset.label === "已超賣"
                ? "超賣"
                : items[0].dataset.label;
            },
            label: function (ctx) {
              return Math.abs(ctx.parsed.x) + " 間";
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          reverse: true,
          min: -10,
          max: 15,
          ticks: {
            color: token("--color-text-800"),
            stepSize: 5,
            callback: function (value) {
              return value;
            },
          },
          grid: {
            color: function (ctx) {
              return ctx.tick && ctx.tick.value === 0
                ? token("--color-text-300")
                : token("--color-border-default");
            },
            lineWidth: function (ctx) {
              return ctx.tick && ctx.tick.value === 0 ? 1.5 : 1;
            },
          },
          border: { display: false },
        },
        y: {
          stacked: true,
          ticks: { color: token("--color-text-800"), font: { size: 11 } },
          grid: { display: false },
          border: { display: false },
        },
      },
    },
  });

  new Chart(document.getElementById("chartDoughnut"), {
    type: "doughnut",
    data: {
      labels: ["OTA", "官網", "電話/現場"],
      datasets: [
        {
          data: [302, 138, 110],
          backgroundColor: [
            token("--color-radio-default"),
            token("--color-accent-green"),
            token("--color-text-300"),
          ],
          hoverBackgroundColor: [
            token("--color-radio-hover"),
            token("--color-accent-green"),
            token("--color-text-400"),
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: token("--color-text-700"),
          displayColors: false,
          callbacks: {
            label: function (ctx) {
              return ctx.label + "：" + ctx.raw + " 筆";
            },
          },
        },
      },
    },
  });
}
