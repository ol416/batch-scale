const photoshop = require('photoshop');
const app = photoshop.app;

document.getElementById("btnScale").addEventListener("click", () => processScaling(false));
document.getElementById("btnAbScale").addEventListener("click", () => processScaling(true));

const sizeInput = document.getElementById("sizeInput");
sizeInput.value = localStorage.getItem("size") || sizeInput.value;
sizeInput.addEventListener("change", () => localStorage.setItem("size", sizeInput.value));

// Slider
const scaleSlider = document.getElementById("scaleSlider");
const sliderValueLabel = document.getElementById("sliderValueLabel");
// Initialize slider value
scaleSlider.value = localStorage.getItem("sliderValue") || 100;
sliderValueLabel.textContent = `${scaleSlider.value}%`;

// Update slider value on slider change
scaleSlider.addEventListener("input", () => {
  localStorage.setItem("sliderValue", scaleSlider.value);
  sliderValueLabel.textContent = `${scaleSlider.value}%`;
});

// Apply scaling on slider release
scaleSlider.addEventListener("change", () => {
  processScalingBySlider(Number(scaleSlider.value));
});

photoshop.action.addNotificationListener(['select'], handleSelectionChange);

function handleSelectionChange() {
  const activeLayers = app.activeDocument.activeLayers;
  const displayElement = document.getElementById('currentScaleDisplay');

  if (!activeLayers.length) {
    displayElement.textContent = '缩放: --%';
    scaleSlider.disabled = true; // Disable slider when no layer is selected
    sliderValueLabel.textContent = `--%`;
    return;
  }

  scaleSlider.disabled = false; // Enable slider when a layer is selected
  const scaleInfo = getCurrentScale(activeLayers[0]);
  displayElement.textContent = scaleInfo ? formatScaleText(scaleInfo) : '缩放: --%';
  if (scaleInfo) {
    const avgScale = ((scaleInfo.scaleX + scaleInfo.scaleY) / 2) * 100;
    if (Math.abs(scaleInfo.scaleX - scaleInfo.scaleY) * 100 <= 0.03) {
        scaleSlider.value = avgScale;
    } else {
        scaleSlider.value = scaleInfo.scaleX * 100;
    }
    localStorage.setItem("sliderValue", scaleSlider.value);
    sliderValueLabel.textContent = `${scaleSlider.value}%`;
  }
}

function processScaling(isAbsolute) {
  const activeLayers = app.activeDocument.activeLayers;
  if (!activeLayers.length) return app.showAlert("请选择一个图层");

  const size = Number(sizeInput.value);
  if (size === 100) return app.showAlert("请选择一个100%以外的比例");

  activeLayers.forEach(layer => {
    if (layer.kind !== 5) {
      photoshop.action.batchPlay([{ _obj: "newPlacedLayer" }], { synchronousExecution: true });
      layer = app.activeDocument.activeLayers[0];
    }
    isAbsolute ? scaleSmartObjectLayer(layer, size, app.activeDocument.resolution) : layer.scale(size, size);
  });
}

// New function to handle scaling from slider
function processScalingBySlider(scaleValue) {
  const activeLayers = app.activeDocument.activeLayers;
  if (!activeLayers.length) return app.showAlert("请选择一个图层");

  if (scaleValue === 100) return app.showAlert("请选择一个100%以外的比例");

  activeLayers.forEach(layer => {
    if (layer.kind !== 5) {
      photoshop.action.batchPlay([{ _obj: "newPlacedLayer" }], { synchronousExecution: true });
      layer = app.activeDocument.activeLayers[0];
    }
    scaleSmartObjectLayer(layer, scaleValue, app.activeDocument.resolution);
  });
}

function scaleSmartObjectLayer(layer, scaleValue, currentResolution) {
  try {
    const bounds = layer.bounds;
    const sizeInfo = photoshop.action.batchPlay([
      { _obj: "get", _target: [{ _property: "smartObjectMore" }, { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }] }
    ], { synchronousExecution: true })[0].smartObjectMore;

    const smartObjectResolution = sizeInfo.resolution._value;
    const newWidth = calculateScaleFactor(bounds.right - bounds.left, scaleValue, sizeInfo.size.width, smartObjectResolution, currentResolution);
    const newHeight = calculateScaleFactor(bounds.bottom - bounds.top, scaleValue, sizeInfo.size.height, smartObjectResolution, currentResolution);

    layer.scale(newWidth, newHeight);
    handleSelectionChange(); // Update the current scale display after scaling
  } catch (error) {
    app.showAlert("缩放失败: " + error.message);
  }
}

function calculateScaleFactor(currentSize, targetScale, originalSize, smartObjectResolution, currentResolution) {
  return (targetScale * originalSize * currentResolution) / (currentSize * smartObjectResolution);
}

function getCurrentScale(layer) {
  if (layer.kind !== 5) return null;

  const bounds = layer.bounds;
  const sizeInfo = photoshop.action.batchPlay([
    { _obj: "get", _target: [{ _property: "smartObjectMore" }, { _ref: "layer", _enum: "ordinal", _value: "targetEnum" }] }
  ], { synchronousExecution: true })[0].smartObjectMore;

  const scaleX = (bounds.right - bounds.left) * sizeInfo.resolution._value / (sizeInfo.size.width * app.activeDocument.resolution);
  const scaleY = (bounds.bottom - bounds.top) * sizeInfo.resolution._value / (sizeInfo.size.height * app.activeDocument.resolution);

  return { scaleX, scaleY };
}

function formatScaleText({ scaleX, scaleY }) {
  const avgScale = ((scaleX + scaleY) / 2) * 100;
  return Math.abs(scaleX - scaleY) * 100 <= 0.03 ? `缩放:${avgScale.toFixed(2)}%` : `缩放:${(scaleX * 100).toFixed(2)}%|${(scaleY * 100).toFixed(2)}%`;
}
