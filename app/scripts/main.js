
var base = 'https://covidtracking.com/api/v1/';
var endpointOptions = [
    {
        name: 'US Current',
        value: 'us/current.json'
    },
    {
        name: 'US Daily',
        value: 'us/daily.json'
    },
    {
        name: 'States Current',
        value: 'states/current.json'
    }
];
const form = document.getElementById('form');
const results = document.getElementById('results');
form.onchange = submit

function getResults(endpoint) {
    let url = base + endpoint
    fetch(url).then((response) => {
        return response.json()
    }).then((data) => {
        if(endpoint === 'us/current.json') {
            usCurrent(data[0])
        } else if (endpoint === 'us/daily.json') {
            usDaily(data)
        } else if (endpoint === 'states/current.json') {
            statesCurrent(data)
        } else {
            results.innerHTML = `${endpoint}`
            console.log(data)
        }
        
    })
};

function createDropdown() {
    var endpointInput = document.getElementById('endpointInput');
    for (let idx = 0; idx < endpointOptions.length; idx++) {
        let opt = endpointOptions[idx];
        let el = document.createElement('option')
        el.textContent = opt.name;
        el.value = opt.value;
        endpointInput.appendChild(el)
    }
}

function createTable(cols, rows, caption) {
    let html = '<table class="table table-hover">';
    html += `<caption>${caption}</caption>`;
    html += '<thead><tr class="table-info">';
    for (let col of cols) {
        html += `<th scope="col">${col.name}</th>`
    }
    html += '</tr></thead>'
    html += '<tbody id="resultsTable">'
    for (let row of rows) {
        html += '<tr>'
        var first = true;
        for (let col of cols) {
            if(col.accessor === 'date') {
                row[col.accessor] = formatDate(row[col.accessor])
            }
            html += `<t${first ? 'h scope="row"' : 'd'}>
                        ${!isNaN(row[col.accessor]) ? addCommas(row[col.accessor]) : row[col.accessor]}
                    </t${first ? 'h' : 'd'}>`
            first = false;
            
        }
        html += '</tr>'
        
    }
    html += '</tbody><table>'
    return html;
}

function usDaily(data) {
    let cols = [
        {
            'name': 'Date',
            'accessor': 'date'
        },
        {
            'name': 'Positive',
            'accessor': 'positive'
        },
        {
            'name': 'Deaths',
            'accessor': 'death'
        },
        {
            'name': 'Death Increase',
            'accessor': 'deathIncrease'
        },
        {
            'name': 'Positive',
            'accessor': 'positive'
        },
        {
            'name': 'Positive Increase',
            'accessor': 'positiveIncrease'
        },
        {
            'name': 'Negative',
            'accessor': 'negative'
        }
    ]
    let caption = 'US Daily'


    results.innerHTML = createTable(cols, data, caption);
}



function statesCurrent(data) {
    let cols = [
        {
            'name': 'State',
            'accessor': 'state'
        },
        {
            'name': 'Positive',
            'accessor': 'positive'
        },
        {
            'name': 'Deaths',
            'accessor': 'death'
        },
        {
            'name': 'Hospitalized',
            'accessor': 'hospitalizedCurrently'
        },
        // {
        //     'name': 'In ICU Currently',
        //     'accessor': 'inIcuCurrently'
        // },
        {
            'name': 'Data Quality',
            'accessor': 'dataQualityGrade'
        }
    ]
    results.innerHTML = createTable(cols, data, 'US States current info');
    $('#searchState').on('keyup', function() {
        var value = $(this).val().toLowerCase();
        $('#resultsTable tr').filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });
}

function usCurrent(data) {
    var usCurrentTemplate = `
        <div class="jumbotron jumbotron-fluid bg-info text-light">
            <div class="container">
                <h1 class="display-4">Current US Cases</h1>
                <p class="lead">Total Deaths: ${addCommas(data.death)}</p>
                <p class="lead">Positive: ${addCommas(data.positive)}</p>
                <p class="lead">Currently Hospitalized: ${addCommas(data.hospitalizedCurrently)}</p>
                <p class="lead">Currently in ICU: ${addCommas(data.inIcuCurrently)}</p>
                <p class="lead">Currently on Ventilater: ${addCommas(data.onVentilatorCurrently)}</p>
            </div>
        </div>
        `
    results.innerHTML = usCurrentTemplate;
}

function formatDate(string) {
    string = string.toString();
    return `${string.substring(0,4)}-${string.substring(4,6)}-${string.substring(6,8)}`
}

function addCommas(num) {
    if(!num) {
        return num
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * @name submit
 * @desc submit the form
 */
function submit() {
    if(this.elements[0].value !== 'Choose an Endpoint'){
        getResults(this.elements[0].value)
    }  
}

window.onload = function() {
    this.createDropdown();
    this.getResults(this.form.elements[0].value);
}

