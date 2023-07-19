// Use the D3 library to read in samples.json from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function init() {

    d3.json(url).then((data) => {
        let names = data.names
        let dropdown = d3.select("#selDataset")

        // Populate dropdown options with sample IDs
        names.forEach((name) => {
            dropdown
                .append("option")
                .text(name)
                .property("value", name);
        });

        // Initialize the chart with the first sample ID
        optionChanged(names[0]);
    });
}

function buildCharts(sample_id) {
    // Read samples.json data using D3
    d3.json(url).then((data) => {
        const samples = data.samples
        const results = samples.filter(sample_obj => sample_obj.id == sample_id)[0];
        console.log(results)
        const otu_ids = results.otu_ids
        const otu_labels = results.otu_labels
        const sample_values = results.sample_values

        // Create the bar chart trace
        const trace1 = [
            {
                x: sample_values.slice(0, 10).reverse(),
                y: otu_ids.slice(0, 10).map(otu_id => "OTU " + otu_id).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];

        const layout1 = {
            title: ""

        };
        // Create the bar chart
        Plotly.newPlot("bar", trace1, layout1);

        // Create the bubble chart trace
        const trace2 = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth",
                }
            }
        ];

        const layout2 = {
            xaxis: {
                title: `OTU ID`
            },
        };
        Plotly.newPlot("bubble", trace2, layout2);

        // // Create the gauge chart
        const metadata = data.metadata;
        console.log()
        const gaugeTrace = {
            domain: { x: [0, 1], y: [0, 1] },
            value: metadata.wfreq,
            title: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week",
            type: "indicator",
            labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7","7-8", "8-9"],
            text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7","7-8", "8-9"],
            mode: "gauge+number",
            gauge: {
                axis: { range: [0, 9] },
                steps: [
                    { range: [0, 1], color: "red" },
                       { range: [1, 2], color: "grey" },
                        { range: [2, 3], color: "blue" },
                      { range: [3, 4], color: "green" },
                      { range: [4, 5], color: "yellow" },
                     { range: [5, 6], color: "orange" },
                      { range: [6, 7], color: "purple" },
                        { range: [7, 8], color: "pink" },
                        { range: [8, 9], color: "black" },
                ]
            }
        };      

            var layout3 = { width: 600, height: 500, margin: { t: 0, b: 0 } };
            Plotly.newPlot('gauge', [gaugeTrace], layout3);

                    
            
    })
};

function buildmetadata(sample_id) {
    // Read samples.json data using D3
    d3.json(url).then((data) => {
        const metadata = data.metadata
        const results = metadata.filter(sample_obj => sample_obj.id == sample_id)[0];
        const sampleMetadata = d3.select("#sample-metadata");
        // Clear existing metadata
        sampleMetadata.html("");

        // Update the sample metadata
        Object.entries(results).forEach(([key, value]) => {
            sampleMetadata.append("p").text(`${key}: ${value}`);
        });
    });
}
function optionChanged(new_sample) {
    buildmetadata(new_sample)
    buildCharts(new_sample)

}
// Initialize the dashboard
init();

