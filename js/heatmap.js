function heatmap(
  data,
  {
    xName,
    yName,
    fillName,
    xType = d3.scaleBand,
    yType = d3.scaleBand,
    fillType = d3.scaleLinear,
    tileWidth = 40,
    rectPadding = tileWidth / 5,
    width,
    flipWidth = 650,
    shrinkWidth = 480,
    cornerRadius = tileWidth / 2,
    marginRight = 65,
    marginBottom = 50,
    marginLeft = 100,
    marginTop = 200, //100
    inset = 0,
    insetTop = inset,
    insetRight = inset,
    insetBottom = 0,
    insetLeft = inset,
    fontSize = 11,
    fillRange = [0, 1],
    colorHighlight = "#ced3dc",
    colors = [
      "#FFFFFF", // white (background)
      "#773fad",
      "#36006C", // dark
    ],
    doubleTranslate = -13,
    singleTranslate = -7,
  }
) {
  // check cell width
  // console.log({
  //   width: width,
  // });
  
  // invert x and y if page is wide
  if (width > flipWidth) {
    const xNameOld = xName;
    xName = yName;
    yName = xNameOld;
  } else if (width > shrinkWidth) {
    marginTop += 20
  }

  // extract variables from data
  const x = (d) => d[xName];
  const y = (d) => d[yName];
  const fill = (d) => d[fillName];

  // values
  const X = d3.map(data, x).reverse();
  const Y = d3.map(data, y);
  const FILL = d3.map(data, fill);
  const I = d3.range(data.length);

  // domains
  xDomain = new d3.InternSet(X);
  yDomain = new d3.InternSet(Y);
  fillDomain = [0, d3.max(FILL)];
// 
  // console.log({
  //   X: X, 
  //   xDomain: xDomain,
  //   yDomain: yDomain
  // })

  // font size and margin on desktop
  if (width > shrinkWidth) {
    fontSize = 14;
    marginLeft = 195;
    doubleTranslate = -15;
    singleTranslate = -9;
  }

  const panelWidth = (tileWidth + rectPadding) * xDomain.size;
  plotWidth = panelWidth + marginLeft + insetLeft + marginRight + insetRight;

  const panelHeight = (tileWidth + rectPadding) * yDomain.size;
  const height =
    panelHeight + marginBottom + insetBottom + marginTop + insetTop;

  // ranges within svg
  const xRange = [marginLeft + insetLeft, plotWidth - marginRight - insetRight]; // [left, right]
  const yRange = [height - marginBottom - insetBottom, marginTop + insetTop]; // [bottom, top]

  // const tileWidth = (xRange[1] - xRange[0]) / xDomain.size

  // scales
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const fillBase = fillType().domain(fillDomain).range(fillRange);
  const interpolatePalette = d3.piecewise(d3.interpolateHsl, colors);
  function fillScale(n) {
    return interpolatePalette(fillBase(n));
  }

  // axes
  const xAxis = d3.axisTop(xScale);
  const yAxis = d3.axisLeft(yScale);

  // define SVG
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr(
      "style",
      `max-width: 100%;
            height: auto;
            height: intrinsic;`
    )
    .attr("style", "cursor: crosshair")
    .attr("id", "svgheatmap");

  // axis x
  svg
    .append("g")
    .attr("transform", `translate(0,${marginTop})`)
    .attr("class", "xaxis")
    .call(xAxis)
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick text")
        .attr("class", "xaxistext")
        .attr("font-size", fontSize)
        .style("text-anchor", "end")
        .attr("y", 0)
        .attr("dx", -10)
        .attr("font-family", "Manrope")
        .attr("opacity", 0)
    )
    .call((g) => g.selectAll(".tick line").remove());

  // axis y
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .attr("class", "yaxis")
    .call(yAxis)
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick text")
        .attr("class", "yaxistext")
        .attr("font-size", fontSize)
        .attr("font-family", "Manrope")
    )
    .call((g) => g.selectAll(".tick line").remove());

  // wrap y labels
  setTimeout(() => {
    svg.selectAll(".yaxistext").each(function (d, i) {
      d3.select(this).call(wrap, marginLeft - 20); // 20 = space between labels and axis;
      const textHeight = d3.select(this).node().getBBox().height;
      if (textHeight > 20) {
        d3.select(this).attr("transform", `translate(-10,${doubleTranslate})`);
      } else {
        d3.select(this).attr("transform", `translate(-10,${singleTranslate})`);
      }
    });
  }, 0);

  // wrap x labels
  setTimeout(() => {
    svg.selectAll(".xaxistext").each(function (d, i) {
      d3.select(this).call(wrap, marginTop - 20); // 20 = space between labels and axis;
      d3.select(this)
        .attr("opacity", 0)
        .style("text-anchor", "start")
        .attr(
          "transform",
          width > 480
            ? "translate(-10,-20)rotate(270)"
            : "translate(-7,-20)rotate(270)"
        )
        .attr("opacity", 1);
      const nLines = d3.select(this).node().children.length;
      if (nLines == 2) {
        d3.select(d3.select(this).node().children[0]).attr(
          "dy",
          width > 480
            ? (tileWidth - rectPadding) / 2 - 7
            : (tileWidth - rectPadding) / 2 - 10
        );

        d3.select(d3.select(this).node().children[1]).attr(
          "dy",
          width > 480
            ? (tileWidth - rectPadding) / 2 + 7
            : (tileWidth - rectPadding) / 2 + 2
        );
        d3.select(d3.select(this).node().children[1]).attr("dx", "-10");
      }
    });
  }, 0);

  // axis titles
  svg
    .append("g")
    .attr("class", "axisTitle")
    .append("text")
    .attr("x", 0)
    .attr("y", fontSize)
    .attr("fill", "black")
    .attr("text-anchor", "start")
    .attr("font-family", "Manrope")
    .attr("font-size", fontSize)
    .style("text-transform", "capitalize")
    .style("white-space", "pre")
    .text("↓ " + xName + "   /   " + yName + " →" + "   /   (Number of respondents)");

  // rectangles
  svg
    .append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d) => xScale(d[xName]) + rectPadding / 2)
    .attr("y", (d) => yScale(d[yName]) + rectPadding / 2)
    .attr("fill", (d) => fillScale(d[fillName]))
    .attr("stroke", (d) => fillScale(d[fillName]))
    .attr("rx", cornerRadius)
    .attr("width", tileWidth)
    .attr("height", yScale.step() - rectPadding);
  // .on("mouseover", function (d) {
  //     d3.select(this).attr("fill", colorHighlight);
  //   })
  //   .on("mouseout", function (d) {
  //     d3.select(this) .attr("fill", d => fillScale(d[fillName]))
  //   })

  // text over rectangles
  svg
    .append("g")
    .selectAll("text")
    .data(data)
    .join("text")
    .attr("x", (d) => xScale(d[xName]) + tileWidth * 0.6)
    .attr("y", (d) => yScale(d[yName]) + tileWidth * 0.72)
    .attr("font-size", fontSize)
    .attr("text-anchor", "middle")
    .attr("fill", (d) => colorText(d))
    .text((d) => d["n"]);
  // .on("mouseover", function (d) {
  //     d3.select(this).attr("fill", colorHighlight);
  //   })
  //   .on("mouseout", function (d) {
  //     d3.select(this).attr("fill", d => colorText(d))
  //   })

  // return SVG
  return svg.node();
}

function colorText(d) {
  if (d["n"] > 100) {
    return "white";
  } else {
    return "black";
  }
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
