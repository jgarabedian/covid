
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

function usDaily(data) {
    let html = `
        <table class="table table-hover">
        <thead>
            <tr>
            <th scope="col">Date</th>
            <th scope="col">Positive</th>
            <th scope="col">Deaths</th>
            <th scope="col">Death Increase</th>
            </tr>
        </thead>
        <tbody id="resultsTable">
    `
    let len = data.length;
    if(len > 100) {
        len = 100
    }
    for (let idx = 0; idx < len; idx++) {
        let date = data[idx]['date'].toString()
        date = `${date.substring(0,4)}-${date.substring(4,6)}-${date.substring(6,8)}`
        html += `<tr>
            <th scope="row">${date}</th>
            <td>${addCommas(data[idx].positive)}</td>
            <td>${addCommas(data[idx].death)}</td>
            <td>${addCommas(data[idx].deathIncrease)}</td>
        </tr>`
    }
    html += '</tbody></table>'

    results.innerHTML = html;
}



function statesCurrent(data) {
    let html = `
    <input class="form-control" id="searchState" type="text" placeholder="Search State...">
        <table class="table table-hover">
        <thead>
            <tr>
            <th scope="col">State</th>
            <th scope="col">Positive</th>
            <th scope="col">Deaths</th>
            <th scope="col">Data Quality</th>
            </tr>
        </thead>
        <tbody id="resultsTable">
    `
    for (let idx = 0; idx < data.length; idx++) {
        html += `<tr>
            <th scope="row">${data[idx].state}</th>
            <td>${addCommas(data[idx].positive)}</td>
            <td>${addCommas(data[idx].death)}</td>
            <td>${data[idx].dataQualityGrade}</td>
        </tr>`
    }
    html += '</tbody></table>';
    results.innerHTML = html;
    $('#searchState').on('keyup', function() {
        var value = $(this).val().toLowerCase();
        $('#resultsTable tr').filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });
}

function usCurrent(data) {
    var usCurrentTemplate = `
        <h3>Current US Cases</h3>
        <h5>Total Deaths: ${addCommas(data.death)}</h5>
        <h5>Positive: ${addCommas(data.positive)}</h5>
        <h5>Currently Hospitalized: ${addCommas(data.hospitalizedCurrently)}</h5>
        <h5>Currently in ICU: ${addCommas(data.inIcuCurrently)}</h5>
        <h5>Currently on Ventilater: ${addCommas(data.onVentilatorCurrently)}</h5>
        `
    results.innerHTML = usCurrentTemplate;
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
}

