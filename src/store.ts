import { create } from 'zustand';
import { taiwanGis } from './utils/GIS';
import * as THREE from "three";
interface GISData{
    cityId:string,
    name:string,
    ch_name:string,
    area:string,
}

/**
 * map-mode
 * TWPower = twp
 * RenewableEnergyStation = rnest
 */

interface state {
    taiwanGIS:GISData[],
    mapMode:string,
    zoomInVector:THREE.Vector2 | null
    zoomInVectors:THREE.Vector3[]
    updateMapMode: (mode:string) => void
    updateVector: (vector:THREE.Vector2) => void,
    updateVectorArray: (vector:THREE.Vector3) => void,
}

export const mainStore = create<state>()((set)=>({
    taiwanGIS:taiwanGis,
    mapMode:'twp',
    zoomInVector: null,
    zoomInVectors:[],
    updateMapMode: (mode) => set(()=> ({mapMode:mode})),
    updateVector: (vector) => set(()=> ({zoomInVector:vector})),
    updateVectorArray:(vector) => set((state)=> ({zoomInVectors:[...state.zoomInVectors,vector]}))
}))