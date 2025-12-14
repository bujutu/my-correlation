const data = loadData();

const defaults = {
  x: { name: "気分", unit: "" },
  y: { name: "睡眠時間", unit: "時間" },
  z: { name: "アルコール摂取量", unit: "杯" }
};

data.meta.vars ||= defaults;
saveData(data);

// 初期表示
["x","y","z"].forEach(v => {
  document.getElementById(`name-${v}`).value = data.meta.vars[v].name;
  document.getElementById(`label-${v}`).textContent = data.meta.vars[v].name;
  if (v !== "x") document.getElementById(`${v}-unit`).value = data.meta.vars[v].unit;
});

// スライダー
const slider = document.getElementById("x-value");
const display = document.getElementById("x-display");
display.textContent = slider.value;
slider.oninput = () => display.textContent = slider.value;

// 変数名保存
function saveVarName(v) {
  const name = document.getElementById(`name-${v}`).value;
  data.meta.vars[v].name = name;
  document.getElementById(`label-${v}`).textContent = name;
  saveData(data);
  alert("保存しました");
}

// レコード保存
document.getElementById("save-record").onclick = () => {
  data.meta.vars.y.unit = document.getElementById("y-unit").value;
  data.meta.vars.z.unit = document.getElementById("z-unit").value;

  data.records.push({
    x: Number(slider.value),
    y: Number(document.getElementById("y-value").value),
    z: Number(document.getElementById("z-value").value),
    time: new Date().toISOString()
  });

  saveData(data);
  celebrate();
};

// 盛大に祝う
function celebrate() {
  const confetti = document.createElement("div");
  confetti.className = "celebrate";
  confetti.innerHTML = "\\\||///<br>完璧だ！<br>///||\\\";
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 2000);
}
