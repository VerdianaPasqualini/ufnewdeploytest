function h_barchart(
  data,
  {
    x = ([x]) => x,
    y = ([y]) => y,
    filterLabels1 = ([filterLabels1]) => filterLabels1,
    filterLabels2 = ([filterLabels2]) => filterLabels2,
    questionN = ([questionN]) => questionN,
    filters = false,
    yearFilters = false,
    xFilter1_1 = ([xFilter1_1]) => xFilter1_1,
    xFilter1_2 = ([xFilter1_2]) => xFilter1_2,
    xFilter1_3 = ([xFilter1_3]) => xFilter1_3,
    xFilter1_4 = ([xFilter1_4]) => xFilter1_4,
    xFilter2_1 = ([xFilter2_1]) => xFilter2_1,
    xFilter2_2 = ([xFilter2_2]) => xFilter2_2,
    xFilter2_3 = ([xFilter2_3]) => xFilter2_3,
    xFilter2_4 = ([xFilter2_4]) => xFilter2_4,
    max = ([max]) => max,
    nAnswers = nAnswers,
    width = 640,
    barHeight = 35,
    minWidth = 0,
    maxWidth = 1000,
    marginTop = 20,
    marginRight = 65,
    marginBottom = 50,
    marginLeft = 160,
    inset = 0,
    insetTop = inset,
    insetRight = inset,
    insetBottom = 0,
    insetLeft = inset,
    fontSize = 11,
    fontSizeValue = 18,
    barSpacing = 10,
    //labelColor = "#2e4057",
    barColor = "#36006C",
    barColorHighlight = "#ced3dc",
    barColorFilter = "#531c89",
    barColorFilter2 = "#773fad",
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

  const nAnswersNumbers = nAnswers.map((a) => a);

  // filters

  const container = d3.create("div");
  if (filters) {
    const nAnswers = container
      .append("div")
      .append("text")
      .attr("class", "totalAnswers");

    function updateNAnswers(varText) {
      nAnswers.text(`Total answers: ${varText}`);
    }

    updateNAnswers(nAnswersNumbers[0]);

    const filters = container
      .append("div")
      .attr("class", "filters")
      .style("margin-top", `15px`);

    filters
      .append("button")
      .text(filterLabels1[0])
      .attr("class", "mybutton")
      .classed("selectedButton", true)
      .on("click", function (d) {
        removeFocus();
        d3.select(this).classed("selectedButton", true);
        cleanChart();
        update(d3.map(data, x), barColor, d3.max(X));
        updateNAnswers(nAnswersNumbers[0]);
      });

    filters
      .append("button")
      .text(filterLabels1[1])
      .attr("class", "mybutton")
      .on("click", function (d) {
        cleanChart();
        removeFocus();
        d3.select(this).classed("selectedButton1", true);
        const F11 = d3.map(data, xFilter1_1);
        update(F11, barColorFilter, d3.max(F11));
        updateNAnswers(nAnswersNumbers[1]);
      });

    if (!yearFilters) {
      filters
        .append("button")
        .text(filterLabels1[2])
        .attr("class", "mybutton")
        .on("click", function (d) {
          cleanChart();
          removeFocus();
          d3.select(this).classed("selectedButton1", true);
          const F12 = d3.map(data, xFilter1_2);
          update(F12, barColorFilter, d3.max(F12));
          updateNAnswers(nAnswersNumbers[2]);
        });

      filters
        .append("button")
        .text(filterLabels1[3])
        .attr("class", "mybutton")
        .on("click", function (d) {
          cleanChart();
          removeFocus();
          d3.select(this).classed("selectedButton1", true);
          const F13 = d3.map(data, xFilter1_3);
          update(F13, barColorFilter, d3.max(F13));
          updateNAnswers(nAnswersNumbers[3]);
        });

      filters
        .append("button")
        .text(filterLabels1[4])
        .attr("class", "mybutton")
        .on("click", function (d) {
          cleanChart();
          removeFocus();
          d3.select(this).classed("selectedButton1", true);
          const F14 = d3.map(data, xFilter1_4);
          update(F14, barColorFilter, d3.max(F14));
          updateNAnswers(nAnswersNumbers[4]);
        });

      const filters2 = container.append("div").attr("class", "filters");

      filters2
        .append("button")
        .text(filterLabels2[0])
        .attr("class", "mybutton")
        .on("click", function (d) {
          cleanChart();
          removeFocus();
          d3.select(this).classed("selectedButton2", true);
          const F21 = d3.map(data, xFilter2_1);
          update(F21, barColorFilter2, d3.max(F21));
          updateNAnswers(nAnswersNumbers[5]);
        });

      filters2
        .append("button")
        .text(filterLabels2[1])
        .attr("class", "mybutton")
        .on("click", function (d) {
          cleanChart();
          removeFocus();
          d3.select(this).classed("selectedButton2", true);
          const F22 = d3.map(data, xFilter2_2);
          update(F22, barColorFilter2, d3.max(F22));
          updateNAnswers(nAnswersNumbers[6]);
        });

      filters2
        .append("button")
        .text(filterLabels2[2])
        .attr("class", "mybutton")
        .on("click", function (d) {
          cleanChart();
          removeFocus();
          d3.select(this).classed("selectedButton2", true);
          const F23 = d3.map(data, xFilter2_3);
          update(F23, barColorFilter2, d3.max(F23));
          updateNAnswers(nAnswersNumbers[7]);
        });

      filters2
        .append("button")
        .text(filterLabels2[3])
        .attr("class", "mybutton")
        .on("click", function (d) {
          cleanChart();
          removeFocus();
          d3.select(this).classed("selectedButton2", true);
          const F24 = d3.map(data, xFilter2_4);
          update(F24, barColorFilter2, d3.max(F24));
          updateNAnswers(nAnswersNumbers[8]);
        });
    }
  }

  function cleanChart() {
    d3.select(`#dataBars-${questionN}`).remove();
    d3.select(`#dataLabels-${questionN}`).remove();
  }

  function removeFocus() {
    container.selectAll(".mybutton").each(function (d, i) {
      d3.select(this).classed("selectedButton", false);
      d3.select(this).classed("selectedButton1", false);
      d3.select(this).classed("selectedButton2", false);
    });
  }

  // Define scales parameters and build data variables

  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const I = d3.range(data.length);

  const yDomain = Y;
  const height =
    (barHeight + barSpacing) * Y.length +
    marginBottom +
    insetBottom +
    marginTop +
    insetTop;
  const xRange = [0, width - marginRight - insetRight - insetLeft - marginLeft]; // [left, right]
  const yRange = [height - marginBottom - insetBottom, marginTop + insetTop]; // [bottom, top]

  // scales

  const yScale = d3.scaleBand(yDomain, yRange);

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
    .attr("transform", `translate(${marginLeft},0)`)
    .selectAll("rect")
    .data(I)
    .join("rect")
    .attr("x", 0)
    .attr("y", (i) => yScale(Y[i]) + barSpacing)
    .attr("rx", 13)
    .attr("height", barHeight - barSpacing)
    .attr("width", width - marginLeft)
    .attr("opacity", 0.05)
    .attr("fill", "grey");

  function update(selectedX, barColor, computedMax) {
    var xDomain = [0, computedMax];
    if (yearFilters) {
      xDomain = [0, max];
    }
    const xScale = d3.scaleLinear(xDomain, xRange);

    // bars
    svg
      .append("g")
      .attr("id", `dataBars-${questionN}`)
      .attr("transform", `translate(${marginLeft},0)`)
      .selectAll("rect")
      .data(I)
      .join(function (enter) {
        if (yearFilters) {
          return enter
            .append("rect")
            .attr("opacity", "1")
            .attr("width", (i) => xScale(selectedX[i]));
        } else {
          return enter
            .append("rect")
            .attr("width", (i) => 0)
            .attr("opacity", "0")
            .transition()
            .duration(1000)
            .attr("opacity", "1")
            .attr("width", (i) => xScale(selectedX[i]));
        }
      })
      .attr("x", (i) => xScale(0))
      .attr("y", (i) => yScale(Y[i]) + barSpacing)
      .attr("rx", 13)
      .attr("height", barHeight - barSpacing)
      .attr("fill", barColor)
      .attr("stroke-width", 0.2)
      .attr("stroke", "lightgrey")
      .on("mouseover", function (d) {
        d3.select(this).attr("fill", barColorHighlight);
      })
      .on("mouseout", function (d) {
        d3.select(this).attr("fill", barColor);
      });

    // data label
    svg
      .append("g")
      .attr("id", `dataLabels-${questionN}`)
      .attr("transform", `translate(${marginLeft},0)`)
      .selectAll("text")
      .call(wrap)
      .data(I)
      .join(function (enter) {
        if (yearFilters) {
          return enter
            .append("text")
            .attr("opacity", "1")
            .attr("x", (i) => xScale(selectedX[i]) + 6);
        } else {
          return enter
            .append("text")
            .attr("opacity", "0")
            .attr("x", (i) => xScale(0) + 6)
            .transition()
            .duration(1000)
            .attr("opacity", "1")
            .attr("x", (i) => xScale(selectedX[i]) + 6);
        }
      })
      .attr("y", (i) => yScale(Y[i]) + barSpacing / 2 + barHeight / 2 + 2)
      .attr("font-size", fontSizeValue)
      .attr("fill", "currentColor")
      .attr("font-family", "Manrope")
      .attr("font-weight", 700)
      .attr("color", barColor)
      .attr("dominant-baseline", "middle")
      .text((i) => selectedX[i] + "%");
  }

  update(X, barColor, d3.max(X));

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
