
var countryRegions;

var expanded = false;
var svg;
var g;
var xAxis;
var yAxis;
var gd;
var righAxis;

let played = false;
let worldRegion = false;
const yAxisFormat = d3.format(`.2s`);
const margin = {top: 10, right: 60, bottom: 70, left: 60};
const width = 1200;
const height = 700;
const startYear = 1980;
const endYear = 2013;
const innerHeight = height - margin.bottom - margin.top;
const innerWidth = width - margin.left - margin.right;
const xScale = d3.scaleTime()
                .range([0, innerWidth]);
const yScale = d3.scaleLinear()
                .range([innerHeight,0])
                .nice();
const transitionDuration = 1500;
const fontSize = `18px times`;
const fontFamily = `Arial, Helvetica, sans-serif`;
const fontColor = `black`;
//let topheight = 330;


document.addEventListener(`DOMContentLoaded`, function () {

    svg = d3.select(`#my_dataviz`)
            .append(`svg`)
                .attr(`width`, width)
                .attr(`height`, height);
    
    g = svg.append(`g`)
                .attr(`transform`, `translate(${margin.left},${margin.top})`);
    
    Promise.all([d3.csv(`data/countries_regions.csv`),d3.csv(`data/global_development.csv`)])
        .then(function (values) {
        countryRegions = values[0];
        gd = values[1];
        
    });
    document.getElementById(`startYear`).value = 1980;
    document.getElementById(`endYear`).value = 2013;
    document.getElementById(`opacity`).value = 100;
   console.log(countryMap);
})

const showCheckboxes = () => {
    var checkboxes = document.getElementById(`checkboxes`);
    if (!expanded) {
        console.log(expanded)
        checkboxes.style.display = `block`;
        expanded = true;
        
    } else {
        checkboxes.style.display = `none`;
        expanded = false;
    }
}

