
export type NetworkType = "walk" | "bike" | "drive"

export interface CalculationSettings {
  spaitalProximity: boolean;
  catchmentAreas: boolean;
  travelMode: NetworkType ;
  upperThreshold: number;
}


export interface ODFileDetails{
    idCol : string,
    latitudeCol :string,
    longitudeCol:string,
    amountCol: string
    resourceId: string
    categoryCol?: string
}

export interface Order{
  init_kwargs:{
    network_type: NetworkType,
    source_column_names: {
      lat:string,
      lon:string,
      idx:string,
      population:string
    },
    dest_column_names:{
      lat:string,
      lon:string,
      idx:string,
      capacity:string,
      category?:string
    } 
  },
  calculate_kwargs:{
    upper_threshold: number,
    category_weight_dict?: Record<string,Array<number>>,
    normalize:boolean
  }
}

export interface JobParams{
  orders:Order,
  aggregate_kwargs:{

  },
  job_type: "model",
  model_type: "TSFCA" | "COVERAGE" | "DestSum" | "AccessTime" | "AccessCount" | "AccessModel",
  primary_resource: string,
  secondary_resource: string,
}

