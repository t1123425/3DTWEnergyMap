import { Canvas } from '@react-three/fiber'
import Map from './components/map'
import Navbar from './components/navBar'
import { RnewEnegryTypeTabs } from './components/widgets'
import { mainStore } from './store'
import { PowerAreaDropdownSelector } from './components/widgets'
import { useEffect } from 'react'
import taiwanPower from './json/taiwanPower.json';
// import { Stats } from '@react-three/drei'
function App() {
  const mapMode = mainStore((state)=> state.mapMode);
  const updatePowerDataArray = mainStore((state) => state.updatePowerDataArray);
  //const setCurrentAreaData = mainStore((state)=> state.setCurrentAreaData);
  useEffect(()=>{
    //setCurrentAreaData(taiwanPower.data[0]);
    updatePowerDataArray(taiwanPower.data);
  },[updatePowerDataArray])

  return (
    <>
      <Navbar />
      {
        mapMode === 'rnest' &&  <RnewEnegryTypeTabs />
      }
      {
        mapMode === 'twp' && <PowerAreaDropdownSelector />
      }
      <Canvas camera={{fov:75,near:0.1,far:1000}}  fallback={<div className='text-center'>Sorry no WebGL supported!</div>}>
        <color attach="background" args={['#007FFF']} />
        {/* <Stats /> */}
        <Map />
      </Canvas>
    </>
    
  )
}

export default App
