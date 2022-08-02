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
  }, [id, cardTable.length]);

  const changeValue = (index, value) => {
    if (!value) {
      value = 0
    }
    var copyArr = [...counts];
    copyArr[index] = value;
    setCounts(copyArr);
    valuesStore.getState().update(id, index, value)
  }  

  return (
    <Card style={{ background: background, width: '100%', backgroundClip: 'padding-box',
      boxShadow: theme === 'light' ? '0 6px 10px rgba(0,0,0,.08), 0 0 6px rgba(0,0,0,.05)' : '0 6px 10px rgba(255,255,255,.08), 0 0 6px rgba(255,255,255,.05)'
    }}>
      <Card.Body style={{paddingBottom: 0, paddingTop: 8, paddingLeft: 8, paddingRight: 8}}>
        <Card.Title style={{textTransform: 'uppercase', fontWeight: 'bold', color: '#23272a'}}>
          {title}
        </Card.Title>

          <Table responsive style={{verticalAlign: 'middle', marginBottom: 0}}>
          <tbody style={{fontSize: 13}}>
                {cardTable.map((option, index) => (
                  
                  <tr  key={index}>
                    <td key={index} style={{textAlign: 'left'}}>
                      {option}
                    </td>
                    <td style={{textAlign: 'right', width: 120}}>
                      <InputNumber
                        style={{width: 80, textAlign: 'right', border: '1px solid #dee2e6', borderRadius: 4, height: 22}}
                        min={0}
                        max={1000000000000}
                        value={data[id] ? data[id]['values'][index] : 0}
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