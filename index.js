const photoshop = require('photoshop');
const app = require('photoshop').app;

document
  .getElementById("btnScale")
  .addEventListener("click", scaleLayers);

document
  .getElementById("btnAbScale")
  .addEventListener("click", absoluteScaleLayers);

const sizeInput = document.getElementById("sizeInput");
sizeInput.addEventListener("change", () => {
  localStorage.setItem("size", sizeInput.value);
})
sizeInput.value = localStorage.getItem("size") || sizeInput.value;

function scaleLayers() {
  const activeLayers = app.activeDocument.activeLayers;
  if (!activeLayers.length) {
    app.showAlert("请选择一个图层");
    return
  }
  const size = Number(sizeInput.value)

  if (size === 100) {
    app.showAlert("请选择一个100%以外的比例");
    return
  }

  const toSmartObject = {
    _obj: "newPlacedLayer"
  };

  activeLayers.forEach(layer => layer.selected = false);

  activeLayers.forEach((layer, idx) => {
    layer.selected = true;

    if (layer.kind !== 5) {
      photoshop.action.batchPlay([toSmartObject], { synchronousExecution: true });
    }
    layer = app.activeDocument.activeLayers[0];
    activeLayers[idx] = layer;

    layer.scale(size, size);
    layer.selected = false;
  });

  activeLayers.forEach(layer => layer.selected = true);
}

function absoluteScaleLayers() {
  const doc = app.activeDocument;
  const activeLayers = app.activeDocument.activeLayers;
  if (!activeLayers.length) {
    app.showAlert("请选择一个图层");
    return
  }
  const size = Number(sizeInput.value)

  if (size === 100) {
    app.showAlert("请选择一个100%以外的比例");
    return
  }

  const toSmartObject = {
    _obj: "newPlacedLayer"
  };

  activeLayers.forEach(layer => layer.selected = false);

  activeLayers.forEach((layer, idx) => {
    layer.selected = true;

    if (layer.kind !== 5) {
      photoshop.action.batchPlay([toSmartObject], { synchronousExecution: true });
    }
    layer = app.activeDocument.activeLayers[0];
    activeLayers[idx] = layer;

    scaleSmartObjectLayer(layer, size, doc.resolution);
    layer.selected = false;
  });

  activeLayers.forEach(layer => layer.selected = true);
}


function calculateScaleFactor(
  currentSize,
  targetScale,
  originalSize,
  smartObjectResolution,
  currentResolution
) {
  return (
    (targetScale * originalSize * currentResolution) /
    (currentSize * smartObjectResolution)
  );
}

function scaleSmartObjectLayer(layer, scaleValue, currentRulerUnits) {
  try {
    const bounds = layer.bounds;
    const currentWidth = bounds.right - bounds.left;
    const currentHeight = bounds.bottom - bounds.top;

    const sizeInfo = photoshop.action.batchPlay(
      [
        {
          _obj: "get",
          _target: [
            { _property: "smartObjectMore" },
            { _ref: "layer", _enum: "ordinal", _value: "targetEnum" },
          ],
        },
      ],
      { synchronousExecution: true }
    );

    const size = {
      width: sizeInfo[0].smartObjectMore.size.width,
      height: sizeInfo[0].smartObjectMore.size.height,
      resolution: sizeInfo[0].smartObjectMore.resolution._value
    };

    const smartObjectResolution = size.resolution;

    const newWidth = calculateScaleFactor(
      currentWidth,
      scaleValue,
      size.width,
      smartObjectResolution,
      currentRulerUnits
    );
    const newHeight = calculateScaleFactor(
      currentHeight,
      scaleValue,
      size.height,
      smartObjectResolution,
      currentRulerUnits
    );
    layer.scale(newWidth, newHeight);
  } catch (error) {
    app.showAlert("缩放失败: " + error.message);
  }
}
