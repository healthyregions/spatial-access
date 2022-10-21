export type TravelMode = "car" | "walk" | "bike";
export type DestinationFormat = "point" | "admin";
export type Geom = "tract" | "zip";
export type PopulationSource = "census" | "custom";
export type ModelType = "RAMM" | "2FC";
export type OutputFormat = "GeoJSON" | "ShapeFile" | "CSV"

// Destinations are the resources, which we are calculating the access to
// Sources are the population centers on either zip or census tract level how are trying
// to access the resource / destinations

export interface Job {
  mode: TravelMode;
  // The geometry unit that the calculation is being performed on. Used to determine which
  // OD matrix to use, what geometry to assign destinations and the population of the sources.

  geom: Geom;
  // Max distance willing to travel
  threshold: number;

  // models
  includeModelMetrics: boolean;

  // To select the model type
  modelType?: ModelType;

  // If census, use the census population from ACS which is baked in
  populationSource: PopulationSource;

  // If populationSource is custom this tells us what column in the uploaded file has the
  // population for each geometry
  sourcePopulationColumn?: string;
  // If populationSource is custom this tells us what column in the uploaded file has the
  // id for each geometry (census tract id if using that else zip codes)
  sourceIdColumn?: string;

  // This determines if the input file for resources / destinations is either a lat, lng + info
  // dataset or a zip / census tract id  + ifo dataset. Either way we are using 1 line per resource
  destinationFormat: DestinationFormat;
  // If Point the col that contains the dest lat
  destLatCol?: string;
  // If Point the col that contains the dest lat
  destLngCol?: string;
  // If admin then the zip or census tract id column for dests
  destAdminCol?: string;
  // Use capacity in the model
  useCapacity?: boolean;
  // Use weights in the model
  useWeights?: boolean;

  // Use category in the model
  useCategory?: boolean;

  categoryColumn?: string;
  capacityColumn?: string;

  // A look up of weights per category, missing categories will be assumes to have a weight of 1
  weights?: Record<string, number>;
  destinationFile?: File;
  populationFile?: File;
  outputFormat?: OutputFormat;
}
