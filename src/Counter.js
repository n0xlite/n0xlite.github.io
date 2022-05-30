export default function Counter(props) {
    return (
        <div className="counter">
            <h2 className="counter--title">{props.name} {props.type}</h2>
            {props.desc && <div className="counter--desc">{props.desc}</div>}
            <div className="counter--buttons">
                <button className="button button--minus" onClick={() => props.handleMinus(props.id)}>-</button>
                <span className="counter--count">{props.count}</span>
                <button className="button button--plus" onClick={() => props.handlePlus(props.id)}>+</button>
                <button className="button button--reset" onClick={() => props.handleReset(props.id)}>Reset</button>
            </div>
        </div>
    )
}