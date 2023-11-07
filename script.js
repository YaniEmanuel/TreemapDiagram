document.addEventListener("DOMContentLoaded", () => {
    const width = 960;
    const height = 600;
  
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json").then(data => {
      const treemap = d3.treemap()
        .size([width, height]);
  
      const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
  
      treemap(root);
  
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
      const tiles = svg.selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);
  
      tiles.append("rect")
        .attr("class", "tile")
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => colorScale(d.data.category))
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);
  
      tiles.append("text")
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter()
        .append("tspan")
        .attr("x", 4)
        .attr("y", (d, i) => 13 + i * 14) // Ajusta el valor 14 para el espaciado deseado
        .text(d => d);
  
      const legendData = root.leaves().map(d => d.data.category).filter((value, index, self) => self.indexOf(value) === index);
  
      const legend = d3.select("#legend");
  
      legend.selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("div")
        .attr("class", "legend-item")
        .html(d => `<div class="legend-color" style="background-color: ${colorScale(d)}"></div>${d}`);
  
      function showTooltip(event, d) {
        const tooltip = document.getElementById("tooltip");
        tooltip.style.display = "block";
        tooltip.style.left = event.pageX + 10 + "px";
        tooltip.style.top = event.pageY - 60 + "px";
        tooltip.setAttribute("data-value", d.data.value);
        tooltip.innerHTML = `Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`;
      }
  
      function hideTooltip() {
        const tooltip = document.getElementById("tooltip");
        tooltip.style.display = "none";
      }
    });
  });  