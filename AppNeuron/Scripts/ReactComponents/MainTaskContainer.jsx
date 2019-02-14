import React from 'react';

import GreenButton from './GreenButton.jsx';
import LeftTaskContainer from './LeftTaskContainer.jsx';
import Сountry from './Country.jsx';

export default class MainTaskContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultCheckingAll: null,
            selectedControl: {}, stage: "start", enlangVisible: this.props.map.state.enlangVisible,
            level: this.props.country.cites.length,
            countryContext: null, helperZone: "none", leftContainerContext: null, withHelper: this.props.withHelper,
            speechOn: this.props.map.state.speechOn
        };

        this.checkingCity = this.checkingCity.bind(this);
        this.setEnlargVisible = this.setEnlargVisible.bind(this);
        this.closeTaskModalBox = this.closeTaskModalBox.bind(this);
    }
    componentDidMount() {
        $('#MainTaskContainer').modal('show');
        $('#MainTaskContainer').on('shown.bs.modal', function () {
            this.speechSynt("Вам необходимо запомнить маршруты, фотографии и названия городов. Как будете готовы, нажмите кнопку Вперед");
        }.bind(this));
        this.props.map.afterOpenModal();
        this.props.map.state.tasksContext = this;
    }
    checkingCity(resultAll) {
        this.setState({ resultCheckingAll: resultAll });
    }
    setEnlargVisible() {
        this.setState({ enlangVisible: !this.state.enlangVisible }, this.updateSettings);
    }
    setStateWithChield(config) {
        this.setState(config);
    }
    closeTaskModalBox() {
        $('#MainTaskContainer').modal('hide');
        $('#MainTaskContainer').on("hidden.bs.modal", function () {
            $(this).remove();
        });
        this.props.map.setState({ helperZone: "startGame", withHelper: this.state.withHelper }, this.props.map.startHelperBlink);
    }
    getErrores() {
        return this.state.countryContext.getErrores();
    }
    helperOnOrOff() {
        this.setState({ withHelper: !this.state.withHelper }, this.updateSettings);
    }
    updateSettings() {
        var xhr = new XMLHttpRequest();
        var date = { helper: this.state.withHelper, enlarg: this.state.enlangVisible, speechOn: this.state.speechOn };
        xhr.open("post", "/Home/UpdateSettings", true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify(date));
    }
    speechSynt(text) {
        if (speechSynthesis && this.state.speechOn) {
            speechSynthesis.cancel();
            setTimeout(function (text) {
                var utterThis = new SpeechSynthesisUtterance(text);
                speechSynthesis.speak(
                    utterThis
                );
            }, 500, text);
        }
    }
    render() {
        return <div id="MainTaskContainer" className="modal fade" data-keyboard="false" data-backdrop="static">
            <div className="modal-dialog">
                <div className="modal-content">
                    <LeftTaskContainer country={this.props.country} controlType="info"
                        resultCheckingAll={this.state.resultCheckingAll} parent={this}
                    />
                    <Сountry name={this.props.country.name} cites={this.props.country.cites} 
                        country={this.props.country}
                        getNewСhangedDemensionsCity={this.getNewСhangedDemensionsCity}
                        newСhangedDemensionsCity={this.state.newСhangedDemensionsCity}
                        isCheckingAll={this.state.isCheckingAll}
                        checkingCity={this.checkingCity}
                        parent={this}
                    />
                </div>
            </div>

            <GreenButton containerClass={"enlang-button right-bottom-button " + (this.state.enlangVisible ? "enlang-button-of" : "enlang-button-on")}
                action={() => this.setEnlargVisible()} src1="enlanrging.png" imageClass={this.state.enlangVisible ? "green-button-icon-enlang" : ""} />
            <GreenButton containerClass={"left-bottom-button-2 " + (this.state.withHelper ? "tip-button-of" : "tip-button-on")}
                action={() => this.helperOnOrOff()} src1="tip.png" imageClass={!this.state.withHelper ? "" : "green-button-icon-speech"} />
        </div>;
    }
}