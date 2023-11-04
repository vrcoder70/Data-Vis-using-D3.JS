var pieSvg;
var barSvg;
var textArea;
var message;
var colors
var pieG;
var barG;
var xAxis;
var yAxis; 

const yAxisFormat = d3.format('');
const consonant = {};
const vowel = {};
const punctuation = {};
const pieChartData = [];
const vowelsString = 'aeiouy';
const vowelRange = vowelsString.split('');
const consonantsString = 'bcdfghjklmnpqrstvwxz';
const consonantRange = consonantsString.split('');
const punctuationStrig = '.,?!:;';
const punctuationRange = punctuationStrig.split('');
const margin = {top: 50, right: 30, bottom: 70, left: 60};
const width = 580;
const height = 400;
const innerWidth = width - margin.right - margin.left;
const innerHeight = height - margin.top - margin.bottom;
const radius = Math.min(width,height) / 2 - margin.top;
const innerRadius = radius - 75;
const popOut = d3.arc().outerRadius(radius*1.02).innerRadius(innerRadius*0.98);
const popIn = d3.arc().outerRadius(radius).innerRadius(innerRadius);


document.addEventListener('DOMContentLoaded', function () {

    pieSvg = d3.select('#pie_div')
                .append('svg')
                    .attr('id', 'pie_svg')
                    .attr('width', width)
                    .attr('height', height);
   
   
    barSvg = d3.select('#bar_div')
            .append('svg')
                .attr('id', 'bar_svg')
                .attr('width', width)
                .attr('height', height);
       
});

const submitText = () => {
    
    pieChartData.length = 0;
    textArea = document.getElementById('wordbox');

    message = textArea.value.toLowerCase();
    let char, count, vCount = 0 , cCount = 0, pCount = 0;
    if (message.length == 0)
        return;
    for(let i=0; i < message.length; i++){
        char = message.charAt(i);
        if(vowelsString.includes(char)){
            count = vowel[char];
            vowel[char] = count ? count + 1 : 1;
            vCount++;
        }else if(consonantsString.includes(char)){
            count = consonant[char];
            consonant[char] = count ? count + 1 : 1;
            cCount++;
        }else if(punctuationStrig.includes(char)){
            count = punctuation[char];
            punctuation[char] = count ? count + 1 : 1;
            pCount++;
        }else{
            console.log('Nope, I am not displaying it');
        }
    }

    
    pieChartData.push({chartype : 'Vowels', count : vCount, distribution : vowel});
    pieChartData.push({chartype : 'Consonants', count : cCount, distribution : consonant});
    pieChartData.push({chartype : 'Punctuations', count : pCount, distribution : punctuation});
    
    colors = d3.scaleOrdinal(d3.schemePastel2);

    const arc = d3.arc()
                    .outerRadius(radius)
                    .innerRadius(innerRadius);
        

    // remove the g
    d3.selectAll('.pieG, .barG').remove();
    
    pieG = pieSvg.append('g')
                    .attr('class', 'pieG')
                    .attr('transform', `translate(${width / 2},${height / 2})`);
    
    barG = barSvg.append('g')
                    .attr('class', 'barG')
                    .attr('transform', `translate(${margin.top},${margin.left})`);
        
    xAxis = barG.append('g')
                    .attr('transform', `translate(0, ${innerHeight})`);
    yAxis = barG.append('g')
                    .attr('class', 'yAxis'); 

    pieG.append('path')
        .attr('class', 'backgroundArc')
        .attr('d', arc({startAngle:0, endAngle:2 * Math.PI}));

    const pie = d3.pie()
                .sort(null)
                .value(d => d.count);
    
    const arcs = pie(pieChartData);

    const arcElements = pieG.selectAll('.arc').data(arcs);

    arcElements.enter()
                .append('path')
                .attr('class', 'arc')
                .attr('d', arc)
                .attr('fill', d => colors(d.value))
                .attr('stroke', 'black')
                .style('stroke-width', '1px')
                .merge(arcElements)
                .on('mouseover', function(d,i) {
                    d3.select(this)
                        .transition()
                        .attr('d', popOut)
                        .style('stroke-width', '4px');
                        
                    var centText = pieG.selectAll('.center').data([i]);
                        centText.enter()
                        .append('text')
                        .attr('class', 'center')
                        .attr('text-anchor', 'middle')
                        .text(i.data.chartype + ':' + i.data.count);
                    
                })
                .on('mouseout', function(d,i) {
                    d3.select(this)
                        .transition()
                        .attr('d', popIn)
                        .style('stroke-width', '1px');

                    d3.selectAll('.center').remove();
                })
                .on('click', function(d,i) {
                    document.getElementById('character-name').innerHTML = `Detailed Distribution for selected ${i.data.chartype} characters.`;
                    clr = d3.select(this).style('fill')
                    if(i.data.chartype == 'Vowels'){
                        drawBarPlot(i.data.distribution, vowelRange, clr);
                    }else if (i.data.chartype == 'Consonants') {
                        drawBarPlot(i.data.distribution, consonantRange, clr);
                    } else {
                        drawBarPlot(i.data.distribution, punctuationRange, clr);
                    }
                    
                }); 
                
                 
}

const drawBarPlot = (distribution, range,clr) => {
    d3.selectAll('.bars').remove();
    
    const values = Object.values(distribution);
    const object = [];
    
    range.forEach(element => {
        var val = distribution[element] ? distribution[element] : 0;
        object.push({k:element, v:val});
    });
   
    const xScale = d3.scaleBand()
            .range([0,innerWidth])
            .domain(range)
            .padding(0.2);
    
    const yScale = d3.scaleLinear()
            .domain([0,Math.max(...values)])
            .range([innerHeight,0]);
            
    xAxis
        .transition()
        .call(d3.axisBottom(xScale));
    
    yAxis
        .transition()
        .call(d3.axisLeft(yScale).tickFormat(yAxisFormat));
    
    var bars = barG.selectAll('.bars')
                .data(object);
    bars
        .enter()
        .append('rect')
        .attr('class', 'bars')  
        .merge(bars) 
            .attr('x', d => xScale(d.k))
            .attr('y', d => yScale(d.v))
            .attr('width', xScale.bandwidth())
            .attr('height', d => innerHeight - yScale(d.v))
            .attr('fill', clr)
            .style('stroke', 'black')
            .on('mouseover', function(e,d){
                tooltip
                    .html(`Character: <I>"<B>${d.k}</B>"</I> <br> Value: <I>"<B>${d.v}</B>"</I>`)
                    .style('opacity', 1)
                    .style('position', 'absolute')
                    .style('left', `${e.clientX}px`)
                    .style('top', `${e.clientY+140}px`);
            }).on('mousemove', function(e,d){
                tooltip
                    .style('left', `${e.clientX}px`)
                    .style('top', `${e.clientY+140}px`);
            })
            .on('mouseout', function(e,d){
                tooltip
                    .style('opacity', 0);
            });
    
    const tooltip = d3.select('body')
            .append('div')
            .style('opacity', 0)
            .attr('class', 'tooltip')
            .style('background-color', 'White')
            .style('border', 'solid')
            .style('border-width', '3px')
            .style('border-radius', '4px')
            .style('height', '60px')
            .style('width', '110px');
}
