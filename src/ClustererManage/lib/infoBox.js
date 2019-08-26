import React, { useState } from "react"
import ReactDOM from 'react-dom'
import BMap from 'BMap'

function Overlay(point,map) {
    this._container = document.createElement('div')
    this._position = point
    this._map = map


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
    let {close,markers,map} = props
    let markerList =markers.map((marker,index) => {
        let point = marker.getPosition()
        let {lng,lat} = point
        const handleClick = ()=>{
            map.zoomTo(15)
            map.panTo(point)
            close()
        }
        return <li 
                key={lng.toString()+lat.toString()} 
                style={{width: '100px'}}
                onClick={handleClick}
                >
            <span className="markItem">{index}</span>
            <div>经度: {lng.toFixed(2)}</div>
            <div>纬度： {lat.toFixed(2)}</div>
        </li>
    });
    return (<div style={{cursor: 'pointer',color:'white',overflow: 'auto',background:'rgba(90,66,0.8)'}}>
        <div>
            <div><span onClick={close}>点击关闭</span></div>
            <ul style={{maxHeight: '350px'}}>
                {markerList}
            </ul>
        </div>
    </div>)
}
class Infowindow extends Overlay{
    constructor(point,map,markers){
        super(point,map)
        const handleClose = ()=>{
            this.close()
        }
        this._reactElement = (<Bridge map={map} markers={markers} close={handleClose}/>)
        ReactDOM.render(this._reactElement,this._container)
        this.bindEvent()
    }

    open(){
        this._map.addOverlay(this)
    }

    close(){
        this._map.removeOverlay(this)
    }

    bindEvent(){
        this._map.addEventListener("zoomend", function () {
    
        })
    }
}

export default Infowindow