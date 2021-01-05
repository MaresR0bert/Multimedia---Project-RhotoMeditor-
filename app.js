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

class verticalBar {
    constructor(canvas) {
        this.canvasCanv = canvas;
    }

    draw(array) {
        let contextCanv = this.canvasCanv.getContext("2d");
        contextCanv.fillStyle = "yellow";
        contextCanv.fillRect(0, 0, this.canvasCanv.width, this.canvasCanv.height);
        let maxval = Math.max(...array);
        let rectWidth = this.canvasCanv.width / array.length;

        contextCanv.lineWidth = 6;
        contextCanv.textAlign = "center";

        for (let i = 0; i < array.length; i++) {
            let rectHeight = array[i] * this.canvasCanv.height / maxval * 0.9;
            let rectX = rectWidth * i;
            let rectY = this.canvasCanv.height - rectHeight;
            contextCanv.fillStyle = "red";
            contextCanv.fillRect(rectX, rectY, rectWidth*0.8, rectHeight);
        }
    }
}

function drawHistoOfColors() {

    let canvHisto = document.getElementById('Histogram');
    let verticalBarVar = new verticalBar(canvHisto);

    let imageDataForHisto = canvasContext.getImageData(0, 0, canvasImage.width, canvasImage.height);
    let data = imageDataForHisto.data;
    let array = [];
    for (let i = 0; i < 256; i++) {
        array[i]=0;
    }
    for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        array[Math.round(avg)]++;
    }

    verticalBarVar.draw(array, false);
}

function drawEdits(imageData, x1, y1, x2, y2) {
    const visualCanvasContext = canvasImage.getContext("2d");
    let minx = x1 < x2 ? x1 : x2;
    let miny = y1 < y2 ? y1 : y2;
    visualCanvasContext.putImageData(imageData, minx, miny);

    editToggle = false;
    drawHistoOfColors();
}

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
                drawHistoOfColors();
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
            drawHistoOfColors();
        });
    })
    fileReader.readAsDataURL(file[0]);
    editToggle = true;
    x1 = 0;
    y1 = 0;
    x2 = defValWid;
    y2 = defValHig;
    
});

let performCrop = document.getElementById("cropButton");
let eraseToggleButton = document.getElementById("eraserButton");
let blackandwhteToggleButton = document.getElementById("blackandwhiteButton");
let thresHoldButton = document.getElementById("thresHoldButton");
let sepiaButton = document.getElementById("sepiaButton");
let invertButton = document.getElementById("invertButton");
let lightenButton = document.getElementById("lightenButton");
let darkenButton = document.getElementById("darkenButton");
let sketchButton = document.getElementById("sketchButton");
let rednblue = document.getElementById('rednblue');
let darkRoom = document.getElementById('darkRoom');
let deuteranomaly = document.getElementById('deuteranomaly');
let achromatopsia = document.getElementById('achromatopsia');
let tritanomaly = document.getElementById('tritanomaly');
let highContrast = document.getElementById('highcontrast');
let protanopia = document.getElementById('protanopia');
let blurButton = document.getElementById('blurButton');

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

    // canvasContext.beginPath();
    // canvasContext.rect(x1, y1, x2 - x1, y2 - y1);
    // canvasContext.stroke();
});

performCrop.addEventListener("click", function (e) {
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    let minx = x1 < x2 ? x1 : x2;
    let miny = y1 < y2 ? y1 : y2;
    let maxx = x1 > x2 ? x1 : x2;
    let maxy = y1 > y2 ? y1 : y2;
    canvasImage.width = maxx - minx;
    canvasImage.height = maxy - miny;
    const visualCanvasContext = canvasImage.getContext("2d");
    visualCanvasContext.putImageData(imageData, 0, 0);

    editToggle = false;
    drawHistoOfColors();
})

eraseToggleButton.addEventListener("click", function (e) {
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle) {
        for (let i = 0; i < data.length; i += 4)
            //data[i + 3] = 0;
            data[i] = data[i + 1] = data[i + 2] = 255;
    }
    drawEdits(imageData, x1, y1, x2, y2);
});

blackandwhteToggleButton.addEventListener("click", function (e) {
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle) for (let i = 0; i < data.length; i += 4) data[i] = data[i + 1] = data[i + 2] = (data[i] + data[i + 1] + data[i + 2]) / 3;
    drawEdits(imageData, x1, y1, x2, y2);
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

    drawEdits(imageData, x1, y1, x2, y2);
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

    drawEdits(imageData, x1, y1, x2, y2);
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

    drawEdits(imageData, x1, y1, x2, y2);
});

