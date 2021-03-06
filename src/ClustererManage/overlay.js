import React, { useEffect } from "react"
import ReactDOM from 'react-dom'
import BMap from 'BMap'

function MyOverlay(point,container) {
    this._container = container
    this._point = point
}
MyOverlay.prototype = new BMap.Overlay()
MyOverlay.prototype.constructor = MyOverlay
MyOverlay.prototype.initialize = function (map) {
    let container = this._container
    container.style.position = "absolute"
    container.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    //在调用removeOverlay后会自动从容器中去除
    map.getPanes().labelPane.appendChild(container);
    return this._container
}

MyOverlay.prototype.draw = function (){
    console.log(this._container)
    let map = this._map;
    let pixel = map.pointToOverlayPixel(this._point);
    this._container.style.left = `${pixel.x}px`;
    this._container.style.top = `${pixel.y}px`;
}

const Overlay = props => {
    let container = document.createElement('div')
    ReactDOM.render(<div {...props}>{props.children}</div>, container)
    let point = new BMap.Point(116.407845,39.914101)
    let tmp = new MyOverlay(point,container)
    return null
}
export default Overlay