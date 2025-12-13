const xSlider = document.getElementById("x-value");
const xDisplay = document.getElementById("x-display");

xDisplay.textContent = xSlider.value;
xSlider.addEventListener("input", () => {
  xDisplay.textContent = xSlider.value;
});

document.getElementById("save").addEventListener("click", () => {
  const data = loadData();

  data.meta = {
    x: document.getElementById("x-name").value,
    y: document.getElementById("y-name").value,
    z: document.getElementById("z-name").value,
    yUnit: document.getElementById("y-unit").value,
    zUnit: document.getElementById("z-unit").value
  };

  data.records.push({
    x: Number(xSlider.value),
    y: Number(document.getElementById("y-value").value),
    z: Number(document.getElementById("z-value").value),
    time: new Date().toISOString()
  });

  saveData(data);
  alert("保存しました");
});
