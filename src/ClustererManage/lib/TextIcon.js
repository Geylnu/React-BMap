import React, { useState } from "react"
import ReactDOM from 'react-dom'
import BMap from 'BMap'
import Overlay from './customerOVerlay'

let style = {
    background: 'rgba(215,45,45,0.4)',
    borderRadius: '50%',
    width: '2.5em',
    height: '2.5em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'translate(-50%,-50%)'
}

const Bridge = props => {
    let initText = props.text
    let { textChangeCallback,onClick } = props
    let [text, setText] = useState(initText)
    textChangeCallback && textChangeCallback((newText) => {
        setText(newText)
    })

    return (<div style={style} onClick={onClick}>
        <h1 style={{ padding: '0px', margin: '0px',fontSize:'20px'}}>
            {text}
        </h1>
    </div>)
}


class TextIcon extends Overlay {
    constructor(point, text) {
        super(point,'labelPane')
        this._position = point
        this._text = text
        this._callBack = null
        this._taskList = []
        this._eventCenter = {}
        
        const handleClick = (e)=>{
            this._eventCenter['click'].forEach((handle)=>{
                handle(e)
            })
        }
        this._reactElement = <Bridge text={text} onClick={handleClick}
            textChangeCallback={func => { this._callBack = func }}
        />
        ReactDOM.render(this._reactElement, this._container, () => {
            this._taskList.forEach((task) => {
                task()
            })
        })
    }

    setText(text) {
        //ReactDoM.render()是异步的，所以callBack可能并没有被注册，所以使用任务队列解决
        if (this._callBack === null) {
            this._taskList.push(() => {
                this._callBack(text)
            })
        } else {
            this._callBack(text)
        }
    }

    getPosition(position){
        return this._position
    }

    setPosition(position) {
        if (position && (!this._position || !this._position.equals(position))) {
            this._position = position;
            this.draw()
        }
    }

    addEventListener(type,handle){
        if (!this._eventCenter[type]){
            this._eventCenter[type] = []
        }
        this._eventCenter[type].push(handle)
    }
}



export default TextIcon