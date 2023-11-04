var countries;

const width = 1000;
const height = 500;

document.addEventListener('DOMContentLoaded', function () {
    d3.json('data/countries50m.json')
        .then(data => {
            countries = topojson.feature(data, data.objects.countries); 
        });
});

const plotWorldMap = () => {
    const svg = d3.select('#my_dataviz')
            .append('svg')
                .attr('width', width)
                .attr('height', height);

    const projection = d3.geoEqualEarth();
    const pathGenerator = d3.geoPath().projection(projection);

    const g = svg.append('g');

    svg.call(d3.zoom().on('zoom', (event) => {
        g.attr('transform', event.transform);
    }))

    g.append('path')
        .attr('class','sphere')
        .attr('d', pathGenerator({type:'Sphere'}))

    g.selectAll('path')
                .data(countries.features)
                .enter()
                .append('path')
                .attr('class','country')
                .attr('d', pathGenerator)
            .append('title')
                .text(d => d.properties.name);
}