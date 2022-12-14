function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
//   // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray =data.samples;
    // console.log(samplesArray);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray =samplesArray.filter(sampleObj=>sampleObj.id==sample);
  
    //  5. Create a variable that holds the first sample in the array.
    var result=resultArray[0];
    // console.log(result);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDS=result.otu_ids
    // .sort((a,b)=>b-a);
    // otuIDS=otuIDS.slice(0,10).reverse();
    var otuLabels=result.otu_labels;
    var sampleValues=result.sample_values;
    console.log(otuIDS);


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIDS.slice(0,10).map(x=>"OTU "+x).reverse();
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x:sampleValues.slice(0,10).reverse(),
      y:yticks,
      text: otuLabels.slice(0,10).reverse(),
      type:"bar",
      orientation: 'h'
    }
    ];
    Plotly.newPlot("bar",barData)
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      width: 460, 
      height: 350, 
         };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar',barData, barLayout);


    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIDS,
      y: sampleValues,
      mode: 'markers',
      hovertext:otuLabels,
      marker: {
        color: otuIDS,
        size: sampleValues,
        colorscale: "Jet"
  
    }
   
  }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis:{title: "OTU ID"},
      hovermode: 'closest',
      width:1140,
      height: 460, 
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

   // Create a variable that holds the samples array. 
    var metadata = data.metadata;
   // 1. Create a variable that filters the metadata array for the object with the desired sample number.
   var resultArrayMeta = metadata.filter(sampleObj => sampleObj.id == sample);
   // 2. Create a variable that holds the first sample in the metadata array.
   var resultMeta=resultArrayMeta[0];
    
    // 3. Create a variable that holds the washing frequency.
    var wfreq=parseFloat(resultMeta.wfreq);

    // // 4. Create the trace for the gauge chart.
    var gaugeData = [{
		  value: wfreq,
		  title: { text: "Speed" },
	    type: "indicator",
		  mode: "gauge+number",
      title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"},
      gauge: {
        axis: {range: [0,10],tickwidth: 3, tickcolor: "black"},
        bar: {color: "black"},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "darkgreen" },], }
     }
    ];   
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 460, 
      height: 350, 
      margin: { t: 0, b: 0 } };

   // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge',gaugeData, gaugeLayout);
   
  });
}
