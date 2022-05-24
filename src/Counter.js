export default function Counter(props) {
    return (
        <div className={props.type}>
            <h3 className="counter--title">{props.name}</h3>
            <span className="counter--count">{props.count}</span>
            <button className="counter--minus" onClick={props.handleSub}>-</button>
            <button className="counter--plus" onClick={props.handleAdd}>+</button>
            <button className="counter--reset" onClick={props.handleReset}>Reset</button>
        </div>
    )
}