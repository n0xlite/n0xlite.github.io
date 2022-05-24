export default function Total(props) {
    return (
        <div className="total">
            <h3 className="total--text">Total In/Out:</h3>
            <h3 className="total--output">${(props.windowPrice + props.screenPrice).toFixed(2)}</h3>
            <h3 className="total--text">Total Out Only:</h3>
            <h3 className="total--output">${((props.windowPrice * 0.67) + props.screenPrice).toFixed(2)}</h3>
        </div>
    )
}