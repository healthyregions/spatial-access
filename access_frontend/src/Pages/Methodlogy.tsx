import {
	Box,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

export default function MethodologyPage() {
	const sectionStyle = {
		marginBottom: "2em",
		scrollMarginTop: {
			xs: "3em",
			md: "7em",
		},
	};
	const menuItemsStyle = {
		marginBottom: "1em",
	};
	return (
		<Box display="flex">
			<Box
				sx={{
					position: "fixed",
					top: 100, // since top is 120 for App.tsx, make it 100 to avoid overlap
					width: "23em",
					backgroundColor: "#f0f0f0",
					boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
					padding: "1em",
					height: "calc(100vh - 112px)", // use 7em as defined above for alignment
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-evenly",
					overflow: "auto",
				}}
			>
				<Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
					<Link href="#what-is-spatial-accessibility" sx={menuItemsStyle}>
						What is spatial accessibility?
					</Link>
					<Link href="#why-spatial-accessibility" sx={menuItemsStyle}>
						Why spatial accessibility?
					</Link>
					<Link
						href="#what-does-spatial-accessibility-quantify"
						sx={menuItemsStyle}
					>
						What does spatial accessibility quantify?
					</Link>
					<Link
						href="#what-data-is-used-to-measure-spatial-accessibility"
						sx={menuItemsStyle}
					>
						What data is used to measure spatial accessibility?
					</Link>
					<Link href="#methods" sx={menuItemsStyle}>
						Methods
					</Link>
					<Link href="#euclidean-distance" sx={menuItemsStyle}>
						Euclidean Distance
					</Link>
					<Link href="#access-score" sx={menuItemsStyle}>
						Access Score
					</Link>
					<Link href="#gravity" sx={menuItemsStyle}>
						Gravity
					</Link>
					<Link href="#floating-catchment-area" sx={menuItemsStyle}>
						Floating Catchment Area (FCA)
					</Link>
					<Link href="#two-step-floating-catchment-area" sx={menuItemsStyle}>
						Two-Step Floating Catchment Area (2SFCA)
					</Link>
					<Link
						href="#enhanced-two-step-floating-catchment-area"
						sx={menuItemsStyle}
					>
						Enhanced Two-Step Floating Catchment Area (E2SFCA)
					</Link>
					<Link href="#three-step-floating-catchment-area" sx={menuItemsStyle}>
						Three-Step Floating Catchment Area (3SFCA)
					</Link>
					<Link href="#rational-agent-access-model" sx={menuItemsStyle}>
						Rational Agent Access Model (RAAM)
					</Link>
					<Link href="#references" sx={menuItemsStyle}>
						References
					</Link>
				</Box>
			</Box>
			<Box
				sx={{
					flexGrow: 1,
					marginLeft: "25em",
					padding: "1em",
				}}
			>
				<Box id="what-is-spatial-accessibility" sx={sectionStyle}>
					<Typography variant="h5">What is spatial accessibility?</Typography>
					<p>
						Spatial accessibility measures how difficult it is for communities
						to acquire critical goods and services. For example, a community
						with low access to healthy food, sometimes called a food desert.
						Access to critical goods and services (food, healthcare, green
						space, etc.) are important for healthy, resilient, and sustainable
						communities.
					</p>
				</Box>
				<Box id="why-spatial-accessibility" sx={sectionStyle}>
					<Typography variant="h5">
						Why <i>spatial</i> accessibility?
					</Typography>
					<p>
						Accessibility is a complex and highly personal phenomena, so spatial
						accessibility focuses on the potential for communities to access
						critical goods and services through spatial analysis.
					</p>
					<p>
						We say potential because we do not know that every member of the
						community actually uses these goods/services, but our analysis
						suggests they could. This contrasts with realized access, which is
						based on real-world data like surveys.
					</p>
					<p>
						Spatial accessibility focuses on the spatial barriers to accessing
						goods and services, most commonly the travel times between
						communities and the goods/services and the ratio of people to
						goods/services across space. This contrasts with aspatial factors
						like income, age, sex, preference, etc. that may influence
						individuals.
					</p>
					<p>
						Spatial accessibility focuses on the potential and spatial
						dimensions of access. While this cannot capture the complexity of
						millions of people with individual preferences, the data to measure
						spatial accessibility is more readily available, has fewer privacy
						concerns associated with it, and is still an important Spatial
						Determinant of Health (SDOH).
					</p>
					<WhyDataTable />
				</Box>
				<Box id="what-does-spatial-accessibility-quantify" sx={sectionStyle}>
					<Typography variant="h5">
						What does spatial accessibility quantify?
					</Typography>
					<p>
						There are a variety of methods used to measure spatial accessibility
						(see below), but most methods rely on two factors:
						<ul>
							<li>
								The travel time between supply (good/service providers) and
								demand (people needing those goods/services). Generally, methods
								only consider supply within a distance threshold (e.g. 60
								minutes) of a community. We refer to this acceptable distance
								threshold as the
								<i>catchment area</i>. Many methods employ <i>distance decay</i>{" "}
								functions meaning that resources further away are less likely to
								be used.
							</li>
							<li>
								The crowdedness of resource/service providers. For example, you
								may have a doctor's office right next door, but if it is always
								too busy to see you, it does not provide you with much benefit.
								We often measure crowdedness by measuring ratios of supply
								(people who need the good/service) and demand (the volume of the
								good/service) across space. More advanced methods like the
								Rational Agent Access Model (RAAM) simulates people making
								trade-offs between the travel time to a resource and the
								crowdedness of the resource.
							</li>
						</ul>
					</p>
					<p>For specifics on how these are measured, see the methods below.</p>
				</Box>
				<Box
					id="what-data-is-used-to-measure-spatial-accessibility"
					sx={sectionStyle}
				>
					<Typography variant="h5">
						What data is used to measure spatial accessibility?
					</Typography>
					<p>
						There are a variety of methods used to measure spatial accessibility
						(see below), but most methods rely on two factors:
						<ul>
							<li>
								<b>Supply</b> - the location (e.g. coordinates or Census tract
								IDs) and volume (e.g. number of physicans)
							</li>
							<li>
								<b>Demand</b> - the location (e.g. coordinates or Census tract
								IDs) and volume (e.g. population data)
							</li>
							<li>
								<b>Spatial Impedance</b> - the "cost" to overcome the distance
								between each supply location and each demand location.
								Generally, this is measured as travel time.
							</li>
						</ul>
					</p>
				</Box>
				<Box id="methods" sx={sectionStyle}>
					<Typography variant="h5">Methods</Typography>
					<p>
						The spatial accessibility methods measured rely on the PySAL access
						Python package. Saxon et. al (2022) provides some of the technical
						details on the package or you can check out the documentation for
						the package at: &nbsp;
						<a
							href="https://access.readthedocs.io/"
							target="_blank"
							rel="noreferrer"
						>
							https://access.readthedocs.io/
						</a>
					</p>
					<p>
						For each method below, we will briefly describe:
						<ul>
							<li>the method</li>
							<li>the math to calculate the method</li>
							<li>parameters of the method</li>
							<li>assumptions of the method</li>
						</ul>
					</p>
					<p>
						Parameters are inputs that allow you adjust the measure. For
						example, many of the methods allow you to describe a travel time
						threshold that defines how far someone is willing to go to obtain
						the goods/services we are measuring access to.
					</p>
				</Box>
				<Box id="euclidean-distance" sx={sectionStyle}>
					<Typography variant="h5">Euclidean Distance</Typography>
					<p>
						<b>Description:</b> The Euclidean Distance method calculates the
						straight-line or "as the crow flies" distance between the supply and
						demand locations. Distance and access will be anti-correlated,
						closer goods/services are generally considered more accessible.
					</p>
					<p>
						Notably, this model only needs to know the locations of the demand
						and supply locations, not the volume of demand (e.g. number of
						people) or the volume of supply (e.g. number of hospital beds).
					</p>
					<p>
						<b>Parameters:</b>
						<ul>
							<li>
								<InlineMath math="T" />, the maximum distance to consider
							</li>
						</ul>
					</p>
					<p>
						<b>Math: &nbsp;</b>Distance between the points is calculated using
						the Euclidean distance formula:
						<BlockMath
							math={
								"d_{ij} = \\sqrt{(i_{x} - j_{x})^{2} + (i_{y} - j_{y})^{2}}"
							}
						/>
					</p>
					<p>
						where
						<ul>
							<li>
								<InlineMath math="d_{ij}" /> is the distance between{" "}
								<InlineMath math="i" /> and <InlineMath math="j" />.
							</li>
							<li>
								<InlineMath math="i" /> is the coordinates of the supply
								location.
							</li>
							<li>
								<InlineMath math="j" /> is the coordinates of the demand
								location.
							</li>
						</ul>
					</p>
					<p>
						<b>Assumptions:</b>
						<ul>
							<li>
								The results will be in the units of the Coordinate Reference
								System (CRS) used.
							</li>
							<li>
								Ease to obtain a good/service is proportional to the distance
								(not the travel time or other measure of spatial impedance)
								between two points.
							</li>
						</ul>
					</p>
				</Box>
				<Box id="access-score" sx={sectionStyle}>
					<Typography variant="h5" sx={menuItemsStyle}>
						Access Score
					</Typography>
					<p>
						The Access Score, sometimes called the Cumulative Opportunities
						model, calculates the number of supply locations nearby, weighting
						supply locations by some distance decay function{" "}
						<InlineMath math="W" />.
					</p>
					<p>
						Notably, this model only needs to know the locations of the demand
						and supply locations, not the volume of demand (e.g. number of
						people) or the volume of supply (e.g. number of hospital beds).
					</p>
					<p>
						<b>Parameters:</b>
						<ul>
							<li>
								<InlineMath math="W" />, a distance decay function
							</li>
						</ul>
					</p>
					<p>
						<b>Math: &nbsp;</b>The equation for the Access Score is:
						<BlockMath math={"A_{i}^{access} = \\sum_{l} W(d_{il})"} />
					</p>
					<p>
						where
						<ul>
							<li>
								<InlineMath math="A_{i}^{access}" /> is the measure of access at
								location <InlineMath math="i" /> measured using the Access
								Score.
							</li>
							<li>
								<InlineMath math="W" /> is a distance decay function.
							</li>
							<li>
								<InlineMath math="d_{ij}" /> is the spatial impedance (travel
								time, distance, etc.) between two points <InlineMath math="i" />{" "}
								and <InlineMath math="j" />.
							</li>
						</ul>
					</p>
					<p>
						<b>Assumptions:</b>
						<ul>
							<li>Ignores the congestion or busyness of supply locations</li>
							<li>
								Places with more nearby supply locations have better access,
								regardless of the demand/population density
							</li>
						</ul>
					</p>
				</Box>
				<Box id="gravity" sx={sectionStyle}>
					<Typography variant="h5">Gravity</Typography>
					<p>
						<b>Description: &nbsp;</b>The Gravity Model is designed to mimic the
						forces of gravity in physics: supply locations contribute to access
						based on the distance from the demand location and their "mass" (the
						volume of supply, e.g. number of hospital beds).
					</p>
					<p>
						<b>Parameters:</b>
						<ul>
							<li>
								<InlineMath math="W" />, a distance decay function. Our
								implementation relies on the function &nbsp;
								<InlineMath math="W(d_{ij}) = \left(\frac{d_{ij}}{60}\right)^{-1} = \frac{60}{d_{ij}}" />
								. Note that distances of zero will create issues because you
								will be dividing by zero.
							</li>
						</ul>
					</p>
					<p>
						<b>Math: &nbsp;</b>The equation for the Gravity model is:
						<BlockMath
							math={"A_{i}^{gravity} = \\sum_{l} S_{l} \\cdot W(d_{il})"}
						/>
					</p>
					<p>
						where
						<ul>
							<li>
								<InlineMath math="A_{i}^{gravity}" /> is the measure of access
								at location <InlineMath math="i" /> measured using the Gravity
								model.
							</li>
							<li>
								<InlineMath math="S_{l}" /> is the volume of supply at location{" "}
								<InlineMath math="l" />.
							</li>
							<li>
								<InlineMath math="W" /> is a distance decay function.
							</li>
							<li>
								<InlineMath math="d_{ij}" /> is the spatial impedance (travel
								time, distance, etc.) between two points <InlineMath math="i" />{" "}
								and <InlineMath math="j" />.
							</li>
						</ul>
					</p>
					<p>
						<b>Assumptions: &nbsp;</b>
						<ul>
							<li>Ignores the congestion or busyness of supply locations</li>
							<li>
								Places with more nearby supply locations have better access,
								regardless of the demand/population density
							</li>
						</ul>
					</p>
				</Box>
				<Box id="floating-catchment-area" sx={sectionStyle}>
					<Typography variant="h5">Floating Catchment Area (FCA)</Typography>
					<p>
						<b>Description: &nbsp;</b>The Floating Catchment Area method (Isard
						1960) calculcates access as the ratio of supply-to-demand within a
						buffer around each community. Instead of calculating ratios of
						supply-to-demand for existing adminstrative boundaries (e.g.
						counties) we buffers that "float" across multiple boundaries.
					</p>
					<p>
						<b>Parameters:</b>
						<ul>
							<li>
								<InlineMath math="T" />, the radius for the floating catchment
								area (in the units of your spatial impedance data: travel time,
								distance, etc.).
							</li>
						</ul>
					</p>
					<p>
						<b>Math: &nbsp;</b>The equation for FCA is:
						<BlockMath math={"A_{i}^{fca} = \\frac{S_{i}}{D_{i}}"} />
					</p>
					<p>
						where
						<ul>
							<li>
								<InlineMath math="A_{i}^{fca}" /> is the measure of access at
								location $i$ measured using FCA
							</li>
							<li>
								<InlineMath math="S_{i}" /> is the supply within the buffer
								around location <InlineMath math="i" />.
							</li>
							<li>
								<InlineMath math="D_{i}" /> is the demand within the buffer
								around location <InlineMath math="i" />.
							</li>
						</ul>
					</p>
					<p>
						<b>Assumptions: &nbsp;</b>
						<ul>
							<li>
								People do not travel more than <InlineMath math="T" />{" "}
								time/distance to obtain the good/service, meaning that supply
								outside of the buffer is inaccessible.
							</li>
							<li>
								Every supplier within the buffer is equally accessible. A
								grocery next door and one 29 minutes away are treated the same
								if we use a distance threshold <InlineMath math="T" /> of 30
								minutes.
							</li>
							<li>
								We do not consider that a supply location may have demand
								outside of the buffer.
							</li>
						</ul>
					</p>
				</Box>
				<Box id="two-step-floating-catchment-area" sx={sectionStyle}>
					<Typography variant="h5">
						Two-Step Floating Catchment Area (2SFCA)
					</Typography>
					<p>
						<b>Description: &nbsp;</b>The Two-Step Floating Catchment Area
						(2SFCA) (Luo and Wang 2003) method calculates access by (1)
						calculcating a supply-to-demand ratio using the supply at that
						location divided by demand within a buffer and (2) adding up these
						ratios for demand locations within multiple catchment areas. While
						this is similar to FCA and also creates a supply-to-demand ratio
						(e.g. physicians per person), it allows supply locations to consider
						demand outside of the buffer of each demand location.
					</p>
					<p>
						<b>Parameters:</b>
						<ul>
							<li>
								<InlineMath math="T" />, the radius for the floating catchment
								area (in the units of your spatial impedance data: travel time,
								distance, etc.).
							</li>
						</ul>
					</p>
					<p>
						<b>Math: &nbsp;</b>The equation for step 1 of 2SFCA is:
						<BlockMath
							math={"R_{l} = \\frac{S_{l}}{\\sum_{d_{lr} \\leq T} D_{r}}"}
						/>
					</p>
					<p>
						where
						<ul>
							<li>
								<InlineMath math="R_{l}" /> is the ratio of supply-to-demand
								within each supply location <InlineMath math="l" />
								's catchment.
							</li>
							<li>
								<InlineMath math="S_{l}" /> is the supply at location{" "}
								<InlineMath math="l" />.
							</li>
							<li>
								<InlineMath math="D_{r}" /> is the demand within the buffer
								around location <InlineMath math="r" />.
							</li>
							<li>
								<InlineMath math="d_{lr}" /> is the distance between supply
								location <InlineMath math="l" /> and demand location{" "}
								<InlineMath math="r" />.
							</li>
						</ul>
					</p>
					<p>
						In Step 1, we are adding up the demand at locations{" "}
						<InlineMath math="r" /> if the distance between the supply location{" "}
						<InlineMath math="l" /> and demand location <InlineMath math="r" />{" "}
						is less than our distance parameter <InlineMath math="T" />.
					</p>
					<p>
						The equation for step 2 of 2SFCA is:
						<BlockMath math={"A_{i}^{2sfca} = \\sum_{d_{il} \\leq T} R_{l}"} />
					</p>
					<p>
						where
						<ul>
							<li>
								<InlineMath math="A_{i}^{2sfca}" /> is the measure of access at
								location <InlineMath math="i" /> measured using 2SFCA.
							</li>
							<li>
								<InlineMath math="R_{l}" /> is the ratio of supply-to-demand
								within each supply location <InlineMath math="l" />
								's catchment from step 1.
							</li>
						</ul>
						In Step 2, we are adding up the ratios of supply-to-demand for all
						supply locations within the distance threshold.
					</p>
					<p>
						<b>Assumptions: &nbsp;</b>
						<ul>
							<li>
								People do not travel more than <InlineMath math="T" />{" "}
								time/distance to obtain the good/service, meaning that supply
								outside of the buffer is inaccessible.
							</li>
							<li>
								Every supplier within the buffer is equally accessible. A
								grocery next door and one 29 minutes away are treated the same
								if we use a distance threshold <InlineMath math="T" /> of 30
								minutes.
							</li>
						</ul>
					</p>
				</Box>
				<Box id="enhanced-two-step-floating-catchment-area" sx={sectionStyle}>
					<Typography variant="h5">
						Enhanced Two-Step Floating Catchment Area (E2SFCA)
					</Typography>
					<p>
						<b>Description: &nbsp;</b>The Enhanced Two-Step Floating Catchment
						Area (2SFCA) (Luo and Qi 2009) method uses the same idea as the
						2SFCA, but uses multiple distance thresholds and distance decay
						weights. For example, instead of including all demand within 30
						minutes equally, we might count everyone within 10 minutes as
						demand, only 68% of people within 10-20 minutes, and only 22% of
						people within 20-30 minutes. This would be three thresholds of 10,
						20, and 30 minutes with corresponding distance decay weights of 1,
						0.68, and 0.22.
					</p>
					<p>
						<b>Parameters:</b>
						<ul>
							<li>
								<InlineMath math="T_{1}, T_{2}, T_{3}, \ldots, T_{n}" />, the
								radii for the <InlineMath math="n" /> floating catchment areas
								(in the units of your spatial impedance data: travel time,
								distance, etc.).
							</li>
							<li>
								<InlineMath math="w_{1}, w_{2}, w_{3}, \ldots, w_{n}" />, the
								distance decay weights for <InlineMath math="n" /> distance
								thresholds.
							</li>
						</ul>
					</p>
					<p>
						<b>Math: &nbsp;</b>The equation for step 1 of E2SFCA is:
						<BlockMath
							math={
								"R_{l} = \\frac{S_{l}}{\\sum_{k=1}^{n} \\sum_{d_{lr} \\leq T_{k}} D_{r} \\cdot w_{k}}"
							}
						/>
					</p>
					<p>
						where &nbsp;
						<ul>
							<li>
								<InlineMath math="R_{l}" /> is the ratio of supply-to-demand
								within each supply location <InlineMath math="l" />
								's catchment.
							</li>
							<li>
								<InlineMath math="S_{l}" /> is the supply at location{" "}
								<InlineMath math="l" />.
							</li>
							<li>
								<InlineMath math="D_{r}" /> is the demand within the buffer
								around location <InlineMath math="r" />.
							</li>
							<li>
								<InlineMath math="d_{lr}" /> is the distance between supply
								location <InlineMath math="l" /> and demand location{" "}
								<InlineMath math="r" />.
							</li>
						</ul>
					</p>
					<p>
						In Step 1, we are adding up the weighted demand at locations{" "}
						<InlineMath math="r" /> if the distance between the supply location{" "}
						<InlineMath math="l" /> and demand location <InlineMath math="r" />{" "}
						is less than our distance threshold <InlineMath math="T_{k}" />,
						applying the corresponding distance decay weight{" "}
						<InlineMath math="w_{k}" />.
					</p>
					<p>
						The equation for step 2 of E2SFCA is:
						<BlockMath
							math={
								"A_{i}^{e2sfca} = \\sum_{k=1}^{n} \\sum_{T_{k-1} \\leq d_{il} \\leq T_{k}} R_{l} \\cdot w_{k}"
							}
						/>
					</p>
					<p>
						where
						<ul>
							<li>
								<InlineMath math="A_{i}^{e2sfca}" /> is the measure of access at
								location <InlineMath math="i" /> measured using E2SFCA.
							</li>
							<li>
								<InlineMath math="R_{l}" /> is the ratio of supply-to-demand
								within each supply location <InlineMath math="l" />
								's catchment from step 1.
							</li>
						</ul>
					</p>
					<p>
						In Step 2, we are adding up the weighted ratios of supply-to-demand
						for all supply locations within the distance thresholds.
					</p>
					<p>
						<b>Assumptions: &nbsp;</b>
						<ul>
							<li>
								People do not travel more than <InlineMath math="T_{n}" />{" "}
								time/distance to obtain the good/service, meaning that supply
								outside of the buffer is inaccessible.
							</li>
							<li>
								Every supplier within the buffer each is not equally accessible.
								We now can differentiate using our multiple distance thresholds.
								However, suppliers within the same interval are still considered
								equally accessible. For example, if using 0-10, 10-20, and 20-30
								minute intervals, a grocery next door and one 9 minutes away are
								treated the same.
							</li>
						</ul>
					</p>
				</Box>
				<Box id="three-step-floating-catchment-area" sx={sectionStyle}>
					<Typography variant="h5">
						Three-Step Floating Catchment Area (3SFCA)
					</Typography>
					<p>
						<b>Description: &nbsp;</b>The Three-Step Floating Catchment Area
						(3SFCA) (Wan, Zou, and Sternberg 2012) improves on the 2SFCA-based
						approaches by accounting for people who have multiple options
						available to them. For example, if you have three grocercy stores
						within 10 minutes of you, you cannot be in all three at once. 3SFCA
						accounts for this by calculating a selection weight for each demand
						location with an assumption that people prefer resources/services
						closer to them.
					</p>
					<p>
						<b>Parameters:</b>
						<ul>
							<li>
								<InlineMath math="W(d_{ij})" />, a distance decay function.
							</li>
						</ul>
					</p>
					<p>
						<b>Math: &nbsp;</b>First, we calculate demand weights{" "}
						<InlineMath math="G" />:
						<BlockMath
							math={"G_{rl} = \\frac{W(d_{rl})}{\\sum_{j} W(d_{rj})}"}
						/>
					</p>
					<p>
						where
						<ul>
							<li>
								<InlineMath math="G_{rl}" /> is the selection weight for people
								choosing between resources/services.
							</li>
							<li>
								<InlineMath math="d_{rl}" /> is the distance between locations{" "}
								<InlineMath math="r" /> and <InlineMath math="l" />.
							</li>
						</ul>
					</p>
					<p>
						Then we proceed with the typical 2SFCA method applying both our
						distance decay function $W$ and the selection weights calculated
						from our first step.
					</p>
					<p>
						The equation for step 2 of 3SFCA is:
						<BlockMath
							math={
								"R_{l} = \\frac{S_{l}}{\\sum_{r=1}^{m} D_{r} \\cdot G_{rl} \\cdot W(d_{rl})}"
							}
						/>
					</p>
					<p>
						where
						<ul>
							<li>
								<InlineMath math="S_{l}" /> is the supply at location{" "}
								<InlineMath math="l" />.
							</li>
							<li>
								<InlineMath math="D_{r}" /> is the demand within the buffer
								around location <InlineMath math="r" />.
							</li>
							<li>
								<InlineMath math="G_{rl}" /> is the selection weight from step
								1.
							</li>
							<li>
								<InlineMath math="W(d_{ij})" /> is the distance decay function
								parameter.
							</li>
							<li>
								<InlineMath math="d_{lr}" /> is the distance between supply
								location <InlineMath math="l" /> and demand location{" "}
								<InlineMath math="r" />.
							</li>
						</ul>
					</p>
					<p>
						The equation for step 3 of 3SFCA is:
						<BlockMath
							math={
								"A_{i}^{3sfca} = \\sum_{l} R_{l} \\cdot G_{rl} \\cdot W(d_{rl})"
							}
						/>
					</p>
					<p>
						where
						<ul>
							<li>
								<InlineMath math="A_{i}^{3sfca}" /> is the measure of access at
								location <InlineMath math="i" /> measured using 3SFCA.
							</li>
							<li>
								<InlineMath math="R_{l}" /> is the ratio of supply-to-demand
								within each supply location <InlineMath math="l" />
								's catchment from step 2.
							</li>
						</ul>
					</p>
					<p>
						In Step 2, we are adding up the weighted ratios of supply-to-demand
						for all supply locations within the distance thresholds.
					</p>
					<p>
						<b>Assumptions: &nbsp;</b>
						<ul>
							<li>
								We can use any weight function, so we no longer need to set a
								maximum distance although we usually do for practical reasons.
							</li>
							<li>
								Demand for resources/services are not just influenced by travel
								time, but also the competition around the demand location.
							</li>
						</ul>
					</p>
				</Box>
				<Box id="rational-agent-access-model" sx={sectionStyle}>
					<Typography variant="h5">
						Rational Agent Access Model (RAAM)
					</Typography>
					<p>
						<b>Description: &nbsp;</b>The Rational Agent Access Model (RAAM)
						(Saxon and Snow, 2019) assumes that rational people will will make
						decisions that try to minimize the combination of the spatial
						impedance (the travel time/distance/cost to get there) and the
						congestion at the supply location (how busy they are). For example,
						if the grocery store closest to you always has a long wait to
						check-out, you may choose to drive slightly further to one that
						usually is not as busy.
					</p>
					<p>
						It is important to note that RAAM calculates the <b>cost</b> to
						acquire goods and services which is the opposite of access.
					</p>
					<p>
						<b>Parameters:</b>
						<ul>
							<li>
								{/* \\tau inline seems not work, change to BlockMath instead */}
								<span
									style={{
										display: "inline-block",
										marginTop: -16,
										marginBottom: -16,
									}}
								>
									<BlockMath math={"\\tau"} />
								</span>
								, the amount of travel time (in your spatial impedance unit,
								usually time) that is required to accept the mean congestion
								(demand-to-supply ratio). For example, if{" "}
								<span
									style={{
										display: "inline-block",
										marginTop: -16,
										marginBottom: -16,
									}}
								>
									<BlockMath math={"\\tau"} />
								</span>{" "}
								is 60 and we are measuring spatial impedance in minutes, our
								model treats a 10% increase in congestion at a location as the
								same as a 10% increase (60/10 = 6 minutes) in travel time.
							</li>
						</ul>
					</p>
					<p>
						<b>Math: &nbsp;</b>The equation for calculating access with RAAM is:
						<BlockMath
							math={
								"A_{i}^{raam} = \\frac{ \\sum_{r} \\frac{D_{rl}}{S_{l}} }{\\rho} + \\frac{d_{il}}{\\tau}"
							}
						/>
					</p>
					<p>
						where
						<ul>
							<li>
								<InlineMath math="A_{i}^{raam}" /> is the measure of access at
								location <InlineMath math="i" /> measured using RAAM.
							</li>
							<li>
								<InlineMath math="D_{rl}" /> is the demand by residents of
								location <InlineMath math="r" /> at the supply location{" "}
								<InlineMath math="l" />.
							</li>
							<li>
								<InlineMath math="S_{l}" /> is the supply at location{" "}
								<InlineMath math="l" />.
							</li>
							<li>
								<InlineMath math="\rho" /> is the aggregate demand divided by
								the aggregate supply (
								<InlineMath math="\rho = \sum_{r} D_{r} / \sum_{l} S_{l}" />
								).
							</li>
							<li>
								<InlineMath math="d_{il}" /> is the distance between demand
								location <InlineMath math="i" /> and supply location{" "}
								<InlineMath math="l" />.
							</li>
						</ul>
					</p>
					<p>
						RAAM calculates the cost using an optimization method that minimizes
						the cost of this function.
					</p>
					<p>
						<b>Assumptions: &nbsp;</b>
						<ul>
							<li>
								We can use any weight function, so we no longer need to set a
								maximum distance although we usually do for practical reasons.
							</li>
							<li>
								Demand for resources/services are not just influenced by travel
								time, but also the congestion at supply locations.
							</li>
							<li>
								People linearly trade-off travel time and congestion at the rate
								set by{" "}
								<span
									style={{
										display: "inline-block",
										marginTop: -16,
										marginBottom: -16,
									}}
								>
									<BlockMath math={"\\tau"} />
								</span>{" "}
								. For example, those with time or mobility restrictions may not
								be able to travel further.
							</li>
						</ul>
					</p>
				</Box>
				<Box id="references" sx={sectionStyle}>
					<Typography variant="h5">References</Typography>
					<p>
						Walter Isard. Methods of Regional Analysis: Introduction to Regional
						Science. MIT Press, Cambridge, MA, 1960.
					</p>
					<p>
						Wei Luo. Using a gis-based floating catchment method to assess areas
						with shortage of physicians. Health & Place, 10(1):1 – 11, 2004.
						doi:10.1016/S1353-8292(02)00067-9.
					</p>
					<p>
						Wei Luo and Yi Qi. An enhanced two-step floating catchment area
						(e2sfca) method for measuring spatial accessibility to primary care
						physicians. Health & Place, 15(4):1100 – 1107, 2009.
						doi:10.1016/j.healthplace.2009.06.002.
					</p>
					<p>
						Wei Luo and Fahui Wang. Measures of spatial accessibility to health
						care in a gis environment: synthesis and a case study in the chicago
						region. Environment and Planning B: Planning and Design,
						30(6):865–884, 2003. doi:10.1068/b29120.
					</p>
					<p>
						James Saxon and Daniel Snow. A rational agent model for the spatial
						accessibility of primary health care. Annals of the American
						Association of Geographers, 0(0):1–18, 2019.
						doi:10.1080/24694452.2019.1629870.
					</p>
					<p>
						James Saxon, Julia Koshinsky, Karina Acosta, Vidal Anguiano, Luc
						Anselin, and Sergio Rey. An open software environment to make
						spatial access metrics more accessible
					</p>
					<p>
						Neng Wan, Bin Zou, and Troy Sternberg. A three-step floating
						catchment area method for analyzing spatial access to health
						services. International Journal of Geographical Information Science,
						26(6):1073–1089, 2012. doi:10.1080/13658816.2011.624987.
					</p>
					<p>
						Fahui Wang and Wei Luo. Assessing spatial and nonspatial factors for
						healthcare access: towards an integrated approach to defining health
						professional shortage areas. Health & Place, 11(2):131 – 146, 2005.
						Special section: Geographies of Intellectual Disability.
						doi:10.1016/j.healthplace.2004.02.003.
					</p>
				</Box>
			</Box>
		</Box>
	);
}

const WhyDataTable = () => {
	const rows = [
		{
			category: "Spatial",
			potential: "Nearby resources/services you can potentially use",
			realized: "Nearby resources/services you have actually used",
		},
		{
			category: "Aspatial",
			potential:
				"Factors besides location/travel time that could potentially influence decisions (income, age, sex, etc.)",
			realized:
				"Factors besides location/travel time that have been observed influencing decisions",
		},
	];
	return (
		<TableContainer component={Paper}>
			<Table sx={{ paddingTop: "0.5em" }}>
				<TableHead>
					<TableRow>
						<TableCell></TableCell>
						<TableCell>Potential</TableCell>
						<TableCell>Realized</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow key={row.category}>
							<TableCell>{row.category}</TableCell>
							<TableCell>{row.potential}</TableCell>
							<TableCell>{row.realized}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
