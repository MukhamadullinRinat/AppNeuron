class City extends React.Component {
    constructor(props) {
        super(props);
        this.click = this.click.bind(this);
        this.enlarging = this.enlarging.bind(this);
        this.closeEnlarging = this.closeEnlarging.bind(this);

        this.state = { insertRouteNumber: null, insertName: null, insertImage: null, isCheckingUpdate: false }

        var allCityContexts = this.props.parent.state.allCityContexts;
        allCityContexts.push(this);
        this.props.parent.setState({ allCityContexts: allCityContexts });
    }
    componentDidUpdate() {
        if (this.props.isCheckingAll && !this.state.isCheckingUpdate) {
            this.setState({ isCheckingUpdate: true });
            var result = { cityName: this.props.cityName };
            if (this.props.routeNumber !== this.state.insertRouteNumber) {
                result.errorRouteNumber = "Неправильно указан номер маршрута у города " +
                    this.props.cityName + "! Вы указали - " + this.state.insertRouteNumber +
                    ". Правильный ответ - " + this.props.routeNumber;
            }
            if (this.props.cityName !== this.state.insertName) {
                result.errorCityName = "Неправильно указано имя города " + this.props.cityName + "!" +
                    "Вы указали - " + this.state.insertName +
                    ". Правильный ответ - " + this.props.cityName;
            }
            if (this.props.imageSrc !== this.state.insertImage) {
                result.errorCityImage = "Неправильно указано фото города " + this.props.cityName + "!";
            }
            this.props.checkingCity(result);
        }
    }
    click() {
        var selectedControl = this.props.parentMain.state.selectedControl;
        if (selectedControl && selectedControl.name === "route" && !this.state.insertRouteNumber) {
            this.setState({ insertRouteNumber: selectedControl.value });
            this.props.parentMain.setState({ selectedControl: null });
            this.props.parentMain.state.helperZone = "numbers";
            selectedControl.afterInsert(selectedControl.value);
        }
        else if (selectedControl && selectedControl.name === "name" && !this.state.insertName) {
            this.setState({ insertName: selectedControl.value });
            this.props.parentMain.setState({ selectedControl: null });
            this.props.parentMain.state.helperZone = "names";
            selectedControl.afterInsert(selectedControl.value);
        }
        else if (selectedControl && selectedControl.name === "image" && !this.state.insertImage) {
            this.setState({ insertImage: selectedControl.value });
            this.props.parentMain.setState({ selectedControl: null });
            this.props.parentMain.state.helperZone = "images";
            selectedControl.afterInsert(selectedControl.value);
        }
    }
    getErrores() {
        var result = { cityName: this.props.cityName };
        if (this.props.routeNumber !== this.state.insertRouteNumber) {
            result.errorRouteNumber = "Неправильно указан номер маршрута у города " +
                this.props.cityName + "! Вы указали - " + this.state.insertRouteNumber +
                ". Правильный ответ - " + this.props.routeNumber;
        }
        if (this.props.cityName !== this.state.insertName) {
            result.errorCityName = "Неправильно указано имя города " + this.props.cityName + "!" +
                "Вы указали - " + this.state.insertName +
                ". Правильный ответ - " + this.props.cityName;
        }
        if (this.props.imageSrc !== this.state.insertImage) {
            result.errorCityImage = "Неправильно указано фото города " + this.props.cityName + "!";
        }
        return result;
    }
    enlarging() {
        if (!this.props.parentMain.state.enlangVisible) return;
        var stage = this.props.parentMain.state.stage,
            canvasType = this.props.parent.state.canvasTypeinFinish,
            name = stage === "nameLevel" || (stage === "finish" && canvasType === "patientAnswers") ? this.state.insertName : this.props.cityName,
            route = stage === "routeLevel" || (stage === "finish" && canvasType === "patientAnswers") ? this.state.insertRouteNumber : this.props.routeNumber,
            image = stage === "imageLevel" || (stage === "finish" && canvasType === "patientAnswers") ? this.state.insertImage : this.props.imageSrc;

        ReactDOM.render(
            <Enlarging name={name} route={route} image={image} />,
            document.getElementById("enlargingContainer")
        );
    }
    closeEnlarging() {
        document.getElementById("enlargingContainer").innerHTML = '';
    }
    getClassName() {
        var result = "cityContainer ";
        if (this.props.parentMain.state.withHelper && this.props.withHelper)
            result += "helper helper-large";
        return result;
    }
    render() {
        return <div className={this.getClassName()} onClick={this.click} style={{
            top: this.props.top + '%', left: this.props.left + '%', width: this.props.styles.width + '%',
            height: this.props.styles.height + '%', zIndex: this.props.styles.zIndex,
            visibility: this.props.isVisible ? "visible" : "hidden"
        }}
            onMouseOver={this.enlarging} onMouseOut={this.closeEnlarging}
        >
            <div className="cityNumber" style={{
                top: this.props.cityInfo.isTop ? '0%' : '75%',
                left: this.props.cityInfo.isLeft ? '0%' : '75%',
                backgroundColor: this.props.parent.state.canvasTypeinFinish === "patientAnswers" ?
                    this.props.routeNumber === this.state.insertRouteNumber ? "green" : "red" : "white",
                fontSize: "110%"
            }}>
                {this.props.parentMain.state.stage === "start" || this.props.parentMain.state.stage === "nameLevel" ||
                    this.props.parentMain.state.stage === "imageLevel" ? this.props.routeNumber :
                    this.props.parentMain.state.stage === "routeLevel" ? this.state.insertRouteNumber :
                        this.props.parentMain.state.stage === "finish" && this.props.parent.state.canvasTypeinFinish === "patientAnswers" ?
                            this.state.insertRouteNumber : this.props.routeNumber
                        }
            </div>
            <div className="cityPhoto" style={{
                top: this.props.cityInfo.isTop ? '0%' : '25%',
                backgroundImage: this.props.parentMain.state.stage === "imageLevel" || (this.props.parentMain.state.stage === "finish" &&
                    this.props.parent.state.canvasTypeinFinish === "patientAnswers")
                    ? this.state.insertImage : this.props.imageSrc,
                opacity: this.props.parentMain.state.stage === "imageLevel" && !this.state.insertImage ?  0.5 : 1,
                borderColor: this.props.parentMain.state.stage === "finish" && this.props.parent.state.canvasTypeinFinish === "patientAnswers" ?
                    this.props.imageSrc === this.state.insertImage ?
                    "green" : "red" : "black",
                borderStyle: this.props.parentMain.state.stage === "finish" && this.props.parent.state.canvasTypeinFinish === "patientAnswers" ?
                    "solid" : "none"
            }}>
            </div>
            <div className="cityName" style={{
                top: this.props.cityInfo.isTop ? '75%' : '0%',
                backgroundColor: this.props.parentMain.state.stage === "finish" && this.props.parent.state.canvasTypeinFinish === "patientAnswers" ?
                    this.props.cityName === this.state.insertName ?
                    "green" : "red" : "white",
                fontSize: "110%"
            }}>
                {this.props.parentMain.state.stage === "nameLevel" || (this.props.parentMain.state.stage === "finish" &&
                    this.props.parent.state.canvasTypeinFinish === "patientAnswers") ? this.state.insertName : this.props.cityName}
            </div>
        </div>
    }
}