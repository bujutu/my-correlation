const data = loadData();
const select = document.getElementById("pair-select");

const vars = data.meta.vars;

// セレクト生成
select.innerHTML = `
<option value="x-y">${vars.x.name} × ${vars.y.name}</option>
<option value="x-z">${vars.x.name} × ${vars.z.name}</option>
<option value="y-z">${vars.y.name} × ${vars.z.name}</option>
`;

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

function pearson(x,y){
  const n=x.length;
  const mx=x.reduce((a,b)=>a+b)/n;
  const my=y.reduce((a,b)=>a+b)/n;
  let num=0,dx=0,dy=0;
  for(let i=0;i<n;i++){
    num+=(x[i]-mx)*(y[i]-my);
    dx+=(x[i]-mx)**2;
    dy+=(y[i]-my)**2;
  }
  return num/Math.sqrt(dx*dy);
}

function reliability(r,n){
  if(n<10) return "サンプル不足";
  if(Math.abs(r)>0.7) return "強い相関の可能性";
  if(Math.abs(r)>0.4) return "中程度の相関";
  return "弱い相関";
}

// CSV
document.getElementById("csv").onclick = () => {
  let csv = "x,y,z,time\n";
  data.records.forEach(r=>{
    csv+=`${r.x},${r.y},${r.z},${r.time}\n`;
  });
  const blob = new Blob([csv],{type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "my_correlation.csv";
  a.click();
};

