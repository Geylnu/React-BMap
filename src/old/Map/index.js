import React, { useState } from 'react'
import './index.css'


const apiConfig = {
    path: '//api.map.baidu.com/api',
    params: {
        v: '3.0',
        ak: '7KCcP9pLTnPPGH0GmvBItY6wZWn33mhL',
        callback: '_bmap_init_callback'
    }
}

class ApiLoder {
    constructor(config = apiConfig) {
        this._config = config
        this._script = null
        this._src = this.getScriptSrc()
    }

    getScriptSrc(config = this._config) {
        let queryList = []
        let { path, params } = config
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const value = params[key];
                if (value !== undefined) {
                    queryList.push(key + '=' + value)
                }
            }
        }
        let queryStr = queryList.join('&')
        let scriptSrc = path + '?' + queryStr
        return scriptSrc
    }

    buildScriptTag() {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = this._src
        this._script = script
        return script
    }

    getBMap() {
        return new Promise((res, rej) => {
            window[this._config.params.callback] = () => {
                res()
            }
            let script = this.buildScriptTag()
            script.onload = () => {
                this.removeScript()
            }
            script.onerror = () => {
                this.removeScript()
                rej()
            }
            document.body.appendChild(script)
        })
    }

    removeScript() {
        document.body.removeChild(this._script)
        this._script = null;
    }
}

const Map = props => {
    const apiLoder = new ApiLoder()
    const mapRef = React.createRef()
    const [map, setMap] = useState(null)
    apiLoder.getBMap().then(() => {
        console.log(window.BMap)
        if (!map) {
            React.lazy(() => import('./BMapLib/MarkerClusterer'))
            let tempMap = new window.BMap.Map(mapRef.current)
            tempMap.enableScrollWheelZoom();
            let point = new window.BMap.Point(116.404, 39.915);
            tempMap.centerAndZoom(point, 5);
            setMap(tempMap)
        }

    })

    const renderChildren =()=>{
        const {children} = props;

        if (!children || !map) return;

        return React.Children.map(children, child => {
            if (!child) {
                return;
            }

            if (typeof child.type === 'string') {
                return child;
            } else {
                return React.cloneElement(child, {
                    map: map
                });
            }
        })

    }

    return (<div className="Bmap-container">
        <div style={{height:'100%'}}
            ref={mapRef}
            onClick={() => { console.log(mapRef) 
            }}>
            地图加载中...
        </div>
        <div>{renderChildren()}</div>
    </div>
           )
}

export default Map