import BMap from 'BMap'
import Cluster from './Cluster'

import {getExtendedBounds} from './utils'
/**
 * @fileoverview MarkerClusterer标记聚合器用来解决加载大量点要素到地图上产生覆盖现象的问题，并提高性能。
 * 主入口类是<a href="symbols/BMapLib.MarkerClusterer.html">MarkerClusterer</a>，
 * 基于Baidu Map API 1.2。
 *
 * @author Baidu Map Api Group 
 * @version 1.2
 */


/**
 * 获取一个扩展的视图范围，把上下左右都扩大一样的像素值。
 * @param {Map} map BMap.Map的实例化对象
 * @param {BMap.Bounds} bounds BMap.Bounds的实例化对象
 * @param {Number} gridSize 要扩大的像素值
 *
 * @return {BMap.Bounds} 返回扩大后的视图范围。
 */

/**
 * 按照百度地图支持的世界范围对bounds进行边界处理
 * @param {BMap.Bounds} bounds BMap.Bounds的实例化对象
 *
 * @return {BMap.Bounds} 返回不越界的视图范围
 */


/**
 * 对单个值进行边界处理。
 * @param {Number} i 要处理的数值
 * @param {Number} min 下边界值
 * @param {Number} max 上边界值
 * 
 * @return {Number} 返回不越界的数值
 */

/**
 * 判断给定的对象是否为数组
 * @param {Object} source 要测试的对象
 *
 * @return {Boolean} 如果是数组返回true，否则返回false
 */
var isArray = function (source) {
    return '[object Array]' === Object.prototype.toString.call(source);
};

/**
 * 返回item在source中的索引位置
 * @param {Object} item 要测试的对象
 * @param {Array} source 数组
 *
 * @return {Number} 如果在数组内，返回索引，否则返回-1
 */
var indexOf = function (item, source) {
    var index = -1;
    if (isArray(source)) {
        if (source.indexOf) {
            index = source.indexOf(item);
        } else {
            for (var i = 0, m; m = source[i]; i++) {
                if (m === item) {
                    index = i;
                    break;
                }
            }
        }
    }
    return index;
};

/**
 *@exports MarkerClusterer as BMapLib.MarkerClusterer
 */
/**
 * MarkerClusterer
 * @class 用来解决加载大量点要素到地图上产生覆盖现象的问题，并提高性能
 * @constructor
 * @param {Map} map 地图的一个实例。
 * @param {Json Object} options 可选参数，可选项包括：<br />
 *    markers {Array<Marker>} 要聚合的标记数组<br />
 *    girdSize {Number} 聚合计算时网格的像素大小，默认60<br />
 *    maxZoom {Number} 最大的聚合级别，大于该级别就不进行相应的聚合<br />
 *    minClusterSize {Number} 最小的聚合数量，小于该数量的不能成为一个聚合，默认为2<br />
 *    isAverangeCenter {Boolean} 聚合点的落脚位置是否是所有聚合在内点的平均值，默认为否，落脚在聚合内的第一个点<br />
 *    styles {Array<IconStyle>} 自定义聚合后的图标风格，请参考TextIconOverlay类<br />
 */
function MarkerClusterer(map, options) {
    if (!map) {
        return;
    }
    this._map = map;
    this._markers = [];
    this._clusters = [];

    var opts = options || {};
    this._gridSize = opts["gridSize"] || 60;
    this._maxZoom = opts["maxZoom"] || 18;
    this._minClusterSize = opts["minClusterSize"] || 2;
    this._isAverageCenter = false;
    this._renderStartCallback = opts['renderStart']
    this._renderEndCallback = opts['renderEnd']
    if (opts['isAverageCenter'] != undefined) {
        this._isAverageCenter = opts['isAverageCenter'];
    }
    this._styles = opts["styles"] || [];

    var that = this;
    this._map.addEventListener("zoomend", function () {
        that._redraw();
    });

    this._map.addEventListener("moveend", function () {
        that._redraw(true);
    });

    var mkrs = opts["markers"];
    isArray(mkrs) && this.addMarkers(mkrs);
};

/**
 * 添加要聚合的标记数组。
 * @param {Array<Marker>} markers 要聚合的标记数组
 *
 * @return 无返回值。
 */
