'use strict';

let guessingMode = false;

let userChoice;
let red;
let green;
let blue;

const backgroundColorGenerator = () => {
    generateRandomColor();
    background(red,green,blue);
}

const generateRandomColor = () => {
    red = floor(random(255));
    green = floor(random(255));
    blue = floor(random(255));
}

const highestValueOutputIdx = (outputs) => {

    let idx = 0;
    let high = 0;
    for (let i=0; i<outputs.length; i++) {
        if (high < outputs[i]) { high = outputs[i]; idx = i; }
    }
    return idx;
}

let totalGuesses = 0;
let correctGuesses = 0;
const guessColor = (shade, red, green, blue) => {

    if (!thereExistsNetwork) {
        showMessages('danger','There Is No Network');
        guessingMode = false;
        return;
    }

    let color = [[red, green, blue]];
    let tfColor = tf.tensor2d(color);
    let outputs = tfModel.predict(tfColor).dataSync();
    let prediction = shades[highestValueOutputIdx(outputs)];
    //console.log('You picked ' + shade + ', I guessed ' + prediction);
    let alertBgColor;
    totalGuesses++;
    if (shade === prediction) {
        alertBgColor = 'alert-success';
        correctGuesses++;
    } else {
        alertBgColor = 'alert-danger';
    }
    let html = '<span><font size="+1">'
            + 'You: ' + shade + '<br/>'
            + 'Me:&nbsp ' + prediction + '<br/>'
            + 'Correct: ' + correctGuesses + '<br/>'
            + 'Total:&nbsp ' + totalGuesses + '<br/>'
            + 'Percent: ' + ((correctGuesses/totalGuesses)*100).toFixed(1) + '<br/>'
            + '</font></span>';
    document.getElementById('guessingInnerStats').className = alertBgColor;
    document.getElementById('guessingInnerStats').innerHTML = html;

}