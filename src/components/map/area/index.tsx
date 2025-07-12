import {  useEffect, useMemo, useRef, Suspense,type FC } from "react"
import type { SVGResultPaths } from "three/examples/jsm/Addons.js"
import { Edges } from '@react-three/drei';
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import FloatInfoBlock from "../../floatInfoBlock";
import { OLBModel } from "../3dModel";
import { mainStore } from "../../../store";
type CityData = {
    name: string,
    cityId: string
}
type AreaProp = {
    shape:SVGResultPaths,
    cityData:CityData,
    areaColor?:string,
    ShowInfoType?:string,
    infoList?:string[],
    isHover?:boolean,
    isShowModel?:boolean
}

const defaultsVector = new THREE.Vector3(1,1,1);
const targetScale = new THREE.Vector3(1,1,2)
const alpha:number = 0.3;
const Area:FC<AreaProp> = ({shape,areaColor,isHover,cityData,ShowInfoType,infoList,isShowModel}) => {
    const areaRef = useRef<THREE.Mesh|null>(null);
    const insideMeshRef = useRef<THREE.Mesh|null>(null);
    const EffectRan = useRef(false);
    const isUpdateCityDataRef = useRef(true);
    //const {camera } = useThree();
    //const mapCityDataArray = mainStore(state=> state.mapCityDataArray);
    const updateCityDataArray = mainStore(state => state.updateCityDataArray);
    const renderInfoContent = useMemo(()=> {
        if(ShowInfoType === 'power'){
            return (
                <div className=" bg-amber-50 p-2 rounded-2xl border border-black" style={{minWidth:250}}>
                    {
                        infoList?.length && (
                            <ul className="mt-1">
                                {
                                    infoList.map((e,i) => <li key={i}>{e}</li>)
                                }
                            </ul>
                        )
                    }
                </div>)
        }else if(ShowInfoType?.includes('renew')){
            return (
                <div className="info text-white" style={{minWidth:300}}>
                    {infoList?.length?infoList.map((e,i) => 
                        <p key={i}>{e}</p>):null}
                </div>)
        }else{
            return null
        }
    },[ShowInfoType,infoList])

    const material = useMemo(()=>{
        return new THREE.MeshStandardMaterial({ color: isHover ? areaColor : (areaColor ?? shape.color) ,side:THREE.BackSide})
    },[areaColor,shape,isHover])


    useEffect(()=>{
        if(EffectRan.current && areaRef.current && insideMeshRef.current){
            const box = new THREE.Box3().setFromObject(areaRef.current);
            const center = box.getCenter(new THREE.Vector3());
            insideMeshRef.current.position.set(center.x,center.y,center.z);
        }
        return ()=>{
            EffectRan.current = true;
        }
    },[])
    const modelScaleDetect = () => {
        if(ShowInfoType === 'renewGeothermal'){
            return 0.5;
        }else if(ShowInfoType === 'renewSolar'){
            return 3;
        }else{
            return 1.5;
        }
    }
    useFrame(()=>{
        if(areaRef.current){
          areaRef.current.scale.lerp(isHover?targetScale:defaultsVector,alpha);
          if(isUpdateCityDataRef.current && shape.userData?.node.nodeName === 'path'){
            const box = new THREE.Box3().setFromObject(areaRef.current);
            const center = box.getCenter(new THREE.Vector3());
             const stationData = {
                    city:cityData.name,
                    cityId:cityData.cityId,
                    pos:center
                }
            updateCityDataArray(stationData)
            isUpdateCityDataRef.current = false
          }
        //   if(isHover && ShowInfoType === 'power'){
        //         const box = new THREE.Box3().setFromObject(areaRef.current);
        //         const center = box.getCenter(new THREE.Vector3());
        //         //console.log('frame center',center);
        //         if(centerRef.current){
        //             const cameraOffset = new THREE.Vector3(0, 0, 400); 
        //             const targetCameraPos = center.clone().add(cameraOffset);
        //             camera.position.lerp(targetCameraPos, 0.05); // 動畫效果
        //             camera.lookAt(center);  
        //         }else{
        //             //console.log('frame center',center);
        //             centerRef.current = center;
        //         }
                
                
        //    }
            // const material = areaRef.current.material as THREE.MeshStandardMaterial
            // material.color.set(hoverCheck?'orange':shape.color)
        }
    })
    return (
        <>
             <mesh ref={areaRef}
                material={material}
                >
                <extrudeGeometry args={[shape.toShapes(true),{depth:-15,steps:1,bevelEnabled:true}]}/>
                {/* <meshStandardMaterial  color={shape.color}  side={THREE.BackSide}/> */}
                {/* 添加地區邊線 */}
                <Edges lineWidth={1} threshold={15} color={'#fff'} />
            </mesh>
             <mesh ref={insideMeshRef} >
                {/* <axesHelper scale={150} /> */}
                {
                    ShowInfoType === 'power' && isHover && (

                        <FloatInfoBlock >
                            {
                                renderInfoContent
                            }
                        </FloatInfoBlock>
                              
                    )
                }
                {
                   isShowModel && (
                        <>
                            {/* 添加Suspense 避免當讀取不同3d model時 導致父元件出現re-mount問題  */}
                            <Suspense fallback={null}>
                                {/* 在3d model元件外層添加<group key={...}> 用於讓react diff更好判定模組更新，當要切換不同3d模型時會更好判定處理 */}
                                <group key={ShowInfoType}>
                                    <OLBModel path={'./GLBs/'+ShowInfoType+'.glb'} rotateX={-Math.PI/4} scale={modelScaleDetect()} />
                                </group>
                            </Suspense>
                            <FloatInfoBlock >
                                {
                                    renderInfoContent
                                }
                            </FloatInfoBlock>
                        </>
                    )
                }
            </mesh>
        </>
       
    )
}

export default Area 