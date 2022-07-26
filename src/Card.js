import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import InputNumber from 'react-input-number';
import valuesStore from './store.js'

const BasicCard = ({ id, cardTitle, background='white', cardTable=["Salário", "Subsídio de alimentação", "Rendas imobiliárias", "Part-time", "Renda extra", "Pensão / subsídio"] }) => {
  const [title, ] = useState(cardTitle);
  const [num, setNum] = useState(0);  
  const [total, setTotal] = useState(0);
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
    var sum = 0;
    for (let i = 0; i < copyArr.length; i++) {
      sum += parseFloat(copyArr[i]);
    }
    valuesStore.getState().update(id, index, value)
    setTotal(sum);
  }  

  return (
    <Card style={{background: background, width: '100%', backgroundClip: 'padding-box'}}>
      <Card.Body style={{paddingBottom: 0, paddingTop: 8, paddingLeft: 8, paddingRight: 8}}>
        <Card.Title style={{color: 'black'}}>
          {title}
        </Card.Title>

          <Table responsive style={{verticalAlign: 'middle', marginBottom: 0}}>
          <tbody style={{fontSize: 14}}>
                {cardTable.map((option, index) => (
                  
                  <tr>
                    <td key={index} style={{textAlign: 'left'}}>
                      {option}
                    </td>
                    <td style={{textAlign: 'right', width: 120}}>
                      <InputNumber
                        style={{width: 80}}
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