MarkerClusterer.prototype.addMarkers = function (markers) {
    for (var i = 0, len = markers.length; i < len; i++) {
        this._pushMarkerTo(markers[i]);
    }
    this._createClusters();
};

/**
 * 把一个标记添加到要聚合的标记数组中
 * @param {BMap.Marker} marker 要添加的标记
 *
 * @return 无返回值。
 */
MarkerClusterer.prototype._pushMarkerTo = function (marker) {
    var index = indexOf(marker, this._markers);
    if (index === -1) {
        marker.isInCluster = false;
        this._markers.push(marker);//Marker拖放后enableDragging不做变化，忽略
    }
};

/**
 * 添加一个聚合的标记。
 * @param {BMap.Marker} marker 要聚合的单个标记。
 * @return 无返回值。
 */
MarkerClusterer.prototype.addMarker = function (marker) {
    this._pushMarkerTo(marker);
    this._createClusters();
};

/**
 * 根据所给定的标记，创建聚合点，并且遍历所有聚合点
 * @return 无返回值
 */
MarkerClusterer.prototype._createClusters = function () {
    this._renderStartCallback && this._renderStartCallback()
    var mapBounds = this._map.getBounds();
    var extendedBounds = getExtendedBounds(this._map, mapBounds, this._gridSize);
    extendedBounds = getExtendedBounds(this._map, extendedBounds, this._gridSize);
    for (var i = 0, marker; marker = this._markers[i]; i++) {
        if (!marker.isInCluster && extendedBounds.containsPoint(marker.getPosition())) {
            this._addToClosestCluster(marker);
        }
    }

    var len = this._markers.length;
    for (var i = 0; i < len; i++) {
        if (this._clusters[i]) {
            this._clusters[i].render();
        }
    }
    this._renderEndCallback && this._renderEndCallback()
};

/**
 * 根据标记的位置，把它添加到最近的聚合中
 * @param {BMap.Marker} marker 要进行聚合的单个标记
 *
 * @return 无返回值。
 */
MarkerClusterer.prototype._addToClosestCluster = function (marker) {
    var distance = 4000000;
    var clusterToAddTo = null;
    var position = marker.getPosition();
    for (var i = 0, cluster; cluster = this._clusters[i]; i++) {
        var center = cluster.getCenter();
        if (center) {
            var d = this._map.getDistance(center, marker.getPosition());
            if (d < distance) {
                distance = d;
                clusterToAddTo = cluster;
            }
        }
    }

    if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
        clusterToAddTo.addMarker(marker);
    } else {
        var cluster = new Cluster(this);
        cluster.addMarker(marker);
        this._clusters.push(cluster);
    }
};

/**
 * 清除上一次的聚合的结果
 * @return 无返回值。
 */
MarkerClusterer.prototype._clearLastClusters = function () {
    for (var i = 0, cluster; cluster = this._clusters[i]; i++) {
        cluster.remove();
    }
    this._clusters = [];//置空Cluster数组
    this._removeMarkersFromCluster();//把Marker的cluster标记设为false
};

/**
 * 清除某个聚合中的所有标记
 * @return 无返回值
 */
MarkerClusterer.prototype._removeMarkersFromCluster = function () {
    for (var i = 0, marker; marker = this._markers[i]; i++) {
        marker.isInCluster = false;
    }
};

/**
 * 把所有的标记从地图上清除
 * @return 无返回值
 */
MarkerClusterer.prototype._removeMarkersFromMap = function () {
    for (var i = 0, marker; marker = this._markers[i]; i++) {
        marker.isInCluster = false;
        var tmplabel = marker.getLabel();
        this._map.removeOverlay(marker);
        marker.setLabel(tmplabel);
    }
};

/**
 * 删除单个标记
 * @param {BMap.Marker} marker 需要被删除的marker
 *var 
 * @return {Boolean} 删除成功返回true，否则返回false
 */
MarkerClusterer.prototype._removeMarker = function (marker) {
    var index = indexOf(marker, this._markers);
    if (index === -1) {
        return false;
    }
    var tmplabel = marker.getLabel();
    this._map.removeOverlay(marker);
    marker.setLabel(tmplabel);
    this._markers.splice(index, 1);
    return true;
};

