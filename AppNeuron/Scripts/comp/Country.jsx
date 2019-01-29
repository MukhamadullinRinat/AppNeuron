class Сountry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            resultCheckingAll: [],
            drawningCity: this.getDrawningCity(1),
            allCanvasContexts: [], 
            allCityContexts: [],
            canvasTypeinFinish: "rightAnswers"
        };

        this.props.parent.state.countryContext = this;

        this.returnDimensionsCity = this.returnDimensionsCity.bind(this);
        this.checkingCity = this.checkingCity.bind(this);
        this.getDrawningCity = this.getDrawningCity.bind(this);
        this.updateNextCanvas = this.updateNextCanvas.bind(this);
        //this.updateAllCanvas = this.updateAllCanvas.bind(this);
    }
    getDrawningCity(routeNumber) {
        for (var i = 0; i < this.props.cites.length; i++) {
            if (this.props.cites[i].routeNumber === routeNumber) return this.props.cites[i];
        }
        return null;
    }
    returnDimensionsCity(cityContext) {
        this.props.getNewСhangedDemensionsCity(cityContext);
    }
    checkingCity(result) {
        var resultCheckingAll = this.state.resultCheckingAll;
        resultCheckingAll.push(result);
        this.setState({ resultCheckingAll: resultCheckingAll });
        if (this.props.cites.length === resultCheckingAll.length)
            this.props.checkingCity(resultCheckingAll);
    }
    updateNextCanvas() {
        for (var i = 0; i < this.state.allCanvasContexts.length; i++) {
            if (this.state.allCanvasContexts[i].props.curElement.routeNumber === this.state.drawningCity.routeNumber)
                this.state.allCanvasContexts[i].updateCanvas();
        }
    }
    /*updateAllCanvas(canvasTypeinFinish, withInsertData) {
        this.state.canvasTypeinFinish = canvasTypeinFinish;
        this.setState({ canvasTypeinFinish: canvasTypeinFinish });
        this.state.allCanvasContexts.forEach((context) => context.updateCanvas(withInsertData));
    }*/
    getErrores() {
        return this.state.allCityContexts.map((cityContext, index) => cityContext.getErrores());
    }
    setHelperToCities(index, type) {
        if (this.props.parent.state.helperZone !== "cities") return;

        var allCityContexts = this.state.allCityContexts;
        if (allCityContexts === null) {
            setTimeout(() => this.setHelperToCities(index), 1000, this);
            return;
        }

        if (index < allCityContexts.length - 1)
            index++;
        else
            index = 0;

        var city = null;
        if (type === "numbers") {
            for (var i = index; i < allCityContexts.length; i++)
                if (allCityContexts[i].state.insertRouteNumber === null) {
                    city = allCityContexts[i];
                    break;
                }

            if (city === null)
                for (var i = 0; i < index; i++)
                    if (allCityContexts[i].state.insertRouteNumber === null) {
                        city = allCityContexts[i];
                        break;
                    }
        }
        else if (type === "names") {
            for (var i = index; i < allCityContexts.length; i++)
                if (allCityContexts[i].state.insertName === null) {
                    city = allCityContexts[i];
                    break;
                }

            if (city === null)
                for (var i = 0; i < index; i++)
                    if (allCityContexts[i].state.insertName === null) {
                        city = allCityContexts[i];
                        break;
                    }
        }
        else if (type === "images") {
            for (var i = index; i < allCityContexts.length; i++)
                if (allCityContexts[i].state.insertImage === null) {
                    city = allCityContexts[i];
                    break;
                }

            if (city === null)
                for (var i = 0; i < index; i++)
                    if (allCityContexts[i].state.insertImage === null) {
                        city = allCityContexts[i];
                        break;
                    }
        }
        if (city === null) return;

        this.setState({ idWithHelper: city.props.cityId });
        setTimeout(() => this.setHelperToCities(index, type), 1000, this);
    }
    render() {
        return <div id="Сountry" style={{ backgroundImage: this.props.country.src }}>
            <div className="closeButton" onClick={this.props.parent.closeTaskModalBox}></div>
            {
                this.props.parent.state.stage !== "routeLevel" ? this.props.cites.map(function (city) {
                    return <CanvasComponent parentMain={this.props.parent} isDrawning={this.state.drawningCity.id === city.id}
                        parent={this}
                        isNextDrawning={this.state.drawningCity.routeNumber + 1 === city.routeNumber}
                        curElement={city} country={this.props.country} />
                }, this) : []
            }
            {
                this.props.cites.map(function (city, index) {
                    return <City cityId={city.id} top={city.top} left={city.left} cityName={city.cityName} routeNumber={city.routeNumber}
                        imageSrc={city.src} isVisible={this.state.drawningCity.routeNumber >= city.routeNumber}
                        updateDemensions={this.returnDimensionsCity}
                        styles={(this.props.newСhangedDemensionsCity) && this.props.newСhangedDemensionsCity.props.cityId === city.id ?
                            { width: 20, height: 20, zIndex: 3 } : { width: 22, height: 15, zIndex: 2 }}
                        isCheckingAll={this.props.isCheckingAll}
                        checkingCity={this.checkingCity}
                        parentMain={this.props.parent} parent={this} withHelper={this.props.parent.state.helperZone === "cities" &&
                            this.state.idWithHelper === city.id}
                        cityInfo={city}
                    />
                }, this)
            }
        </div>;
    }
}