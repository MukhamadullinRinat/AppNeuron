class SpeechIcon extends React.Component {
    constructor(props) {
        super(props);

        this.state = { visibleSpeech: visibleSpeech };

        this.click = this.click.bind(this);
    }

    click() {
        if (visibleSpeech) speechSynthesis.cancel();
        else document.getElementById("speechContainer").innerHTML = '';
        visibleSpeech = !visibleSpeech;
        this.setState({ visibleSpeech: visibleSpeech });
    }

    render() {
        return <div id="SpeechItems" style={{
            top: this.state.visibleSpeech ? "85%" : "95%",
            height: this.state.visibleSpeech ? "10%" : "5%"
        }}>
            {this.state.visibleSpeech ? <div className="SpeechIcon"></div> : null}
            <button onClick={this.click} className="SpeechButton btn btn-primary">
                {this.state.visibleSpeech ? "Выключить звук" : "Включить звук"}</button>
        </div>
    }
}