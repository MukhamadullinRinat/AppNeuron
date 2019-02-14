class Enlarging extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div id="Enlarging" style={{left: this.props.isRight ? "60%" : "0%"}}>
            {this.props.name ? <div className="enlargName">Название города: {this.props.name}</div> : null}
            {this.props.route ? <div className="enlangRoute">Номер города: {this.props.route}</div> : null}
            {
                this.props.image ? <div className="enlangImage" style={{
                    backgroundImage: this.props.image,
                    height: this.props.name && this.props.route ? "84%" : this.props.name || this.props.route ? "92%" : "100%"
                }}></div> : null
            }
        </div>
    }
}