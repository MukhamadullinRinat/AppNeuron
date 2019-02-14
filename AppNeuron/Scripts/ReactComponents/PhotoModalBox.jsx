class PhotoModalBox extends React.Component {
    constructor(props) {
        super(props);

        this.closeModalBox = this.closeModalBox.bind(this);
    }
    componentDidMount() {
        $('#PhotoModalBox').modal('show');
        if (this.props.cityName && this.props.routeNumber)
            speechSynt("Вы открыли фото города " + this.props.cityName + " Номер в маршруте " + this.props.routeNumber +
                " Чтобы закрыть фото нажмите на крестик в правом верхнем углу фото");
        else if (this.props.cityName)
            speechSynt("Вы открыли фото города " + this.props.cityName +
                " Чтобы закрыть фото нажмите на крестик в правом верхнем углу фото");
        else if (this.props.routeNumber)
            speechSynt("Вы открыли фото города с номером маршрута " + this.props.routeNumber +
                " Чтобы закрыть фото нажмите на крестик в правом верхнем углу фото");
        else
            speechSynt("Чтобы закрыть фото нажмите на крестик в правом верхнем углу фото");

    }
    closeModalBox() {
        $('#PhotoModalBox').modal('hide');
        if (this.props.cityName && this.props.routeNumber)
            speechSynt("");
        else if (!this.props.cityName && this.props.routeNumber)
            speechSynt("Выберите названия для этого города в левой части окна");
        else if (this.props.cityName && !this.props.routeNumber)
            speechSynt("Выберите номер маршрута для этого города в левой части окна");
        else
            speechSynt("");
        $('#PhotoModalBox').remove();
        $('.modal-backdrop').first().remove();
    }
    render() {
        return <div id="PhotoModalBox" className="modal fade" data-keyboard="false" data-backdrop="static">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="photoCity" style={{ backgroundImage: this.props.imageSrc }}>
                        <div className="closeButton" onClick={this.closeModalBox}></div>
                    </div>
                </div>
            </div>
        </div>;
    }
}