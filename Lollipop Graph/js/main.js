// Hint: This is a good place to declare your global variables

// Variable
var femaleData;
var maleData;
var svg;
var g;
var xAxis;
var yAxis;

// Constant
const femaleColor = '#FC766AFF';
const maleColor = '#333D79FF';
const margin = {top: 50, right: 30, bottom: 70, left: 60};
const width = 1000;
const height = 600;
const startYear = 1990;
const endYear = 2023;
const innerHeight = height - margin.bottom - margin.top;
const innerWidth = width - margin.left - margin.right;
const squareDimension = 20;
const offeset = 5;
const circleRadius = '4';
const transitionDuration = 1500;
const fontSize = '18px times';
const fontFamily = 'Arial, Helvetica, sans-serif';
const fontColor = 'black';
const xScale = d3.scaleTime()
                .domain([new Date(startYear, 0, 1), new Date(endYear, 0, 1)])
                .range([0, innerWidth]);
const yScale = d3.scaleLinear().range([0, innerHeight]);


// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg element inside this function

    svg = d3.select('#my_dataviz')
            .append('svg')
                .attr('width', width)
                .attr('height', height);
    
    g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);
    
    xAxis = g.append('g')
                .attr('transform', `translate(0, ${innerHeight})`);

    xAxis.append('text')
            .attr('x', innerWidth/2)
            .attr('y', 30)
            .style('font', fontSize)
            .style('font-family', fontFamily)
            .attr('fill', fontColor)
            .text('Year');

    yAxis = g.append('g')
                .attr('class', 'yAxis');
    
    yAxis.append('text')
            .attr('x', -innerHeight/2 + 65)
            .attr('y', -40)
            .style('font', fontSize)
            .style('font-family', fontFamily)
            .attr('fill', fontColor)
            .style('text-anchor', 'end')
            .attr('transform', 'rotate(-90)')
            .text('Employment Rate');
    
    const rectGroup = svg.append('g')
                            .attr('transform', `translate(${innerWidth}, 0)`);

    // Data Lable and shape
    rectGroup.append('rect')
                .attr('x', - 150)
                .attr('width', squareDimension)
                .attr('height', squareDimension)
                .attr('fill', femaleColor)
                .attr('stroke', femaleColor);
    
    rectGroup.append('rect')
                .attr('x', - 150)
                .attr('y', 25)
                .attr('width', squareDimension)
                .attr('height', squareDimension)
                .attr('fill', maleColor)
                .attr('stroke', maleColor);
    
    rectGroup.append('text')
                .attr('x', - 125)
                .attr('y', 15)
                //.attr('fill', femaleColor) color for text
                .text('Female Employment Rate');
    
    rectGroup.append('text')
                .attr('x', - 125)
                .attr('y', 40)
                //.attr('fill', maleColor) color for text
                .text('Male Employment Rate');

   // This will load your two CSV files and store them into two arrays.   
   Promise.all([d3.csv('data/females_data.csv'),d3.csv('data/males_data.csv')])
        .then(function (values) {
            femaleData = values[0];
            maleData = values[1];
            
            // Hint: This is a good spot for doing data wrangling
            femaleData.forEach(element => {
                element.Year = new Date(+element.Year, 0, 1);
                element.Afghanistan = +element.Afghanistan;
                element.Bahrain = +element.Bahrain;
                element.Canada = +element.Canada;
                element.Estonia = +element.Estonia;
                element.Greece = +element.Greece;
                
            });

            maleData.forEach(element => {
                element.Year = new Date(+element.Year, 0, 1);
                element.Afghanistan = +element.Afghanistan;
                element.Bahrain = +element.Bahrain;
                element.Canada = +element.Canada;
                element.Estonia = +element.Estonia;
                element.Greece = +element.Greece;
                
            });
            
            drawLolliPopChart({value : document.getElementById('country-select').value});
        });
});

// Use this function to draw the lollipop chart.
const drawLolliPopChart = (selectedOption) => {
    
    // Find the max of male & female employment rate
    var range = [];
    maleData.forEach(d =>{
        range.push(d[selectedOption.value]);
    });

    femaleData.forEach(d =>{
        range.push(d[selectedOption.value]);
    });

    // Set domain & transition property & Lable
    xAxis
        .transition()
            .duration(transitionDuration)
            .call(d3.axisBottom(xScale))
    
    yScale
        .domain([Math.max(...range), 0]);
    yAxis
        .transition()
            .duration(transitionDuration)
            .call(d3.axisLeft(yScale));
    
    // Draw Lines.
    
    // Female
    const femaleLines = g.selectAll('.femalLine')
        .data(femaleData);
        
    femaleLines
        .enter()
        .append('line')
        .attr('class','femalLine')
        .merge(femaleLines)
        .transition()
        .duration(transitionDuration)
          .attr('x1', d => xScale(d.Year) + offeset )
          .attr('x2', d => xScale(d.Year) + offeset )
          .attr('y1', yScale(0) )
          .attr('y2', d => yScale(d[selectedOption.value]))
          .attr('stroke', femaleColor);

    // Male
    const maleLines = g.selectAll('.maleLine')
        .data(maleData);
    
    maleLines
        .enter()
        .append('line')
        .attr('class','maleLine')
        .merge(maleLines)
        .transition()
        .duration(transitionDuration)
            .attr('x1', d => xScale(d.Year) - offeset )
            .attr('x2', d => xScale(d.Year) - offeset )
            .attr('y1', yScale(0))
            .attr('y2', d => yScale(d[selectedOption.value]))
            .attr('stroke', maleColor);
 
    // Draw circles
    // Female
    const femaleCircles = g.selectAll('.femaleCircle')
        .data(femaleData);

    femaleCircles
        .enter()
        .append('circle')
        .attr('class','femaleCircle')
        .merge(femaleCircles)
        .transition()
        .duration(transitionDuration)
            .attr('cx', d => xScale(d.Year) + offeset)
            .attr('cy', d => yScale(d[selectedOption.value]) )
            .attr('r', circleRadius)
            .style('fill', femaleColor)
            .attr('stroke', femaleColor);
    
    // Male
    const maleCircles = g.selectAll('.male_circle')
        .data(maleData);
    
    maleCircles
        .enter()
        .append('circle')
        .attr('class','male_circle')
        .merge(maleCircles)
        .transition()
        .duration(transitionDuration)
            .attr('cx', d => xScale(d.Year) - offeset )
            .attr('cy', d => yScale(d[selectedOption.value]) )
            .attr('r', circleRadius)
            .style('fill', maleColor)
            .attr('stroke', maleColor);
}


