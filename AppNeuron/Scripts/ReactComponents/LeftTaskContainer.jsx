import React from 'react';

import InfoContainer from './InfoContainer.jsx';
import CheckRouteNumber from './CheckRouteNumber.jsx';
import CheckNames from './CheckNames.jsx';
import CheckImages from './CheckImages.jsx';
import CheckAll from './CheckAll.jsx';

export default class LeftTaskContainer extends React.Component {
    constructor(props) {
        super(props);

        this.toNamesCityTask = this.toNamesCityTask.bind(this);
        this.toNextTask = this.toNextTask.bind(this);
        this.toImageCityTask = this.toImageCityTask.bind(this);
        this.checkingAll = this.checkingAll.bind(this);
        this.closeModalBox = this.closeModalBox.bind(this);
        this.deleteSelectedNumber = this.deleteSelectedNumber.bind(this);
        this.deleteSelectedNames = this.deleteSelectedNames.bind(this);
        this.deleteSelectedImages = this.deleteSelectedImages.bind(this);

        this.props.parent.state.leftContainerContext = this;

        this.state = {
            controlType: this.props.controlType,
            buttonName: "Вперед",
            disabledButton: true,
            numbers: null,
            erroreMsg: null,
            currentClickButtonFunc: this.toNextTask,
            cityNames: null,
            imagesSrc: null,
            tasksTime: [],
            comparisonData: null,
            numberWithHelper: 0
        };
    }
    toNextTask() {
        this.props.parent.state.helperZone = "numbers";
        this.setHelperToNumbers(0);

        var numbers = this.props.country.cites.map(function (city, index) {
            return index + 1;
        });
        this.setState({ controlType: "route", buttonName: "Завершить этап", disabledButton: true, numbers: numbers });
        this.setState({ currentClickButtonFunc: this.toNamesCityTask });

        this.props.parent.speechSynt("На этом этапе вам нужно правильно указать номера городов" +
            " Выберите номер маршрута слева");

        var tasksTime = this.state.tasksTime;
        tasksTime.push(new Date());
        this.setState({ tasksTime: tasksTime });
        this.props.parent.setState({ stage: "routeLevel" });
    }
    deleteSelectedNumber(number) {
        var numbers = this.state.numbers;
        for (var i in numbers)
            if (numbers[i] === number) numbers.splice(i, 1);
        this.setState({ numbers: numbers });
        if (numbers.length === 0) {
            this.setState({ disabledButton: false });
            this.props.parent.speechSynt("Нажмите на кнопку Завершить этап");
            this.props.parent.setState({ helperZone: "button" });
        }
        else {
            this.setHelperToNumbers(0);
            this.props.parent.speechSynt("Выберите номер города слева");
        }
    }
    deleteSelectedNames(name) {
        var names = this.state.cityNames;
        for (var i in names)
            if (names[i] === name) names.splice(i, 1);
        this.setState({ cityNames: names });
        if (names.length === 0) {
            this.setState({ disabledButton: false });
            this.props.parent.speechSynt("Нажмите на кнопку Завершить этап");
            this.props.parent.setState({ helperZone: "button" });
        }
        else {
            this.setHelperToNames(0);
            this.props.parent.speechSynt("Выберите название города слева");
        }
    }
    deleteSelectedImages(image) {
        var images = this.state.imagesSrc;
        for (var i in images)
            if (images[i] === image) images.splice(i, 1);
        this.setState({ imagesSrc: images });
        if (images.length === 0) {
            this.setState({ disabledButton: false });
            this.props.parent.speechSynt("Нажмите на кнопку Завершить этап");
            this.props.parent.setState({ helperZone: "button" });
        }
        else {
            this.setHelperToImages(0);
            this.props.parent.speechSynt("Выберите фотографию слева");
        }
    }
    toNamesCityTask() {
        var names = this.props.country.cites.map(function (city, index) {
            return city.cityName;
        });
        this.setState({ controlType: "name", disabledButton: true, cityNames: names });
        this.setState({ currentClickButtonFunc: this.toImageCityTask });

        this.props.parent.speechSynt("На этом этапе вам нужно правильно указать названия городов" +
            " Выберите название города слева");

        var tasksTime = this.state.tasksTime;
        tasksTime.push(new Date());
        this.setState({ tasksTime: tasksTime });
        this.props.parent.setState({ stage: "nameLevel" });
        this.props.parent.state.helperZone = "names";
        this.setHelperToNames(0);
    }
    toImageCityTask() {
        var imagesSrc = this.props.country.cites.map(function (city, index) {
            return city.src;
        });
        this.setState({ controlType: "image", disabledButton: true, imagesSrc: imagesSrc });
        this.setState({ currentClickButtonFunc: this.checkingAll });
        this.props.parent.speechSynt("На этом этапе вам нужно правильно указать фотографии городов" +
            " Выберите фотографию города слева");

        var tasksTime = this.state.tasksTime;
        tasksTime.push(new Date());
        this.setState({ tasksTime: tasksTime });
        this.props.parent.setState({ stage: "imageLevel" });
        this.props.parent.state.helperZone = "images";
        this.setHelperToImages(0);
    }
    checkingAll() {
        //this.props.checkingAll();

        var intervarls = this.getIntervals();
        var erroreObject = this.getErrores();
        var sum = 0;
        intervarls.forEach(value => sum += value);

        this.comparisonResults(sum, this.getPercentSuccess(erroreObject));

        this.props.parent.state.helperZone = "none";
    }
    comparisonResults(interval, resultPercent) {
        var xhr = new XMLHttpRequest();
        var date = { seconds: interval, result: resultPercent, level: this.props.parent.state.level};
        xhr.open("post", "/Home/GetDeviationFromAverage", true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = function () {
            var response = JSON.parse(xhr.responseText);
            this.setState({ comparisonData: response });
            this.setState({ controlType: "checking", buttonName: "Отправить результат", currentClickButtonFunc: this.closeModalBox });
            this.props.parent.setState({ stage: "finish" });
            if (response.Reload)
                this.props.parent.props.map.loadData();
        }.bind(this);
        xhr.send(JSON.stringify(date));
    }
    getIntervals() {
        var intervarls = [];
        for (var i = 0; i < this.state.tasksTime.length; i++) {
            var curTime = this.state.tasksTime[i];
            var nextTime = null;
            if (i === this.state.tasksTime.length - 1) nextTime = new Date();
            else nextTime = this.state.tasksTime[i + 1];
            var result = (nextTime.getHours() - curTime.getHours()) * 3600 + (nextTime.getMinutes() - curTime.getMinutes()) * 60 +
                (nextTime.getSeconds() - curTime.getSeconds());
            intervarls.push(result);
        }
        return intervarls;
    }
    getErrores() {
        return this.props.parent.getErrores();
    }

    getPercentSuccess(erroreObject) {
        var countAll = 0;
        var count = 0;
        for (var index in erroreObject) {
            countAll += 3;
            if (erroreObject[index].errorRouteNumber)
                count++;
            if (erroreObject[index].errorCityName)
                count++;
            if (erroreObject[index].errorCityImage)
                count++;
        }
        var res = Math.round(100 - count / countAll * 100);
        return res;
    }

    closeModalBox() {
        closeTaskModalBox();
    }
    getClassName() {
        return "btn btn-primary " + (this.state.disabledButton ? "disabled " : " ") +
            (this.props.parent.state.withHelper && this.props.parent.state.helperZone === "button" ? "helper helper-btn" : "");
    }

    setHelperToNumbers(index) {
        if (this.props.parent.state.helperZone !== "numbers") return;

        if (this.state.numbers === null) {
            setTimeout(() => this.setHelperToNumbers(index), 1000, this);
            return;
        }

        if (index < this.state.numbers.length - 1)
            index++;
        else
            index = 0;

        this.setState({ numberWithHelper: this.state.numbers[index] });
        setTimeout(() => this.setHelperToNumbers(index), 1000, this);
    }
    setHelperToNames(index) {
        if (this.props.parent.state.helperZone !== "names") return;

        if (this.state.cityNames === null) {
            setTimeout(() => this.setHelperToNames(index), 1000, this);
            return;
        }

        if (index < this.state.cityNames.length - 1)
            index++;
        else
            index = 0;

        this.setState({ nameWithHelper: this.state.cityNames[index] });
        setTimeout(() => this.setHelperToNames(index), 1000, this);
    }
    setHelperToImages(index) {
        if (this.props.parent.state.helperZone !== "images") return;

        if (this.state.imagesSrc === null) {
            setTimeout(() => this.setHelperToImages(index), 1000, this);
            return;
        }

        if (index < this.state.imagesSrc.length - 1)
            index++;
        else
            index = 0;

        this.setState({ imageWithHelper: this.state.imagesSrc[index] });
        setTimeout(() => this.setHelperToImages(index), 1000, this);
    }

    render() {
        return <div id="LeftTaskContainer">
            <div id="ControlsContainer">
                {this.state.controlType === "info" ? <InfoContainer /> :
                    this.state.controlType === "route" ? <CheckRouteNumber numbers={this.state.numbers} parentMain={this.props.parent}
                        parent={this} /> :
                        this.state.controlType === "name" ? <CheckNames names={this.state.cityNames} parentMain={this.props.parent}
                            parent={this} /> : this.state.controlType === "image" ?
                                <CheckImages imagesSrc={this.state.imagesSrc} parentMain={this.props.parent} parent={this} /> :
                                this.state.controlType === "checking" ? <CheckAll parentMain={this.props.parent} comparisonData={this.state.comparisonData}/> :
                                    null}
            </div>
            <div id="erroreMsg">
                {this.state.erroreMsg}
            </div>
            <div id="ButtonContainer">
                <button onClick={this.state.currentClickButtonFunc} className={this.getClassName()}>{this.state.buttonName}
                </button>
            </div>
        </div>;
    }
}