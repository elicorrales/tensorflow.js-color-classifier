'use strict';

let tfModel;
let tfHidden;
let tfOutputs;
let tfOptimizer;
let tfLoss;
let tfInputs;
let momentum = 0.4;
let numEpoch;
let lossGoal;

let learningRate = document.getElementById('learningRateSlider').value;
document.getElementById('learningRate').innerHTML = learningRate;

let thereExistsNetwork = false;
let trainTheNetwork = false;
let trainNetworkWait = false;
let networkTrained = false;
let startNetworTrainTime;

const areAllShadesTrained = () => {
    for (let i=0; i<shadesThatAreTrained.length; i++) {
        if (shadesThatAreTrained[i] === false) {
            return false;
        }
    }
    return true;
}

const trainTheModel = () => {

    //do everything in here so that we dont have a memory
    //leak
    tf.tidy(() => {

        if (trainTheNetwork && !networkTrained) {
            try {
                train()
                    .then(result => {
                        //console.log(result.history.loss[0]);
                        //trainNetworkWait = false;
                        let now = new Date().getTime();
                        document.getElementById('currLoss').innerHTML = result.history.loss[0].toFixed(4);
                        if (result.history.loss[0] < lossGoal && areAllShadesTrained()) {
                            trainTheNetwork = false;
                            networkTrained = true;
                            showMessages('success','Network Trained in ' + round((now - startNetworTrainTime)/1000) + ' secs');
                            return;
                        }

                        showMessages('info','Network Training with ' + colorLabels.length + ' input data ... ' + round((now - startNetworTrainTime)/1000) + ' secs');

                        //if (trainTheNetwork && !networkTrained && !trainNetworkWait) {
                        if (trainTheNetwork && !networkTrained) {
                            setTimeout(trainTheModel, 1);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        //trainTheNetwork = false;
                        showMessages('danger', error);
                    });
            } catch (error) {
                console.log(error);
                showMessages('danger', error);

            }
        }
    });


}

const train = () => {

    if (tfModel === undefined) {
        throw 'There Is No Network.'
    }

    return tfModel.fit(tfRGBs, tfLabels, {
        shuffle: true,
        epoch: numEpoch
    });


}

const updateShadeButtonIfGoalReached = (outputs) => {

    let numShades = shades.length;
    let numSamples = outputs.length / numShades;
    let currSample = 0;
    for (let i=0 ; i < outputs.length; i++) {
        if (i >= numShades * (currSample+1)) {
            currSample++;
        }
        if (outputs[i] > 0.94) {
            //if (trainTheNetwork) console.log(i,' ',  currSample * numShades);
            let shadeIdx = i - currSample * numShades;
            //if (trainTheNetwork) console.log(shadeIdx);
            document.getElementById(shades[shadeIdx]).className = 'btn btn-info';
            shadesThatAreTrained[shadeIdx] = true;
        }
    }
}

const showTrainingResults = () => {

    if (tfModel === undefined) {
        return;
    }

    tf.tidy(() => {
        let outputs = tfModel.predict(tfRGBs).dataSync();

        updateShadeButtonIfGoalReached(outputs);
        //console.log(outputs);
        
        drawPredictions(outputs);

        if (trainTheNetwork && !networkTrained)  document.getElementById('frameRate').innerHTML = frameRate().toFixed(2);

        stroke(255);
    });

    //noLoop();
}



const createNeuralNetwork = (numHidden, activationHidden, activationOutputs, useWhichOptimizer, useWhichLoss, epoch, goal) => {

        numEpoch = epoch;
        lossGoal = goal;


        lastStartingOutIdx = 0;

        if (tfModel !== undefined) {
            try { tfModel.dispose(); } catch (error) {}
        }

        tfModel = tf.sequential();

        //if (tfHidden !== undefined) { tfHidden.dispose(); }
        tfHidden = tf.layers.dense(
            {
                inputShape: [3],            // this is the number of inputs to the hidden layer.
                units: numHidden,           // the number of nodes inside the hidden layer.
                activation: activationHidden,
            }
        );

        // the inputShape is inferred because this output layer is added after the hidden layer
        // and each layer was added as 'dense' (fully connected)
        //if (tfOutputs !== undefined) { tfOutputs.dispose(); }
        tfOutputs = tf.layers.dense(
            {
                units: 9,                   // the number of nodes inside the output layer(one per color shade)
                activation: activationOutputs,
            }
        );

        if (tfOptimizer !== undefined) { tfOptimizer.dispose(); }
        switch (useWhichOptimizer) {
            case 'SGD': tfOptimizer = tf.train.sgd(learningRate); break;
            case 'Momentum': tfOptimizer = tf.train.momentum(learningRate, momentum); break;
            case 'ADAGRAD': tfOptimizer = tf.train.adam(learningRate); break;
            case 'ADADELTA': tfOptimizer = tf.train.adagrad(learningRate); break;
            case 'ADAM': tfOptimizer = tf.train.adadelta(learningRate); break;
            case 'ADAMAX': tfOptimizer = tf.train.adamax(learningRate); break;
            case 'RMSPROP': tfOptimizer = tf.train.rmsprop(learningRate); break;
        }

        //if (tfLoss !== undefined) { tfLoss.dispose(); }
        switch (useWhichLoss) {
            case 'absoluteDifference': tfLoss = tf.losses.absoluteDifference; break;
            case 'computeWeightedLoss': tfLoss = tf.losses.computeWeightedLoss; break;
            case 'cosineDistance': tfLoss = tf.losses.cosineDistance; break;
            case 'hingeLoss': tfLoss = tf.losses.hingeLoss; break;
            case 'huberLoss': tfLoss = tf.losses.huberLoss; break;
            case 'logLoss': tfLoss = tf.losses.logLoss; break;
            case 'meanSquaredError': tfLoss = tf.losses.meanSquaredError; break;
            case 'sigmoidCrossEntropy': tfLoss = tf.losses.sigmoidCrossEntropy; break;
            case 'softmaxCrossEntropy': tfLoss = tf.losses.softmaxCrossEntropy; break;
        }


        tfModel.add(tfHidden);
        tfModel.add(tfOutputs);
        tfModel.compile({
            optimizer: tfOptimizer,
            loss: tfLoss
        });
}
