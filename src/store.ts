import { create } from 'zustand';
import { taiwanGis } from './utils/GIS';
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
    updateMapMode: (mode:string) => void
}

export const mainStore = create<state>()((set)=>({
    taiwanGIS:taiwanGis,
    mapMode:'twp',
    updateMapMode: (mode) => set(()=> ({mapMode:mode}))
}))