'use stricti';

let canvas;

function preload() {
    preloadData();
}

function setup() {
    canvas = createCanvas(400, 400);
    canvas.parent('canvasParent');

    resizeTheCanvas();
/*
    newCanvasWidth = document.getElementById('canvasParent').clientWidth;
    tempCanvasHeight = canvasResolution * shades.length; 
    if (newCanvasHeight / 2 > tempCanvasHeight) {
        newCanvaseHeight = tempCanvasHeight * 2;
    }
    document.getElementById('canvasHeight').value = newCanvasHeight;
    resizeCanvas(newCanvasWidth, newCanvasHeight);
*/
    //backgroundColorGenerator();
}


const resizeTheCanvas = () => {

    newCanvasWidth = document.getElementById('canvasParent').clientWidth;
    tempCanvasHeight = canvasResolution * shades.length; 
    if (newCanvasHeight / 2 > tempCanvasHeight) {
        newCanvaseHeight = tempCanvasHeight * 2;
    }
    document.getElementById('canvasHeight').value = newCanvasHeight;
    resizeCanvas(newCanvasWidth, newCanvasHeight);
/*
    tempCanvasHeight = canvasResolution * shades.length; 
    if (newCanvasHeight / 2 > tempCanvasHeight) {
        newCanvaseHeight = tempCanvasHeight * 2;
    }
    document.getElementById('canvasHeight').value = newCanvasHeight;
    resizeCanvas(newCanvasWidth, newCanvasHeight);
*/
}

function draw() {


    try {

        resizeTheCanvas();
/*
        tempCanvasHeight = canvasResolution * shades.length; 
        if (newCanvasHeight / 2 > tempCanvasHeight) {
            newCanvaseHeight = tempCanvasHeight * 2;
        }
        document.getElementById('canvasHeight').value = newCanvasHeight;
        resizeCanvas(newCanvasWidth, newCanvasHeight);
*/
        canvasCols = floor(newCanvasWidth / canvasResolution);
        canvasRows =  newCanvasHeight / canvasResolution;

        background(0);

        if (guessingMode) {
            background(red, green, blue);
        }

        if (thereExistsNetwork && !guessingMode) {
            showTrainingResults();
        }

        //console.log('Tensors: ' + tf.memory().numTensors);

    } catch (error) {
        console.log(error);
        showMessages('danger',error);
    }


}