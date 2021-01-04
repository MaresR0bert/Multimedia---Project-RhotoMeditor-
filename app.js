"use strict"

let canvasImage = document.getElementById("canvasImage");
let canvasContext = canvasImage.getContext("2d");
let defaultVal = 800;
canvasImage.width = defaultVal;
canvasImage.height = defaultVal;
var x1 = 0;
var y1 = 0;
var x2 = canvasImage.width;
var y2 = canvasImage.height;
var defValWid = canvasImage.width;
var defValHig = canvasImage.height;

var editToggle = true;

document.addEventListener("dragover", e => {
    e.preventDefault();
})
document.addEventListener("drop", e => {
    e.preventDefault();
    let file = e.dataTransfer.files;
    if (file.length > 0) {
        let fileReader = new FileReader();
        fileReader.addEventListener("load", e => {
            let imageVar = document.createElement("img");
            imageVar.src = e.target.result;
            imageVar.addEventListener("load", e => {
                if (imageVar.naturalHeight > defaultVal && imageVar.naturalWidth > defaultVal) {
                    canvasImage.height = defaultVal;
                    canvasImage.width = defaultVal * (imageVar.naturalWidth / imageVar.naturalHeight);
                } else if (imageVar.naturalHeight > defaultVal && imageVar.naturalWidth < defaultVal) {
                    canvasImage.height = defaultVal;
                    canvasImage.width = defaultVal * (imageVar.naturalWidth / imageVar.naturalHeight);
                } else if (imageVar.naturalWidth > defaultVal && imageVar.naturalHeight < defaultVal) {
                    canvasImage.width = defaultVal;
                    canvasImage.height = defaultVal / (imageVar.naturalWidth / imageVar.naturalHeight);
                } else if (imageVar.naturalHeight < defaultVal && imageVar.naturalWidth < defaultVal) {
                    canvasImage.width = imageVar.naturalWidth;
                    canvasImage.height = imageVar.naturalHeight;
                }
                let context = canvasImage.getContext("2d");
                context.drawImage(imageVar, 0, 0, canvasImage.width, canvasImage.height);
            });
        })
        fileReader.readAsDataURL(file[0]);
        editToggle = true;
        x1 = 0;
        y1 = 0;
        x2 = defValWid;
        y2 = defValHig;
    }
});

const fileBrowser = document.getElementById("fileBrowser");
fileBrowser.addEventListener("change", ev => {
    const file = ev.target.files;
    let fileReader = new FileReader();
    fileReader.addEventListener("load", e => {
        let imageVar = document.createElement("img");
        imageVar.src = e.target.result;
        imageVar.addEventListener("load", e => {
            if (imageVar.naturalHeight > defaultVal && imageVar.naturalWidth > defaultVal) {
                canvasImage.height = defaultVal;
                canvasImage.width = canvasImage.height * (imageVar.naturalWidth / imageVar.naturalHeight);
            } else if (imageVar.naturalHeight > defaultVal && imageVar.naturalWidth < defaultVal) {
                canvasImage.height = defaultVal;
                canvasImage.width = canvasImage.height * (imageVar.naturalWidth / imageVar.naturalHeight);
            } else if (imageVar.naturalWidth > defaultVal && imageVar.naturalHeight < defaultVal) {
                canvasImage.width = defaultVal;
                canvasImage.height = canvasImage.width / (imageVar.naturalWidth / imageVar.naturalHeight);
            } else if (imageVar.naturalHeight < defaultVal && imageVar.naturalWidth < defaultVal) {
                canvasImage.width = imageVar.naturalWidth;
                canvasImage.height = imageVar.naturalHeight;
            }
            let context = canvasImage.getContext("2d");
            context.drawImage(imageVar, 0, 0, canvasImage.width, canvasImage.height);
        });
    })
    fileReader.readAsDataURL(file[0]);
    editToggle = true;
    x1 = 0;
    y1 = 0;
    x2 = defValWid;
    y2 = defValHig;
});

