import { pythonipc } from './python-ipc.js';
const Chart = require("chart.js").Chart;
let $ = require('jquery');
const ipc = require('electron').ipcRenderer;

$('#btn-openJSON').on('click', () => {
  let result = ipc.sendSync('open-JSON');
  if (result != null) {
    pythonipc((r) => {
      $("#btn-openJSON").remove();
      showGraph(r);
    }, "graph", result);
  }
});

$('#btn-generateStatement').on('click', () => {
  // nothing yet
});

function showGraph(values) {
  const labels = Object.keys(values).map(
      el => el.charAt(0).toUpperCase() + el.slice(1).toLowerCase());

  const data = {
    labels: labels,
    datasets: [{
      backgroundColor: [
        "#ea5534",
        "#c7e260",
        "#74a7c8",
        "#ebe795",
        "#f4af4a",
        "#d40e0e"
      ],
      data: Object.values(values)
    }]
  };

  const config = {
    type: "doughnut",
    data: data,
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              var label = context.label;
              var chf;
              if (context.parsed == Math.round(context.parsed)) {
                chf = context.parsed + ".-";
              } else {
                chf = context.parsed;
              }

              return label + ": " + chf + " CHF";
            }
          }
        }
      }
    }
  };

  new Chart(document.getElementById("myChart"), config);
  $(".table").removeAttr("hidden");
}
