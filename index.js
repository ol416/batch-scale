const photoshop = require('photoshop');
const app = photoshop.app;

document.getElementById("btnScale").addEventListener("click", () => processScaling(false));
document.getElementById("btnAbScale").addEventListener("click", () => processScaling(true));

// New event listeners for the step buttons
document.getElementById("btnScaleDown").addEventListener("click", () => processStepScaling(-1));
document.getElementById("btnScaleUp").addEventListener("click", () => processStepScaling(1));

const sizeInput = document.getElementById("sizeInput");
sizeInput.value = localStorage.getItem("size") || sizeInput.value;
sizeInput.addEventListener("change", () => localStorage.setItem("size", sizeInput.value));

const stepInput = document.getElementById("stepInput");
stepInput.value = localStorage.getItem("step") || stepInput.value;
stepInput.addEventListener("change", () => localStorage.setItem("step", stepInput.value));

photoshop.action.addNotificationListener(['select'], handleSelectionChange);

function handleSelectionChange() {
  const activeLayers = app.activeDocument.activeLayers;
  const displayElement = document.getElementById('currentScaleDisplay');
  
  if (!activeLayers.length) {
    displayElement.textContent = '缩放: --%';
    return;
  }

  // Calculate and display the average scale of all selected layers
  const avgScaleInfo = getAverageScale(activeLayers);
  displayElement.textContent = avgScaleInfo ? formatScaleText(avgScaleInfo) : '缩放: --%';
}

// Helper function to select a layer by its ID
async function selectLayerById(layerId) {
  await photoshop.action.batchPlay([
    {
      _obj: "select",
      _target: [
        {
          _ref: "layer",
          _id: layerId
        }
      ],
      makeVisible: false,
      layerID: [layerId]
    }
  ], { synchronousExecution: true });
}

async function processScaling(isAbsolute) {
  const activeLayers = app.activeDocument.activeLayers;
  if (!activeLayers.length) return app.showAlert("请选择一个图层");

  const size = Number(sizeInput.value);
  if (size === 100) return app.showAlert("请选择一个100%以外的比例");

  for (const layer of activeLayers) {
    await selectLayerById(layer._id);
    let currentLayer = app.activeDocument.activeLayers[0];
    if (currentLayer.kind !== 5) {
      photoshop.action.batchPlay([{ _obj: "newPlacedLayer" }], { synchronousExecution: true });
      currentLayer = app.activeDocument.activeLayers[0];
    }
    if (isAbsolute) {
        scaleSmartObjectLayer(currentLayer, size, app.activeDocument.resolution);
    } else {
        currentLayer.scale(size, size);
    }
  }
  // Update the display after scaling all layers
  const displayElement = document.getElementById('currentScaleDisplay');
  const avgScaleInfo = getAverageScale(activeLayers);
  displayElement.textContent = avgScaleInfo ? formatScaleText(avgScaleInfo) : '缩放: --%';
}

// New function for step scaling
async function processStepScaling(direction) {
    const activeLayers = app.activeDocument.activeLayers;
    if (!activeLayers.length) return app.showAlert("请选择一个图层");

    const step = Number(stepInput.value);
    if (isNaN(step)) return app.showAlert("请输入有效的步进值");

    for (const layer of activeLayers) {
        await selectLayerById(layer._id);
        let currentLayer = app.activeDocument.activeLayers[0];
        if (currentLayer.kind !== 5) {
            photoshop.action.batchPlay([{ _obj: "newPlacedLayer" }], { synchronousExecution: true });
            currentLayer = app.activeDocument.activeLayers[0];
        }
        const currentScale = getCurrentScale(currentLayer);
        if (!currentScale) return;
        const currentAvgScale = (currentScale.scaleX + currentScale.scaleY) / 2;
        const newScale = (currentAvgScale * 100) + (step * direction);
        scaleSmartObjectLayer(currentLayer, newScale, app.activeDocument.resolution);
    }
    // Update the display after scaling all layers
    const displayElement = document.getElementById('currentScaleDisplay');
    const avgScaleInfo = getAverageScale(activeLayers);
    displayElement.textContent = avgScaleInfo ? formatScaleText(avgScaleInfo) : '缩放: --%';
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

function getAverageScale(layers) {
  if (!layers || layers.length === 0) return null;

  let totalScaleX = 0;
  let totalScaleY = 0;
  let validLayerCount = 0;

  for (const layer of layers) {
    const scaleInfo = getCurrentScale(layer);
    if (scaleInfo) {
      totalScaleX += scaleInfo.scaleX;
      totalScaleY += scaleInfo.scaleY;
      validLayerCount++;
    }
  }

  if (validLayerCount === 0) return null;

  return {
    scaleX: totalScaleX / validLayerCount,
    scaleY: totalScaleY / validLayerCount,
  };
}
