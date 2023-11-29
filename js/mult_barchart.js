function mult_barchart(
  data,
  {
    x = ([x]) => x,
    y = ([y]) => y,
    z = ([z]) => z,
    max = ([max]) => max,
    width = 640,
    barHeight = 30,
    minWidth = 0,
    maxWidth = 1000,
    marginTop = 40,
    marginRight = 60,
    marginBottom = 10,
    marginLeft = 160,
    inset = 0,
    insetTop = inset,
    insetRight = inset,
    insetBottom = 0,
    insetLeft = inset,
    fontSize = 11,
    fontSizeValue = 18,
    barSpacing = 5,
    labelColor = "#2e4057",
    barColors = ["#773fad", "#531c89", "#36006C"], // purple
    barColorHighlight = "#ced3dc",
    doubleTranslate = -13,
    singleTranslate = -7,
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

  // font size and margin on desktop

  if (width > 480) {
    fontSize = 14;
    marginLeft = 200;
    doubleTranslate = -15;
    singleTranslate = -9;
  }

  // Define scales parameters and build data variables

  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const I = d3.range(data.length);
  const xDomain = [0, max];
  const yDomain = Y;
  const height =
    (barHeight + barSpacing) * Y.length +
    marginBottom +
    insetBottom +
    marginTop +
    insetTop;
  const xRange = [0, width - marginRight - insetRight - insetLeft - marginLeft]; // [left, right]
  const yRange = [height - marginBottom - insetBottom, marginTop + insetTop]; // [bottom, top]

  if (Y.length > 3) {
    barColors = [
      "#748FB3",
      "#5e7a9f",
      "#456084",
      "#30496a",
      "#2e4057",
      "#1b2b41",
      "#0e1c2e", // dark
    ];
  }

  // scales
  const xScale = d3.scaleLinear(xDomain, xRange);
  const yScale = d3.scaleBand(yDomain, yRange);

  // axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).tickSize(0);

  // generate SVG
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("class", "barchart")
    .attr("style", `max-width: 100%`)
    .attr("style", "cursor: crosshair; margin: auto; display: block;");

  // Y axis
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .attr("class", "yaxis")
    .call(yAxis)
    .call((g) =>
      g
        .selectAll(".tick text")
        .attr("font-size", fontSize)
        .attr("font-family", "Manrope")
    )
    .call((g) => g.select(".domain").remove());

  setTimeout(() => {
    svg
      .selectAll(".tick text") //
      .each(function (d, i) {
        d3.select(this).call(wrap, marginLeft - 20); // 20 = space between labels and axis;
        const textHeight = d3.select(this).node().getBBox().height;
        if (textHeight > 20) {
          d3.select(this).attr(
            "transform",
            `translate(-10,${doubleTranslate})`
          );
        } else {
          d3.select(this).attr(
            "transform",
            `translate(-10,${singleTranslate})`
          );
        }
      });
  }, 0);

  svg
    .append("text")
    .attr("font-size", 15)
    .attr("font-family", "Manrope")
    .attr("x", marginLeft)
    .attr("y", marginTop - 15)
    .text(z);

  // background bars
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .selectAll("rect")
    .data(I)
    .join("rect")
    .attr("x", (i) => xScale(0))
    .attr("y", (i) => yScale(Y[i]) + barSpacing)
    .attr("rx", 13)
    .attr("height", barHeight - barSpacing)
    .attr("width", width - marginLeft)
    .attr("opacity", 0.05)
    .attr("fill", "grey");

  // bars
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .selectAll("rect")
    .data(I)
    .join((enter) =>
      enter
        .append("rect")
        .attr("width", (i) => 0)
        .attr("opacity", "0")
        .transition()
        .delay(500)
        .duration(1000)
        .attr("opacity", "1")
        .attr("width", (i) => xScale(X[i]))
    )
    .attr("x", (i) => xScale(0))
    .attr("y", (i) => yScale(Y[i]) + barSpacing)
    .attr("rx", 13)
    .attr("height", barHeight - barSpacing)
    .attr("fill", (i) => barColors[i])
    .attr("stroke-width", 0.2)
    .attr("stroke", "lightgrey")
    .on("mouseover", function (d) {
      d3.select(this).attr("fill", barColorHighlight);
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("fill", (i) => barColors[i]);
    });

  // data label
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .selectAll("text")
    .call(wrap)
    .data(I)
    .join((enter) =>
      enter
        .append("text")
        .attr("opacity", "0")
        .attr("x", (i) => xScale(0) + 6)
        .transition()
        .delay(500)
        .duration(1000)
        .attr("opacity", "1")
        .attr("x", (i) => xScale(X[i]) + 6)
    )
    .attr("y", (i) => yScale(Y[i]) + barSpacing / 2 + barHeight / 2 + 2)
    .attr("font-size", fontSizeValue)
    .attr("fill", "currentColor")
    .attr("font-family", "Manrope")
    .attr("font-weight", 700)
    .attr("color", (i) => barColors[i])
    .attr("dominant-baseline", "middle")
    .text((i) => X[i] + "%");

  return svg.node();
}

function wrap(text, wrapWidth) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      y = text.attr("y"),
      dy = 1,
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", `${dy}em`);
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > wrapWidth) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", dy + "em")
          .text(word);
      }
    }
  });
  return 0;
}
