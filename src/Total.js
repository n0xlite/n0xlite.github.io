export default function Total(props) {
    return (
        <div className="total">
            <h2 className="total--text">Total In/Out:</h2>
            <span className="total--output">${(props.windowPrice + props.screenPrice).toFixed(2)}</span>
            <h2 className="total--text">Total Out Only:</h2>
            <span className="total--output">${((props.windowPrice * 0.67) + props.screenPrice).toFixed(2)}</span>
        </div>
    )
}