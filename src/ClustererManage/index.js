import BMap from 'BMap'
import Geohash from 'latlon-geohash'

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
    let {map,data,gridSize} = props
    let markers = getMarkers(data)

    let zoom  = 6

    let begin = Date.now()
    const renderStart = ()=>{
        begin = Date.now()
    }

    const renderEnd = ()=>{
        // console.log('zoom',zoom)
        console.log(Date.now() - begin)
        // if (zoom <20){
        //     window.setTimeout(()=>{
        //         map.setZoom(zoom)
        //         zoom+=1
        //     },300)
        // }
    }
    
    let clustererManage = new MarkerClusterer(map,
        {markers,renderStart,renderEnd,gridSize})
    return null
}

export default ClustererManage