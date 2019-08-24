import React, { useState } from "react"
import ReactDOM from 'react-dom'
import BMap from 'BMap'

function Overlay(point) {
    this._container = document.createElement('div')
    this._point = point
}
Overlay.prototype = new BMap.Overlay()
Overlay.prototype.constructor = Overlay
Overlay.prototype.initialize = function (map) {
    this._map = map
    let container = this._container
    container.style.position = "absolute"
    container.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    //在调用removeOverlay后会自动从容器中去除
    map.getPanes().labelPane.appendChild(container);
    return this._container
}

Overlay.prototype.draw = function () {
    console.log(this._container)
    let map = this._map;
    let pixel = map.pointToOverlayPixel(this._point);
    this._container.style.left = `${pixel.x}px`;
    this._container.style.top = `${pixel.y}px`;
}

const Bridge = props => {
    let initText = props.text
    let { textChangeCallback } = props
    let [text, setText] = useState(initText)
    textChangeCallback && textChangeCallback((newText) => {
        setText(newText)
        console.log('setText:', newText)
    })

    return (<div>
        <h1>
            {text}
        </h1>
    </div>)
}


class TextIcon extends Overlay {
    constructor(point, text) {
        super(point)
        this._point = point
        this._text = text
        this._callBack = null
        this._reactElement = <Bridge text={text}
            textChangeCallback={func => { this._callBack = func }} />

        this._container = document.createElement('div')
        ReactDOM.render(this._reactElement, this._container)
    }

    setText(text){
        this._callBack(text)
    }
}



export default TextIcon