const startDraw = () => {
    
    let div = document.getElementById(`country-flag`);
    let countryName = document.getElementById(`country-name`);
    let span = document.getElementById(`flagName`);
    
    let img = document.getElementById(`flag`);

    
    const region = d3.group(countryRegions, d=>d[`World bank region`]);    
    
    let globalDevlopmentData = document.getElementById(`global-development-select`).value;
    if(globalDevlopmentData == `Global Development Data`){
        //window.alert(`Please Select Global Development Data from Dropdown Menu`);
        span.style.color = 'red'
        document.getElementById(`global-development-select`).style.outline = '#f00 solid 2px';
        span.textContent = `Please Select 'Global Development Data' from Dropdown Menu.`;
        return;
    }
    document.getElementById(`global-development-select`).style.outline ='';
    // let radioDeselect = document.getElementsByName(`select`)[1].checked;
    // if(radioDeselect){
    //     //d3.select('g').remove();
    //     span.textContent = `Please uncheck 'Deselect All' button by clicking 'Specific select or Select All' button.`;
    //     window.alert(`Please uncheck Deselect All button by clicking Specific select or Select All button.`);
    //     return;
    // }

    worldRegion = document.getElementById(`val1`).checked ||
        document.getElementById(`val2`).checked ||
        document.getElementById(`val3`).checked ||
        document.getElementById(`val4`).checked ||
        document.getElementById(`val5`).checked ||
        document.getElementById(`val6`).checked ||
        document.getElementById(`val7`).checked;
    if(!worldRegion){
        span.style.color = 'red'
        // window.alert(`Please Select at least one World Bank Region from Dropdown Menu.`);
        document.getElementById('overSelect').style.outline = '#f00 solid 2px';
        span.textContent = `Please Select at least one 'World Bank Region' from Dropdown Menu.` 
        d3.selectAll('.yAxisText, .tick, .circles, .line-path, .domain, .xAxisText').remove();
        return;
    }
    document.getElementById('overSelect').style.outline = '';
    let opacityVal = document.getElementById(`opacity`).value / 100 + ``;
    
    
    let lower = document.getElementById(`startYear`).value;
    let higher = document.getElementById(`endYear`).value;
    let ticksCount = higher-lower;
    if (ticksCount == 0){
        d3.selectAll('.yAxisText, .tick, .circles, .line-path, .domain, .xAxisText').remove();
        //window.alert(`Start year and End year can not be same.`);
        span.textContent  = "Start year and End year can not be same.";
        span.style.color = 'red'
        return;
    }else if(ticksCount < 0){
        d3.selectAll('.yAxisText, .tick, .circles, .line-path, .domain, .xAxisText').remove();
        //window.alert(`Start year must be less than End year.`);
        span.textContent  = "Start year must be less than End year.";
        span.style.color = 'red'
        return;
    }
    span.style.color = 'green'
    span.textContent  = "Hover over at end point to see country's name.";
    // let radioSelect = document.getElementsByName(`select`)[0].checked;
    // if(radioSelect){
    //     document.getElementById(`val1`).checked = true;
    //     document.getElementById(`val2`).checked = true;
    //     document.getElementById(`val3`).checked = true;
    //     document.getElementById(`val4`).checked = true;
    //     document.getElementById(`val5`).checked = true;
    //     document.getElementById(`val6`).checked = true;
    //     document.getElementById(`val7`).checked = true;
    // }

    let globalDevlopment = [];
    gd.forEach(element => {
        let year = +element.Year
        if(  year >= lower && year <= higher){
            let obj = {}
            obj.Country = element.Country;
            obj.Year = new Date(+year, 0, 1);
            if(globalDevlopmentData == `Data.Health.Fertility Rate`){
                obj[`Data.Health.Fertility Rate`] = + element[`Data.Health.Fertility Rate`];
            }else if(globalDevlopmentData == `Data.Health.Birth Rate`){
                obj[`Data.Health.Birth Rate`] = + element[`Data.Health.Birth Rate`];
            }else if(globalDevlopmentData == `Data.Health.Death Rate`){
                obj[`Data.Health.Death Rate`] = + element[`Data.Health.Death Rate`];
            }else if(globalDevlopmentData == `Data.Health.Life Expectancy at Birth, Total`){
                obj[`Data.Health.Life Expectancy at Birth, Total`] = + element[`Data.Health.Life Expectancy at Birth, Total`];
            }else if(globalDevlopmentData == `Data.Health.Population Growth`){
                obj[`Data.Health.Population Growth`] = + element[`Data.Health.Population Growth`];
            }else if(globalDevlopmentData == `Data.Health.Total Population`){
                obj[`Data.Health.Total Population`] = + element[`Data.Health.Total Population`];
            }else if(globalDevlopmentData == `Data.Infrastructure.Mobile Cellular Subscriptions`){
                obj[`Data.Infrastructure.Mobile Cellular Subscriptions`] = + element[`Data.Infrastructure.Mobile Cellular Subscriptions`];
            }else if(globalDevlopmentData == `Data.Infrastructure.Telephone Lines`){
                obj[`Data.Infrastructure.Telephone Lines`] = + element[`Data.Infrastructure.Telephone Lines`];
            }else if(globalDevlopmentData == `Data.Rural Development.Agricultural Land`){
                obj[`Data.Rural Development.Agricultural Land`] = + element[`Data.Rural Development.Agricultural Land`];
            }else if(globalDevlopmentData == `Data.Rural Development.Arable Land`){
                obj[`Data.Rural Development.Arable Land`] = + element[`Data.Rural Development.Arable Land`];
            }
            globalDevlopment.push(obj)
        }
    });
    d3.selectAll(`.yAxisText,.tick,.circles`).remove();
    let visData = [];
    if(document.getElementById(`val1`).checked){
        var arr = region.get(`South Asia`);
        globalDevlopment.forEach(e => {
            if(arr.some(ele => ele.name == e.Country)){
                visData.push(e);
            }
        });
    }

    if(document.getElementById(`val2`).checked){
        var arr = region.get(`Europe & Central Asia`);
        globalDevlopment.forEach(e => {
            if(arr.some(ele => ele.name == e.Country)){
                visData.push(e);
            }
        });
    }
    
    if(document.getElementById(`val3`).checked){
        var arr = region.get(`Middle East & North Africa`);
        globalDevlopment.forEach(e => {
            if(arr.some(ele => ele.name == e.Country)){
                visData.push(e);
            }
        });
    }

    if(document.getElementById(`val4`).checked){
        var arr = region.get(`Sub-Saharan Africa`);
        globalDevlopment.forEach(e => {
            if(arr.some(ele => ele.name == e.Country)){
                visData.push(e);
            }
        });
    }

    if(document.getElementById(`val5`).checked){
        var arr = region.get(`Latin America & Caribbean`);
        globalDevlopment.forEach(e => {
            if(arr.some(ele => ele.name == e.Country)){
                visData.push(e);
            }
        });
    }
    
    if(document.getElementById(`val6`).checked){
        var arr = region.get(`East Asia & Pacific`);
        globalDevlopment.forEach(e => {
            if(arr.some(ele => ele.name == e.Country)){
                visData.push(e);
            }
        });
    }

    if(document.getElementById(`val7`).checked){
        var arr = region.get(`North America`);
        globalDevlopment.forEach(e => {
            if(arr.some(ele => ele.name == e.Country)){
                visData.push(e);
            }
        });
    }

    xAxis = g.append(`g`)
                .attr(`transform`, `translate(0, ${innerHeight})`);

    xAxis.append(`text`)
            .attr(`x`, innerWidth/2)
            .attr(`class`, `xAxisText`)
            .attr(`y`, 30)
            .style(`font`, fontSize)
            .style(`font-family`, fontFamily)
            .attr(`fill`, fontColor)
            .text(`Year`);
    
    xScale
        .domain([new Date(lower, 0, 1), new Date(higher, 0, 1)])
    
    let axisbottom = d3.axisBottom(xScale)
                        .ticks(ticksCount)
                        .tickSizeInner([-innerHeight]); ;
    
    xAxis
        .transition()
            .duration(500)
            .call(axisbottom);

    yAxis = g.append(`g`)
            .attr(`class`, `yAxis`);

    yAxis.append(`text`)
        .attr(`x`, -innerHeight/2 + 65)
        .attr(`y`, -40)
        .attr(`class`, `yAxisText`)
        .style(`font`, fontSize)
        .style(`font-family`, fontFamily)
        .attr(`fill`, fontColor)
        .style(`text-anchor`, `end`)
        .attr(`transform`, `rotate(-90)`)
        .text(`Data of `+globalDevlopmentData.split(`.`)[2]);

    const yValue = d => d[globalDevlopmentData]    

    const group = d3.group(visData, d => d.Country);
    
    yScale
        .domain(d3.extent(visData,yValue));
    
    let axisLeft = d3.axisLeft(yScale)
                        .tickFormat(yAxisFormat)
                        .tickSizeInner([-innerWidth]); 
    yAxis
        .transition()
            .duration(500)
            .call(axisLeft);
    
    const lineGenerator = (d) => { 
                            return d3.line()
                            .x(d => xScale(d.Year))
                            .y(d => yScale(d[globalDevlopmentData]))
                            .curve(d3.curveBasis)
                            (d[1]);
                            
                                
    }
    
    let colorMap = new Map();
    colorMap.set(`South Asia`,`#0051FF`);
    colorMap.set(`Europe & Central Asia`,`#00FF90`);
    colorMap.set(`Middle East & North Africa`,`#FFDD00`);
    colorMap.set(`Sub-Saharan Africa`,`#FF3700`);
    colorMap.set(`Latin America & Caribbean`,`#FFAE00`);
    colorMap.set(`East Asia & Pacific`,`#FF0090`);
    colorMap.set(`North America`,`#BB00FF`);
    
    let lines = g.selectAll(`.line-path`)
                    .data(group);

    lines
    .join(`path`)
    .attr(`class`,`line-path`)
    .attr(`id`, `lineIds`)
    .merge(lines)
    .transition()
        .duration(transitionDuration)
        .attr(`stroke`, d => {
            let col = ``;
            region.forEach((vals,key) => {
                vals.forEach(element => {
                    if(element.name == d[0]){
                        col = colorMap.get(key);
                    }
                })
            });
            return col;
        })
        .attr(`d`, d => lineGenerator(d))
        .attr(`opacity`, opacityVal);
        
    let circleYear = higher >= 2000 ? (higher % 2000) + 100 : higher % 1900;
   
    console.log(circleYear);

    let circle = g.selectAll(`circle`).data(visData);

    circle
    .enter()
    .append(`circle`)
    .merge(circle)
    .attr(`class`,`circles`)
    .attr(`id`,d => {
        if(circleYear == d.Year.getYear()){
            return `circleIds`;
        }
        return `noIds`;
    })
    .attr(`cx`,d => xScale(d.Year))
    .attr(`cy`,d => yScale(d[globalDevlopmentData]))
    .attr(`r`, `4px`)
    .attr(`fill`,d => {
        let col = ``;
            region.forEach((vals,key) => {
                vals.forEach(element => {
                    if(element.name == d.Country){
                        col = colorMap.get(key);
                    }
                })
            });
            return col;
    })
    .style(`opacity`, d => {
        if(circleYear == d.Year.getYear()){
            return opacityVal;
        }
        return `0`;
    })
    .on(`mouseover`, function(d,i){
        if(i.Year.getYear() == circleYear){
            // if(expanded){
            //     topheight = 500;
            // }
            span.style.visibility = 'hidden';
            div.style.display = 'block';
            img.src = countryMap.get(i.Country);
            img.alt = `${i.Country}'s Flag not Available`;
            countryName.textContent = i.Country;
            d3.select(this)
                .transition()
                .duration(500)
                .attr(`r`,`10px`)
                .attr(`stroke`,`black`);   
            
            // tooltip
            //     .html(`<img src="${countryMap.get(i.Country)}" alt="${i.Country}" id="flag"`)
            //     .style(`opacity`, 1)
            //     .style(`position`, `absolute`)
            //     .style(`left`, `750px`)
            //     .style(`top`, `${topheight}px`);
            // console.log(tooltip);
        }
        
    })
    .on(`mousemove`, function(d,i){
        // if(expanded){
        //     topheight = 500;
        // }
        if(i.Year.getYear() == circleYear){
            div.style.display = 'block';
            // tooltip
            //     .style(`left`, `750px`)
            //     .style(`top`, `${topheight}px`);
            
        }
    })
    .on(`mouseout`, function(d,i){
        if(i.Year.getYear() == circleYear){
            img.src = ""
            img.alt = ""
            div.style.display = 'none';
            countryName.textContent = '';
            span.style.visibility = 'visible';
            d3.select(this)
                .transition()
                .duration(500)
                .attr(`r`,`4px`)
                .attr(`stroke`,`None`); 
            // tooltip
            //     .style(`width`, `100px`)
            //     .style(`opacity`, 0);
        }
    });

    // const tooltip = d3.select(`#my_dataviz`)
    //         .append(`div`)
    //         .style(`opacity`, 0)
    //         .attr(`class`, `tooltip`)
    //         .style(`background-color`, `White`)
    //         .style(`border`, `none`)
    //         .style(`border-width`, `3px`)
    //         .style(`border-radius`, `4px`)
    //         .style(`height`, `100px`)
    //         .style(`width`, `100px`);

    played = true;
}

