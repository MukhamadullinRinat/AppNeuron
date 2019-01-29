class CanvasComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            styles: { width: "0%", height: "0%", top: "0%", left: "0%", zIndex: 10 }
        };
        updateZIndex.push({ func: this.updateZIndex, context: this });
        this.pushCanvasContextToParent();

        this.getNextCity = this.getNextCity.bind(this);
        this.drowLine = this.drowLine.bind(this);
    }

    pushCanvasContextToParent() {
        var contexts = this.props.parent.state.allCanvasContexts;
        if (this.props.country.cites.length === contexts.length) {
            contexts = [];
        }
        contexts.push(this);
        this.props.parent.state.allCanvasContexts = contexts;
    }

    updateZIndex(context, zIndex) {
        var styles = context.state.styles;
        styles.zIndex = zIndex;
        context.setState(styles);
    }

    componentDidMount() {
        this.updateCanvas();
    }

    getNextCity(curNumber) {
        for (var index in this.props.country.cites) {
            if (this.props.country.cites[index].routeNumber == curNumber + 1) return this.props.country.cites[index];
        }
        return null;
    }
    drowLine(isFromRightToLeft, isFromTopToEnd, lineWidth, startX, startY, endX, endY) {
        const delta = 5;
        const timeout = 50;

        if (!startX) {
            startX = isFromRightToLeft ? 400 : 0;
            startY = isFromTopToEnd ? 0 : 400;
            endX = isFromRightToLeft ? 400 - delta : delta;
            endY = isFromTopToEnd ? delta : 400 - delta;
        }

        this.insertLine(lineWidth, startX, startY, endX, endY);

        startX = isFromRightToLeft ? startX - delta : startX + delta;
        startY = isFromTopToEnd ? startY + delta : startY - delta;
        endX = isFromRightToLeft ? endX - delta : endX + delta;
        endY = isFromTopToEnd ? endY + delta : endY - delta;
        if (startX > 400 || startY > 400 || endX > 400 || endY > 400 || startX < 0 || startY < 0 || endX < 0 || endY < 0) {
            var nextCity = this.getNextCity(this.props.curElement.routeNumber);
            if (nextCity) {
                this.props.parent.setState({ drawningCity: this.props.parent.getDrawningCity(nextCity.routeNumber) });
                this.props.parent.updateNextCanvas();
            }
            var styles = this.state.styles;
            styles.zIndex = 0;
            this.setState({ styles: styles });
            return;
        }

        setTimeout(this.drowLine, timeout, isFromRightToLeft, isFromTopToEnd, lineWidth, startX, startY, endX, endY, this);

    }
    insertLine(lineWidth, startX, startY, endX, endY, isClear) {
        var canvas = this.refs.canvas;
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");

            if (isClear) ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.lineWidth = String(lineWidth);
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }
    getNextCityWithId(cityId) {
        for (var index in this.props.country.cites) {
            if (this.props.country.cites[index].id == cityId) return this.props.country.cites[index];
        }
    }
    getNextCityWithInsertData() {
        var curElement = this.props.curElement;
        var allCityContexts = this.props.parent.state.allCityContexts;
        var insertedNumber;
        allCityContexts.forEach((city) => {
            if (city.props.cityId === curElement.id)
                insertedNumber = city.state.insertRouteNumber;
        },
            insertedNumber);
        var nextCityId = null;
        allCityContexts.forEach((city) => { if (city.state.insertRouteNumber === insertedNumber + 1) nextCityId = city.props.cityId; },
            nextCityId, insertedNumber);
        return nextCityId ? this.getNextCityWithId(nextCityId) : null;
    }
    updateCanvas(withInsertData) {
        var curElement = this.props.curElement;
        var nextElement = withInsertData ? this.getNextCityWithInsertData() : this.getNextCity(curElement.routeNumber);

        var stage = this.props.parentMain.state.stage;

        if (nextElement) {
            var positionTopNext = (nextElement.isTop ? 0 : 15) + nextElement.top;
            var positionTopCur = (curElement.isTop ? 0 : 15) + curElement.top;
            var positionLeftNext = (nextElement.isLeft ? 0 : 22) + nextElement.left;
            var positionLeftCur = (curElement.isLeft ? 0 : 22) + curElement.left;

            var canvasWidth = positionLeftCur > positionLeftNext ? positionLeftCur - positionLeftNext : positionLeftNext - positionLeftCur;
            var canvasHeight = positionTopCur > positionTopNext ? positionTopCur - positionTopNext : positionTopNext - positionTopCur;

            var isFromRightToLeft = positionLeftCur > positionLeftNext,
                isFromTopToEnd = positionTopCur < positionTopNext;

            var lineWidth = 10 * (45 / canvasHeight + 20 / canvasWidth);

            if (stage === "start" && this.props.isDrawning)
                this.drowLine(isFromRightToLeft, isFromTopToEnd, lineWidth);
            else if (stage === "nameLevel" || stage === "imageLevel")
                this.insertLine(lineWidth, isFromRightToLeft ? 400 : 0, isFromTopToEnd ? 0 : 400,
                    isFromRightToLeft ? 0 : 400, isFromTopToEnd ? 400 : 0);
            else if (stage === "finish") {
                this.insertLine(lineWidth, isFromRightToLeft ? 400 : 0, isFromTopToEnd ? 0 : 400,
                    isFromRightToLeft ? 0 : 400, isFromTopToEnd ? 400 : 0, true);
            }

            this.setState({
                styles: {
                    width: canvasWidth + "%",
                    height: canvasHeight + "%",
                    top: (positionTopCur > positionTopNext ? positionTopNext : positionTopCur) + "%",
                    left: (positionLeftCur > positionLeftNext ? positionLeftNext : positionLeftCur) + "%",
                    zIndex: stage !== "start" ? 0 : 20
                }
            });
        }
        else {
            var positionTopCur = (curElement.isTop ? 0 : 15) + curElement.top;
            var positionLeftCur = (curElement.isLeft ? 0 : 22) + curElement.left;

            if (stage === "start" && this.props.isDrawning) {
                this.drowLine(false, true, 120);
                this.drowIsFinished();
            }
            else if (stage === "nameLevel" || stage === "imageLevel")
                this.insertLine(120, 0, 0, 400, 400);
            else if (stage === "finish") {
                this.insertLine(120, 0, 0, 400, 400, true);
            }

            this.setState({
                styles: {
                    width: "5%",
                    height: "5%",
                    top: positionTopCur + "%",
                    left: positionLeftCur + "%",
                    zIndex: stage !== "start" ? 0 : 20
                }
            });
        }
    }
    drowIsFinished() {
        this.props.parentMain.state.leftContainerContext.setState({ disabledButton: false });
        this.props.parentMain.setState({ helperZone: "button" });
    }
    render() {
        return (
            <canvas ref="canvas" width={400} height={400} style={this.state.styles} />
        );
    }
}