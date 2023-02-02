//-----------------Data request----------------

const req = new XMLHttpRequest();
req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", true);
req.send();
req.onload = () => {
  const dataset = JSON.parse(req.responseText);

  //-----------------Creating main svg element ------------------

  width = 800;
  height = 600;
  padding = 60;
  let dopingColor = "#EF2303";
  let noDopingColor = "#2D9516";
  console.log("dataset", dataset);

  const svg = d3.select("body").append("div").attr("id", "svg-container").append("svg").attr("width", width).attr("height", height);

  //---------------Data scaling---------------------

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(dataset, (d) => parseInt(d.Year)) - 1, d3.max(dataset, (d) => parseInt(d.Year))])
    .range([padding, width - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([d3.min(dataset, (d) => createDate(d.Time)), d3.max(dataset, (d) => createDate(d.Time))])
    .range([padding * 2, height - padding]);

  //----------------Header-----------------
  svg
    .append("text")
    .attr("id", "title")
    .attr("x", width / 2)
    .attr("y", padding - 10)
    .text("Doping in Professional Bicycle Racing")
    .style("text-anchor", "middle");
  svg
    .append("text")
    .attr("id", "secondTitle")
    .attr("x", width / 2)
    .attr("y", padding + 20)
    .text("35 Fastest times up Alpe d'Huez")
    .style("text-anchor", "middle");

  //-------------Graph----------------

  let tooltip = d3.select("body").append("foreignObject").attr("id", "tooltip");

  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .on("mouseover", (e, d) => {
      const tooltipHTML = `${d.Name} : ${d.Nationality}<br>Year: ${parseInt(d.Year)}, Time: ${d.Time}<br><br>${d.Doping === "" ? "No doping allegations" : d.Doping}`;
      tooltip
        .html(`<div>${tooltipHTML}</div>`)
        .style("opacity", "100%")
        .style("left", e.clientX + 10 + "px")
        .style("top", e.clientY - 20 + "px")
        .attr("data-year", parseInt(d.Year));
    })
    .on("mouseout", (event, d) => {
      tooltip
        .style("opacity", "0%")
        .style("left", -2000 + "px")
        .style("top", -2000 + "px");
    })
    .attr("data-xvalue", (d) => parseInt(d.Year))
    .attr("data-yvalue", (d) => createDate(d.Time))
    .attr("cx", (d) => xScale(parseInt(d.Year)))
    .attr("cy", (d) => yScale(createDate(d.Time)))
    .attr("r", 5)
    .style("fill", (d) => (d.Doping === "" ? noDopingColor : dopingColor));

  //------------Axis----------------

  const xAxis = d3.axisBottom(xScale).tickFormat((d) => {
    return parseInt(d);
  });

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

  svg
    .append("text")
    .text("Time in Minutes")
    .attr("y", padding / 3)
    .attr("x", 0 - padding * 2)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "end");

  //-----------Legend--------------

  const legend = svg.append("g").attr("id", "legend");

  const legendOne = legend.append("g");

  legendOne
    .append("text")
    .text("No doping allegations")
    .attr("x", width - padding - 10 + "px")
    .attr("y", height / 2 - 20)
    .style("text-anchor", "end");

  legendOne
    .append("circle")
    .style("fill", noDopingColor)
    .attr("cx", width - padding)
    .attr("cy", height / 2 - 24)
    .attr("r", 5);

  const legendTwo = legend.append("g");

  legendTwo
    .append("text")
    .text("Riders with doping allegations")
    .attr("x", width - padding - 10 + "px")
    .attr("y", height / 2)
    .style("text-anchor", "end");

  legendTwo
    .append("circle")
    .style("fill", dopingColor)
    .attr("cx", width - padding)
    .attr("cy", height / 2 - 4)
    .attr("r", 5);

  // -----Func: string "MM:SS" into date object -----------

  function createDate(string) {
    let time = string.split(":");
    let minutes = parseInt(time[0]);
    let seconds = parseInt(time[1]);
    let date = new Date();
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date;
  }

  //------------Footer--------------

  d3.select("body").append("footer").text("This Scatterplot Graph was created using: HTML, CSS, JavaScript and D3 svg-based visualization library");
};
