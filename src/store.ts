import { create } from 'zustand';
import { taiwanGis } from './utils/GIS';
import  { type PowerData } from './utils/types';
import * as THREE from "three";

interface GISData{
    cityId:string,
    name:string,
    ch_name:string,
    area:string,
}

interface MapCityData {
    cityId:string,
    city:string,
    pos:THREE.Vector3
}

/**
 * map-mode
 * TWPower = twp
 * RenewableEnergyStation = rnest
 */

interface state {
    taiwanGIS:GISData[],
    mapMode:string,
    energyType:string,
    currentAreaData:PowerData | null,
    currentSelectCity:MapCityData | null,
    mapCityDataArray:MapCityData[],
    updateMapMode: (mode:string) => void
    setEnergyType:(type:string) => void,
    setCurrentSelectCity: (city:MapCityData | null) => void
    setCurrentAreaData: (data:PowerData) => void
    initalCityDataArray:() => void
    updateCityDataArray: (city:MapCityData) => void,
}

export const mainStore = create<state>()((set)=>({
    taiwanGIS:taiwanGis,
    mapMode:'twp',
    energyType:'Wind',
    currentAreaData:null,
    currentSelectCity: null,
    mapCityDataArray:[],
    zoomInVectors:[],
    updateMapMode: (mode) => set(()=> ({mapMode:mode})),
    setEnergyType: (type) => set(()=> ({energyType:type})),
    setCurrentSelectCity: (data) => set(()=> ({currentSelectCity:data})),
    setCurrentAreaData:(data) => set(()=> ({currentAreaData:data})),
    initalCityDataArray:()=> set(()=>({mapCityDataArray:[]})),
    updateCityDataArray:(city) => set((state)=> ({mapCityDataArray:[...state.mapCityDataArray,city]})),
}))