let cropToggleButton = document.getElementById("cropButton");
cropToggleButton.addEventListener("click", function (e) {
    if (cropToggle) cropToggle = false;
    else cropToggle = true;
});

let eraseToggleButton = document.getElementById("eraserButton");

let blackandwhteToggleButton = document.getElementById("blackandwhiteButton");

let thresHoldButton = document.getElementById("thresHoldButton");

let sepiaButton = document.getElementById("sepiaButton");

let invertButton = document.getElementById("invertButton");

let lightenButton = document.getElementById("lightenButton");

let darkenButton = document.getElementById("darkenButton");

let pixalationSlider = document.getElementById("pixalationSlider");

canvasImage.addEventListener("mousedown", function (e) {
    let canvasOrigin = canvasImage.getBoundingClientRect();
    x1 = e.x - canvasOrigin.left;
    y1 = e.y - canvasOrigin.top;
    console.log("mousedown values: " + x1 + " " + y1);
});

canvasImage.addEventListener("mouseup", function (e) {
    let canvasOrigin = canvasImage.getBoundingClientRect();
    x2 = e.x - canvasOrigin.left;
    y2 = e.y - canvasOrigin.top;
    console.log("mouseup values: " + x2 + " " + y2);
    console.log("new values: " + x1 + " " + y1 + " " + x2 + " " + y2);

    editToggle = true;

    canvasContext.beginPath();
    canvasContext.rect(x1, y1, x2 - x1, y2 - y1);
    canvasContext.stroke();
});

eraseToggleButton.addEventListener("click", function (e) {
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle) {
        for (let i = 0; i < data.length; i += 4)
            data[i + 3] = 0;
    }

    const visualCanvasContext = canvasImage.getContext("2d");
    let minx = x1 < x2 ? x1 : x2;
    let miny = y1 < y2 ? y1 : y2;
    visualCanvasContext.putImageData(imageData, minx, miny);

    editToggle = false;
});

blackandwhteToggleButton.addEventListener("click", function (e) {
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle) {
        for (let i = 0; i < data.length; i += 4) {
            const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = data[i + 1] = data[i + 2] = average;
        }
    }

    const visualCanvasContext = canvasImage.getContext("2d");
    let minx = x1 < x2 ? x1 : x2;
    let miny = y1 < y2 ? y1 : y2;
    visualCanvasContext.putImageData(imageData, minx, miny);

    editToggle = false;
});

thresHoldButton.addEventListener("click", function (e) {
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle)
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 100) ? 255 : 0;

            data[i] = data[i + 1] = data[i + 2] = v;
        }

    const visualCanvasContext = canvasImage.getContext("2d");
    let minx = x1 < x2 ? x1 : x2;
    let miny = y1 < y2 ? y1 : y2;
    visualCanvasContext.putImageData(imageData, minx, miny);

    editToggle = false;
});

sepiaButton.addEventListener("click", function (e) {
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle)
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            data[i] = (r * .393) + (g * .769) + (b * .189);
            data[i + 1] = (r * .349) + (g * .686) + (b * .168);
            data[i + 2] = (r * .272) + (g * .534) + (b * .131);
        }

    const visualCanvasContext = canvasImage.getContext("2d");
    let minx = x1 < x2 ? x1 : x2;
    let miny = y1 < y2 ? y1 : y2;
    visualCanvasContext.putImageData(imageData, minx, miny);

    editToggle = false;
});

invertButton.addEventListener("click", function (e) {
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle)
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }

    const visualCanvasContext = canvasImage.getContext("2d");
    let minx = x1 < x2 ? x1 : x2;
    let miny = y1 < y2 ? y1 : y2;
    visualCanvasContext.putImageData(imageData, minx, miny);

    editToggle = false;
});

