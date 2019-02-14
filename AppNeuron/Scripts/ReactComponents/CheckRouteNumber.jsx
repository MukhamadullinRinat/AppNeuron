import React from 'react';

export default class CheckRouteNumber extends React.Component {
    constructor(props) {
        super(props);

        this.state = { selectedNumber: null };

        this.click = this.click.bind(this);
    }
    click(number) {
        this.props.parentMain.setState({
            selectedControl: { name: "route", value: number, afterInsert: (number) => this.props.parent.deleteSelectedNumber(number) }
        });
        this.setState({ selectedNumber: number });
        this.props.parentMain.state.helperZone = "cities";
        this.props.parentMain.state.countryContext.setHelperToCities(0, "numbers");
        this.props.parentMain.speechSynt("Выберите город справа");
    }

    getClassName(number, index) {
        var add = "";
        if (this.props.parentMain.state.withHelper && this.props.parentMain.state.helperZone === "numbers")
            if (index % 2 === 0)
                add =  number === this.props.parent.state.numberWithHelper ? "helper-gorizontal helper-gorizontal-left" : "";
            else
                add = number === this.props.parent.state.numberWithHelper ? "helper-gorizontal helper-gorizontal-right" : "";

        return "numbersButton " + add;
    }

    render() {
        return <div id="CheckRouteNumber">
            {
                this.props.numbers.map(function (number, index) {
                    if (index % 2 !== 0) return;
                    else {
                        return <div className="row">
                            {
                                this.props.numbers.map(function (number1, index1) {
                                    if (index1 < index || index1 > index + 1) return;
                                    else {
                                        return <div onClick={() => this.click(number1)} className={this.getClassName()}
                                            style={{
                                                backgroundColor: this.state.selectedNumber === number1 ? "gold" : "white"
                                            }}
                                            className={this.getClassName(number1, index1)}
                                        >{number1}</div>
                                    }
                                }, this, index)
                            }
                        </div>
                    }
                }, this)
            }
        </div>
    }
}