"use strict"

let canvasImage = document.getElementById("canvasImage");
let canvasContext = canvasImage.getContext("2d");
let defaultVal=800;
canvasImage.width = defaultVal;
canvasImage.height = defaultVal;
var x1 = 0;
var y1 = 0;
var dummySwitch = false;
var cropToggle = false;
var eraseToggle = false;
var blackandwhteToggle = false;
var thresHoldToggle = false;
var speiaToggle = false;
var invertToggle = false;
var lightenToggle = false;
var darkenToggle = false;
let buttonDefaultColor = "indigo"
let buttonPressedDefaultColor = "darkred"

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
                if(imageVar.naturalHeight>defaultVal && imageVar.naturalWidth>defaultVal){
                    canvasImage.height=defaultVal;
                    canvasImage.width = defaultVal*(imageVar.naturalWidth/imageVar.naturalHeight);
                }else if(imageVar.naturalHeight > defaultVal && imageVar.naturalWidth < defaultVal){
                    canvasImage.height=defaultVal;
                    canvasImage.width = defaultVal*(imageVar.naturalWidth/imageVar.naturalHeight);
                }else if(imageVar.naturalWidth>defaultVal && imageVar.naturalHeight<defaultVal){
                    canvasImage.width=defaultVal;
                    canvasImage.height = defaultVal/(imageVar.naturalWidth/imageVar.naturalHeight);
                }else if(imageVar.naturalHeight<defaultVal && imageVar.naturalWidth<defaultVal){
                    canvasImage.width=imageVar.naturalWidth;
                    canvasImage.height=imageVar.naturalHeight;
                }
                let context = canvasImage.getContext("2d");
                context.drawImage(imageVar, 0, 0, canvasImage.width, canvasImage.height);
                dummySwitch = true;
            });
        })
        fileReader.readAsDataURL(file[0]);
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
            if(imageVar.naturalHeight>defaultVal && imageVar.naturalWidth>defaultVal){
                canvasImage.height=defaultVal;
                canvasImage.width = canvasImage.height*(imageVar.naturalWidth/imageVar.naturalHeight);
            }else if(imageVar.naturalHeight > defaultVal && imageVar.naturalWidth < defaultVal){
                canvasImage.height=defaultVal;
                canvasImage.width = canvasImage.height*(imageVar.naturalWidth/imageVar.naturalHeight);
            }else if(imageVar.naturalWidth>defaultVal && imageVar.naturalHeight<defaultVal){
                canvasImage.width=defaultVal;
                canvasImage.height = canvasImage.width/(imageVar.naturalWidth/imageVar.naturalHeight);
            }else if(imageVar.naturalHeight<defaultVal && imageVar.naturalWidth<defaultVal){
                canvasImage.width=imageVar.naturalWidth;
                canvasImage.height=imageVar.naturalHeight;
            }
            let context = canvasImage.getContext("2d");
            context.drawImage(imageVar, 0, 0, canvasImage.width, canvasImage.height);
            dummySwitch = true;
        });
    })
    fileReader.readAsDataURL(file[0]);
});

const efxButtons = document.querySelectorAll('.efxButton');
for(let j = 0; j<efxButtons.length; j++){
    efxButtons[j].addEventListener('click',function(e){
        if(this.style.background === buttonPressedDefaultColor) this.style.background=buttonDefaultColor;
        else this.style.background = buttonPressedDefaultColor;
    })
}

let cropToggleButton = document.getElementById("cropButton");
cropToggleButton.addEventListener("click",function(e){
    if(cropToggle) cropToggle = false;
    else cropToggle = true;
});

let eraseToggleButton = document.getElementById("eraserButton");
eraseToggleButton.addEventListener("click",function(e){
    if(eraseToggle) eraseToggle = false;
    else eraseToggle = true;
})

let blackandwhteToggleButton = document.getElementById("blackandwhiteButton");
blackandwhteToggleButton.addEventListener("click", function(e){
    if(blackandwhteToggle) blackandwhteToggle = false;
    else blackandwhteToggle = true;
})
let thresHoldButton = document.getElementById("thresHoldButton");
thresHoldButton.addEventListener("click", function(e){
    if(thresHoldToggle) thresHoldToggle = false;
    else thresHoldToggle = true;
})
let sepiaButton = document.getElementById("sepiaButton");
sepiaButton.addEventListener("click", function(e){
    if(speiaToggle) speiaToggle = false;
    else speiaToggle = true;
})
let invertButton = document.getElementById("invertButton");
invertButton.addEventListener("click", function(e){
    if(invertToggle) invertToggle = false;
    else invertToggle = true;
})
let lightenButton = document.getElementById("lightenButton");
lightenButton.addEventListener("click", function(e){
    if(lightenToggle) lightenToggle = false;
    else lightenToggle = true;
})
let darkenButton = document.getElementById("darkenButton");
darkenButton.addEventListener("click", function(e){
    if(darkenToggle) darkenToggle = false;
    else darkenToggle = true;
})

