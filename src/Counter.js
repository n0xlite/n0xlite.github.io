export default function Counter(props) {
    return (
        <div className="counter">
            <h3 className="counter--title">{props.name}</h3>
            <div className="counter--buttons">
                <button className="counter--minus" onClick={props.handleSub}>-</button>
                <span className="counter--count">{props.count}</span>
                <button className="counter--plus" onClick={props.handleAdd}>+</button>
                <button className="counter--reset" onClick={props.handleReset}>Reset</button>
            </div>
        </div>
    )
}