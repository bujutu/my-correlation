const data = loadData();
const pairSelect = document.getElementById("pair-select");

let lineChart, scatterChart;

function correlation(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a,b)=>a+b)/n;
  const my = ys.reduce((a,b)=>a+b)/n;
  let num = 0, dx = 0, dy = 0;
  for (let i=0;i<n;i++) {
    num += (xs[i]-mx)*(ys[i]-my);
    dx += (xs[i]-mx)**2;
    dy += (ys[i]-my)**2;
  }
  return num / Math.sqrt(dx*dy);
}

function render() {
  const [a, b] = pairSelect.value.split("-");
  const xs = data.records.map(r => r[a]);
  const ys = data.records.map(r => r[b]);

  if (lineChart) lineChart.destroy();
  if (scatterChart) scatterChart.destroy();

  lineChart = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: xs.map((_, i) => i + 1),
      datasets: [
        { label: data.meta[a], data: xs },
        { label: data.meta[b], data: ys }
      ]
    }
  });

  scatterChart = new Chart(document.getElementById("scatterChart"), {
    type: "scatter",
    data: {
      datasets: [{
        label: `${data.meta[a]} × ${data.meta[b]}`,
        data: xs.map((x,i)=>({x, y: ys[i]}))
      }]
    }
  });

  const r = correlation(xs, ys);
  document.getElementById("correlation").textContent =
    `相関係数: ${r.toFixed(3)}`;
}

pairSelect.addEventListener("change", render);
render();
