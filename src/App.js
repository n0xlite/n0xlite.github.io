import {useState} from 'react'
import {dataSheet} from './dataSheet'
import Navbar from './Navbar'
import Counter from './Counter'
import Total from './Total'

function App() {
  const [bid, setBid] = useState(dataSheet)
  
  function addItem(id) {
    const newBid = [...bid]
    const newBidItem = {...newBid[id]}
    newBidItem.count = newBidItem.count + 1
    newBid[id] = newBidItem
    setBid(newBid)
  }

  function subItem(id) {
    const newBid = [...bid]
    const newBidItem = {...newBid[id]}
    newBidItem.count = newBidItem.count - 1
    newBid[id] = newBidItem
    setBid(newBid)
  }

  function resetItem(id) {
    const newBid = [...bid]
    const newBidItem = {...newBid[id]}
    newBidItem.count = 0
    newBid[id] = newBidItem
    setBid(newBid)
  }

  let windowSum = 0
  let screenSum = 0
  bid.forEach(item => {
    if (item.type === "window") {
      windowSum += item.count * item.price
    } else if (item.type === "screen") {
      screenSum += item.count * item.price
    }
  })

  const counters = bid.map(item => {
    return <Counter
        key={item.id}
        name={item.name}
        type={item.type}
        description={item.description}
        count={item.count}
        handleAdd={() => addItem(item.id)}
        handleSub={() => subItem(item.id)}
        handleReset={() => resetItem(item.id)}
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