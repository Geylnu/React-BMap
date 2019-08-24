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
    map.getPanes().labelPane.appendChild(container);
    return this._container
}

Overlay.prototype.draw = function () {
    if (!this._position){
        return
    }
    let map = this._map;
    let pixel = map.pointToOverlayPixel(this._position);
    this._container.style.left = `${pixel.x}px`;
    this._container.style.top = `${pixel.y}px`;
}

Overlay.prototype.updatePosition = function (){

}

const Bridge = props => {
    let initText = props.text
    let { textChangeCallback } = props
    let [text, setText] = useState(initText)
    textChangeCallback && textChangeCallback((newText) => {
        setText(newText)
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
        this._position = point
        this._text = text
        this._callBack = null
        this._taskList = []
        this._reactElement = <Bridge text={text}
            textChangeCallback={func => { this._callBack = func }} 
            />
        ReactDOM.render(this._reactElement, this._container,()=>{
            this._taskList.forEach((task)=>{
                task()
            })
        })
    }

    setText(text){
        //ReactDoM.render()是异步的，所以callBack可能并没有被注册，所以使用任务队列解决
        if (this._callBack === null){
            this._taskList.push(()=>{
                this._callBack(text)
            })
        }else{
            this._callBack(text)
        }
    }

    setPosition(position){
        if(position && (!this._position || !this._position.equals(position))){
            this._position = position;
            this.draw()
        }
    }
}



export default TextIcon