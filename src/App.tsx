import { Canvas } from '@react-three/fiber'
import Map from './components/map'
import Navbar from './components/navBar'
// import { Stats } from '@react-three/drei'
function App() {
  return (
    <>
      <Navbar />
      <Canvas camera={{fov:75,near:0.1,far:1000}}  fallback={<div className='text-center'>Sorry no WebGL supported!</div>}>
        <color attach="background" args={['#007FFF']} />
        {/* <Stats /> */}
        <Map />
      </Canvas>
    </>
    
  )
}

export default App
