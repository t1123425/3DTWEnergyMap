import {  useEffect, useMemo, useRef, type FC } from "react"
import type { SVGResultPaths } from "three/examples/jsm/Addons.js"
import { Edges } from '@react-three/drei';
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import FloatInfoBlock from "../../floatInfoBlock";
import { OLBModel } from "../3dModel";
type AreaProp = {
    shape:SVGResultPaths,
    areaColor?:string,
    ShowInfoType?:string,
    infoList?:string[],
    isHover?:boolean,
    isShowModel?:boolean
}

const defaultsVector = new THREE.Vector3(1,1,1);
const targetScale = new THREE.Vector3(1,1,2)
const alpha:number = 0.3;
const Area:FC<AreaProp> = ({shape,areaColor,isHover,ShowInfoType,infoList,isShowModel}) => {
    const areaRef = useRef<THREE.Mesh|null>(null);
    const insideMeshRef = useRef<THREE.Mesh|null>(null);
    const EffectRan = useRef(false);

    const renderInfoContent = useMemo(()=> {
        if(ShowInfoType === 'power'){
            return (
                <div className=" bg-amber-50 p-4 rounded-2xl border border-black">
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
            return <div className="info text-white" >{infoList?.length && infoList.map((e,i) => <p key={i}>{e}</p>)}</div>
        }else{
            return null
        }
    },[ShowInfoType,infoList])

    const material = useMemo(()=>{
        return new THREE.MeshStandardMaterial({ color: isHover ? areaColor : shape.color ,side:THREE.BackSide})
    },[areaColor,shape,isHover])


    useEffect(()=>{
        if(EffectRan.current && areaRef.current && insideMeshRef.current && ShowInfoType){
            const box = new THREE.Box3().setFromObject(areaRef.current);
            const center = box.getCenter(new THREE.Vector3());
            //console.log('center',center);
            
            if(insideMeshRef.current){
                insideMeshRef.current.position.set(center.x,center.y,center.z);
            }
        }
        return ()=>{
            EffectRan.current = true;
        }
    },[ShowInfoType])

    // const targetScaleMemo = useMemo(()=>{
    //     return new THREE.Vector3(1,1,rate)
    // },[rate])
    useFrame(()=>{
        if(areaRef.current){
            areaRef.current.scale.lerp(isHover?targetScale:defaultsVector,alpha);
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
                            <OLBModel path={'./GLBs/'+ShowInfoType+'.glb'} rotateX={-Math.PI/4} scale={ShowInfoType === 'renewGeothermal'?0.3:1} />
                            <FloatInfoBlock >
                                {
                                    renderInfoContent
                                }
                            </FloatInfoBlock>
                        </>
                    )
                }
            </mesh>
            {/* <OLBModel path="./GLBs/WindTurbine.glb" rotateX={-Math.PI/4}/> */}
                {/* <OLBModel path="./GLBs/SolarPanelStructure.glb" rotateX={-Math.PI/4}/> */}
                {/* <OLBModel path="./GLBs/Factory2.glb" rotateX={-Math.PI/4} scale={0.3} /> */}
        </>
       
    )
}

export default Area 