'use strict';

const doSubmitSelectedColor = (button) => {

    let value = button.innerHTML;

    if (value === undefined || value === '') {
        return;
    }

    saveColor(value, red, green, blue);

    guessColor(value, red, green, blue);
}

const doStartGuessingColor = () => {
    guessingMode = true;
    trainTheNetwork = false;
    totalGuesses = 0;
    correctGuesses = 0;
    document.getElementById('trainNetwork').innerHTML = 'Train Network';
    document.getElementById('trainNetwork').className = 'btn btn-primary';
    document.getElementById('canvasParent').className = 'col col-xs-6';
    //document.getElementById('guessingStats').className = 'col col-xs-6';
    document.getElementById('guessingStats').style.display = 'block';
    backgroundColorGenerator();
}

const doWriteColorDataToFile = () => {

   writeColorDataToFile();

}

const doChangeCanvasWidth = () => {
    networkTrained = false;
    trainTheNetwork = true;
    clearMessages();
    newCanvasWidth = document.getElementById('canvasParent').clientWidth;
    //newCanvasHeight = parseInt(document.getElementById('canvasHeight').value);
    //resizeCanvas(newCanvasWidth, newCanvasHeight);
}

const doChangeCanvasHeight = (input) => {
    networkTrained = false;
    trainTheNetwork = true;
    clearMessages();
    //newCanvasWidth = document.getElementById('canvasParent').clientWidth;
    newCanvasHeight = input.value;
    //resizeCanvas(newCanvasWidth, newCanvasHeight);
}

//canvasResolution = document.getElementById('canvasResolution');
const doChangeCanvasResolution = (input) => {
    if (isNaN(input.value)) {
        showMessages('danger','Need Number As Canvas Resolution');
        return;
    }

    if (input.value < 5) {
        showMessages('danger','Canvas Resolution Is Too Small');
        return;
    }
    networkTrained = false;
    trainTheNetwork = true;
    clearMessages();
    canvasResolution = parseInt(input.value);
    //assemblePredictionInputs();
}


const doCreateNetwork = () => {

    guessingMode = false;
    document.getElementById('canvasParent').className = 'col col-xs-12';
    document.getElementById('guessingStats').style.display = 'none';
    thereExistsNetwork = false;

    networkTrained = false;
    trainTheNetwork = false;
    document.getElementById('trainNetwork').innerHTML = 'Train Network';
    document.getElementById('trainNetwork').className = 'btn btn-primary';

    clearMessages();

    try {
        let numHidden = parseInt(document.getElementById('nnNumHidden').value);
        let activationHidden = document.getElementById('activationHidden').value;
        let activationOutputs = document.getElementById('activationOutputs').value;
        let optimizer = document.getElementById('optimizer').value;
        let loss = document.getElementById('loss').value;
        let numEpoch = parseInt(document.getElementById('nnNumEpoch').value);
        let lossGoal = parseFloat(document.getElementById('nnLossGoal').value);
        createNeuralNetwork(numHidden, activationHidden, activationOutputs, optimizer, loss, numEpoch, lossGoal);

        thereExistsNetwork = true;


    } catch (error) {
        console.log(error);
        showMessages('danger', error);
    }
}

const doTrainNetwork = (button) => {

    trainTheNetwork = trainTheNetwork?false:true;
    if (trainTheNetwork) {
        button.className = 'btn btn-warning';
        button.innerHTML = 'Stop';
    } else {
        button.className = 'btn btn-primary';
        button.innerHTML = 'Train Network';
    }

    networkTrained = false;
    startNetworTrainTime = new Date().getTime();
    clearMessages();
    for (let i=0; i<shades.length; i++) {
        document.getElementById(shades[i]).className = 'btn btn-default';
        shadesThatAreTrained[i] = false;
    }

    trainTheModel();
}

const doChangeLearningRate = (slider) => {
    networkTrained = false;
    trainTheNetwork = false;
    clearMessages();
    learningRate = slider.value;
    document.getElementById('learningRate').innerHTML = learningRate;
}