/**
 * 删除单个标记
 * @param {BMap.Marker} marker 需要被删除的marker
 *
 * @return {Boolean} 删除成功返回true，否则返回false
 */
MarkerClusterer.prototype.removeMarker = function (marker) {
    var success = this._removeMarker(marker);
    if (success) {
        this._clearLastClusters();
        this._createClusters();
    }
    return success;
};

/**
 * 删除一组标记
 * @param {Array<BMap.Marker>} markers 需要被删除的marker数组
 *
 * @return {Boolean} 删除成功返回true，否则返回false
 */
MarkerClusterer.prototype.removeMarkers = function (markers) {
    var success = false;
    for (var i = 0; i < markers.length; i++) {
        var r = this._removeMarker(markers[i]);
        success = success || r;
    }

    if (success) {
        this._clearLastClusters();
        this._createClusters();
    }
    return success;
};

/**
 * 从地图上彻底清除所有的标记
 * @return 无返回值
 */
MarkerClusterer.prototype.clearMarkers = function () {
    this._clearLastClusters();
    this._removeMarkersFromMap();
    this._markers = [];
};

/**
 * 重新生成，比如改变了属性等
 * @return 无返回值serve
 */
MarkerClusterer.prototype._redraw = function (reserve) {
    this._clearLastClusters();
    this._createClusters();
};

/**
 * 获取网格大小serve
 * @return {Number} 网格大小
 */
MarkerClusterer.prototype.getGridSize = function () {
    return this._gridSize;
};

/**
 * 设置网格大小
 * @param {Number} size 网格大小
 * @return 无返回值
 */
MarkerClusterer.prototype.setGridSize = function (size) {
    this._gridSize = size;
    this._redraw();
};

/**
 * 获取聚合的最大缩放级别。
 * @return {Number} 聚合的最大缩放级别。
 */
MarkerClusterer.prototype.getMaxZoom = function () {
    return this._maxZoom;
};

/**
 * 设置聚合的最大缩放级别
 * @param {Number} maxZoom 聚合的最大缩放级别
 * @return 无返回值
 */
MarkerClusterer.prototype.setMaxZoom = function (maxZoom) {
    this._maxZoom = maxZoom;
    this._redraw();
};

/**
 * 获取聚合的样式风格集合
 * @return {Array<IconStyle>} 聚合的样式风格集合
 */
MarkerClusterer.prototype.getStyles = function () {
    return this._styles;
};

/**
 * 设置聚合的样式风格集合
 * @param {Array<IconStyle>} styles 样式风格数组
 * @return 无返回值
 */
MarkerClusterer.prototype.setStyles = function (styles) {
    this._styles = styles;
    this._redraw();
};

/**
 * 获取单个聚合的最小数量。
 * @return {Number} 单个聚合的最小数量。
 */
MarkerClusterer.prototype.getMinClusterSize = function () {
    return this._minClusterSize;
};

/**
 * 设置单个聚合的最小数量。
 * @param {Number} size 单个聚合的最小数量。
 * @return 无返回值。
 */
MarkerClusterer.prototype.setMinClusterSize = function (size) {
    this._minClusterSize = size;
    this._redraw();
};

/**
 * 获取单个聚合的落脚点是否是聚合内所有标记的平均中心。
 * @return {Boolean} true或false。
 */
MarkerClusterer.prototype.isAverageCenter = function () {
    return this._isAverageCenter;
};

/**
 * 获取聚合的Map实例。
 * @return {Map} Map的示例。
 */
MarkerClusterer.prototype.getMap = function () {
    return this._map;
};

/**
 * 获取所有的标记数组。
 * @return {Array<Marker>} 标记数组。
 */
MarkerClusterer.prototype.getMarkers = function () {
    return this._markers;
};

/**
 * 获取聚合的总数量。
 * @return {Number} 聚合的总数量。
 */
MarkerClusterer.prototype.getClustersCount = function () {
    var count = 0;
    for (var i = 0, cluster; cluster = this._clusters[i]; i++) {
        cluster.isReal() && count++;
    }
    return count;
};


export default MarkerClusterer