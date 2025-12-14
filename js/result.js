const data = loadData();

if (!data.records || data.records.length === 0) {
  document.querySelector("main").innerHTML =
    "<p>まだデータがありません。入力ページから記録してください。</p>";
  throw new Error("No data");
}

const vars = data.meta.vars;
const select = document.getElementById("pair-select");

let lineChart = null;
let scatterChart = null;

// セレクト生成
select.innerHTML = `
<option value="x-y">${vars.x.name} × ${vars.y.name}</option>
<option value="x-z">${vars.x.name} × ${vars.z.name}</option>
<option value="y-z">${vars.y.name} × ${vars.z.name}</option>
`;

// 相関係数
function pearson(xs, ys) {
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

function correlationReliability(r,n){
  if(n<10) return "サンプル不足";
  if(Math.abs(r)>0.7) return "強い相関の可能性";
  if(Math.abs(r)>0.4) return "中程度の相関";
  return "弱い相関";
}


/* =========================
   グラフ描画
========================= */
function render() {
  const [a, b] = select.value.split("-");

  const xs = data.records.map(r => r[a]);
  const ys = data.records.map(r => r[b]);
  const labels = data.records.map((_, i) => i + 1);

  const aLabel = `${vars[a].name}${vars[a].unit ? "（" + vars[a].unit + "）" : ""}`;
  const bLabel = `${vars[b].name}${vars[b].unit ? "（" + vars[b].unit + "）" : ""}`;

  if (lineChart) lineChart.destroy();
  if (scatterChart) scatterChart.destroy();

  /* 折れ線グラフ */
  lineChart = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: aLabel,
          data: xs,
          yAxisID: "y1"
        },
        {
          label: bLabel,
          data: ys,
          yAxisID: "y2"
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y1: {
          type: "linear",
          position: "left",
          title: {
            display: true,
            text: aLabel
          }
        },
        y2: {
          type: "linear",
          position: "right",
          grid: { drawOnChartArea: false },
          title: {
            display: true,
            text: bLabel
          }
        }
      }
    }
  });

  /* 散布図 */
  scatterChart = new Chart(document.getElementById("scatterChart"), {
    type: "scatter",
    data: {
      datasets: [{
        label: `${vars[a].name} × ${vars[b].name}`,
        data: xs.map((x, i) => ({ x, y: ys[i] }))
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: aLabel
          }
        },
        y: {
          title: {
            display: true,
            text: bLabel
          }
        }
      }
    }
  });

  /* 相関表示 */
  const r = pearson(xs, ys);
  document.getElementById("correlation-value").textContent =
    `相関係数 r = ${r.toFixed(3)}`;
  document.getElementById("correlation-reliability").textContent =
    correlationReliability(r, xs.length);
}


// CSV
document.getElementById("csv-export").addEventListener("click", () => {
  let csv = `time,${vars.x.name},${vars.y.name},${vars.z.name}\n`;
  data.records.forEach(r => {
    csv += `${r.time},${r.x},${r.y},${r.z}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "my_correlation.csv";
  a.click();

  URL.revokeObjectURL(url);
});

select.addEventListener("change", render);
render();
