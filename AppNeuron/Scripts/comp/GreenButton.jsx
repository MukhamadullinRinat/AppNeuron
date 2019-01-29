class GreenButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={"green-button-container " + this.props.containerClass}
            onClick={this.props.action}>
            <div className="green-button">
                <div className="green-button-1">
                    <div className="green-button-2"></div>
                    <div className="green-button-3">
                        {this.props.imageClass ? <div className={this.props.imageClass}></div> : ""}
                        {this.props.src1 ? <img className={"green-button-icon"} src={"../Images/" + this.props.src1} /> : ""}
                        {this.props.src2 ? <img className={"green-button-icon"} src={"../Images/" + this.props.src2} /> : ""}
                    </div>
                </div>
            </div>
        </div>
    }
}