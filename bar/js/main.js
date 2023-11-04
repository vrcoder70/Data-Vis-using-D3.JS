var plotOne;
var plotTwo;
var twoG;
var oneG;
var highGrowthRate = [];
var lowGrowthRate = [];
var other = [];
var playClick = false;
const margin = {top: 50, right: 30, bottom: 70, left: 120};
const width = 640;
const height = 400;
const innerWidth = width - margin.right - margin.left;
const innerHeight = height - margin.top - margin.bottom;
const xScale = d3.scaleLinear()
                    .domain([0,80])
                    .range([0,innerWidth-10]);
const yScale = d3.scaleBand()
        .range([0,innerHeight])
        .padding(0.7);
const growthColor = '#02DBE3';
const literacyColor = '#1000FF';
const tooltipColor = 'white';
const tootltipOffset = 10;
document.addEventListener(`DOMContentLoaded`, function () {

    plotOne = d3.select('#plot_two')
                .append('svg')
                    .attr('id', 'one_id')
                    .attr('width', width)
                    .attr('height', height);
    
    oneG = plotOne.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
   
    plotTwo = d3.select('#plot_one')
            .append('svg')
                .attr('id', 'two_id')
                .attr('width', width)
                .attr('height', height);
    twoG = plotTwo.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);
    
    
    
    d3.csv(`data/2015_16_Statewise_Secondary.csv`)
        .then(function (data) {
        data.forEach(element => {
            let e = {};
            e['grwoth_rate'] = +element['grwoth_rate'];
            e['literacy_rate'] = +element['literacy_rate'];
            e['statname'] = element['statname'];
            if(e['grwoth_rate'] > 20 && e['literacy_rate'] <= 80){
                highGrowthRate.push(e);
            }else if(e['grwoth_rate'] <= 20 && e['literacy_rate'] <= 80){
                lowGrowthRate.push(e);
            }else{
                other.push(e);
            }
        });
       
    });

    console.log(highGrowthRate);
    console.log(lowGrowthRate);
    console.log(other);
    //startDraw();
    
});

const startPlotOne = () => {
    barPlotTwo();

    plotTwo.attr('class' , 'border border-warning rounded bg-light shadow-sm')
    .style('background-image','linear-gradient(#FF9933,#FFFFFF,#138808)')
    .style('border', 'none');

    plotTwo.append('rect')
            .attr('class', 'label1')
            .attr('x', 30)
            .attr('y', 10)
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', growthColor)
            .attr('stroke', 'black');
    
    plotTwo.append('text')
            .attr('x', 60)
            .attr('y', 27)
            .attr('fill', growthColor)
            .text('Growth Rate');

    plotTwo.append('text')
            .attr('x', 160)
            .attr('y', 27)
            .attr('fill', 'black')
            .text('States with Growth rate < 20 % and Literacy rate <= 80 %');
    
    document.getElementById('plot-one').innerText = "Everyone knows the economy runs by highly educated people only. So if the state has a good number of well-educated people its growth rate will increase but another way around is also true. Simply put this way if the state dosen't has a higher number of educated people, it's economy take a big hit or won't grow as much as other. For example, see the above graph, economic growth is not even 20 percent when the literacy rate is less than 80 percent.";

    if(playClick){
        document.getElementById('link').innerHTML = 'Click <a href="https://www.kaggle.com/datasets/rajanand/education-in-india?select=2015_16_Statewise_Secondary.csv">here</a> for source of dataset.' 
    }
    playClick = true;
}

const startPlotTwo = () => {
    
    barPlotOne();
    plotOne.attr('class' , 'border border-warning rounded bg-light shadow-sm')
    .style('background-image','linear-gradient(#FF9933,#FFFFFF,#138808)')
    .style('border', 'none');

    
    plotOne.append('rect')
            .attr('class', 'label2')
            .attr('x', 465)
            .attr('y', 10)
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', literacyColor)
            .attr('stroke', 'black');
    
    plotOne.append('text')
            .attr('x', 495)
            .attr('y', 27)
            .attr('fill', literacyColor)
            .text('Literacy Rate')
    
    plotOne.append('text')
            .attr('x', 30)
            .attr('y', 27)
            .attr('fill', 'black')
            .text('States with Growth rate > 20 % and Literacy rate <= 80 %');

   
    document.getElementById('plot-two').innerText = `Is it make any sense that more people with degrees means better growth? Once a famous man said, "Never confuse education with intelligence, you can have a Ph.D. and still be an idiot."  So it doesn't if a state has 999 idiots (so-called literates) out of 1000, its growth still be near the equator. That is what the above graph shows, even with quite a low literacy rate a state can have a higher growth rate. `;

    if(playClick){
        document.getElementById('link').innerHTML = 'Click <a href="https://www.kaggle.com/datasets/rajanand/education-in-india?select=2015_16_Statewise_Secondary.csv" target="_blank">here</a> for source of dataset.' 
    }
    playClick =true;
}

