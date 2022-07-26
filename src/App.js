import { createContext, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Pie } from "react-chartjs-2";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { PersistGate } from 'zustand-persist'
import BasicCard from './Card.js';
import valuesStore from './store.js'

import 'chart.js/auto';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export const ThemeContext = createContext(null);

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

  useEffect(() => {
    let newDataVals = {
      labels: [],
      datasets: [
        {
          label: "Orçamento",
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: [],
          borderWidth: 1
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
      <div className="App" style={{ width: '100%', paddingTop: 20 }} id={theme}>
        <header className="App-header">
          <div style={{ position: 'absolute', top: 25, right: '10rem' }}>
            <DarkModeSwitch
              checked={isDarkMode}
              onChange={toggleTheme}
              size={40}
            />
          </div>
          <h1 id={theme} style={{ fontWeight: 'bold'}}>Orçamento</h1>
          <Container>
            <Row style={{ paddingTop: 10 }}>
              <Col xs="12" sm="12" md="6" lg="4" style={{ paddingTop: 20 }}>
                <BasicCard id="Rendimentos" cardTitle="Rendimentos" background="linear-gradient(180deg, white 88%, rgb(54 162 235))" cardTable={["Salário", "Subsídio de alimentação", "Rendas imobiliárias", "Part-time", "Renda extra", "Pensão / subsídio"]} />
              </Col>
              <Col xs="12" sm="12" md="6" lg="4" style={{ paddingTop: 20 }}>
                <BasicCard id="Património" cardTitle="Património" cardTable={["Investimentos", "Poupança", "Reserva de emergência"]} />
              </Col>
              <Col xs="12" sm="12" md="12" lg="4" style={{ paddingTop: 0, textAlign: "center" }}>
                {dataVals &&
                  <Pie data={dataVals} style={{ maxHeight: 356.5, textAlign: "center", paddingTop: 15 }} />
                }
                <h6 style={{paddingTop: 10}} id={theme}>
                  Orçamento Zero ?
                </h6>
                <h6 id={theme}>
                  {data['Rendimentos']['total']} € - {totalSpent} € = <span style={{background: '#0d6efd', padding:3, borderRadius: '10%', fontWeight: 'bold'}}>{data['Rendimentos']['total'] - totalSpent} €</span>
                </h6>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="12" md="4" lg="3" style={{ minWidth: 290, paddingTop: 20 }}>
                <BasicCard id="Casa" cardTitle="Casa" cardTable={["Renda / Empréstimo", "Água", "Luz", "Gás", "Internet", "Telefone", "Telemóvel", "TV por cabo", "Condomínio", "Seguros", "IMI"]} />
              </Col>
              <Col xs="12" sm="12" md="4" lg="3" style={{ minWidth: 290, paddingTop: 20 }}>
                <BasicCard id="Familiar" cardTitle="Familiar" cardTable={["Alimentação / Higiene", "Despesas médicas", "Ginásio / atividades", "Educação / propinas", "Escola / creche", "Presentes (Aniversário; Natal)", "Vestuário e Acessórios", "Veterinário", "Despesas animais de estimação"]} />
              </Col>
              <Col xs="12" sm="12" md="4" lg="3" style={{ minWidth: 290, paddingTop: 20 }}>
                <BasicCard id="Transportes" cardTitle="Transportes" cardTable={["Crédito Automóvel", "Combustível", "Seguros", "Manutenção mecânico", "IUC", "Passe Mensal", "Bilhete único (transp. públicos)", "Portagens", "Inspeção veículos"]} />
              </Col>
              <Col xs="12" sm="12" md="4" lg="3" style={{ minWidth: 290, paddingTop: 20 }}>
                <BasicCard id="Extras" cardTitle="Extras" cardTable={["Dívidas (cartões de crédito)", "Crédito Pessoal", "Outros créditos", "Restaurantes / bares / cafés", "Subscrições", "Livros  e workshops", "Reparações / arranjos", "Utensílios", "Férias", "Multas"]} />
              </Col>
            </Row>
          </Container>
          <hr />
        </header>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;