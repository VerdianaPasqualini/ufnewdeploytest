function years_chart(
  data,
  {
    x = ([x]) => x,
    y = ([y]) => y,
    questionN = ([questionN]) => questionN,
    x2 = ([x2]) => x2,
    max = ([max]) => max,
    nAnswers = nAnswers,
    width = 640,
    widthSwitch1 = 700,
    widthSwitch2 = 480,
    barHeight = 35,
    minWidth = 0,
    maxWidth = 1000,
    marginTop = 40,
    marginRight = 40,
    marginBottom = 50,
    marginLeft = 110,
    marginExtraLeft = 15,
    inset = 0,
    insetTop = inset,
    insetRight = inset,
    insetBottom = 0,
    insetLeft = inset,
    fontSize = 11,
    fontSizeValue = 12,
    barSpacing = 10,
    barColor = "#36006C",
    barColorHighlight = "#ced3dc",
    barColorFilter2 = "#9c53e0",
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

  const nAnswersNumbers = nAnswers.map((a) => a);

  const container = d3.create("div");

  const nAnswersElem = container
    .append("div")
    .append("text")
    .attr("class", "totalAnswers")
    .text(
      `Total answers: ${nAnswersNumbers[0]} (2023) - ${nAnswersNumbers[1]} (2022)`
    );

  // font size and margin on desktop


  if (width > widthSwitch2) {
    fontSizeValue = 14;
    marginRight = 65;
    marginExtraLeft = 0;
  }

  if (width > widthSwitch1) {
    fontSizeValue = 18;
    fontSize = 14;
    marginLeft = 200;
    doubleTranslate = -15;
    singleTranslate = -9;
  }

  // Define scales parameters and build data variables

  const X = d3.map(data, x);
  const X2 = d3.map(data, x2);
  const Y = d3.map(data, y);
  const I = d3.range(data.length);

  const yDomain = Y;
  const height =
    (barHeight + barSpacing) * Y.length +
    marginBottom +
    insetBottom +
    marginTop +
    insetTop;
  const xRange = [0, width - marginRight - insetRight - insetLeft - marginLeft - marginExtraLeft]; // [left, right]
  const yRange = [height - marginBottom - insetBottom, marginTop + insetTop]; // [bottom, top]

  // scales

  const yScale = d3.scaleBand(yDomain, yRange);
  var xScale = d3.scaleLinear([-8, max + 2], xRange);

  if (width < widthSwitch2) {
    xScale = d3.scaleLinear([-8, max + 15], xRange);
  }

  // axes

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

  // background bars
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft + marginExtraLeft + 30},0)`)
    .selectAll("rect")
    .data(I)
    .join("rect")
    .attr("x", 0)
    .attr("y", (i) => yScale(Y[i]) + barSpacing + 12)
    .attr("rx", 13)
    .attr("height", 1)
    .attr("width", width - marginLeft - marginExtraLeft)
    .attr("opacity", 0.1)
    .attr("fill", "grey");

  var gradient = svg
    .append("defs")
    .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%")
    .attr("spreadMethod", "pad");

  gradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", barColor)
    .attr("stop-opacity", 0.8);

  gradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", barColorFilter2)
    .attr("stop-opacity", 0.7);

  var gradient2 = svg
    .append("defs")
    .append("linearGradient")
    .attr("id", "gradient2")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%")
    .attr("spreadMethod", "pad");

  gradient2
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", barColorFilter2)
    .attr("stop-opacity", 0.7);

  gradient2
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", barColor)
    .attr("stop-opacity", 0.8);

  // connecting bars
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft + marginExtraLeft},0)`)
    .selectAll("rect")
    .data(I)
    .join("rect")
    .attr("x", function (i) {
      if (X[i] < X2[i]) return xScale(X[i]) + 13.5;
      else return xScale(X2[i]) + 13.5;
    })
    .attr("y", (i) => yScale(Y[i]) + barSpacing)
    .attr("height", barHeight - barSpacing)
    .attr("width", function (i) {
      if (X[i] > X2[i]) return xScale(X[i]) - xScale(X2[i]);
      else return xScale(X2[i]) - xScale(X[i]);
    })
    .attr("opacity", 1)
    .attr("fill", function (i) {
      if (X[i] < X2[i]) return "url(#gradient)";
      else return "url(#gradient2)";
    });

  // year bars
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft + marginExtraLeft},0)`)
    .selectAll("rect")
    .data(I)
    .join("rect")
    .attr("x", xScale(X[Y.length - 1]) + 11)
    .attr("y", yScale(Y[Y.length - 1]) - 24)
    .attr("height", 50)
    .attr("width", 1)
    .attr("opacity", 0.02)
    .attr("fill", "grey");
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft + marginExtraLeft},0)`)
    .selectAll("rect")
    .data(I)
    .join("rect")
    .attr("x", xScale(X2[Y.length - 1]) + 11)
    .attr("y", yScale(Y[Y.length - 1]) - 24)
    .attr("height", 50)
    .attr("width", 1)
    .attr("opacity", 0.02)
    .attr("fill", "grey");

  // bars x2
  svg
    .append("g")
    .attr("id", `dataBars-${questionN}`)
    .attr("transform", `translate(${marginLeft + marginExtraLeft},0)`)
    .selectAll("rect")
    .data(I)
    .join(function (enter) {
      return enter.append("rect").attr("opacity", "1").attr("width", 24);
    })
    .attr("x", (i) => xScale(X2[i]))
    .attr("y", (i) => yScale(Y[i]) + barSpacing)
    .attr("rx", 12)
    .attr("height", barHeight - barSpacing)
    .attr("fill", barColorFilter2)
    .attr("stroke-width", 0.2);

  // bars
  svg
    .append("g")
    .attr("id", `dataBars-${questionN}`)
    .attr("transform", `translate(${marginLeft + marginExtraLeft},0)`)
    .selectAll("rect")
    .data(I)
    .join(function (enter) {
      return enter.append("rect").attr("opacity", "1").attr("width", 24);
    })
    .attr("x", (i) => xScale(X[i]))
    .attr("y", (i) => yScale(Y[i]) + barSpacing)
    .attr("rx", 12)
    .attr("height", barHeight - barSpacing)
    .attr("fill", barColor)
    .attr("stroke-width", 0.2);

  // data label
  svg
    .append("g")
    .attr("id", `dataLabels-${questionN}`)
    .attr("transform", `translate(${marginLeft + marginExtraLeft},0)`)
    .selectAll("text")
    .call(wrap)
    .data(I)
    .join(function (enter) {
      return enter
        .append("text")
        .attr("opacity", "1")
        .attr("x", function (i) {
          if (X[i] >= X2[i]) return xScale(X[i]) + 27;
          else return xScale(X[i]) - 5;
        });
    })
    .attr("text-anchor", function (i) {
      if (X[i] < X2[i]) return "end";
    })
    // .attr("display", function (i) {
    //   if (X[i] < X2[i] && width < widthSwitch) return "none";
    // })
    .attr("y", (i) => yScale(Y[i]) + barSpacing / 2 + barHeight / 2 + 2)
    .attr("font-size", fontSizeValue)
    .attr("fill", "currentColor")
    .attr("font-family", "Manrope")
    .attr("font-weight", 700)
    .attr("color", barColor)
    .attr("dominant-baseline", "middle")
    .text((i) => X[i] + "%");

  // data label 2
  svg
    .append("g")
    .attr("id", `dataLabels-${questionN}`)
    .attr("transform", `translate(${marginLeft + marginExtraLeft},0)`)
    .selectAll("text")
    .call(wrap)
    .data(I)
    .join(function (enter) {
      return enter
        .append("text")
        .attr("opacity", "1")
        .attr("x", function (i) {
          if (X[i] < X2[i]) return xScale(X2[i]) + 27;
          else return xScale(X2[i]) - 5;
        });
    })
    .attr("text-anchor", function (i) {
      if (X[i] >= X2[i]) return "end";
    })
    // .attr("display", function (i) {
    //   if (X[i] >= X2[i] && width < widthSwitch) return "none";
    // })
    .attr("y", (i) => yScale(Y[i]) + barSpacing / 2 + barHeight / 2 + 2)
    .attr("font-size", fontSizeValue)
    .attr("fill", "currentColor")
    .attr("font-family", "Manrope")
    .attr("font-weight", 700)
    .attr("color", barColorFilter2)
    .attr("dominant-baseline", "middle")
    .text((i) => X2[i] + "%");

  // year 2023
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft + marginExtraLeft},0)`)
    .attr("id", `legendLabels-${questionN}`)
    .append("text")
    .attr("text-anchor", function (i) {
      if (X[Y.length - 1] < X2[Y.length - 1]) return "end";
      else return "start";
    })
    .attr("x", function (i) {
      if (X[Y.length - 1] < X2[Y.length - 1])
        return xScale(X[Y.length - 1]) + 6;
      else return xScale(X[Y.length - 1]) + 17;
    })
    .attr("y", yScale(Y[Y.length - 1]) - 15)
    .attr("font-size", fontSizeValue)
    .attr("fill", "currentColor")
    .attr("font-family", "Manrope")
    .attr("font-weight", 700)
    .attr("color", barColor)
    .attr("dominant-baseline", "middle")
    .text("2023");

  // year 2022
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft + marginExtraLeft},0)`)
    .attr("id", `legendLabels-${questionN}`)
    .append("text")
    .attr("text-anchor", function (i) {
      if (X[Y.length - 1] < X2[Y.length - 1]) return "start";
      else return "end";
    })
    .attr("x", function (i) {
      if (X[Y.length - 1] < X2[Y.length - 1])
        return xScale(X2[Y.length - 1]) + 17;
      else return xScale(X2[Y.length - 1]) + 6;
    })
    .attr("y", yScale(Y[Y.length - 1]) - 15)
    .attr("font-size", fontSizeValue)
    .attr("fill", "currentColor")
    .attr("font-family", "Manrope")
    .attr("font-weight", 700)
    .attr("color", barColorFilter2)
    .attr("dominant-baseline", "middle")
    .text("2022");

  container.append("div").append(() => svg.node());

  return container.node();
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