const barPlotOne = () => {

    const xAxisStyle = d3.axisBottom(xScale).tickSizeInner([-innerHeight+13]);

    const xAxis = oneG.append('g').call(xAxisStyle)
                    .attr('transform', `translate(0,${innerHeight})`);
    xAxis.select('.domain').remove();
    oneG.append('text')
        .attr('y',320)
        .attr('x', -115)
        .attr('fill','black')
        .attr('font-size', '1em')
        .text(`Ha Ha Ha. Are you kidding me? Number of educated people dosen't define Economy.`);

    yScale.domain(highGrowthRate.map(d => d.statname));       
    const yAxis = oneG.append('g').call(d3.axisLeft(yScale)).selectAll('.domain, .tick line').remove();
   
    const literacy = oneG.selectAll('literacyRect')
                .data(highGrowthRate);
            
    literacy.join('rect')
            .on('mouseover', function(e,d){
                d3.selectAll('.bar').attr('opacity', '0.1').style('stroke','none');
                d3.select(this).attr('opacity', '1').style('stroke', literacyColor);

                tooltip
                    .html(`State : ${d.statname} <br> Literacy Rate: ${d.literacy_rate} % <br> Growth Rate: ${d.grwoth_rate} % `)
                    .style('opacity', 1)
                    .style('position', 'absolute')
                    .style('display','block')
                    .style('font-weight','bold')
                    .style('left', `${e.clientX}px`)
                    .style('top', `${e.clientY}px`);
            })
            .on('mousemove',  function(e,d){
                console.log(e.clientX);
                let X = e.clientX + tootltipOffset;
                if( e.clientX >= 1180){
                    X = X - 200;
                }

                let Y = e.clientY + tootltipOffset;
                if( e.clientY >= 410){
                    Y = Y - 100;
                }
                tooltip
                    .style('left', `${X}px`)
                    .style('top', `${Y}px`);
            })
            .on('mouseout',  function(e,d){
                d3.selectAll('.bar').attr('opacity', '1').style('stroke','black');
                tooltip
                    .style('opacity', 0)
                    .style('display','none');
            })   
            .transition()
            .duration(1000)
            .attr('class', 'bar')  
            .attr('y', d => yScale(d.statname)-5)
            .attr('width', d => xScale(d.literacy_rate))
            .attr('height', yScale.bandwidth())
            .attr("fill", literacyColor)
            .attr('opacity', '1')
            .style('stroke', 'black');
    
    

    const growth = oneG.selectAll('growthRect')
                .data(highGrowthRate);
                
    growth.join('rect')
            .on('mouseover', function(e,d){
                console.log('mouseover');
                d3.selectAll('.bar').attr('opacity', '0.1').style('stroke','none');
                d3.select(this).attr('opacity', '1')
                .style('stroke', growthColor);

                tooltip
                    .html(`State : ${d.statname} <br> Growth Rate: ${d.grwoth_rate} % <br> Literacy Rate: ${d.literacy_rate} %`)
                    .style('opacity', 1)
                    .style('position', 'absolute')
                    .style('display','block')
                    .style('font-weight','bold')
                    .style('left', `${e.clientX}px`)
                    .style('top', `${e.clientY}px`);
            })
            .on('mousemove',  function(e,d){
                let X = e.clientX + tootltipOffset;
                if( e.clientX >= 1180){
                    X = X - 200;
                }

                let Y = e.clientY + tootltipOffset;
                if( e.clientY >= 410){
                    Y = Y - 100;
                }
                tooltip
                    .style('left', `${X}px`)
                    .style('top', `${Y}px`);
            })
            .on('mouseout',  function(e,d){
                console.log('mouseout');
                d3.selectAll('.bar').attr('opacity', '1').style('stroke','black');
               
                tooltip
                    .style('opacity', 0)
                    .style('display','none');
            })   
            .transition()
            .duration(1000)
            .attr('class', 'bar')   
            .attr('y', d => yScale(d.statname)+5)
            .attr('width', d => xScale(d.grwoth_rate))
            .attr('height', yScale.bandwidth())
            .attr("fill", growthColor)
            .attr('opacity', '1')
            .style('stroke', 'black'); 

    const tooltip = d3.select('body')
            .append('div')
            .style('opacity', 0)
            .attr('class', 'tooltip')
            .style('border', 'none')
            .style('height', '250px')
            .style('width', '250px');
}


