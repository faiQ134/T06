/**************************************/
/* Make the filter options accessible globally */
/**************************************/


// Create a bin generator using d3.bin (This constant needs to be available to both functions)

const populateFilters = (data) => {
    // 1. Draw the filter buttons
    d3.select("#filters_screen")
        .selectAll(".filter")
        .data(filters_screen)
        .join("button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        // 2. Set up the click handler
        .on("click", (e, d) => {

            console.log("Clicked filter:", e);
            console.log("Clicked filter data:", d);

            if (!d.isActive) {
                // // make sure button clicked is not already active
                // 3. Update the global state array
                filters_screen.forEach(filter => {
                    filter.isActive = d.id === filter.id ? true : false;
                });

                // 4. Visually update the filter buttons
                d3.selectAll("#filters_screen .filter")
                    .classed("active", filter => filter.id === d.id ? true : false);

                // 5. Update the chart
                updateHistogram(d.id, data);
            }
        });
}

// Function to handle filtering the data and redrawing the histogram
const updateHistogram = (filterId, data) => {
    // 1. Filter the data based on the selected screen technology
    const updatedData = filterId === "all"
        ? data
        : data.filter(tv => tv.screenTech === filterId);

    // 2. Generate new bins from the filtered data
    const updatedBins = binGenerator(updatedData);

    // 3. Update the histogram bars with a transition
    d3.selectAll("#histogram rect")
        .data(updatedBins)
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length));
}

tooltip
.append("rect")
    .attr("width", tooltipWidth)
    .attr("height", tooltipHeight)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("fill", barColor)
    .attr("fill-opacity", 0.75)
