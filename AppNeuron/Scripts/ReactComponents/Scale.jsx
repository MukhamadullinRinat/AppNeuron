import React from 'react';

export default class Scale extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="Scale">
            <div className="topPart" style={{ height: (100 - this.props.value) + "%" }}></div>
            <div className={"buttonPart " + (this.props.value < 30 ? "redPart" : this.props.value < 70 ? "yellowPart" : "greenPart")}
                style={{ height: this.props.value + "%" }}></div>
        </div>
    }
}