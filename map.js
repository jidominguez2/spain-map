const WIDTH = window.innerWidth;
const HEIGHT= window.innerHeight;
const ZOOM_THRESHOLD=[0.3,7];
const OVERLAY_MULTIPLIER=10;
const OVERLAY_OFFSET=OVERLAY_MULTIPLIER/2-0.5;
const ZOOM_DURATION =500;
const ZOOM_IN_STEP=2;
const ZOMM_OUT_STEP=1/ZOOM_IN_STEP;
const HOVER_COLOR="#d36f80";

//Evento handler
const zoom=d3
    .zoom()
    .scaleExtent(ZOOM_THRESHOLD)
    .on("zoom", zoomHandler);

function zoomHandler(){
    g.attr("transform", d3.event.transform);
}

function mouseOverHandler(d,i){
    d3.select(this).attr("fill",HOVER_COLOR)
    d3.select("#maptext").text(`has elegido ${d.properties.name}; ${d.properties.value}`)
}

function mouseOutHandler(d,i){
    d3.select(this).attr("fill",color(i))
}

//Espacio para el mapa

const svg=d3
    .select("#mapcontainer")
    .append("svg")
    .attr("width","100%")
    .attr("height","100%");

const g=svg.call(zoom).append("g");

g
    .append("rect")
    .attr("width",  WIDTH * OVERLAY_MULTIPLIER)
    .attr("height", HEIGHT * OVERLAY_MULTIPLIER)
    .attr("transform", `translate(-${WIDTH*OVERLAY_OFFSET}-${HEIGHT*OVERLAY_OFFSET})`)
    .style("fill","none")
    .style("pointer-event", "all");

//Centro del mapa, escala

const projection=d3
    .geoMercator()
    .center([-4.4352, 40.2591])
    .scale(2500)
    .translate([WIDTH/2,HEIGHT/2]);

//proyectar los path

const path=d3.geoPath().projection(projection);
const color=d3.scaleOrdinal(d3.schemeCategory20c.slice(1, 4));

//renderizar mapa, eligiendo los puntos para los dibujos

renderMap(spain);

function renderMap(root){
    g
        .append("g")
        .selectAll("path")
        .data(root.features)
        .enter()
        .append("path")
        .attr("d",path)
        .attr("fill", (d,i)=>color(i))
        .attr("stroke","black")
        .attr("stroke-width", 0.5)
        .on("mouseover", mouseOverHandler)
        .on("mouseout", mouseOutHandler);
    g
        .append("g")
        .selectAll("text")
        .data(root.features)
        .enter()
        .append("text")
        .attr("transform",d=>`translate(${path.centroid(d)})`)
        .attr("dx", d=>_.get(d, "offset[0]",null))
        .attr("dy", d=>_.get(d, "offset[1]",null));
}