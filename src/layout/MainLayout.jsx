import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
const MainLayout=({children})=>{
return(
  <>
  <Navbar />
<div className="flex overflow-hidden bg-gray-50 ">
  <Sidebar />
  <main className="relative w-full h-svh overflow-y-auto bg-gray-50 lg:ml-52 pt-14">
    {children}
  </main>
</div>
</>
)
};
export default MainLayout;