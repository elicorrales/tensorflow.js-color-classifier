'use strict';

let colorDatabase = {};
let colorRGBs;
let colorLabels;
let tfRGBs;
let tfLabels;
let shades = [];
let shadesThatAreTrained = [];
shades.push('Reddish');
shadesThatAreTrained.push(false);
shades.push('Pinkish');
shadesThatAreTrained.push(false);
shades.push('Greenish');
shadesThatAreTrained.push(false);
shades.push('Blueish');
shadesThatAreTrained.push(false);
shades.push('Yellowish');
shadesThatAreTrained.push(false);
shades.push('Orangish');
shadesThatAreTrained.push(false);
shades.push('Purpleish');
shadesThatAreTrained.push(false);
shades.push('Brownish');
shadesThatAreTrained.push(false);
shades.push('Grayish');
shadesThatAreTrained.push(false);

const preloadData = () => {

    colorDatabase = loadJSON('data/color.database.json',
        (result) => {
            //console.log(result);
            convertDatabaseIntoSeparateRgbAndLabelArrays();
            convertColorDatabaseArraysIntoTensors();
        },
        (error) => {
            console.log(error);
        }
    );
}


const normalizeInputsFromRgbValuesToZeroToOne = (inputs) => {

    let normalized = []
    inputs.forEach((input, i) => {
        normalized[i] = map(input,0,255,0,1);
    })

    return normalized;
}

const convertDatabaseIntoSeparateRgbAndLabelArrays = () => {

    colorRGBs = [];
    colorLabels = [];

    for (let key in colorDatabase) { //for each category....  ('birds','cats'...)
        if (!colorDatabase.hasOwnProperty(key)) {
            throw 'there was an error attempting to create training/testing data arrays ';
        }
        let colorData = colorDatabase[key];
        colorRGBs.push(normalizeInputsFromRgbValuesToZeroToOne(colorData.inputs));
        colorLabels.push(colorData.outputs);
    }
}

const convertColorDatabaseArraysIntoTensors = () => {

    if (tfRGBs != undefined) {
        try {
            tfRGBs.dispose();
            tfLabels.dispose();
        } catch (error) {}
    }

    tfRGBs = tf.tensor2d(colorRGBs);
    tfLabels = tf.tensor2d(colorLabels);

    //tfRGBs.print();
    //tfLabels.print();
}




const saveColor = (label, red, green, blue) => {

    let key = shades.indexOf(label)+label+red+green+blue;

    let outputs = [];
    shades.forEach( (s,i) => {
        let labelIdx = shades.indexOf(label);
        if (i === labelIdx) {
            outputs[i] = 1;
        } else {
            outputs[i] = 0;
        }
    });

    let color = { 
            'idx': shades.indexOf(label), 
            label,
            'inputs': [red, green, blue],
            outputs
    } ;

    colorDatabase[key] = color;

    backgroundColorGenerator();
}


const writeColorDataToFile = () => {

    saveJSON(colorDatabase, 'colors.json');

}