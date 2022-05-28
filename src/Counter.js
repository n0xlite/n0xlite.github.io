export default function Counter(props) {
    return (
        <div className="counter">
            <h2 className="counter--title">{props.name}</h2>
            <div className="counter--buttons">
                <button className="button button--minus" onClick={props.handleSub}>-</button>
                <span className="counter--count">{props.count}</span>
                <button className="button button--plus" onClick={props.handleAdd}>+</button>
                <button className="button button--reset" onClick={props.handleReset}>Reset</button>
            </div>
        </div>
    )
}