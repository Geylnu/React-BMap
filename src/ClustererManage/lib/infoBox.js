import React, { useState } from "react"
import ReactDOM from 'react-dom'
import BMap from 'BMap'

function Overlay(point) {
    this._container = document.createElement('div')
    this._position = point


}
Overlay.prototype = new BMap.Overlay()
Overlay.prototype.constructor = Overlay
Overlay.prototype.initialize = function (map) {
    this._map = map
    let container = this._container
    container.style.position = "absolute"
    //在调用removeOverlay后会自动从容器中去除
    map.getPanes().floatPane.appendChild(container);
    return this._container
}

Overlay.prototype.draw = function () {
    if (!this._position) {
        return
    }
    let map = this._map;
    let pixel = map.pointToOverlayPixel(this._position);
    this._container.style.left = `${pixel.x}px`;
    this._container.style.top = `${pixel.y}px`;
}

const Bridge = props =>{
    return (<div></div>)
}

class Infowindow extends Overlay{
    constructor(point,data){
        
    }
}

export default Infowindow