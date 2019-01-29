class CheckImages extends React.Component {
    constructor(props) {
        super(props);

        this.state = { selectedImage: null };

        this.click = this.click.bind(this);
        this.enlarging = this.enlarging.bind(this);
        this.closeEnlarging = this.closeEnlarging.bind(this);
    }
    click(image) {
        this.props.parentMain.setState({
            selectedControl: { name: "image", value: image, afterInsert: (image) => this.props.parent.deleteSelectedImages(image) }
        });
        this.setState({ selectedImage: image });
        this.props.parentMain.state.helperZone = "cities";
        this.props.parentMain.state.countryContext.setHelperToCities(0, "images");
        this.props.parentMain.speechSynt("Выберите город справа");
    }
    getClassName(image, index) {
        var add = "";
        if (this.props.parentMain.state.withHelper && this.props.parentMain.state.helperZone === "images")
            if (index % 2 === 0)
                add = image === this.props.parent.state.imageWithHelper ? "helper-gorizontal helper-gorizontal-left" : "";
            else
                add = image === this.props.parent.state.imageWithHelper ? "helper-gorizontal helper-gorizontal-right" : "";

        return "imagesButton " + add;
    }
    enlarging(image) {
        if (!this.props.parentMain.state.enlangVisible) return;

        ReactDOM.render(
            <Enlarging name={null} route={null} image={image} isRight={true} />,
            document.getElementById("enlargingContainer")
        );
    }
    closeEnlarging() {
        document.getElementById("enlargingContainer").innerHTML = '';
    }

    render() {
        return <div id="CheckImages">
            {
                this.props.imagesSrc.map(function (image, index) {
                    if (index % 2 !== 0) return;
                    else {
                        return <div className="row">
                            {this.props.imagesSrc.map(function (image1, index1) {
                                if (index1 < index || index1 > index + 1) return;
                                else {
                                    return <div className="imageCont">
                                        <div onClick={() => this.click(image1)} className={this.getClassName(image1, index1)}
                                            style={{
                                                backgroundImage: image1,
                                                borderWidth: this.state.selectedImage === image1 ? "5px" : "1px",
                                                borderColor: this.state.selectedImage === image1 ? "gold" : "black"
                                            }}
                                            onMouseOver={() => this.enlarging(image1)} onMouseOut={this.closeEnlarging}></div>
                                    </div>
                                }
                            }, this, index, image)}
                        </div>
                    }
                }, this)
            }
        </div>
    }
}