const photoshop = require('photoshop');
const app = photoshop.app;

document.getElementById("btnScale").addEventListener("click", () => processScaling(false));
document.getElementById("btnAbScale").addEventListener("click", () => processScaling(true));

const sizeInput = document.getElementById("sizeInput");
sizeInput.value = localStorage.getItem("size") || sizeInput.value;
sizeInput.addEventListener("change", () => localStorage.setItem("size", sizeInput.value));

photoshop.action.addNotificationListener(['select'], handleSelectionChange);

function handleSelectionChange() {
  const activeLayers = app.activeDocument.activeLayers;
  const displayElement = document.getElementById('currentScaleDisplay');
  
  if (!activeLayers.length) {
    displayElement.textContent = '缩放: --%';
    return;
  }

  const scaleInfo = getCurrentScale(activeLayers[0]);
  displayElement.textContent = scaleInfo ? formatScaleText(scaleInfo) : '缩放: --%';
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
