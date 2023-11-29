function v_barchart(
  data,
  {
    x = ([x]) => x,
    y = ([y]) => y,
    width = 640,
    height = 400,
    barWidth = 30,
    minWidth = 0,
    maxWidth = 1000,
    marginTop = 40, // top margin, in pixels
    marginRight = 40, // right margin, in pixels
    marginBottom = 50, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    inset = 0, // inset the default range, in pixels
    insetTop = inset, // inset the default y-range
    insetRight = inset, // inset the default x-range
    insetBottom = 0, // inset the default y-range
    insetLeft = inset, // inset the default x-range
    xLabel = "[n]",
    strokeWidth = 1,
    fillOpacity = 1,
    fontSize = 10,
    fontSizeValue = 15,
    halfBarSpacing = 4,
  }
) {
  // Compute page layout values
  if (width < minWidth) {
    width = minWidth;
  }
  var xoffset = 0;
  if (width > maxWidth) {
    width = maxWidth;
  }

  // Define scales parameters and build data variables

  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const I = d3.range(data.length);
  const xDomain = X;
  const yDomain = [0, d3.max(Y)];
  const xRange = [0, width - marginRight - insetRight - insetLeft - marginLeft]; // [left, right]
  const yRange = [height - marginBottom - insetBottom, marginTop + insetTop]; // [bottom, top]

  // scales
  const xScale = d3.scaleBand(xDomain, xRange);
  const yScale = d3.scaleLinear(yDomain, yRange);

  // axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // generate SVG
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("class", "barchart")
    .attr("style", `max-width: 100%`)
    .attr("style", "cursor: crosshair; margin: auto; display: block;");

  // X axis
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},${height - marginBottom})`)
    .attr("class", "xaxis")
    .call(xAxis)
    .call((g) =>
      g
        .selectAll(".tick text")
        .attr("font-size", fontSize)
        .attr("font-family", "Manrope")
    );

  // bars
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .attr("stroke-width", strokeWidth)
    .attr("stroke", "black")
    .selectAll("rect")
    .data(I)
    .join((enter) =>
      enter
        .append("rect")
        .attr("opacity", "0")
        .attr("height", (i) => yScale(0) - yScale(Y[i]))
        .transition()
        .delay(500)
        .duration(1000)
        .attr("opacity", "1")
        .attr("height", (i) => yScale(0) - yScale(Y[i]))
    )
    .attr("x", (i) => xScale(X[i]))
    .attr("y", (i) => yScale(Y[i]))
    .attr("width", barWidth)
    .attr("fill", "yellow");

  // data label
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .selectAll("text")
    .data(I)
    .join((enter) =>
      enter
        .append("text")
        .attr("opacity", "0")
        .attr("y", (i) => yScale(0) + 10)
        .transition()
        .delay(500)
        .duration(1000)
        .attr("opacity", "1")
        .attr("y", (i) => yScale(Y[i]) - 10)
    )
    .attr("x", (i) => xScale(X[i]) + barWidth / 4)
    .attr("font-size", fontSizeValue)
    .attr("fill", "currentColor")
    .attr("font-family", "Manrope")
    .text((i) => Y[i]);

  console.log({
    data: data,
    X: X,
    Y: Y,
    I: I,
    xDomain: xDomain,
    xScale: xScale,
    yScale: yScale,
  });

  return svg.node();
}
