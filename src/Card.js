import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import InputNumber from 'react-input-number';
import valuesStore from './store.js'

const BasicCard = ({ id, cardTitle, background='white', cardTable=["Salário", "Subsídio de alimentação", "Rendas imobiliárias", "Part-time", "Renda extra", "Pensão / subsídio"] }) => {
  const [title, ] = useState(cardTitle);
  const theme = valuesStore(state => state.theme);
  const [counts, setCounts] = useState([]);
  let data = valuesStore(state => state.data);

  useEffect(() => {
    setCounts(new Array(cardTable.length).fill(0));
    valuesStore.getState().create(id, cardTable.length);
    if (data[id])
      setCounts(data[id]['values'])
  }, [data, id, cardTable.length]);

  const changeValue = (index, value) => {
    if (!value || typeof(value) !== 'number' || value < 0 || value >= 10000000) {
      value = 0
    }
    var copyArr = [...counts];
    copyArr[index] = value;
    setCounts(copyArr);
    valuesStore.getState().update(id, index, value)
  }  

  return (
    <Card  bg={ theme === 'light' ? 'light' : 'secondary'} style={{ width: '100%', backgroundClip: 'padding-box',
      boxShadow: theme === 'light' ?
        '0 0px 10px rgba(108, 117, 125,.08), 0 0 6px rgba(108, 117, 125,.05)' :
        '0 0px 10px rgba(248, 249, 250,.08), 0 0 6px rgba(248, 249, 250,.05)',
      border: theme !== 'light' ? '#f8f9fa' : '#212529'
    }}>
      <Card.Body style={{paddingBottom: 0, paddingTop: 13, paddingLeft: 8, paddingRight: 8}}>
        <Card.Title style={{textTransform: 'uppercase', fontWeight: 'bold', color: theme !== 'light' ? 'white' : '#23272a'}}>
          {title}
        </Card.Title>

          <Table responsive style={{verticalAlign: 'middle', marginBottom: 0}}>
          <tbody style={{fontSize: 13, color: theme !== 'light' ? 'white' : '#23272a'}}>
                {cardTable.map((option, index) => (
                  
                  <tr key={index} style={{borderColor: theme === 'light' ? '#dee2e6' : 'gray'}}>
                    <td key={index} style={{textAlign: 'left'}}>
                      {option}
                    </td>
                    <td style={{textAlign: 'right', width: 120}}>
                      <InputNumber
                        style={{color: theme !== 'light' ? 'white' : '#23272a', width: 80, textAlign: 'right', border: theme === 'light' ? '1px solid #dee2e6' : '1px solid gray', borderRadius: 4, height: 22,
                          background: theme === 'light' ? '#f8f9fa' : '#6c757d'}}
                        min={0}
                        max={1000000000000}
                        value={counts[index]}
                        step={1}
                        onChange={(value) => changeValue(index, value)}
                        enableMobileNumericKeyboard
                      />
                    </td>
                  </tr>
                ))}
                <tr style={{border: '0px transparent'}}>
                  <td style={{textAlign: 'right'}}>
                    Total
                  </td>
                  <td style={{textAlign: 'right', width: 150, fontWeight: 'bold'}}>{data[id] ? data[id]['total'].toFixed(2) : 0} €</td>
                </tr>
            </tbody>
          </Table>
        
      </Card.Body>
    </Card>
  );
}

export default BasicCard;