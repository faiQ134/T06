const drawScatterplot = (data) => {
    
    // Set the dimensions and margins of the chart area
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`); // Responsive SVG

    // Create an inner chart group with margins
    // Note: Since 'innerChartS' was declared as 'let' in shared-constants, 
    // we assign to it here instead of using 'const innerChartS ='
    innerChartS = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    // Set up x and y scales using data extents
    const xExtent = d3.extent(data, d => d.star);
    const yExtent = d3.extent(data, d => d.screenSize);

    // ✅ CORRECTED: Modify the global scales, don't redeclare them with 'const'
    xScaleS
        .domain([xExtent[0] - 0.5, xExtent[1] + 0.5])
        .range([0, innerWidth]);

    // ✅ CORRECTED: Modify the global scales, don't redeclare them with 'const'
    yScaleS
        .domain([yExtent[0], yExtent[1]])
        .range([innerHeight, 0])
        .nice();
    
    // Set up color scale for screen technology
    colorScale
        .domain(data.map(d => d.screenTech)) // Get unique screenTech values
        .range(d3.schemeCategory10); // Use a predefined color scheme
    
    // Get unique technologies for the legend
    const uniqueTechs = colorScale.domain();


    // Add axes
    const bottomAxis = d3.axisBottom(xScaleS);
    innerChartS.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    svg.append("text")
        .text("Star Rating")
        .attr("text-anchor", "end")
        .attr("x", width - 20)
        .attr("y", height - 5)
        .attr("class", "axis-label");

    const leftAxis = d3.axisLeft(yScaleS);
    innerChartS.append("g")
        .call(leftAxis);

    svg.append("text")
        .text("Screen size (inches)")
        .attr("x", 30)
        .attr("y", 20)
        .attr("class", "axis-label");


    // Draw the scatterplot points
    innerChartS.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.screenSize))
        .attr("r", 4)
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.5);


    // Add a legend on the right-hand side
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 140}, ${margin.top})`);

    uniqueTechs.forEach((tech, i) => {
        const g = legend.append('g').attr('transform', `translate(0, ${i * 22})`);
        
        g.append('rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', colorScale(tech));
        
        g.append('text')
            .attr('x', 18)
            .attr('y', 10)
            .text(tech)
            .attr('class', 'axis-label');
    });
}

/**
 * Creates the static tooltip elements (rectangle and text) 
 * and initializes its opacity to 0.
 * NOTE: This function relies on innerChartS, tooltipWidth, and tooltipHeight 
 * being defined in shared-constants or globally accessible.
 */
const createTooltip = () => {
    
    // Create the main tooltip group and hide it initially
    const tooltip = innerChartS
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    // Add the background rectangle (assuming it's white or some color)
    tooltip.append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("fill", "black") // Assuming a dark background for contrast
        .attr("rx", 5)
        .attr("ry", 5);

    // Add the text element inside the tooltip
    tooltip
        .append("text")
        .text("NA")
        .attr("x", tooltipWidth / 2)
        .attr("y", tooltipHeight / 2 + 2)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "white")
        .style("font-weight", 900);
}


/**
 * Attaches mouse event listeners to the scatterplot circles.
 * It is assumed that this function will be called after the circles are drawn.
 */
const handleMouseEvents = () => {

    // Select all the circles in the scatterplot
    innerChartS.selectAll("circle")
        
        // Mouse Enter Handler
        .on("mouseenter", (e, d) => {
            console.log("Mouse entered circle", d);
            
            // 1. Update the text in the tooltip with the screen size value
            d3.select(".tooltip text")
                .text(d.screenSize + " inches"); 
            
            // 2. Get the screen coordinates of the entered circle
            // Note: e.target is the DOM element (the circle)
            const cx = e.target.getAttribute("cx");
            const cy = e.target.getAttribute("cy");
            
            // 3. Move the tooltip to the circle's position and make it visible
            d3.select(".tooltip")
                .attr("transform", `translate(${cx - 0.5 * tooltipWidth}, ${cy - 1.5 * tooltipHeight})`)
                .transition()
                .duration(200)
                .style("opacity", 1);
        })

        // Mouse Leave Handler
        .on("mouseleave", (e, d) => {
            console.log("Mouse left circle", d);
            
            // 4. Hide the tooltip and move it off-screen (for cleanup, though just hiding is often enough)
            d3.select(".tooltip")
                .style("opacity", 0)
                // .attr("transform", `translate(0, 500)`); // Optional: Move it far away
        });
}
