import React from "react"
import ReactDOM from 'react-dom'
import BMap from 'BMap'
import Overlay from './customerOVerlay'

const Bridge = props => {
    let { close, markers, map } = props

    const handleScroll = (e) => {
        console.log('scorll')
    }
    let markerList = markers.map((marker, index) => {
        let point = marker.getPosition()
        let { lng, lat } = point
        const handleClick = () => {
            map.zoomTo(15)
            map.panTo(point)
            close()
        }

        return <li
            key={lng.toString() + lat.toString()}
            style={{ width: '100px' }}
            onClick={handleClick}
        >
            <span className="markItem">{index}</span>
            <div>经度: {lng.toFixed(2)}</div>
            <div>纬度： {lat.toFixed(2)}</div>
        </li>
    });
    return (<div
        style={{
            cursor: 'pointer',
            color: 'white', overflow: 'auto',
            background: 'rgba(90,66,0.8)'
        }}
        onScroll={handleScroll}
    >
        <div>
            <div><span onClick={close}>点击关闭</span></div>
            <ul style={{ maxHeight: '350px' }}>
                {markerList}
            </ul>
        </div>
    </div>)
}
class Infowindow extends Overlay {
    constructor(point, map, markers) {
        super(point, 'floatPane', map)
        const handleClose = () => {
            this.close()
        }
        this._reactElement = (<Bridge map={map} markers={markers} close={handleClose} />)
        ReactDOM.render(this._reactElement, this._container)
    }

    _getInfoBoxSize() {
        this._boxWidth = parseInt(this._container.offsetWidth, 10);
        this._boxHeight = parseInt(this._container.offsetHeight, 10);
    }

    _moveBox() {
        let mapH = parseInt(this._map.getContainer().offsetHeight, 10),
            mapW = parseInt(this._map.getContainer().offsetWidth, 10),
            boxH = this._boxHeight,
            boxW = this._boxWidth;
        //infobox窗口本身的宽度或者高度超过map container
        if (boxH >= mapH || boxW >= mapW) {
            return;
        }

        if(!this._map.getBounds().containsPoint(this._position)){
            this._map.setCenter(this._position);
        }

        let ponitPixel = this._map.pointToPixel(this._position)
        let moveX = ponitPixel.x + boxW - mapW
        let moveY = ponitPixel.y + boxH - mapH

        moveX = moveX < 0 ? 0: moveX+50
        moveY = moveY < 0 ? 0:moveY+50

        this._map.panBy(-moveX,-moveY)

        return moveX || moveY
    }

    open() {
        this._map.addOverlay(this)
        // this._map.panBy(-100, -100)
        this._getInfoBoxSize()
        this._moveBox()
    }

    close() {
        this._map.removeOverlay(this)
    }
}

export default Infowindow