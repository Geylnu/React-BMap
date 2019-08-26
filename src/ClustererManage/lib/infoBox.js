import React from "react"
import ReactDOM from 'react-dom'
import BMap from 'BMap'
import Overlay from './customerOVerlay'

const Bridge = props => {
    let { close, markers, map } = props

    const handleScroll = (e)=>{
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
            style={{ cursor: 'pointer',
                     color: 'white', overflow: 'auto',
                     background: 'rgba(90,66,0.8)' 
                    }}
            onScroll={handleScroll}
            onWheel = {handleScroll}
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
        super(point, 'floatPane',map)
        const handleClose = () => {
            this.close()
        }
        this._reactElement = (<Bridge map={map} markers={markers} close={handleClose} />)
        ReactDOM.render(this._reactElement, this._container)
    }

    open() {
        this._map.addOverlay(this)
    }

    close() {
        this._map.removeOverlay(this)
    }
}

export default Infowindow