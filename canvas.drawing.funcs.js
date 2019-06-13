'use strict';

let newCanvasWidth;
let newCanvasHeight = parseInt(document.getElementById('canvasHeight').value);
let canvasResolution = parseInt(document.getElementById('canvasResolution').value);

let canvasCols;
let canvasRows;

let outIdx = 0;
let lastStartingOutIdx = 0;

let startTrainingDataDisplayShiftTime = new Date().getTime();

const drawPredictions = (outputs) => {

    noStroke();

    outIdx = 0;
/*
    outIdx = lastStartingOutIdx;

    if (document.getElementById('freezeTrainingInputs').checked) {
        let now = new Date().getTime();
        outIdx = lastStartingOutIdx;
        if ((now - startTrainingDataDisplayShiftTime) > 200) {
            startTrainingDataDisplayShiftTime = new Date().getTime();
            lastStartingOutIdx++;
            if (lastStartingOutIdx >= outputs.length) {
                lastStartingOutIdx = 0;
            }
            outIdx = lastStartingOutIdx;
        }
    } 
*/

    let numShades = shades.length;
    let numSamples = outputs.length / numShades;
    let currSample = 0;
    for (let i = 0; i < canvasCols; i++) {
        for (let j = 0; j < canvasRows; j++) {
            let x1 = i / canvasCols;
            let x2 = j / canvasRows;
            let output = outputs[outIdx].toFixed(2);
            let brightness = floor(outputs[outIdx] * 255);
            fill(brightness);
            rect(i * canvasResolution, j * canvasResolution, canvasResolution, canvasResolution);

            if (canvasResolution >= 20) {
                fill(255-brightness);
                textAlign(CENTER, CENTER);
                if (outIdx >= numShades * (currSample+1)) {
                    currSample++;
                }
                if (canvasResolution >= 50) {
                    text('s'+(outIdx - currSample*numShades) + ' '+output , i * canvasResolution + canvasResolution/2,  j * canvasResolution + canvasResolution/2);
                } else {
                    text('s'+(outIdx - currSample*numShades) , i * canvasResolution + canvasResolution/2,  j * canvasResolution + canvasResolution/2);
                }
            }
            outIdx++;
            if (outIdx >= outputs.length) {
                currSample = 0;
                outIdx = 0;
            }
        }
    }


}
