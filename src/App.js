import { createContext, useEffect, useState, createRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Pie, Bar } from "react-chartjs-2";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import BasicCard from './Card.js';
import valuesStore from './store.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import InputNumber from 'react-input-number';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { Icon } from "@material-ui/core"
import Pdf from "react-to-pdf";
import "chartjs-plugin-datalabels";
import 'chart.js/auto';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export const ThemeContext = createContext(null);
const ref = createRef();



var getTotal = function (dataVals, value) {
  var sum = dataVals.datasets[0].data.reduce(
    (a, b) => a + b,
    0
    );
    if ((value / sum * 100).toFixed(0) !== '0')
    return (value / sum * 100).toFixed(0) + "%";
    return null
  };
  
  function App() {
    const [dataVals, setDataVals] = useState(null);
    const [capitalVals, setCapitalVals] = useState(null)
    const [wordMonths, setWordMonths] = useState("Meses");
    const [wordYears, setWordYears] = useState("Anos");
    const years = valuesStore(state => state.years);
    const months = valuesStore(state => state.months);
    const data = valuesStore(state => state.data);
    const totalSpent = valuesStore(state => state.totalSpent);
    const theme = valuesStore(state => state.theme);
    const [isDarkMode, setDarkMode] = useState(theme === "dark" ? true : false);
    
    const InfoIcon = () => (
      <Icon>
          <img alt={''} src={theme !== "light" ? require('./info-light.png') : require('./info.png')} style={{width: 20, height: 20}} id={theme}/>
      </Icon>
    )
    
    const DoneIcon = () => (
      <Icon>
          <img alt={''} src={theme !== "light" ? require('./done-light.png') : require('./done.png')} style={{width: 20, height: 20}}/>
      </Icon>
    )
    
    const ClearIcon = () => (
      <Icon>
          <img alt={''} src={theme !== "light" ? require('./clear-light.png') : require('./clear.png')} style={{width: 20, height: 20}}/>
      </Icon>
    )

    useEffect(()=>{
    if (parseFloat(years) === parseFloat(1))
      setWordYears("Ano")
    else
      setWordYears("Anos")

  if (parseFloat(months) === parseFloat(1))
      setWordMonths("Mês")
    else
      setWordMonths("Meses")

  }, [years, months])

  const changeYears = (value) => {
    if (!value) {
      value = 0
    }
    valuesStore.getState().setYears(value)
  }

  const changeMonths = (value) => {
    if (!value) {
      value = 0
    }
    valuesStore.getState().setMonths(value)
  }


  const toggleTheme = () => {
    setDarkMode((curr) => !curr);
    valuesStore.getState().changeTheme(theme === "light" ? "dark" : "light");
  }

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: theme === 'light' ? '#23272a' : 'white'
        }
      },
      datalabels: {
        color: theme === 'light' ? '#23272a' : 'white',
        font: {
          weight: "bold",
          size: 16
        },
        padding: 6,
        formatter: (value) => {
          return getTotal(dataVals, value);
        }
      }
    },
  }

  const barChartOptions = {
    responsive: true,
    scales: {
      yAxes:{
          ticks:{
              color: theme === 'light' ? '#23272a' : 'white'
          }
      },
      xAxes: {
          ticks:{
              color: theme === 'light' ? '#23272a' : 'white'
          }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: theme === 'light' ? '#23272a' : 'white',
        font: {
          weight: "bold",
          size: 16
        },
        padding: 6,
        formatter: (value) => {
          return parseFloat(value).toFixed(0) !== '0' ? parseFloat(value).toFixed(0) + " €" : null;
        },
      }
    },
  }

  useEffect(() => {
    var color = theme === 'light' ? '#f8f9fa' : '#6c757d';
    var capital = [];
    if (data['Rendimentos'] && data['Casa'] && data['Património']) {
      capital[0] = (data['Rendimentos']['total'] * months + data['Rendimentos']['total'] * 12 * years).toFixed(2);
      var expenses = data['Casa']['total'] + data['Familiar']['total'] + data['Transportes']['total'] + data['Extras']['total'];
      capital[1] = (expenses * months + expenses * 12 * years).toFixed(2);
      capital[2] = (data['Património'].values[0] * months + data['Património'].values[0] * 12 * years).toFixed(2);
      capital[3] = (data['Património'].values[1] * months + data['Património'].values[1] * 12 * years).toFixed(2);
      capital[4] = (data['Património'].values[2] * months + data['Património'].values[2] * 12 * years).toFixed(2);
    }
    setCapitalVals({
      labels: ["Ganho", "Gasto", "Investido", "Poupado", "De Emergência"],
      datasets: [
        {
          label: "",
          data: capital,
          backgroundColor: color,
          hoverBorderColor: new Array(5).fill(color),
          hoverBorderWidth: 7,
        }
      ]
    })
  }, [data, months, years, theme])

  useEffect(() => {
    let newDataVals = {
      labels: [],
      datasets: [
        {
          label: "Orçamento",
          data: [],
          backgroundColor: [],
          hoverBorderColor: [],
          borderColor: [],
          borderWidth: 0.5,
          hoverBorderWidth: 1,
          hoverOffset: 0
        }
      ]
    }
    for (const [key, value] of Object.entries(data)) {
      if (key !== "Rendimentos") {
        newDataVals.labels.push(key);
        newDataVals.datasets[0].data.push(value['total']);
        newDataVals.datasets[0].backgroundColor.push(value['color']);
        newDataVals.datasets[0].borderColor.push(value['color']);
        newDataVals.datasets[0].hoverBorderColor.push(theme === 'light' ? 'rgb(35, 39, 42)' : 'white');
      }
    }
    setDataVals(newDataVals);
  }, [data, theme])

  const [options, setOptions] = useState({
    unit: 'in',
    format: [
      (ref.current ? ref.current.offsetWidth : window.innerWidth) / 96,
      (ref.current ? ref.current.offsetHeight : window.innerHeight) / 96
    ]
  });

  const handleResize = () => {
    setOptions({
      unit: 'in',
      format: [
        (ref.current ? ref.current.offsetWidth : window.innerWidth) / 96,
        (ref.current ? ref.current.offsetHeight : window.innerHeight) / 96
      ]
    })
  }

  useEffect(() => {
    console.log(options.format)
  }, [options])

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);


  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="App" style={{ width: '100%', overflowX: 'hidden' }} id={theme}>
        <header className="App-header">
          <Container ref={ref} id={theme} style={{paddingTop: 20}}>
            <Row>
              <Col xs="3" sm="4">
                <Pdf targetRef={ref} filename="orcamento.pdf" options={options} scale={1}>
                  {({ toPdf }) => <Button variant={theme} onClick={toPdf} style={{fontWeight: 600, fontSize: '.75rem', float: 'left'}}>PDF</Button>}
                </Pdf>
              </Col>
              <Col xs="6" sm="4">
                <h2 id={theme} style={{ fontWeight: '900', width: '100%'}}>ORÇAMENTO</h2>
              </Col>
              <Col xs="3" sm="4">
                <DarkModeSwitch
                  style={{float: 'right'}}
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  size={36}
                />
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="12" md="6" lg="4" style={{ paddingTop: 20 }}>
                <BasicCard id="Rendimentos" cardTitle="Rendimentos" cardTable={["Salário", "Subsídio de alimentação", "Rendas imobiliárias", "Part-time", "Renda extra", "Pensão / subsídio"]} />
              </Col>
              <Col xs="12" sm="12" md="6" lg="4" style={{ paddingTop: 20 }}>
                <BasicCard id="Património" cardTitle="Património" cardTable={["Investimentos", "Poupança", "Reserva de emergência"]} />
                <div style={{borderRadius: '5px', marginTop: '20px', height: 95, 
                  boxShadow: theme === 'light' ?
                  '0 0px 10px rgba(108, 117, 125,.08), 0 0 6px rgba(108, 117, 125,.05)' :
                  '0 0px 10px rgba(248, 249, 250,.08), 0 0 6px rgba(248, 249, 250,.05)',
                  border: theme !== 'light' ? '#f8f9fa' : '#212529',
                  background: theme === 'light' ? '#f8f9fa' : '#6c757d'
                }}>
                  <h6 style={{ fontWeight: 500, paddingTop: 24, background: 'transparent', height: '100%',  color: theme !== 'light' ? 'white' : '#23272a'}}>
                    Orçamento Zero
                    {
                      data['Rendimentos']['total'].toFixed(2) - totalSpent.toFixed(2) === 0 ?
                        <DoneIcon style={{color: theme === 'light' ? '#141619' : 'white', paddingBottom: 5}}/> :
                        <ClearIcon style={{color: theme !== 'light' ? 'white' : '#141619', paddingBottom: 5}}/>
                    }
                    <br/>
                    {data['Rendimentos']['total'].toFixed(2)} € - {totalSpent.toFixed(2)} € = <span style={{paddingLeft: 3, paddingRight: 3, borderRadius: '5%', fontWeight: '900' }}>{(data['Rendimentos']['total'] - totalSpent).toFixed(2)} €</span>
                  </h6>
                </div>
              </Col>
              <Col xs="12" sm="12" md="12" lg="4" style={{ paddingTop: 0, textAlign: "center" }}>
                {dataVals &&
                  <>
                    <Pie plugins={[ChartDataLabels]} options={pieChartOptions} data={dataVals} style={{ maxHeight: 330, textAlign: "center", paddingTop: 15 }} />
                  </>
                }
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
            <div id={theme} style={{width: '100%', paddingTop: 30}}>
              <h4 style={{fontWeight: '900'}}>
                Capital após <InputNumber
                  style={{ fontWeight: 900, width: (months.toFixed(0).length)*20, textAlign: 'center', border: 'none', background: 'transparent', color: theme === 'light' ? '#23272a': 'white'}}
                  min={0}
                  value={months}
                  max={100000}
                  step={1}
                  onChange={(value) => changeMonths(value)}
                  enableMobileNumericKeyboard
                /> {wordMonths} e <InputNumber
                  style={{ fontWeight: 900, width: (years.toFixed(0).length)*20, textAlign: 'center', border: 'none', background: 'transparent', color: theme === 'light' ? '#23272a': 'white'}}
                  min={0}
                  value={years}
                  max={99}
                  step={1}
                  onChange={(value) => changeYears(value)}
                  enableMobileNumericKeyboard
                /> {wordYears}
                <Tooltip title="Edita o número de meses e anos!">
                <IconButton style={{marginBottom: 9, cursor: 'default', marginLeft: 5}}>
                  <InfoIcon style={{color: theme === 'light' ? '#23272a': 'white'}}/>
                </IconButton>
              </Tooltip>
              </h4>
              <Row>
                { dataVals &&
                  <>
                    <Bar plugins={[ChartDataLabels]} options={barChartOptions} data={capitalVals} style={{ maxHeight: 356.5, textAlign: "center", paddingTop: 15 }} />
                  </>
                }
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