lightenButton.addEventListener('click', function (e) {
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle) {
        const lightenSlider = document.getElementById("lightenSlider");
        let vallight = parseInt(lightenSlider.value);
        console.log(vallight);
        for (let i = 0; i < data.length; i += 4) {
            data[i] += vallight;
            data[i + 1] += vallight;
            data[i + 2] += vallight;
        }
    }

    drawEdits(imageData, x1, y1, x2, y2);
});

darkenButton.addEventListener("click", function (e) {
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle) {
        const darkenSlider = document.getElementById("darkenSlider");
        let val = parseInt(darkenSlider.value);
        for (let i = 0; i < data.length; i += 4) {
            data[i] -= val;
            data[i + 1] -= val;
            data[i + 2] -= val;
        }
    }

    drawEdits(imageData, x1, y1, x2, y2);
});

sketchButton.addEventListener("click", function (e) {
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle)
        for (let i = 0; i < data.length; i += 4)
            data[i] = data[i + 1] = data[i + 2] = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2] >= 100) ? 255 : 127;

    drawEdits(imageData, x1, y1, x2, y2);
});

rednblue.addEventListener("click", function (e) {
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle) {
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] > data[i + 2]) {
                data[i] = 127;
                data[i + 1] = 0;
                data[i + 2] = 0;
            } else {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 127;
            }
        }
    }

    drawEdits(imageData, x1, y1, x2, y2);
});

darkRoom.addEventListener('click',function(e){
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle) {
        for (let i = 0; i < data.length; i += 4) {
            data[i]-=100;
            data[i+1]=0;
            data[i+2]=0;
        }
    }

    drawEdits(imageData, x1, y1, x2, y2);
});

highContrast.addEventListener('click',function(e){
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle) {
        for (let i = 0; i < data.length; i += 4) {
            if(data[i]>data[i+1] && data[i]>data[i+2]) data[i]=255;
            if(data[i+1]>data[i] && data[i+1]>data[i+2]) data[i+1]=255;
            if(data[i+2]>data[i+1] && data[i]<data[i+2]) data[i+2]=255;
        }
    }

    drawEdits(imageData, x1, y1, x2, y2);
});

deuteranomaly.addEventListener('click', function(e){
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle) {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = (data[i]*.625)+(data[i+1]*.375);
            data[i+1]=(data[i]*.7)+(data[i+1]*.3);
            data[i+2]=(data[i+1]*.7)+(data[i+2]*.3);
        }
    }

    drawEdits(imageData, x1, y1, x2, y2);
});

achromatopsia.addEventListener('click',function(e){
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle) {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = (data[i]*.299)+(data[i+1]*.587)+(data[i+2]*.114);
            data[i+1]=(data[i]*.299)+(data[i+1]*.587)+(data[i+2]*.114);
            data[i+2]=(data[i]*.299)+(data[i+1]*.587)+(data[i+2]*.114);
        }
    }

    drawEdits(imageData, x1, y1, x2, y2);
});

tritanomaly.addEventListener('click',function(e){
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle) {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = (data[i]*.967)+(data[i+1]*.033)+(data[i+2]*0);
            data[i+1]=(data[i]*0)+(data[i+1]*.733)+(data[i+2]*.267);
            data[i+2]=(data[i]*0)+(data[i+1]*.183)+(data[i+2]*.817);
        }
    }

    drawEdits(imageData, x1, y1, x2, y2);
});

protanopia.addEventListener('click',function(e){
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle) {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = (data[i]*.567)+(data[i+1]*.433)+(data[i+2]*0);
            data[i+1]=(data[i]*.558)+(data[i+1]*.442)+(data[i+2]*0);
            data[i+2]=(data[i]*0)+(data[i+1]*.242)+(data[i+2]*.758);
        }
    }

    drawEdits(imageData, x1, y1, x2, y2);
});

blurButton.addEventListener("click", function (e) {
    const imageData = canvasContext.getImageData(x1, y1, x2 - x1, y2 - y1);
    const data = imageData.data;

    if (editToggle) {    
        let blurSlider = document.getElementById('blurSlider');
        let valblur = parseInt(blurSlider.value)
        for (let i = 0; i < data.length; i += valblur) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
    
            for (let j = 0; j < valblur; j += 4) {
                data[i + j] = r;
                data[i + j + 1] = g;
                data[i + j + 2] = b;
            }
        }
    }
    drawEdits(imageData, x1, y1, x2, y2);
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

    const imageData = canvasContext.getImageData(0, 0, canvasImage.width, canvasImage.height);
    const data = imageData.data;

    drawEdits(imageData,0, 0, canvasImage.width, canvasImage.height);
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