canvasImage.addEventListener("mousedown", function (e) {
    let canvasOrigin = canvasImage.getBoundingClientRect();
    x1 = e.x - canvasOrigin.left;
    y1 = e.y - canvasOrigin.top;
    console.log("mousedown values: "+x1+" "+y1);
});

canvasImage.addEventListener("mouseup", function (e) {
    let canvasOrigin = canvasImage.getBoundingClientRect();
    var x2 = e.x - canvasOrigin.left;
    var y2 = e.y - canvasOrigin.top;
    console.log("mouseup values: "+x2+" "+y2);
    console.log("new values: "+x1+" "+y1+" "+x2+" "+y2);
    
    const imageData = canvasContext.getImageData(x1,y1,x2-x1,y2-y1);
    const data = imageData.data;

    if(eraseToggle){
        for(let i = 0; i<data.length; i+=4)
            data[i+3]=0;  
        eraseToggleButton.click();
    }
    else if(blackandwhteToggle){

        for(let i = 0; i<data.length; i+=4){
            const average = (data[i]+data[i+1]+data[i+2])/3;
            data[i]=data[i+1]=data[i+2]=average;
        }
        blackandwhteToggleButton.click();
    }
    else if(thresHoldToggle){
        for(let i = 0; i<data.length; i+=4){
            const r=data[i];
            const g=data[i+1];
            const b=data[i+2];
            const v = (0.2126*r + 0.7152*g + 0.0722*b >= 100) ? 255 : 0;
             
            data[i]=data[i+1]=data[i+2]=v;
        }
        thresHoldButton.click();
    }
    else if(speiaToggle){
        for(let i = 0; i<data.length; i+=4){
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
    
            data[i] = (r * .393) + (g *.769) + (b * .189);
            data[i + 1] = (r * .349) + (g *.686) + (b * .168);
            data[i + 2] = (r * .272) + (g *.534) + (b * .131);
        }
        sepiaButton.click();
    }
    else if(invertToggle){
        for(let i = 0; i<data.length; i+=4){
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
    
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
        invertButton.click();
    }
    else if(lightenToggle){
        const lightenSlider = document.getElementById("lightenSlider");
        let val = lightenSlider.value;
        for(let i = 0; i<data.length; i+=4){
            data[i] += val;
            data[i + 1] += val;
            data[i + 2] += val;
        }
        lightenButton.click();
    }
    else if(darkenToggle){
        const darkenSlider = document.getElementById("darkenSlider");
        let val = darkenSlider.value;
        for(let i = 0; i<data.length; i+=4){
            data[i] -= val;
            data[i + 1] -= val;
            data[i + 2] -= val;
        }
        darkenButton.click();
    }

    const visualCanvasContext = canvasImage.getContext("2d");
    let minx = x1<x2? x1:x2;
    let miny = y1<y2? y1:y2;
    visualCanvasContext.putImageData(imageData,minx,miny);
});

canvasImage.addEventListener("dblclick",function(e){
    let redSlider = document.getElementById("redSlider");
    let greenSlider = document.getElementById("greenSlider");
    let blueSlider = document.getElementById("blueSlider");
    let textInput = document.getElementById("textInput");
    let canvasOrigin = canvasImage.getBoundingClientRect();
    let textSizeSlider = document.getElementById("textSizeSlider");

    canvasContext.font = textSizeSlider.value + "px Arial";
    canvasContext.fillStyle = 'rgb('+redSlider.value +','+greenSlider.value+','+blueSlider.value+')';
    canvasContext.fillText(textInput.value,e.x-canvasOrigin.left,e.y-canvasOrigin.top);
})

document.getElementById("btnDownload").addEventListener("click", function(e){
    const image = canvasImage.toDataURL();
    const link = document.createElement('a');
    link.download='image.png';
    link.href = image;
    link.click();
})

let redSlider2 = document.getElementById("redSlider");
let greenSlider2 = document.getElementById("greenSlider");
let blueSlider2 = document.getElementById("blueSlider");
let colorShow = document.getElementById("colorShow");
let colorShowContext = colorShow.getContext("2d");

colorShowContext.fillStyle = 'rgb('+redSlider2.value +','+greenSlider2.value+','+blueSlider2.value+')';
colorShowContext.fillRect(0,0,colorShow.width,colorShow.height);

const colorSlider = document.querySelectorAll('.colorSlider');
for(let i=0; i<colorSlider.length;i++){
    colorSlider[i].addEventListener('change', function(e){
        colorShowContext.fillStyle = 'rgb('+redSlider2.value +','+greenSlider2.value+','+blueSlider2.value+')';
        colorShowContext.fillRect(0,0,colorShow.width,colorShow.height);
    })
}