const changeOpacity = (value) => {
    let opacityVal = document.querySelectorAll(`[id=lineIds]`);
    let circles = document.querySelectorAll(`[id=circleIds]`);
    opacityVal.forEach(element => {
        element.style.opacity = (value/100)+``;
    })

    circles.forEach(e =>{
        e.style.opacity = (value/100)+``;
    })
}

const changeSelect = () => {
    let radioDeselect = document.getElementsByName(`select`)[1].checked;
    let radioSelect = document.getElementsByName(`select`)[0].checked;
    let span = document.getElementById(`flagName`);
    let globalDevlopmentData = document.getElementById(`global-development-select`).value;
    if(radioSelect){
        document.getElementById(`val1`).checked = true;
        document.getElementById(`val2`).checked = true;
        document.getElementById(`val3`).checked = true;
        document.getElementById(`val4`).checked = true;
        document.getElementById(`val5`).checked = true;
        document.getElementById(`val6`).checked = true;
        document.getElementById(`val7`).checked = true;
    }else if(radioDeselect){
        span.textContent = '';
        d3.selectAll('.yAxisText, .tick, .circles, .line-path, .domain, .xAxisText').remove();
        document.getElementById(`val1`).checked = false;
        document.getElementById(`val2`).checked = false;
        document.getElementById(`val3`).checked = false;
        document.getElementById(`val4`).checked = false;
        document.getElementById(`val5`).checked = false;
        document.getElementById(`val6`).checked = false;
        document.getElementById(`val7`).checked = false;
    }
    
    if(globalDevlopmentData != `Global Development Data` && radioSelect){
        startDraw();
    }
}

const changeCheckBox = () => {
    let radioDeselect = document.getElementsByName(`select`)[1].checked;
    let radioSelect = document.getElementsByName(`select`)[0].checked;
    let globalDevlopmentData = document.getElementById(`global-development-select`).value;
    if(globalDevlopmentData != `Global Development Data` && (radioDeselect || radioSelect)){
        startDraw();
    }
}

const drawAgain = () => {
    if(played && worldRegion){
        startDraw();
    }
}