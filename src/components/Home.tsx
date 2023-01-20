import React, {Fragment, useEffect, useState} from "react";
import Plot from 'react-plotly.js';
import classes from "./all.module.css";

const baseURL = "http://localhost:22080/api"

async function queryGetAllScenarios() {
    return fetch(`${baseURL}/scenarios`, {
        method: "GET"
    }).then(data => data.json());
}

async function queryGetByScenario(scenario: number) {
    return fetch(`${baseURL}/getResults/${scenario}`, {
        method: "GET"
    }).then(data => data.json());
}

async function queryGetSettings() {
    return fetch(`${baseURL}/settings`, {
        method: "GET"
    }).then(data => data.json());
}

async function queryStartModel(terminals: number, visitors: number, scenario: number) {
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return fetch(`${baseURL}/start`, {
        method: "POST",
        headers: headers,
        body: new URLSearchParams({
            "terminals": terminals.toString(),
            "visitors": visitors.toString(),
            "scenario": scenario.toString()
        }).toString()
    })
        .then(response => response.text())
        .then(result => console.log(result))

}

function Home() {
    const [items, setItems] = useState([{
        scenario_number: null,
        sim_year: null,
        cust_served: null,
        cust_refused: null,
        terminals: null
    }]);
    const [scenarioItems, setScenarioItems] = useState([]);
    const [scenario, setScenario] = useState(-1);
    const [terminals, setTerminals] = useState(10);
    const [visitors, setVisitors] = useState(0.25);

    const handleScenarioItemChange = (e: { target: { value: string | number; }; }) => {
        console.log(scenarioItems[Number(e.target.value)]);
        setScenario(scenarioItems[Number(e.target.value)]);
    }

    const getScenarios = async () => {
        try {
            const jsonData = await queryGetAllScenarios()
            console.log(jsonData);
            setScenarioItems(jsonData)
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        }
    }

    const getItems = async (scenario: number) => {
        try {
            const jsonData = await queryGetByScenario(scenario);
            console.log(jsonData);
            setItems(jsonData);
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        }
    };

    const onSubmitForm = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await queryStartModel(terminals, visitors, scenario);
            await getItems(scenario);
            await getScenarios();
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        }
    };

    const onSubmitScenarioForm = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await getItems(scenario);
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
        }
    }

    useEffect(() => {
        getScenarios();
    }, []);

    useEffect(() => {
        queryGetSettings().then(data => {
            setScenario(data.scenarioNumber);
            setVisitors(data.paceOfVisitors);
            setTerminals(data.terminalQuantity);
        });
    }, []);

    return (
        <Fragment>
            <h3 className="text-center mt-5">Запустить модель</h3>
            <form className="d-flex mt-5" onSubmit={onSubmitForm}>
                <label htmlFor={"scenario"}>Сценарий</label>
                <input
                    type="number"
                    className={`form-control ${classes.inp}`}
                    name="scenario"
                    value={scenario}
                    onChange={e => setScenario(parseInt(e.target.value))}
                />
                <br/>
                <label htmlFor={"terminals"}>Кол-во терминалов</label>
                <input
                    type="number"
                    className={`form-control ${classes.inp}`}
                    name="terminals"
                    value={terminals}
                    onChange={e => setTerminals(parseInt(e.target.value))}
                />
                <br/>
                <label htmlFor={"visitors"}>Темп посещения посетителей</label>
                <input
                    type="number"
                    className={`form-control ${classes.inp}`}
                    name="visitors"
                    value={visitors}
                    onChange={e => setVisitors(parseFloat(e.target.value))}
                />
                <br/>
                <button className="btn btn-success">Запустить</button>
            </form>
            <br/>
            <form className="d-flex mt-5" onSubmit={onSubmitScenarioForm}>
                <label>
                    <p>Выбрать сценарий</p>
                    <select
                        onChange={handleScenarioItemChange}
                        className="browser-default custom-select">
                        {
                            scenarioItems.map((scenario, key) => <option key={key} value={key}>{scenario}</option>)
                        }
                    </select>
                </label>
                <button className={`btn btn-success ${classes.btn}`}>Получить данные</button>
            </form>
            <h3 className="text-center mt-5">Результат</h3>
            <table className="table mt-5 text-center">
                <thead>
                <tr>
                    <th>Сценарий</th>
                    <th>Прошедшее время в днях</th>
                    <th>Обслуженные посетители</th>
                    <th>Необслуженные посетители</th>
                    <th>Терминалы</th>
                </tr>
                </thead>
                <tbody>
                {items.map(item => {
                        const year = item.sim_year !== null ? item.sim_year / (60 * 24) : null;
                        return (
                            <tr key={item.sim_year}>
                                <td>{item.scenario_number}</td>
                                <td>{year}</td>
                                <td>{item.cust_served}</td>
                                <td>{item.cust_refused}</td>
                                <td>{item.terminals}</td>
                            </tr>
                        )
                    }
                )}
                </tbody>
            </table>
            <h3>График</h3>
            <Plot
                data={[
                    {
                        x: items.map(item => item.sim_year !== null ? item.sim_year / (60 * 24) : null),
                        y: items.map(item => item.cust_served),
                        fill: 'tozeroy',
                        type: 'scatter',
                        name: 'Обслуженные покупатели'
                    },
                    {
                        x: items.map(item => item.sim_year !== null ? item.sim_year / (60 * 24) : null),
                        y: items.map(item => item.cust_refused),
                        fill: 'tozeroy',
                        type: 'scatter',
                        name: 'Необслуженные покупатели'
                    },
                ]}
                layout={ {width: 820, height: 480, title: 'Гравик обслуживания'} }
            />
        </Fragment>
    );
}

export default Home;