import React from 'react';
import ReactDOM from 'react-dom';

import GreenButton from './GreenButton.jsx';
import CountryInWorldMap from './CountryInWorldMap.jsx';
import MainTaskContainer from './MainTaskContainer.jsx';

export default class WorldsMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            disabled: true, countries: [], selectedCountry: null, //speechOn: speechOn,
            countryIndexWithHelper: 0, countryIdWithHelper: 0,
            helperZone: "countriesInMap", withHelper: true, enlangVisible: false,
            tasksContext: null
        };

        this.disableButton = this.disableButton.bind(this);
        this.buttonClick = this.buttonClick.bind(this);
        this.loadData = this.loadData.bind(this);
        this.setSelectedCountry = this.setSelectedCountry.bind(this);
        this.insertRandomRouteNumbers = this.insertRandomRouteNumbers.bind(this);
        this.speechOnOrOff = this.speechOnOrOff.bind(this);
    }

    componentDidMount() {
        this.loadData();
        //speechSynt("Здравствуйте! Выберите страну на карте, для этого нажмите на красный чемоданчик");
    }

    disableButton(isBlock) {
        this.setState({ disabled: isBlock });
    }

    buttonClick() {
        if (this.state.disabled) return;

        ReactDOM.render(
            <MainTaskContainer country={this.state.selectedCountry.props.country} withHelper={this.state.withHelper}
                map={this}
            />,
            document.getElementById("taskModalBoxContainer")
        );
    }
    afterOpenModal() {
        this.setState({ helperZone: "finish" });
    }
    loadData() {
        var xhr = new XMLHttpRequest();
        xhr.open("get", "/Home/GetGameData", true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            if (data.Error) {
                location.href = '../Home/Index';
                return;
            }
            data.Countries = this.insertRandomRouteNumbers(data.Countries);
            this.setState({
                countries: data.Countries, withHelper: data.Helper, speechOn: data.Speech, enlangVisible: data.Enlarg,
                selectedCountry: null
            },
                () => this.speechSynt("Выберите страну на карте, для этого нажмите на красный указатель")
            );
            this.setHelperToCountries(0);
        }.bind(this);
        xhr.onerror = (error) => {
            location.reload();
        };
        xhr.send();
    }

    setHelperToCountries(countryIndex) {
        if (!this.state.withHelper) return;

        if (this.state.helperZone !== "countriesInMap") {
            this.setState({ countryIdWithHelper: -1 });
            return;
        }

        if (this.state.countries !== null)
            if (countryIndex < this.state.countries.length - 5)
                countryIndex += 5;
            else
                countryIndex = 0;

        this.setState({ countryIndexWithHelper: countryIndex, countryIdWithHelper: this.state.countries[countryIndex].id});
        setTimeout(() => this.setHelperToCountries(countryIndex), 1000, this)
    }

    insertRandomRouteNumbers(data) {
        for (var j = 0; j < data.length; j++) {
            var country = data[j];
            var numbers = [];
            var randomNumbers = [];
            for (var i = 0; i < country.cites.length; i++) {
                numbers[i] = i + 1;
            }
            while (numbers.length !== 0) {
                var index = Math.floor(Math.random() * numbers.length);
                randomNumbers.push(numbers[index]);
                numbers.splice(index, 1);
            }
            for (var i = 0; i < country.cites.length; i++) {
                country.cites[i].routeNumber = randomNumbers[i];
            }
            data[j] = country;
        }
        return data;
    }
    setSelectedCountry(country) {
        if (this.state.selectedCountry !== null) this.state.selectedCountry.unActive();
        this.setState({ selectedCountry: country });

        this.state.helperZone = country === null ? "countriesInMap" : "startGame";
        if (!this.state.withHelper) return;
        if(country === null) this.setHelperToCountries(0);
    }

    speechOnOrOff() {
        //speechOnOrOff();
        if (speechSynthesis) speechSynthesis.cancel();
        var task = this.state.tasksContext;
        if (task !== null) task.setState({ speechOn: !this.state.speechOn });
        this.setState({ speechOn: !this.state.speechOn }, this.updateSettings);
    }

    getNextButtonClasses() {
        return "right-bottom-button next-button " + (this.state.withHelper && this.state.helperZone === "startGame" ?
            "helper helper-large" : "");
    }
    helperOnOrOff() {
        this.setState({ withHelper: !this.state.withHelper }, () => {
            this.startHelperBlink();
            this.updateSettings();
        });
    }
    startHelperBlink() {
        if (this.state.withHelper)
            if (this.state.helperZone === "countriesInMap")
                this.setHelperToCountries(0);
    }
    updateSettings() {
        var xhr = new XMLHttpRequest();
        var date = { helper: this.state.withHelper, speech: this.state.speechOn};
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
        return <div>
            <div id="WorldsMap">
                {
                    this.state.countries.map(function (country) {
                        return <CountryInWorldMap country={country} isSelected={this.state.selectedCountry !== null &&
                            this.state.selectedCountry.props.country.id === country.id}
                            parent={this} />
                    }, this)
                }
            </div>
            <GreenButton containerClass="exit-button" action={() => location.href = '../Home/Logoff'}
                imageClass="green-button-icon-exit" />
            <GreenButton containerClass={"left-bottom-button " + (this.state.speechOn ? "speech-button-of" : "speech-button-on")}
                action={() => this.speechOnOrOff()} src1="speech.png" imageClass={this.state.speechOn ? "green-button-icon-speech" : ""} />
            <GreenButton containerClass={this.getNextButtonClasses()} action={() => this.buttonClick()}
                imageClass="green-button-icon green-button-icon-next" />
            <GreenButton containerClass="left-top-button prev-button" action={() => location.href = '../Home/Index'}
                imageClass="green-button-icon-prev" />
            {
                this.state.helperZone === "finish" ? "" :
                    <GreenButton containerClass={"left-bottom-button-2 " + (this.state.withHelper ? "tip-button-of" : "tip-button-on")}
                        action={() => this.helperOnOrOff()} src1="tip.png" imageClass={!this.state.withHelper ? "" : "green-button-icon-speech"} />
            }
        </div>;
    }
}