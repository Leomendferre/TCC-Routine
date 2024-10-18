import './styles/global.css';
import './lib/dayjs'
import { Header } from './components/Header';
import { SummaryTable } from './components/SummaryTable';


export function App() {
  return (  
    <div className="overflow-auto	lg:overflow-hidden w-screen h-screen flex justify-center items-center h-max ">
      <div className="w-full max-w-5xl h-screen p-6 flex flex-col gap-16">
          <Header/>
          <SummaryTable />
      </div>
    </div>   
  )
}