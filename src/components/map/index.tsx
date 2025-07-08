import { useLoader,useFrame, useThree } from "@react-three/fiber";
import { useRef,useEffect,useMemo,useState } from "react"
import {DirectionalLight} from 'three'
import { SVGLoader } from "three/examples/jsm/Addons.js";
import TaiwanMapSVG from '../../assets/tw.svg';
import { OrbitControls } from '@react-three/drei';
import { mainStore } from "../../store";
import TWPowerMap from "./twpower";
import RenewEnegryMap from "./renewEnegry";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
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
    const zoomInVectors = mainStore(state => state.zoomInVectors);
    const controlsRef = useRef<OrbitControlsImpl | null>(null);
    const [animating, setAnimating] = useState(false)
    const {camera } = useThree();
    const targetPos = useMemo(()=>{
        
        // zoomInVectors 0:中部 1:南部 2:東部 3:北部
        if(zoomInVectors.length){
            const Vector = [
                new THREE.Vector3(zoomInVectors[3].x,-zoomInVectors[3].y,0),
                new THREE.Vector3(zoomInVectors[0].x,-zoomInVectors[0].y,0),
                new THREE.Vector3(zoomInVectors[1].x,-(zoomInVectors[1].y*2),0),
                new THREE.Vector3(zoomInVectors[2].x,-zoomInVectors[2].y,0),
            ]
            return Vector[0];
        }else{
            return new THREE.Vector3();
        }
       
    },[zoomInVectors])
    useFrame(()=>{
        if(animating && controlsRef.current){
             const targetCameraPos = new THREE.Vector3(0,200,400)
            camera.position.lerp(targetCameraPos,0.05)

            controlsRef.current.target.lerp(targetPos,0.05);
            controlsRef.current.update()
            // 始終朝向目標地區
            camera.lookAt(targetPos);
            const distance = camera.position.distanceTo(targetCameraPos)
            if(distance < 1){
                console.log('stop aniamte and show targetPos',targetPos);
                setAnimating(false)
            }
        }
    })
    return (
          <>
            <OrbitControls ref={controlsRef} />
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