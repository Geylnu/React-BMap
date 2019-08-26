import BMap from 'BMap'

function Overlay(point,paneType,map) {
    this._container = document.createElement('div')
    this._position = point
    this._map = map
    this._paneType = paneType
}
Overlay.prototype = new BMap.Overlay()
Overlay.prototype.constructor = Overlay
Overlay.prototype.initialize = function (map) {
    this._map = map
    let container = this._container
    container.style.position = "absolute"
    //在调用removeOverlay后会自动从容器中去除
    if (map.getPanes()[this._paneType]){
        map.getPanes()[this._paneType].appendChild(container)
    }else{
        throw new TypeError('incorrect paneType')
    }
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

export default Overlay