import { createContext, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Doughnut } from "react-chartjs-2";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import BasicCard from './Card.js';
import valuesStore from './store.js'
import "chartjs-plugin-datalabels";
import 'chart.js/auto';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import InputNumber from 'react-input-number';
import GaugeChart from 'react-gauge-chart'

export const ThemeContext = createContext(null);

var getTotal = function (dataVals, value) {
  var sum = dataVals.datasets[0].data.reduce(
    (a, b) => a + b,
    0
  );

  return (value / sum * 100).toFixed(0);
};

function App() {
  const [dataVals, setDataVals] = useState(null);
  const [wordMonths, setWordMonths] = useState("Meses");
  const [wordYears, setWordYears] = useState("Anos");
  const years = valuesStore(state => state.years);
  const months = valuesStore(state => state.months);
  const won = valuesStore(state => state.won);
  const savings = valuesStore(state => state.savings);
  const expenses = valuesStore(state => state.expenses);
  const investments = valuesStore(state => state.investments);
  const emergency = valuesStore(state => state.emergency);
  const data = valuesStore(state => state.data);
  const totalSpent = valuesStore(state => state.totalSpent);
  const theme = valuesStore(state => state.theme);
  const [isDarkMode, setDarkMode] = useState(theme === "dark" ? true : false);

  const changeYears = (value) => {
    if (!value) {
      value = 0
    }
    if (parseFloat(value) === parseFloat(1))
      setWordYears("Ano")
    else
      setWordYears("Anos")
    valuesStore.getState().setYears(value)
  }

  const changeMonths = (value) => {
    console.log(value)
    if (!value) {
      value = 0
    }
    if (parseFloat(value) === parseFloat(1))
      setWordMonths("Mês")
    else
      setWordMonths("Meses")
    valuesStore.getState().setMonths(value)
    console.log(months)
  }


  const toggleTheme = () => {
    setDarkMode((curr) => !curr);
    valuesStore.getState().changeTheme(theme === "light" ? "dark" : "light");
  }

  const chartOptions = {
    cutout: '65%',
    plugins: {
      datalabels: {
        color: "white",
        font: {
          weight: "bold",
          size: 16
        },
        padding: 6,
        formatter: (value) => {
          return getTotal(dataVals, value) + "%";
        }
      }
    },
  }

  useEffect(() => {
    valuesStore.getState().setWon(data['Rendimentos']['total'] * months + data['Rendimentos']['total'] * 12 * years);
    valuesStore.getState().setSavings(data['Património'].values[1] * months + data['Património'].values[1] * 12 * years);
    var expenses = data['Casa']['total'] + data['Familiar']['total'] + data['Transportes']['total'] + data['Extras']['total'];
    valuesStore.getState().setExpenses(expenses * months + expenses * 12 * years);
    valuesStore.getState().setInvestments(data['Património'].values[0] * months + data['Património'].values[0] * 12 * years);
    valuesStore.getState().setEmergency(data['Património'].values[2] * months + data['Património'].values[2] * 12 * years);
  }, [data, months, years])

  useEffect(() => {
    let newDataVals = {
      labels: [],
      datasets: [
        {
          label: "Orçamento",
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: [],
          borderWidth: 0.5,
          hoverBorderWidth: 4,
          hoverOffset: 2
        }
      ]
    }
    for (const [key, value] of Object.entries(data)) {
      if (key !== "Rendimentos") {
        newDataVals.labels.push(key);
        newDataVals.datasets[0].data.push(value['total']);
        newDataVals.datasets[0].backgroundColor.push(value['color']);
        newDataVals.datasets[0].hoverBackgroundColor.push(value['color']);
      }
    }
    setDataVals(newDataVals);
  }, [data])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="App" style={{ width: '100%', paddingTop: 20, overflowX: 'hidden' }} id={theme}>
        <header className="App-header">
          <h1 id={theme} style={{ fontWeight: 'bold', flex: "1", width: '100%' }}>Orçamento</h1>
          <div style={{ position: 'absolute', top: 18, right: 20 }}>
            <DarkModeSwitch
              checked={isDarkMode}
              onChange={toggleTheme}
              size={40}
            />
          </div>
          <Container>
            <Row style={{ paddingTop: 10 }}>
              <Col xs="12" sm="12" md="6" lg="4" style={{ paddingTop: 20 }}>
                <BasicCard id="Rendimentos" cardTitle="Rendimentos" background="linear-gradient(180deg, white 87.5%, rgba(54,162,235,0.8))" cardTable={["Salário", "Subsídio de alimentação", "Rendas imobiliárias", "Part-time", "Renda extra", "Pensão / subsídio"]} />
              </Col>
              <Col xs="12" sm="12" md="6" lg="4" style={{ paddingTop: 20 }}>
                <BasicCard id="Património" cardTitle="Património" cardTable={["Investimentos", "Poupança", "Reserva de emergência"]} />
              </Col>
              <Col xs="12" sm="12" md="12" lg="4" style={{ paddingTop: 0, textAlign: "center" }}>
                {dataVals &&
                  <>
                    <Doughnut plugins={[ChartDataLabels]} options={chartOptions} data={dataVals} style={{ maxHeight: 356.5, textAlign: "center", paddingTop: 15 }} />
                  </>
                }
                <h6 style={{ paddingTop: 10 }} id={theme}>
                  Orçamento Zero ?
                </h6>
                <h6 id={theme}>
                  {data['Rendimentos']['total'].toFixed(2)} € - {totalSpent.toFixed(2)} € = <span style={{ background: '#0d6efdA0', paddingLeft: 3, paddingRight: 3, borderRadius: '5%', fontWeight: 'bold' }}>{(data['Rendimentos']['total'] - totalSpent).toFixed(2)} €</span>
                </h6>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="12" md="6" lg="3" xl="3" style={{ paddingTop: 20 }}>
                <BasicCard id="Casa" cardTitle="Casa" cardTable={["Renda / Empréstimo", "Água", "Luz", "Gás", "Internet", "Telefone", "Telemóvel", "TV por cabo", "Condomínio", "Seguros", "IMI"]} />
              </Col>
              <Col xs="12" sm="12" md="6" lg="3" xl="3" style={{ paddingTop: 20 }}>
                <BasicCard id="Familiar" cardTitle="Familiar" cardTable={["Alimentação / Higiene", "Despesas médicas", "Ginásio / atividades", "Educação / propinas", "Escola / creche", "Presentes (Aniversário; Natal)", "Vestuário e Acessórios", "Veterinário", "Despesas animais de estimação"]} />
              </Col>
              <Col xs="12" sm="12" md="6" lg="3" xl="3" style={{ paddingTop: 20 }}>
                <BasicCard id="Transportes" cardTitle="Transportes" cardTable={["Crédito Automóvel", "Combustível", "Seguros", "Manutenção mecânico", "IUC", "Passe Mensal", "Bilhete único (transp. públicos)", "Portagens", "Inspeção veículos"]} />
              </Col>
              <Col xs="12" sm="12" md="6" lg="3" xl="3" style={{ paddingTop: 20 }}>
                <BasicCard id="Extras" cardTitle="Extras" cardTable={["Dívidas (cartões de crédito)", "Crédito Pessoal", "Outros créditos", "Restaurantes / bares / cafés", "Subscrições", "Livros  e workshops", "Reparações / arranjos", "Utensílios", "Férias", "Multas"]} />
              </Col>
            </Row>
            <br />
            <div id={theme} style={{width: '100%'}}>
              <h4>
                Capital após <InputNumber
                  style={{ width: 70, maxHeight: 38, borderRadius: '10%', textAlign: 'center', border: '2px solid black' }}
                  min={0}
                  value={months}
                  max={100000}
                  step={1}
                  onChange={(value) => changeMonths(value)}
                  enableMobileNumericKeyboard
                /> {wordMonths} e <InputNumber
                  style={{ width: 70, maxHeight: 38, borderRadius: '10%', textAlign: 'center', border: '2px solid black' }}
                  min={0}
                  value={years}
                  max={99}
                  step={1}
                  onChange={(value) => changeYears(value)}
                  enableMobileNumericKeyboard
                /> {wordYears}:
              </h4>
              <Row>
                <Col xs="12" sm="6" md="4" lg="4" style={{ paddingTop: 20 }}>
                  <h4>Ganho</h4>
                  <GaugeChart
                    colors={["rgba(0, 255, 0, 0.8)", "rgba(128, 255, 0, 0.8)",
                      "rgba(255, 255, 0, 0.8)", "rgba(255, 128, 0, 0.8)", "rgba(255, 0, 0, 0.8)"]}
                    needleColor={'rgba(54, 162, 235, .5)'}
                    needleBaseColor={'rgba(54, 162, 235, 1)'}
                    textColor={theme === "light" ? 'black' : 'white'}
                    nrOfLevels={5}
                    percent={(won / (won+savings+investments+expenses+emergency))}
                    formatTextValue={() => { return won.toFixed(2) + ' €'}}
                  />
                </Col>
                <Col xs="12" sm="6" md="4" lg="4" style={{ paddingTop: 20 }}>
                  <h4>Poupado</h4>
                  <GaugeChart
                    colors={["rgba(0, 255, 0, 0.8)", "rgba(128, 255, 0, 0.8)",
                      "rgba(255, 255, 0, 0.8)", "rgba(255, 128, 0, 0.8)", "rgba(255, 0, 0, 0.8)"]}
                    needleColor={'rgba(54, 162, 235, .5)'}
                    needleBaseColor={'rgba(54, 162, 235, 1)'}
                    textColor={theme === "light" ? 'black' : 'white'}
                    nrOfLevels={5}
                    percent={(savings / (won+savings+investments+expenses+emergency))}
                    formatTextValue={() => { return savings.toFixed(2) + ' €'}}
                  />
                </Col>
                <Col xs="12" sm="6" md="4" lg="4" style={{ paddingTop: 20 }}>
                  <h4>Investido</h4>
                  <GaugeChart
                    colors={["rgba(0, 255, 0, 0.8)", "rgba(128, 255, 0, 0.8)",
                      "rgba(255, 255, 0, 0.8)", "rgba(255, 128, 0, 0.8)", "rgba(255, 0, 0, 0.8)"]}
                    needleColor={'rgba(54, 162, 235, .5)'}
                    needleBaseColor={'rgba(54, 162, 235, 1)'}
                    textColor={theme === "light" ? 'black' : 'white'}
                    nrOfLevels={5}
                    percent={(investments / (won+savings+investments+expenses+emergency))}
                    formatTextValue={() => { return investments.toFixed(2) + ' €'}}
                  />
                </Col>
                <Col xs="0" sm="0" md="2" lg="2" id="hideCol"></Col>
                <Col xs="12" sm="6" md="4" lg="4" style={{ paddingTop: 20 }}>
                  <h4>Gasto</h4>
                  <GaugeChart
                    colors={["rgba(0, 255, 0, 0.8)", "rgba(128, 255, 0, 0.8)",
                      "rgba(255, 255, 0, 0.8)", "rgba(255, 128, 0, 0.8)", "rgba(255, 0, 0, 0.8)"]}
                    needleColor={'rgba(54, 162, 235, .5)'}
                    needleBaseColor={'rgba(54, 162, 235, 1)'}
                    textColor={theme === "light" ? 'black' : 'white'}
                    nrOfLevels={5}
                    percent={(expenses / (won+savings+investments+expenses+emergency))}
                    formatTextValue={() => { return expenses.toFixed(2) + ' €'}}
                  />
                </Col>
                <Col xs="0" sm="3" md="0" lg="0" id="showCol"></Col>
                <Col xs="12" sm="6" md="4" lg="4" style={{ paddingTop: 20 }}>
                  <h4>De Emergência</h4>
                  <GaugeChart
                    colors={["rgba(0, 255, 0, 0.8)", "rgba(128, 255, 0, 0.8)",
                      "rgba(255, 255, 0, 0.8)", "rgba(255, 128, 0, 0.8)", "rgba(255, 0, 0, 0.8)"]}
                    needleColor={'rgba(54, 162, 235, .5)'}
                    needleBaseColor={'rgba(54, 162, 235, 1)'}
                    textColor={theme === "light" ? 'black' : 'white'}
                    nrOfLevels={5}
                    percent={(emergency / (won+savings+investments+expenses+emergency))}
                    formatTextValue={() => { return emergency.toFixed(2) + ' €'}}
                  />
                </Col>
              </Row>
            </div>
            <br />
          </Container>
        </header>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
