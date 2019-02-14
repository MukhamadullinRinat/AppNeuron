class CountryInWorldMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 4,
            height: 6, 
            isCliked: false,
            nameVisible: false,
            backgroundImage: 'url("../Images/iconCountry.png"',
            zIndex: 1
        };

        this.click = this.click.bind(this);
        this.updateSize = this.updateSize.bind(this);
    }

    click() {
        if (this.state.isCliked) {
            this.setState({ width: 4, height: 6, backgroundImage: 'url("../Images/iconCountry.png"', zIndex: 1 });
            this.props.parent.disableButton(true);
            this.props.parent.setSelectedCountry(null);
        }
        else {
            this.props.parent.disableButton(false);
            this.props.parent.setSelectedCountry(this);
            this.setState({ backgroundImage: 'url("../Images/countryInWorld.svg"', zIndex: 2 });
            this.props.parent.speechSynt("Нажмите на зеленую правую нижнюю кнопку Вперед");
        }
        this.setState({ isCliked: this.state.isCliked ?  false : true});
    }
    unActive() {
        this.setState({
            width: 4, height: 6, backgroundImage: 'url("../Images/iconCountry.png"', zIndex: 1,
            nameVisible: false, isCliked: false
        });
    }
    getClassName() {
        return "CountryInWorldMap " + (this.props.parent.state.withHelper && this.props.parent.state.helperZone === "countriesInMap" &&
            this.props.parent.state.countryIdWithHelper === this.props.country.id ?
            "helper helper-small" : "");
    }

    updateSize(isBig) {
        if (this.props.isSelected) return;
        this.setState({ nameVisible: isBig, zIndex: isBig ? 2 : 1 });
        isBig ? this.setState({ width: 7, height: 10 }) : this.state.isCliked ? null : this.setState({ width: 4, height: 6 });
    }

    render() {
        return <div className={this.getClassName()}
            style={{
                left: this.props.country.left + "%", top: this.props.country.top + "%", width: (this.props.isSelected ? 7 : this.state.width) + "%",
                height: (this.props.isSelected ? 10 : this.state.height) + "%",
                backgroundImage: this.state.backgroundImage,
                zIndex: this.state.zIndex
            }}
            onClick={this.click} onMouseOver={() => this.updateSize(true)} onMouseOut={() => this.updateSize(false)}>
            <div className="countryNameInMap" style={{visibility: this.state.nameVisible ? "visible" : "hidden"}}>
                {this.props.country.name}</div>
        </div>
    }
}