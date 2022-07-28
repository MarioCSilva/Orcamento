import create from 'zustand'
import persist from './utils/persist.js'

const colors = {
  'Rendimentos': "#FF6384",
  'Património': "#36A2EB",
  'Casa': "#FFCE56",
  'Familiar': "#52D726",
  'Transportes': "#FF7300",
  'Extras': "#47B39C",
  
}


const valuesStore = create(
  persist(
    {
      key: "root",
      denylist: []
    },
    (set, get) => ({
      data: { 'Rendimentos': { 'total': 0, 'values': new Array(6).fill(0), 'color': colors["Rendimentos"] }},
      theme: 'dark',
      totalSpent: 0,
      years: 0,
      months: 6,
      won: 0,
      savings: 0,
      expenses: 0,
      investments: 0,
      emergency: 0,
      create: (id, len) => {
        const newData = { ...get().data }
        if (!(id in newData)) {
          newData[id] = {
            'total': 0,
            'values': new Array(len).fill(0),
            'color': colors[id]
          }
        }
        set((s) => ({...s, data: newData }))
      },
      update: (id, index, value) => {
        const newData = { ...get().data }
        const prevValue = newData[id]['values'][index];
        const prevTotal = newData[id]['total'];
        newData[id]['values'][index] = value;
        newData[id]['total'] += + value - prevValue;
        let newTotalSpent = get().totalSpent;
        if (id !== "Rendimentos")
          newTotalSpent += newData[id]['total'] - prevTotal;
        set((s) => ({...s, data: newData, totalSpent: newTotalSpent }))
      },
      changeTheme: (newTheme) => {
        set((s) => ({...s, theme: newTheme}))
      },
      setYears: (value) => {
        set((s) => ({...s, years: value}))
      },
      setMonths: (value) => {
        set((s) => ({...s, months: value}))
      },
      setWon: (value) => {
        set((s) => ({...s, won: value}))
      },
      setSavings: (value) => {
        set((s) => ({...s, savings: value}))
      },
      setExpenses: (value) => {
        set((s) => ({...s, expenses: value}))
      },
      setInvestments: (value) => {
        set((s) => ({...s, investments: value}))
      },
      setEmergency: (value) => {
        set((s) => ({...s, emergency: value}))
      }

    }),
  )
);

export default valuesStore;