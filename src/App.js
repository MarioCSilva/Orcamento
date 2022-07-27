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

export const ThemeContext = createContext(null);

var getTotal = function(dataVals, value) {
  var sum = dataVals.datasets[0].data.reduce(
    (a, b) => a + b,
    0
  );

  return (value / sum * 100).toFixed(2);
};

function App () {
  const [dataVals, setDataVals] = useState(null);
  const data = valuesStore(state => state.data);
  const totalSpent = valuesStore(state => state.totalSpent);
  const theme = valuesStore(state => state.theme);
  const [isDarkMode, setDarkMode] = useState(theme === "dark" ? true : false);
  
  const toggleTheme = () => {
    setDarkMode((curr) => !curr);
    valuesStore.getState().changeTheme(theme === "light" ? "dark" : "light");
  }

  const chartOptions = {
    cutout: '65%',
    plugins: {
      datalabels: {
        color: "#212529",
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
        newDataVals.labels.push(key)
        newDataVals.datasets[0].data.push(value['total'])
        newDataVals.datasets[0].backgroundColor.push(value['color'])
        newDataVals.datasets[0].hoverBackgroundColor.push(value['color'])
      }
    }
    setDataVals(newDataVals)
  }, [data])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="App" style={{ width: '100%', paddingTop: 20, overflowX: 'hidden' }} id={theme}>
        <header className="App-header">
            <h1 id={theme} style={{ fontWeight: 'bold', flex: "1", width: '100%'}}>Orçamento</h1>
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
                  <Doughnut plugins={[ChartDataLabels]} options={chartOptions} data={dataVals} style={{ maxHeight: 356.5, textAlign: "center", paddingTop: 15}} />
                </>
                }
                <h6 style={{paddingTop: 10}} id={theme}>
                  Orçamento Zero ?
                </h6>
                <h6 id={theme}>
                  {data['Rendimentos']['total'].toFixed(2)} € - {totalSpent.toFixed(2)} € = <span style={{background: '#0d6efdA0', paddingLeft:3, paddingRight:3, borderRadius: '5%', fontWeight: 'bold'}}>{(data['Rendimentos']['total'] - totalSpent).toFixed(2)} €</span>
                </h6>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="12" md="4" lg="3" style={{ paddingTop: 20 }}>
                <BasicCard id="Casa" cardTitle="Casa" cardTable={["Renda / Empréstimo", "Água", "Luz", "Gás", "Internet", "Telefone", "Telemóvel", "TV por cabo", "Condomínio", "Seguros", "IMI"]} />
              </Col>
              <Col xs="12" sm="12" md="4" lg="3" style={{ paddingTop: 20 }}>
                <BasicCard id="Familiar" cardTitle="Familiar" cardTable={["Alimentação / Higiene", "Despesas médicas", "Ginásio / atividades", "Educação / propinas", "Escola / creche", "Presentes (Aniversário; Natal)", "Vestuário e Acessórios", "Veterinário", "Despesas animais de estimação"]} />
              </Col>
              <Col xs="12" sm="12" md="4" lg="3" style={{ paddingTop: 20 }}>
                <BasicCard id="Transportes" cardTitle="Transportes" cardTable={["Crédito Automóvel", "Combustível", "Seguros", "Manutenção mecânico", "IUC", "Passe Mensal", "Bilhete único (transp. públicos)", "Portagens", "Inspeção veículos"]} />
              </Col>
              <Col xs="12" sm="12" md="4" lg="3" style={{ paddingTop: 20 }}>
                <BasicCard id="Extras" cardTitle="Extras" cardTable={["Dívidas (cartões de crédito)", "Crédito Pessoal", "Outros créditos", "Restaurantes / bares / cafés", "Subscrições", "Livros  e workshops", "Reparações / arranjos", "Utensílios", "Férias", "Multas"]} />
              </Col>
            </Row>
          </Container>
          <hr />
          <h2>By </h2>
        </header>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
