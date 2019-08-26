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

    let begin = Date.now()
    const renderStart = ()=>{
        begin = Date.now()
    }

    const renderEnd = ()=>{
        console.log(Date.now() - begin)
    }
    
    let clustererManage = new MarkerClusterer(map,
        {markers,renderStart,renderEnd})
    return null
}

export default ClustererManage