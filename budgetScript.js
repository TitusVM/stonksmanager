import { pythonipc } from './python-ipc.js';
const Chart = require("chart.js").Chart;
let $ = require('jquery');
const ipc = require('electron').ipcRenderer;


let username = ipc.sendSync('get-username');
pythonipc(showGraph, "graph", username);

$('#timespan').on('change', () => {
  $('#myChart').remove();
  $('#chartContainer').append('<canvas id="myChart"><canvas>');

  let timespan = document.getElementById("timespan").value;

  pythonipc((r) => {
    showGraph(r);
  }, "graph", [username, timespan]);
});

const categoryTranslator_fr = {
  "HOUSING": "Habitation",
  "FOOD": "Nourriture",
  "TRANSPORTATION": "Transports",
  "LEISURE": "Loisirs",
  "NECESSITY": "Nécessités",
  "OTHER": "Autre"
};

const categoryTranslator = categoryTranslator_fr;

function showGraph(values) {
  /* const labels = Object.keys(values).map(
      el => el.charAt(0).toUpperCase() + el.slice(1).toLowerCase()); */
  const categories = Object.keys(values);

  var i = 1, sum = 0;
  categories.forEach((c) => {
    let row = $(".table tbody").children().eq(i++).children();
    let amount = values[c];

    row.eq(1).text(categoryTranslator[c]);
    row.eq(2).text(formatMoney(amount));
    sum += amount;
  });
  $(".table tbody").children().last().children().eq(2).text(formatMoney(sum));

  const data = {
    labels: categories.map(c => categoryTranslator[c]),
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
              let label = context.label;
              let chf = formatMoney(context.parsed);

              return label + ": " + chf;
            }
          }
        }
      }
    }
  };

  new Chart(document.getElementById("myChart"), config);
}

function formatMoney(amount) {
  var chf;
  if (amount == Math.round(amount)) {
    chf = amount + ".-";
  } else {
    chf = amount;
  }

  return amount + " CHF";
}