lightenButton.addEventListener('click', function (e) {
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle) {
        const lightenSlider = document.getElementById("lightenSlider");
        let val = lightenSlider.value;
        for (let i = 0; i < data.length; i += 4) {
            data[i] += val;
            data[i + 1] += val;
            data[i + 2] += val;
        }
    }

    const visualCanvasContext = canvasImage.getContext("2d");
    let minx = x1 < x2 ? x1 : x2;
    let miny = y1 < y2 ? y1 : y2;
    visualCanvasContext.putImageData(imageData, minx, miny);

    editToggle = false;
});

darkenButton.addEventListener("click", function (e) {
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle) {
        const darkenSlider = document.getElementById("darkenSlider");
        let val = darkenSlider.value;
        for (let i = 0; i < data.length; i += 4) {
            data[i] -= val;
            data[i + 1] -= val;
            data[i + 2] -= val;
        }
    }

    const visualCanvasContext = canvasImage.getContext("2d");
    let minx = x1 < x2 ? x1 : x2;
    let miny = y1 < y2 ? y1 : y2;
    visualCanvasContext.putImageData(imageData, minx, miny);

    editToggle = false;
});

pixalationSlider.addEventListener("change", function (e) {
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;
    let val = pixalationSlider.value;

    if (editToggle) {
        for (let i = 0; i < imageData.height; i += val) {

            const offsetLiniiAnterioare = i * (imageData.width * 4);

            for (let j = 0; j < imageData.width; j += val) {

                let pij = j * 4 + offsetLiniiAnterioare;

                const r = data[pij]; //red 
                const g = data[pij + 1]; //green
                const b = data[pij + 2]; //blue

                for (let k = 0; k < val; k++)
                    for (let l = 0; l < val; l++) {
                        const kl = (i + k) * (imageData.width * 4) + (j + l) * 4;
                        data[kl] = r;
                        data[kl + 1] = g;
                        data[kl + 2] = b;
                    }
            }
        }
    }

    const visualCanvasContext = canvasImage.getContext("2d");
    let minx = x1 < x2 ? x1 : x2;
    let miny = y1 < y2 ? y1 : y2;
    visualCanvasContext.putImageData(imageData, minx, miny);

    editToggle = false;
})


canvasImage.addEventListener("dblclick", function (e) {
    let redSlider = document.getElementById("redSlider");
    let greenSlider = document.getElementById("greenSlider");
    let blueSlider = document.getElementById("blueSlider");
    let textInput = document.getElementById("textInput");
    let canvasOrigin = canvasImage.getBoundingClientRect();
    let textSizeSlider = document.getElementById("textSizeSlider");

    canvasContext.font = textSizeSlider.value + "px Arial";
    canvasContext.fillStyle = 'rgb(' + redSlider.value + ',' + greenSlider.value + ',' + blueSlider.value + ')';
    canvasContext.fillText(textInput.value, e.x - canvasOrigin.left, e.y - canvasOrigin.top);
})

document.getElementById("btnDownload").addEventListener("click", function (e) {
    const image = canvasImage.toDataURL();
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = image;
    link.click();
})

let redSlider2 = document.getElementById("redSlider");
let greenSlider2 = document.getElementById("greenSlider");
let blueSlider2 = document.getElementById("blueSlider");
let colorShow = document.getElementById("colorShow");
let colorShowContext = colorShow.getContext("2d");

colorShowContext.fillStyle = 'rgb(' + redSlider2.value + ',' + greenSlider2.value + ',' + blueSlider2.value + ')';
colorShowContext.fillRect(0, 0, colorShow.width, colorShow.height);

const colorSlider = document.querySelectorAll('.colorSlider');
for (let i = 0; i < colorSlider.length; i++) {
    colorSlider[i].addEventListener('change', function (e) {
        colorShowContext.fillStyle = 'rgb(' + redSlider2.value + ',' + greenSlider2.value + ',' + blueSlider2.value + ')';
        colorShowContext.fillRect(0, 0, colorShow.width, colorShow.height);
    })
}