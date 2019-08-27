import React, {useState} from "react"
import ReactDOM from 'react-dom'
import Overlay from './customerOVerlay'


const Bridge = props => {
    let { close, map,callBack } = props
    let [markers,setMarks] = useState(props.markers)
    let [show, setShow] = useState(true)

    callBack((markers)=>{
        setMarks(markers)
    })

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
            display: show ? 'block' : 'none',
            cursor: 'pointer',
            color: 'white', overflow: 'auto',
            background: 'rgba(90,66,0.8)'
        }}
    >
        <div>
            <div><span onClick={()=>{
                setShow(false)
                close()
            }}>点击关闭</span></div>
            <ul style={{ maxHeight: '350px' }}>
                {markerList}
            </ul>
        </div>
    </div>)
}
class Infowindow extends Overlay {
    constructor(point, map, markers) {
        super(point, 'floatPane', map)
        this._callBack = null
        const handleClose = () => {
            this.close()
        }
        this._reactElement = (<Bridge 
                                map={map} 
                                markers={markers} 
                                close={handleClose}
                                callBack={func=>this._callBack=func}
                                />)
        ReactDOM.render(this._reactElement, this._container)
        this.bindEvents()
    }

    static positions = []
    static addPosition(position,infowindow){
        Infowindow.positions.push({position,infowindow})
    }

    static getPosition(ponit){
        let $infowindow = null
        Infowindow.positions.forEach(({ position, infowindow }, index) => {
            if (position.equals(ponit)) {
                $infowindow = infowindow
            }
        })
        return $infowindow
    }

    static removePosition(ponit){
        let deleteIndex = -1
        Infowindow.positions.forEach(({position},index)=>{
            if (position.lng === ponit.lng && position.lng === position.lat){
                deleteIndex = index
            }
        })
        Infowindow.positions.splice(deleteIndex,1)
    }

    static removePositions(){
        Infowindow.positions = []
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

    bindEvents(){
        this._map.addEventListener("zoomend",  ()=> {
            this.close()
        })

        this._map.addEventListener("moveend", ()=> {
            let mapBounds = this._map.getBounds()
                if (!mapBounds.containsPoint(this._position)) {
                    this.close()
                }
        });
    }

    setMarkers(markers){
        this._callBack(markers)
    }

    open() {
        this._map.addOverlay(this)
        // this._map.panBy(-100, -100)
        this._getInfoBoxSize()
        this._moveBox()
        Infowindow.addPosition(this._position,this)
    }

    close() {
        this._map.removeOverlay(this)
        Infowindow.removePosition(this._position)
    }
}

export default Infowindow