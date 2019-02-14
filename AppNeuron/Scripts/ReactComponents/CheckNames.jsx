import React from 'react';

export default class CheckNames extends React.Component {
    constructor(props) {
        super(props);

        this.state = { selectedName: null };

        this.click = this.click.bind(this);
    }
    click(name) {
        this.props.parentMain.setState({
            selectedControl: { name: "name", value: name, afterInsert: (name) => this.props.parent.deleteSelectedNames(name) }
        });
        this.setState({ selectedName: name });
        this.props.parentMain.state.helperZone = "cities";
        this.props.parentMain.state.countryContext.setHelperToCities(0, "names");
        this.props.parentMain.speechSynt("Выберите город справа");
    }
    getClassName(name, index) {
        var add = "";
        if (this.props.parentMain.state.withHelper && this.props.parentMain.state.helperZone === "names")
            if (index % 2 === 0)
                add = name === this.props.parent.state.nameWithHelper ? "helper-gorizontal helper-gorizontal-left" : "";
            else
                add = name === this.props.parent.state.nameWithHelper ? "helper-gorizontal helper-gorizontal-right" : "";

        return "namesButton " + add;
    }

    render() {
        return <div id="CheckNames">
            {
                this.props.names.map(function (name, index) {
                    if (index % 2 !== 0) return;
                    else {
                        return <div className="row">
                            {
                                this.props.names.map(function (name1, index1) {
                                    if (index1 < index || index1 > index + 1) return;
                                    else {
                                        return <div onClick={() => this.click(name1)} className={this.getClassName(name1, index1)}
                                            style={{backgroundColor: this.state.selectedName === name1 ? "gold" : "white"}}
                                        >{name1}</div>
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