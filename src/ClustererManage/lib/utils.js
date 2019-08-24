import BMap from 'BMap'

var getExtendedBounds = function (map, bounds, gridSize) {
    bounds = cutBoundsInRange(bounds);
    var pixelNE = map.pointToPixel(bounds.getNorthEast());
    var pixelSW = map.pointToPixel(bounds.getSouthWest());
    pixelNE.x += gridSize;
    pixelNE.y -= gridSize;
    pixelSW.x -= gridSize;
    pixelSW.y += gridSize;
    var newNE = map.pixelToPoint(pixelNE);
    var newSW = map.pixelToPoint(pixelSW);
    return new BMap.Bounds(newSW, newNE);
};

var cutBoundsInRange = function (bounds) {
    var maxX = getRange(bounds.getNorthEast().lng, -180, 180);
    var minX = getRange(bounds.getSouthWest().lng, -180, 180);
    var maxY = getRange(bounds.getNorthEast().lat, -74, 74);
    var minY = getRange(bounds.getSouthWest().lat, -74, 74);
    return new BMap.Bounds(new BMap.Point(minX, minY), new BMap.Point(maxX, maxY));
};

var getRange = function (i, mix, max) {
    mix && (i = Math.max(i, mix));
    max && (i = Math.min(i, max));
    return i;
};


export {getExtendedBounds}

