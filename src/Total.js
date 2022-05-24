export default function Total(props) {
    return (
        <div className="total">
            <h3 className="total--inout">Total In/Out: ${(props.windowPrice + props.screenPrice).toFixed(2)}</h3>
            <h3 className="total--outonly">Total Out Only: ${((props.windowPrice * 0.67) + props.screenPrice).toFixed(2)}</h3>
        </div>
    )
}