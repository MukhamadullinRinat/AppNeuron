class UserRoomDoctor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { results: [], graphicsData: {} };

        this.getResults = this.getResults.bind(this);
        this.getGraphicsData = this.getGraphicsData.bind(this);
        this.createGraphic = this.createGraphic.bind(this);
    }
    getResults() {
        var text = this.refs.searchValue.value;
        var xhr = new XMLHttpRequest();
        var date = { text: text };
        xhr.open("post", "/Home/GetUsersResults", true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ results: data });
        }.bind(this);
        xhr.send(JSON.stringify(date));
    }
    getGraphicsData(userId) {
        if (this.state.graphicsData[userId]) {
            var graphicsData = this.state.graphicsData;
            graphicsData[userId].isVisible = !graphicsData[userId].isVisible;
            this.setState({ graphicsData: graphicsData });
            return;
        }
        var xhr = new XMLHttpRequest();
        var date = { userId: userId };
        xhr.open("post", "/Home/GetGraphicsData", true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            var graphicsData = this.state.graphicsData;
            graphicsData[userId] = data;
            graphicsData[userId].isVisible = true;
            this.createGraphic(userId, data);
            this.setState({ graphicsData: graphicsData });
        }.bind(this);
        xhr.send(JSON.stringify(date));
    }
    createGraphic(userId, data) {
        var height = 400, padding = 25;
        var dates = [];
        var ranges = [];
        var dataInChart = [];
        data.forEach((value, index) => {
            dates.push(value.DateInString);
            ranges.push(index * 100 + 40);
        });
        var width = dates.length * 100; 
        var axis_lengthX = width - padding * 2;
        var axis_lengthY = height - padding * 2;
        var svg = d3.select(".table-user-room #userId_" + userId).append("svg")
            .attr("width", width)
            .attr("height", height);
        var scaleX = d3.scaleOrdinal()
            .domain(dates)
            .range(ranges);
        var scaleY = d3.scaleLinear()
            .domain([100, 0])
            .range([0, height - padding * 2]);

        for (i = 0; i < data.length; i++)
            dataInChart.push({
                x: scaleX(data[i].DateInString) + padding, y: scaleY(data[i].Result.Result) + padding });

        var axisX = d3.axisBottom()
            .scale(scaleX)
            .ticks(5);
        var axisY = d3.axisRight()
            .scale(scaleY)
            .ticks(10);

        svg.append("g")
            .attr("class", "x-axis")
            .call(axisX)
            .attr("transform", "translate(" + padding + "," + (axis_lengthY + padding) + ")")
            .style("font-size", "15px");
        svg.append("g")
            .attr("class", "y-axis")
            .call(axisY)
            .attr("transform", "translate(" + (axis_lengthX + 15) + "," + padding + ")")
            .style("font-size", "15px");

        d3.selectAll("g.x-axis g.tick")
            .append("line") // добавляем линию
            .classed("grid-line", true) // добавляем класс
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", - (axis_lengthY + 10));

        d3.selectAll("g.y-axis g.tick")
            .append("line")
            .classed("grid-line", true)
            .attr("x1", -axis_lengthX + 40)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", 0);

        var line = d3.line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; });
        // добавляем путь
        svg.append("g").append("path")
            .attr("d", line(dataInChart))
            .style("stroke", "steelblue")
            .style("fill", "none")
            .style("stroke-width", 2);
    }
    render() {
        return <div className="UserRoom-results">
            <div className="search-user-room-container">
                <div className="search-label-user-room">Введите либо имя, либо фамилию, либо отчество.</div>
                <input ref="searchValue" className="input-user-room" type="text" />
                <button type="button" onClick={this.getResults} className="button-search-user-room btn btn-primary">Найти</button>
            </div>

            <div className="result-user-room-container">
                <div className="table-user-room">
                    <div className="header-table-user-room">
                        <div>Фамилия</div>
                        <div>Имя</div>
                        <div>Отчество</div>
                        <div>Год рождения</div>
                        <div>Пол</div>
                    </div>
                    {
                        this.state.results.map((value) => {
                            return <div><div className="tr-users" title="Кликните, чтобы посмотреть график"
                                onClick={() => this.getGraphicsData(value.Id)}
                                style={{
                                    backgroundColor: this.state.graphicsData[value.Id] && this.state.graphicsData[value.Id].isVisible ? "#3276b1" : "rgba(0,0,0,0)",
                                    color: this.state.graphicsData[value.Id] && this.state.graphicsData[value.Id].isVisible ? "white" : "black"
                                }}
                            >
                                <div>{value.LastName}</div>
                                <div>{value.FirstName}</div>
                                <div>{value.MiddleName}</div>
                                <div>{value.BirthDateYear}</div>
                                <div className="td-last-users">{value.Sex ? "Муж." : "Жен."}</div>
                            </div>
                                <div className="graphic-user-room" id={"userId_" + value.Id}
                                    style={{ display: this.state.graphicsData[value.Id] && this.state.graphicsData[value.Id].isVisible ? "initial" : "none"}}></div>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    }
}


ReactDOM.render(
    <UserRoomDoctor />,
    document.getElementById("user-results")
);