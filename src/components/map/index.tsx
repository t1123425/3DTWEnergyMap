import { useLoader } from "@react-three/fiber";
import { useRef,useEffect,useState, type FC } from "react"
import {DirectionalLight} from 'three'
import { SVGLoader } from "three/examples/jsm/Addons.js";
import TaiwanMapSVG from '../../assets/tw.svg';
import { Html, OrbitControls } from '@react-three/drei';
import taiwanPower from '../../json/taiwanPower.json';
import { mainStore } from "../../store";
import TWPowerMap from "./twpower";
import RenewEnegryMap from "./renewEnegry";
const DirectLight = () => {
    const lightRef = useRef<DirectionalLight | null>(null);
    // const [isReady, setIsReady] = useState(false);
    // const {x} = useControls({x:{value:1, min:-20,max:20}});
    //寫法參考：https://github.com/pmndrs/react-three-fiber/discussions/2791
    useEffect(()=>{
        if(lightRef.current){
            const d = 10;
            lightRef.current.position.set(20,20,20);
            lightRef.current.castShadow = true;
            lightRef.current.shadow.camera.left = -d;
            lightRef.current.shadow.camera.right = d;
            lightRef.current.shadow.camera.top = d;
            lightRef.current.shadow.camera.bottom = -d;

            //更新target 位置
            lightRef.current.target.position.set(0,0,0);
            lightRef.current.target.updateMatrixWorld();
            
        }
    },[])
    return <directionalLight ref={lightRef} color={0xffffff} intensity={4} />
}
// GIS來源資料如下
/**
 * 發電(萬瓩)
 * 用電(萬瓩)
 */
// type areaData = {
//     cityId:string,
//     name:string,
//     area: string,
//     ch_name: string,
//     powergen?:number,
//     powerConsumption?:number
// }
// 
type PowerData = {
    date:string,
    area:string,
    powerGen: string,
    powerConsumption: string
}
type SelectorProp = {
    setSelectorData: (area:PowerData) => void
}
const DataSelector:FC<SelectorProp> = ({setSelectorData}) => {

    return (
        <Html
        as='div'
        fullscreen
        style={{
            left:0,
            transform: 'translate(-45%, 50%)'
        }}
        prepend>
            <select className="selector bg-amber-50" onChange={(e)=>{
                const selectedData = taiwanPower.data.find(item => item.area === e.target.value)
                if(selectedData){
                    setSelectorData(selectedData)
                }
                
            }}>
                {
                    taiwanPower.data.map((e,i)=> {
                        return <option key={i} value={e.area}>
                            {e.area}
                        </option>
                    })
                }
            </select>
        </Html>
    )
}

const Map = () => {
    const [currentAreaData,setCurrentAreaData] = useState(taiwanPower.data[0])
    const svgData = useLoader(SVGLoader,TaiwanMapSVG)
    const mapMode = mainStore((state)=> state.mapMode);
    return (
          <>
            <OrbitControls />
            <DataSelector setSelectorData={(data:PowerData)=> {setCurrentAreaData({...data})} } />
            {
                mapMode === 'twp' && <TWPowerMap currentArea={currentAreaData} svgData={svgData} />
            }
            {
                mapMode === 'rnest' && <RenewEnegryMap svgData={svgData} />
            }
            {/* <TaiwanMap currentArea={currentAreaData} /> */}
            <ambientLight color={0xffffff} intensity={0.8} /> 
            <DirectLight />
         </>
    )
   
}

export default Map