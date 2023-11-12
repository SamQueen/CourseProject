const width = 700;
const height = 500;
const margin = {'top': 10, 'bottom': 50, 'left': 30, 'right': 20};
let displayData = [];
let svg;

window.addEventListener('load', () => {
    // set data
    d3.csv('../data/Air_Quality.csv').then((data) => {
        displayData = data;
        drawLineChart();
    });
});

// draw line chart
const drawLineChart = () => {
    const data = parseData();
    console.log(data)
    
    // add svg
    svg = d3.select('#svg-container1')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

    // define x-axis
    var xAxis = d3.scaleLinear()
    .range([(0 + margin.left), (width - margin.right)])
    .domain([2008 , 2021]);

    // draw x-axis
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0, '+ (height-margin.bottom) +')')
        .call(d3.axisBottom(xAxis));

    // define y-axis
    var yAxis = d3.scaleLinear()
    .range([(height-margin.bottom), (margin.top)])
    .domain([0 , 60]);

    // draw y-axis
    svg.append('g')
    .attr('class', 'y-axis')
    .attr('transform', 'translate('+margin.left+', 0)')
    .call(d3.axisLeft(yAxis))

    // draw line
    svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', 3)
    .attr('d', d3.line()
        .x(function(d) { return xAxis(d.year) })
        .y(function(d) { return yAxis(d.average) })
    )
}

const parseData = () => {
    var data = []
    var map = new Map();

    displayData.map((item) => {
        if (item.Name === 'Nitrogen dioxide (NO2)' && item.Geo_Place_Name == 'Greenpoint') {
            // add a year attribute
            var str = item.Start_Date;
            year = str.substr(str.length - 4);
            item.year = year;
            
            // add to map
            if (map.has(year))
                map.get(year).push(Number(item.Data_Value))
            else {
                var arr = [Number(item.Data_Value)]
                map.set(year, arr);
            }
        }
    });

    // find the average for each year
    for (const x of map.entries()) {
        const findAvg = (array) => array.reduce((a, b) => a + b) / array.length;
        const year = x[0];
        const avg = findAvg(x[1]);
        var dataEntry = {year: year, average: avg};
        data.push(dataEntry);
    }

    // sort by year
    data.sort((a, b) => {
        return a.year - b.year;
    });

    return data;
}