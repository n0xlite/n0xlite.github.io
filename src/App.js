import {useState} from 'react'
import {dataSheet} from './dataSheet'
import Navbar from './Navbar'
import Counter from './Counter'
import Total from './Total'

function App() {
  const [bid, setBid] = useState(dataSheet)
  
  function plusCount(id) {
    setBid(prevBid => {
        return prevBid.map(item => {
            return item.id === id ? {...item, count: item.count + 1} : item
        })
    })
  }

  function minusCount(id) {
    setBid(prevBid => {
        return prevBid.map(item => {
            return item.id === id ? {...item, count: item.count - 1} : item
        })
    })
  }

  function resetCount(id) {
    setBid(prevBid => {
        return prevBid.map(item => {
            return item.id === id ? {...item, count: 0} : item
        })
    })
  }

  let windowSum = 0
  let screenSum = 0
  bid.forEach(item => {
    if (item.type === "Pane") {
      windowSum += item.count * item.price
    } else if (item.type === "Screen") {
      screenSum += item.count * item.price
    }
  })

  const counters = bid.map(item => {
    return <Counter
        key={item.id}
        id={item.id}
        name={item.name}
        type={item.type}
        desc={item.desc}
        count={item.count}
        handlePlus={plusCount}
        handleMinus={minusCount}
        handleReset={resetCount}
      />
  })

  return (
    <div className="App">
      <Navbar />
      {counters}
      <Total windowPrice={windowSum} screenPrice={screenSum}/>
    </div>
  )
}

export default App;