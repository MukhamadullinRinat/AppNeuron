import React from 'react';

import Scale from './Scale.jsx';

export default class CheckAll extends React.Component {
    constructor(props) {
        super(props);
        this.state = { patientAnswers: true };
        this.updateAllCanvas = this.updateAllCanvas.bind(this);
    }
    componentDidMount() {
        this.props.parentMain.speechSynt("Поздравляем! Вы закончили упражнение, ознакомьтесь с результатами");
    }
    updateAllCanvas(canvasTypeinFinish, withInsertData) {
        this.setState({ patientAnswers: !withInsertData });
        var countryContext = this.props.parentMain.state.countryContext;
        countryContext.state.canvasTypeinFinish = canvasTypeinFinish;
        countryContext.setState({ canvasTypeinFinish: canvasTypeinFinish });
        countryContext.state.allCanvasContexts.forEach((context) => context.updateCanvas(withInsertData));
    }

    render() {
        return <div id="CheckAll">
            <h2>Ваши результаты</h2>
            <div className="percentScale scales">
                <div className="resultName">Правильность</div>
                <Scale value={this.props.comparisonData.Percent} />
                <div className="resultValue">{this.props.comparisonData.Percent >= 90 ? "Отлично! Больше 90%!" : ""}</div>
            </div>
            <div className="timeScale scales">
                <div className="resultName">Скорость</div>
                <Scale value={this.props.comparisonData.Time} />
                <div className="resultValue">{this.props.comparisonData.Time >= 50 ? "Лучше, чем обычно" : ""}</div>
            </div>
            <div className="buttonFinishContainer">
                <button onClick={() => this.state.patientAnswers ? this.updateAllCanvas("patientAnswers", true) :
                    this.updateAllCanvas("rightAnswers", false)} className="btn btn-default">
                    {this.state.patientAnswers ? "Ваши ответы" : "Правильные ответы"}</button>
            </div>
        </div>
    }
}