export type TravelMode = "car" | "walk" | "bike"
export type DestinationFormat = "point" | "admin"
export type Geom= "tract" | "zip"
export type PopulationSource="census" | "custom"
export interface Job{
  mode: TravelMode,
  geom: Geom,
  threshold: number,
  includeGravityModel: boolean,
  includeAccessModel:boolean
  populationSource: PopulationSource,
  sourcePopulationColumn?: string,
  sourceIdColumn?: string,
  destIdCol?:string,
  destLatCol?: string,
  destLngCol?: string,
  destAdminCol?: string,
  destinationFormat : DestinationFormat, 
  useCapacity?: boolean
  useWeights?: boolean,
  useCategory?: boolean,

  categoryColumn? : string,
  capacityColumn?: string,
  weightColumn?: string
}
