class UserRoomPatient extends React.Component {
    constructor(props) {
        super(props);

        this.getGraphicsData = this.getGraphicsData.bind(this);
        this.createGraphic = this.createGraphic.bind(this);
    }
    componentDidMount() {
        this.getGraphicsData();
    }
    getGraphicsData() {
        var xhr = new XMLHttpRequest();
        xhr.open("post", "/Home/GetUserGraphicData", true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.createGraphic(data);
        }.bind(this);
        xhr.send();
    }
    createGraphic(data) {
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
        var svg = d3.select(".graphic-user-room").append("svg")
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
                x: scaleX(data[i].DateInString) + padding, y: scaleY(data[i].Result.Result) + padding
            });

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
            .append("line")
            .classed("grid-line", true) 
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
         
        svg.append("g").append("path")
            .attr("d", line(dataInChart))
            .style("stroke", "steelblue")
            .style("fill", "none")
            .style("stroke-width", 2);
    }
    render() {
        return <div className="UserRoom-results">
            <div className="search-user-room-container">
                <div className="search-label-user-room">Ниже приведен график сдачи вами тестов</div>
            </div>

            <div className="result-user-room-container">
                <div className="graphic-user-room"></div>
            </div>
        </div>
    }
}

ReactDOM.render(
    <UserRoomPatient />,
    document.getElementById("user-results")
);