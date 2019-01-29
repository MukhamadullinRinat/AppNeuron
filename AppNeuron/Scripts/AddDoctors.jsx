class AddDoctors extends React.Component {
    constructor(props) {
        super(props);
        this.state = { results: [] };

        this.getResults = this.getResults.bind(this);
        this.setUserType = this.setUserType.bind(this);
    }
    getResults() {
        var text = this.refs.searchValue.value;
        var xhr = new XMLHttpRequest();
        var date = { text: text };
        xhr.open("post", "/Home/GetUsersData", true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ results: data });
        }.bind(this);
        xhr.send(JSON.stringify(date));
    }
    setUserType(isDoctor, userId) {
        var results = this.state.results.map(item => {
            if (item.Item1.Id === userId)
                item.Item2 = !item.Item2;
            return item;
        });
        this.setState({ results: results });
        var xhr = new XMLHttpRequest();
        var date = { isDoctor: isDoctor, userId: userId };
        xhr.open("post", "/Home/SetUsersType", true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify(date));
    }
    render() {
        return <div className="AddDoctors">
            <div className="search-add-doctors-container">
                <div className="search-label-add-doctors">Введите либо имя, либо фамилию, либо отчество.</div>
                <input ref="searchValue" className="input-add-doctors" type="text" />
                <button type="button" onClick={this.getResults} className="button-search-add-doctors btn btn-primary">Найти</button>
            </div>

            <div className="result-add-doctors-container">
                <table className="table">
                    <tr>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Отчество</th>
                        <th>Год рождения</th>
                        <th></th>
                    </tr>
                    {
                        this.state.results.map((value, index) => {
                            return <tr className="tr-users">
                                <td>{value.Item1.FirstName}</td>
                                <td>{value.Item1.LastName}</td>
                                <td>{value.Item1.MiddleName}</td>
                                <td>{value.Item1.BirthDateYear}</td>
                                <td><button onClick={() => this.setUserType(value.Item2, value.Item1.Id)} className="btn btn-default">{value.Item2 ? "Сделать пациентом" : "Сделать врачом"}</button></td>
                            </tr>
                    })
                    }
                </table>
            </div>
        </div>
    }
}

ReactDOM.render(
    <AddDoctors />,
    document.getElementById("add-doctors-container")
);