import ReactDOM from 'react-dom';
import React from 'react';

import WorldsMap from './WorldsMap.jsx';

var updateZIndex = [];

var visibleSpeech = true;
var speechOn = true;

function speechOnOrOff() {
    speechOn = !speechOn;
    speechSynthesis.cancel();
}

ReactDOM.render(
    <WorldsMap />,
    document.getElementById("content")
);

/*function speechSynt(text) {
    if (speechSynthesis && this.visibleSpeech) {
        speechSynthesis.cancel();
        setTimeout(function (text) {
            renderSpeechIcon();
            var utterThis = new SpeechSynthesisUtterance(text);
            utterThis.onend = speechOnEnd;
            speechSynthesis.speak(
                utterThis
            );
        }, 500, text);
    }
}*/
function renderSpeechIcon() {
    ReactDOM.render(
        <SpeechIcon />,
        document.getElementById("speechContainer")
    );
}
function speechOnEnd(event) {
    if(visibleSpeech)
        document.getElementById("speechContainer").innerHTML = '';
}

$(function () {
    $('body').children().filter('div').each(function (index, elem) {
        if (elem.id !== "content" && elem.id !== "taskModalBoxContainer" && elem.id !== "photoModalBoxContainer"
            && elem.id !== "enlargingContainer" && elem.id !== "speechContainer" && elem.id !== "demoModalBoxContainer")
            $(elem).css("display", "none");
    })
})