const barPlotTwo = () => {
    const xAxisStyle = d3.axisBottom(xScale).tickSizeInner([-innerHeight+13]);

    const xAxis = twoG.append('g').call(xAxisStyle)
            .attr('transform', `translate(0,${innerHeight})`); 
    xAxis.select('.domain').remove();
    
    twoG.append('text')
        .attr('class','tileTwo')
        .attr('y',320)
        .attr('x', -25)
        .attr('fill','black')
        .attr('font-size', '1em')
        .text('Yeah, It is. You will grow more if you have more educated people.');

    yScale.domain(lowGrowthRate.map(d => d.statname));  
    const yAxis = twoG.append('g').call(d3.axisLeft(yScale)).selectAll('.domain, .tick line').remove();
   
    const literacy = twoG.selectAll('literacyRect')
                .data(lowGrowthRate);
            
    literacy.join('rect')
            .on('mouseover', function(e,d){
                d3.selectAll('.barTwo').attr('opacity', '0.1').style('stroke','none');
                d3.select(this).attr('opacity', '1')
                .style('stroke', literacyColor);
                tooltip
                    .html(`State : ${d.statname} <br> Literacy Rate: ${d.literacy_rate} % <br> Growth Rate: ${d.grwoth_rate} %`)
                    .style('opacity', 1)
                    .style('position', 'absolute')
                    .style('display','block')
                    .style('font-weight','bold')
                    .style('left', `${e.clientX}px`)
                    .style('top', `${e.clientY}px`);
            })
            .on('mousemove',  function(e,d){
                let X = e.clientX + tootltipOffset;
                if( X >= 550){
                    X = X - 200;
                }

                let Y = e.clientY + tootltipOffset;
                if( e.clientY >= 410){
                    Y = Y - 100;
                }
                tooltip
                    .style('left', `${X}px`)
                    .style('top', `${Y}px`);
            })
            .on('mouseout',  function(e,d){
                d3.selectAll('.barTwo').attr('opacity', '1').style('stroke','black');
                tooltip
                    .style('opacity', 0)
                    .style('display','none');
            })   
            .transition()
            .duration(1000)
            .attr('class', 'barTwo')  
            .attr('y', d => yScale(d.statname)-5)
            .attr('width', d => xScale(d.literacy_rate))
            .attr('height', yScale.bandwidth())
            .attr("fill", literacyColor)
            .attr('opacity', '1')
            .attr('stroke','black');
    

    const growth = twoG.selectAll('growthRect')
                .data(lowGrowthRate);
                
    growth.join('rect')
            .on('mouseover', function(e,d){
                d3.selectAll('.barTwo').attr('opacity', '0.1').style('stroke','none');
                d3.select(this).attr('opacity', '1')
                .style('stroke', growthColor);

                tooltip
                    .html(`State : ${d.statname} <br> Growth Rate: ${d.grwoth_rate} % <br> Literacy Rate: ${d.literacy_rate} %`)
                    .style('opacity', 1)
                    .style('position', 'absolute')
                    .style('display','block')
                    .style('font-weight','bold')
                    .style('left', `${e.clientX}px`)
                    .style('top', `${e.clientY}px`);
            })
            .on('mousemove',  function(e,d){
                let X = e.clientX + tootltipOffset;
                if( e.clientX >= 510){
                    X = X - 100;
                }

                let Y = e.clientY + tootltipOffset;
                if( e.clientY >= 410){
                    Y = Y - 100;
                }
                tooltip
                    .style('left', `${X}px`)
                    .style('top', `${Y}px`);
            })
            .on('mouseout',  function(e,d){
                d3.selectAll('.barTwo').attr('opacity', '1').style('stroke','black');
                tooltip
                    .style('opacity', 0)
                    .style('display','none');
            })   
            .transition()
            .duration(1000)
            .attr('class', 'barTwo')   
            .attr('y', d => yScale(d.statname)+5)
            .attr('width', d => xScale(d.grwoth_rate))
            .attr('height', yScale.bandwidth())
            .attr("fill", growthColor)
            .attr('opacity', '1')
            .attr('stroke', 'black'); 

    const tooltip = d3.select('body')
            .append('div')
            .style('opacity', 0)
            .attr('class', 'tooltip')
            .style('border', 'none')
            .style('height', '250px')
            .style('width', '250px');
}
