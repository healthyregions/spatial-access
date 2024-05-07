import {useState, useEffect, useCallback} from 'react'
import {Job} from '../Types/Job'

const initalJob : Job={
    mode: "car",
    geom: "tract",
    threshold: 30,
    destinationFormat: "point",
    includeModelMetrics: false,
    populationSource: "census",
} 

export const useJob =()=>{
   const [job, setJob] = useState<Job|null>(null) 

   useEffect(()=>{
     if(job===null){
        let savedJob = localStorage.getItem("job")
        if(savedJob){
          console.log("loading from local storage")
          setJob(JSON.parse(savedJob))
        }
        else{
          console.log("setting default job")
          setJob(initalJob)
        }
     }
     else{
        console.log("Setting local storage ", job)
        localStorage.setItem("job", JSON.stringify(job))
     }
    

   },[job])

   const resetJob = useCallback(()=>{
     setJob(initalJob)
   },[])

   return {job,setJob, resetJob}
}
