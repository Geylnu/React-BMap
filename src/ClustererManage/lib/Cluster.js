import BMap from 'BMap'

import {getExtendedBounds} from './utils'
import TextIcon from './TextIcon'
import InfoBox from './infoBox'

/**
 * @ignore
 * Cluster
 * @class 表示一个聚合对象，该聚合，包含有N个标记，这N个标记组成的范围，并有予以显示在Map上的TextIconOverlay等。
 * @constructor
 * @param {MarkerClusterer} markerClusterer 一个标记聚合器示例。
 */
function Cluster(markerClusterer) {
    this._markerClusterer = markerClusterer;
    this._map = markerClusterer.getMap();
    this._minClusterSize = markerClusterer.getMinClusterSize();
    this._isAverageCenter = markerClusterer.isAverageCenter();
    this._center = null;//落脚位置
    this._markers = [];//这个Cluster中所包含的markers
    this._gridBounds = null;//以中心点为准，向四边扩大gridSize个像素的范围，也即网格范围
    this._isReal = false; //真的是个聚合

    // this._clusterMarker = new BMapLib.TextIconOverlay(this._center, this._markers.length, { "styles": this._markerClusterer.getStyles() });
    this._clusterMarker = new TextIcon(this._center, this._markers.length)
    //this._map.addOverlay(this._clusterMarker);
}

/**
 * 向该聚合添加一个标记。
 * @param {Marker} marker 要添加的标记。
 * @return 无返回值。
 */
Cluster.prototype.addMarker = function (marker) {
    if (this.isMarkerInCluster(marker)) {
        return false;
    }//也可用marker.isInCluster判断,外面判断OK，这里基本不会命中

    if (!this._center) {
        this._center = marker.getPosition();
        this.updateGridBounds();//
    } else {
        if (this._isAverageCenter) {
            var l = this._markers.length + 1;
            var lat = (this._center.lat * (l - 1) + marker.getPosition().lat) / l;
            var lng = (this._center.lng * (l - 1) + marker.getPosition().lng) / l;
            this._center = new BMap.Point(lng, lat);
            this.updateGridBounds();
        }//计算新的Center
    }

    marker.isInCluster = true;
    this._markers.push(marker);
};

/**
 * 进行dom操作
 * @return 无返回值
 */
Cluster.prototype.render = function () {
    var len = this._markers.length;

    if (len < this._minClusterSize) {
        for (var i = 0; i < len; i++) {
            this._map.addOverlay(this._markers[i]);
        }
    } else {
        this._map.addOverlay(this._clusterMarker);
        this._isReal = true;
        this.updateClusterMarker();
    }
}

/**
 * 判断一个标记是否在该聚合中。
 * @param {Marker} marker 要判断的标记。
 * @return {Boolean} true或false。
 */
Cluster.prototype.isMarkerInCluster = function (marker) {
    if (this._markers.indexOf) {
        return this._markers.indexOf(marker) != -1;
    } else {
        for (var i = 0, m; m = this._markers[i]; i++) {
            if (m === marker) {
                return true;
            }
        }
    }
    return false;
};

/**
 * 判断一个标记是否在该聚合网格范围中。
 * @param {Marker} marker 要判断的标记。
 * @return {Boolean} true或false。
 */
Cluster.prototype.isMarkerInClusterBounds = function (marker) {
    return this._gridBounds.containsPoint(marker.getPosition());
};

Cluster.prototype.isReal = function (marker) {
    return this._isReal;
};

/**
 * 更新该聚合的网格范围。
 * @return 无返回值。
 */
Cluster.prototype.updateGridBounds = function () {
    var bounds = new BMap.Bounds(this._center, this._center);
    this._gridBounds = getExtendedBounds(this._map, bounds, this._markerClusterer.getGridSize());
};

/**
 * 更新该聚合的显示样式，也即TextIconOverlay。
 * @return 无返回值。
 */
Cluster.prototype.updateClusterMarker = function () {
    if (this._map.getZoom() > this._markerClusterer.getMaxZoom()) {
        this._clusterMarker && this._map.removeOverlay(this._clusterMarker);
        for (var i = 0, marker; marker = this._markers[i]; i++) {
            this._map.addOverlay(marker);
        }
        return;
    }

    if (this._markers.length < this._minClusterSize) {
        this._clusterMarker.hide();
        return;
    }

    this._clusterMarker.setPosition(this._center);

    this._clusterMarker.setText(this._markers.length);

    var thatMap = this._map;
    var thatBounds = this.getBounds();
    let first = true

    // this._markers.forEach((value, index) => {
    //     let son = document.createElement('div')
    //     son.innerText = `marker${index}`
    //     son.addEventListener('click', (e) => {
    //         let pot = value.getPosition()
    //         thatMap.setViewport(getExtendedBounds(
    //             this._map,
    //             new BMap.Bounds(pot,pot),
    //             0))
    //         this._map.zoomTo(15)
    //         this._map.panTo(value.getPosition())
    //     })
    //     html.appendChild(son)
    // })


    this._clusterMarker.addEventListener("click", (event) => {
            console.log(this._markers)
            let infoBox = new InfoBox(this._clusterMarker.getPosition(),this._map,this._markers)
            infoBox.open()
            // thatMap.setViewport(thatBounds);
    });

};

/**
 * 删除该聚合。
 * @return 无返回值。
 */
Cluster.prototype.remove = function () {
    for (var i = 0, m; m = this._markers[i]; i++) {
        var tmplabel = this._markers[i].getLabel();
        this._markers[i].getMap() && this._map.removeOverlay(this._markers[i])
        this._markers[i].setLabel(tmplabel)
    }//清除散的标记点
    this._map.removeOverlay(this._clusterMarker);
    this._markers.length = 0;
    delete this._markers;
}

/**
 * 获取该聚合所包含的所有标记的最小外接矩形的范围。
 * @return {BMap.Bounds} 计算出的范围。
 */
Cluster.prototype.getBounds = function () {
    var bounds = new BMap.Bounds(this._center, this._center);
    for (var i = 0, marker; marker = this._markers[i]; i++) {
        bounds.extend(marker.getPosition());
    }
    return bounds;
};

/**
 * 获取该聚合的落脚点。
 * @return {BMap.Point} 该聚合的落脚点。
 */
Cluster.prototype.getCenter = function () {
    return this._center;
};


export default Cluster