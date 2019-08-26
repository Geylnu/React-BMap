import BMap from 'BMap'

import MarkerClusterer from './lib/MarkerClusterer'


const getMarkers =(data)=>{
    let markList = []
    data.forEach(pot => {
        let {lng,lat} = pot
        let marker = new BMap.Marker(new BMap.Point(lng,lat))
        markList.push(marker)
    });
    markList[0].getPosition()
    return markList
}

const ClustererManage = props =>{
    let {map,data} = props
    let markers = getMarkers(data)
    
    let clustererManage = new MarkerClusterer(map,{markers})
    return null
}

export default ClustererManage