import { useLoader } from "@react-three/fiber";
import { useRef,useEffect } from "react"
import {DirectionalLight} from 'three'
import { SVGLoader } from "three/examples/jsm/Addons.js";
import TaiwanMapSVG from '../../assets/tw.svg';
import { OrbitControls } from '@react-three/drei';
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

const Map = () => {
    const svgData = useLoader(SVGLoader,TaiwanMapSVG)
    const mapMode = mainStore((state)=> state.mapMode);
    return (
          <>
            <OrbitControls />
            {
                mapMode === 'twp' && <TWPowerMap svgData={svgData} />
            }
            {
                mapMode === 'rnest' && <RenewEnegryMap svgData={svgData} />
            }
            <ambientLight color={0xffffff} intensity={0.8} /> 
            <DirectLight />
         </>
    )
   
}

export default Map