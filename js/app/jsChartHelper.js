const generatedCharts = {};

function groupElementToParent(child, chartId) {
    let elementGroupNameKey = child.getAttribute('element-group-name');
    let elementGroupName = undefined;
    
    log("elementGroupName", elementGroupNameKey ,$('[element-name="' + elementGroupNameKey + '"]'), '[element-name="' + elementGroupNameKey + '"]');
    if ($('[element-name="' + elementGroupNameKey + '"]').length > 0 && chartId) {
        log("elementGroupName", elementGroupNameKey, '[element-name="' + elementGroupName + '"]');
        elementGroupName = $('[element-name="' + elementGroupNameKey + '"]').attr('ids');
        log("ids", elementGroupName);
        elementGroupName = JSON.parse(elementGroupName);
        log("ids", elementGroupName);
        elementGroupName.push(chartId);
        log("ids", elementGroupName);

        // child.setAttribute('element-group-name', elementGroupName);
        $('[element-name="' + elementGroupNameKey + '"]').attr('ids', JSON.stringify(elementGroupName));
    }
}
function initChart() {
    log("innit");

    elementTypeChartDate();
    elementTypeChartBar();
    elementTypeChartPie();
    elementTypeChartDateRange();
    elementTypeChartTable();

}

// auto plot graph based on month and year vs specified value
function elementTypeChartDate(elements=$('[element-type="chart-date"]'), date=false) {
    if (elements.length > 0 ) {
        elements.map(function (index, child) {

            //default chart data
            const chartDisplayData = {
                labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                series: [0, 0, 0, 0, 0, 0, 0],
                high: 0
            };


            let chartType = child.getAttribute("type");
            if (chartType === null || chartType === undefined) {
                chartType = "line";
            }

            let chartId = child.getAttribute("id");
            if (chartId === null || chartId === undefined) {
                chartId = "id - " + uuid();
                child.setAttribute("id", chartId);
            }

            const url =  child.getAttribute('url');
            let dataKey = child.getAttribute('data-key');
            dataKey = getDataKeyReady(dataKey);
            const durationType = child.getAttribute('duration-type');
            let chartData = child.getAttribute('chart-data');
            if (chartData != null && chartData != undefined) {
                chartData = JSON.parse(chartData);
            }

            let contentType = child.getAttribute('content-type');
            let renderOn = child.getAttribute('render-on');

            let chartCounter = 0;

            // fetch data from api/db
            request(url, 'get', undefined,
                (data) => {
                    if (data.code === data.negative || data.code === data.error) {
                        // showErrorMessage(data);
                    }
                    else {
                        if (!dataKey && !data.data[dataKey]) {
                            dataKey = "dataKey";
                            data.data[dataKey] = data.data;
                        }
                        if (data.data[dataKey]) {
                            //reset chartdata
                            chartDisplayData.labels = [];
                            chartDisplayData.series = [];

                            const rows = data.data[dataKey];
                            const gottenData = {};
                            rows.map(row => {
                                // //reset chartdata
                                // chartDisplayData.labels = [];
                                // chartDisplayData.series = [];

                                let rowKeys = Object.keys(row);
                                //rowkey => access to individual data on each interaction
                                /**
                                 * {
                                        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                                        series: [0, 0, 0, 0, 0, 0, 0],
                                        high: 50
                                    };
                                 * ***/
                                let chartItemDate = undefined;


                                if (durationType === "month") {
                                    let chartItemDate = moment(row[chartData[1]]).format("M");
                                    let gottenDataKeys = Object.keys(gottenData);

                                    if (gottenDataKeys.length === 0) {

                                        gottenData[getMonthByIndex(chartItemDate)] = 0;
                                        if (row[chartData[0]] !== undefined) {
                                            //if passed data to check exists in data gotten
                                            // chartDisplayData.series = [1];
                                            const newValue = gottenData[getMonthByIndex(chartItemDate)] + 1;
                                            gottenData[getMonthByIndex(chartItemDate)] = newValue;

                                            if (newValue > chartDisplayData.high) {
                                                chartDisplayData.high = newValue + 5;
                                            }
                                        }
                                    }
                                    else {
                                        chartItemDate = (moment(row[chartData[1]]).format("M"));

                                        if (gottenData[getMonthByIndex(chartItemDate)] === undefined) {
                                            // if current date doesnt exist, push new
                                            gottenData[`${getMonthByIndex(chartItemDate)}`] = 0;
                                            if (row[chartData[0]] !== undefined) {
                                                //if passed data to check exists in data gotten
                                                gottenData[`${getMonthByIndex(chartItemDate)}`] = 1;
                                            }
                                        }
                                        else {
                                            // date exist

                                            const newValue = gottenData[getMonthByIndex(chartItemDate)] + 1;

                                            if (row[chartData[0]] !== undefined) {
                                                //if passed data to check exists in data gotten
                                                // chartDisplayData.series[chartDisplayData.series.length - 1] = newValue;
                                                gottenData[`${getMonthByIndex(chartItemDate)}`] = newValue;
                                            }

                                            if (newValue > chartDisplayData.high) {
                                                chartDisplayData.high = newValue + 5;
                                            }
                                        }
                                    }
                                }

                                if (durationType === "year") {
                                    let chartItemDate = moment(row[chartData[1]]).format("YYYY");
                                    let gottenDataKeys = Object.keys(gottenData);

                                    if (gottenData.length === 0) {
                                        gottenData[chartItemDate] = 0;
                                        if (row[chartData[0]] !== undefined) {
                                            //if passed data to check exists in data gotten
                                            gottenData[chartItemDate] = 1;
                                        }
                                    }
                                    else {

                                        chartItemDate = (moment(row[chartData[1]]).format("YYYY"));
                                        if (gottenData[chartItemDate] === undefined) {
                                            // if current date not saved push new
                                            chartDisplayData.labels.push(chartItemDate);
                                            gottenData[chartItemDate] = 0;
                                            if (row[chartData[0]] !== undefined) {
                                                //if passed data to check exists in data gotten
                                                // chartDisplayData.series.push(1);
                                                gottenData[chartItemDate] = 1;
                                            }
                                        }
                                        else {
                                            //
                                            const newValue = gottenData[chartItemDate] + 1;

                                            if (row[chartData[0]] !== undefined) {
                                                //if passed data to check exists in data gotten
                                                gottenData[chartItemDate] = newValue;
                                            }

                                            if (newValue > chartDisplayData.high) {
                                                chartDisplayData.high = newValue + 5;
                                            }
                                        }
                                    }
                                }

                                if (durationType === "week") {
                                    let month = moment(row[chartData[1]]).format("MM");
                                    let year= moment(row[chartData[1]]).format("YYYY");
                                    let weekNo = getWeekNumber(new Date());
                                    let instanceWeekNo = getWeekNumber(new Date(row[chartData[1]]));

                                    if (month === moment(new Date()).format("MM") && year === moment(new Date()).format("YYYY") && weekNo === instanceWeekNo) {
                                        // same month as current month and year and current week

                                        let chartItemDate = moment(row[chartData[1]]).format("dddd");
                                        let gottenDataKeys = Object.keys(gottenData);

                                        if (gottenData.length === 0) {
                                            gottenData[chartItemDate] = 0;
                                            if (row[chartData[0]] !== undefined) {
                                                //if passed data to check exists in data gotten
                                                gottenData[chartItemDate] = 1;
                                            }
                                        }
                                        else {
                                            chartItemDate = moment(row[chartData[1]]).format("dddd");
                                            if (gottenData[chartItemDate] === undefined) {
                                                // if current date not saved push new
                                                chartDisplayData.labels.push(chartItemDate);
                                                gottenData[chartItemDate] = 0;
                                                if (row[chartData[0]] !== undefined) {
                                                    //if passed data to check exists in data gotten
                                                    // chartDisplayData.series.push(1);
                                                    gottenData[chartItemDate] = 1;
                                                }
                                            }
                                            else {
                                                const newValue = gottenData[chartItemDate] + 1;

                                                if (row[chartData[0]] !== undefined) {
                                                    //if passed data to check exists in data gotten
                                                    gottenData[chartItemDate] = newValue;
                                                }

                                                if (newValue > chartDisplayData.high) {
                                                    chartDisplayData.high = newValue + 5;
                                                }
                                            }
                                        }
                                    }
                                }
                            });

                            // clean up and prepare to use on chart

                            const labels = chartDisplayData.labels;
                            const gottenDataKeys = Object.keys(gottenData);

                            const currentYear = moment(new Date()).format("YYYY");
                            const years = [];
                            if (durationType === "month") {
                                //max =12
                                for(let i =0 ; i < monthName.length; i++) {
                                    if (gottenDataKeys.indexOf(monthName[i]) === -1) {
                                        // month doesnt exist in gotten data
                                        labels[i] = getMonthABBR(monthName[i]);
                                        chartDisplayData.series[i] = 0;
                                    }
                                    else {
                                        // month exist in gotten data
                                        labels[i] = getMonthABBR(monthName[i]);
                                        chartDisplayData.series[i] = gottenData[monthName[i]];
                                    }
                                }
                            }
                            if (durationType === "year") {

                                // get 5 years back and 5 years forward 2010-2020
                                for(let i = (parseInt(currentYear) - 5) ; i < (parseInt(currentYear)); i++) {
                                    //get year
                                    // min 5 e.g 2015 (2010 - 2020)
                                    years.push(`${i}`);
                                }

                                for(let i = currentYear; i < (parseInt(currentYear) + 5); i++) {
                                    //get year
                                    //  plus 5 e.g 2015 (2010 - 2020)
                                    years.push(`${i}`);
                                }

                                for(let i = 0 ; i < years.length ; i++) {
                                    if (gottenDataKeys.indexOf((years[i])) === -1) {
                                        //    if year not  gotten Data array
                                        labels[i] = years[i];
                                        chartDisplayData.series[i] = 0;
                                    }
                                    else {
                                        // year exists in gotten data
                                        labels[i] = years[i];
                                        chartDisplayData.series[i] = gottenData[years[i]];
                                    }
                                }
                            }
                            if (durationType === "week") {
                                for(let i = 0 ; i < dayName.length ; i++) {
                                    if (gottenDataKeys.indexOf(dayName[i]) === -1) {
                                        //    if year not  gotten Data array
                                        labels[i] = years[i];
                                        chartDisplayData.series[i] = 0;
                                    }
                                    else {
                                        // year exists in gotten data
                                        labels[i] = years[i];
                                        chartDisplayData.series[i] = gottenData[years[i]];
                                    }
                                }

                                if (chartDisplayData.labels.length === 0) {
                                    chartDisplayData.labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                                    chartDisplayData.series = [0, 0, 0, 0, 0, 0, 0];
                                }
                            }

                            chartDisplayData.labels = labels;

                            renderChart(chartDisplayData, chartType, chartId, renderOn, contentType);
                        }
                    }

                },
                (xhr,status,error) => {
                    //fail silently
                    log("error",  JSON.stringify(xhr), JSON.stringify(status), JSON.stringify(error));
                    // showErrorMessage(xhr.responseJSON);
                },
            );

        });
    }
}

function wrap_url(child, dates) {

    log("total_cus", "dates url II", dates);
    let url = child.getAttribute('url');
    log("total_cus", "dates url III", url);
    if (dates && dates.startDate !== undefined) {
        url = child.getAttribute("date-url");
    }
    log("total_cus", "dates url III", url, dates);

        if (dates && dates.startDate !== undefined) {
            url = url.replace("[start_date]",  dates.startDate);
            url = url.replace("[end_date]", (dates.endDate || new Date().getFullYear()));
            url = url.replace("[current_year]", moment(new Date()).format("YYYY") + "-01-01");
        }
        else {
            url = url.replace("[start_date]",  new Date().getFullYear());
            url = url.replace("[end_date]", (new Date().getFullYear()));
            url = url.replace("[current_year]", moment(new Date()).format("YYYY") + "-01-01");
        }

    return url;
}

// bar chart for data passed
function elementTypeChartBar(opts=undefined) {
    //
log("total_cus1", "render opts", opts);
    if (opts === undefined) {
        opts = {};
    }



    if (opts.elements === undefined) {
        opts.elements = $('[element-type="chart-bar"]');
    }


    if (opts.elements !== undefined && opts.elements.length > 0 ) {
        log("total_cus", "dates  url opts.elements", opts.elements);
        opts.elements.map(function (index, child) {
            log("total_cus", "dates  url opts.elements", opts.elements);
            try {

                //default chart data
                let chartId = child.getAttribute("id");

                if (chartId === null || chartId === undefined) {
                    chartId = "id-" + uuid();
                    child.setAttribute("id", chartId);
                }

                log("total_cus", "dates url", "dates urls");

                let url = wrap_url(child);
                if (opts.startEndDate) {
                    url = wrap_url(child, {startDate: opts.startEndDate.start, endDate: opts.startEndDate.end});
                }

                log("total_cus", "render url", url);

                log("date_range_button", "dates url I", url);
                let dataKey = child.getAttribute('data-key');
                dataKey = getDataKeyReady(dataKey);

                let chartData = child.getAttribute('chart-data');
                if (chartData != null && chartData !== undefined) {
                    chartData = JSON.parse(chartData);
                }

                let renderOn = child.getAttribute('render-on');
                let dataLabelKey = child.getAttribute('data-label');
                let primaryDataKey = child.getAttribute('primary-key');
                let secondaryDataKey = child.getAttribute('secondary-key');
                const chartTitle = child.getAttribute('chart-title');
                const primaryTitle = child.getAttribute('primary-title');
                const secondaryTitle = child.getAttribute('secondary-title');

                const labels = [];
                const primaryData = [];
                const secondaryData = [];

                let unknownCounter = 1;


                groupElementToParent(child, chartId);
                log("total_cus", "dates  url chartId", chartId);


                // fetch data from api/db
                request(url, 'get', undefined,
                    (data) => {

                        if (data.code === data.negative || data.code === data.error) {
                            // showErrorMessage(data);
                        }
                        else {
                            log("total_cus", "data", data);
                            if (!data.data[dataKey]) {
                                data.data[dataKey] = data.data;
                            }
                            if (data.data[dataKey]) {

                                const rows = data.data[dataKey];
                                log("total_cus", "rows", rows);
                                // prepare data for graph use
                                rows.map((row, index) => {
                                    if (row[dataLabelKey] === null) {
                                        labels.push("Unknown " + unknownCounter);
                                    }
                                    else {
                                        labels.push(row[dataLabelKey]);
                                    }
                                    //numberWithCommas()
                                    primaryData.push((parseFloat(row[primaryDataKey]).toFixed(2)));
                                    secondaryData.push((parseFloat(row[secondaryDataKey]).toFixed(2)));
                                });


                                renderChartistBar(chartId, labels, primaryData, secondaryData, primaryTitle, secondaryTitle);
                            }
                        }

                    },
                    (xhr, status, error) => {
                        //fail silently
                        log("total_cus",JSON.stringify(xhr), JSON.stringify(status), JSON.stringify(error));
                        // showErrorMessage(xhr.responseJSON);
                    },
                );

                log("date_range_button", "dates url I", url);

            }
            catch (e) {
                log("total_cus", "e[m1]", e);
            }
        });
    }
}

// pie chart for data passed
function elementTypeChartPie(opts=undefined) {
    if (opts === undefined) {
        opts = {};
    }

    if (opts.elements === undefined) {
        opts.elements = $('[element-type="chart-pie"]');
    }

    if (opts.elements.length > 0 ) {
        opts.elements.map(function (index, child) {
            
            
            //default chart data
            let chartId = child.getAttribute("id");
            if (chartId === null || chartId === undefined) {
                chartId = "id-" + uuid();
                child.setAttribute("id", chartId);
            }

            let url = wrap_url(child);
            if (opts.startEndDate) {
                url = wrap_url(child, {startDate: opts.startEndDate.start, endDate: opts.startEndDate.end});
            }
            let dataKey = child.getAttribute('data-key');
            dataKey = getDataKeyReady(dataKey);
            
            let chartData = child.getAttribute('chart-data');
            if (chartData != null && chartData != undefined) {
                chartData = JSON.parse(chartData);
            }

            let renderOn = child.getAttribute('render-on');
            let dataLabelKey = child.getAttribute('data-label');
            let primaryDataKey = child.getAttribute('primary-key');
            let secondaryDataKey = child.getAttribute('secondary-key');
            const chartTitle = child.getAttribute('chart-title');
            const primaryTitle = child.getAttribute('primary-title');
            const secondaryTitle = child.getAttribute('secondary-title');

            let labels = [];
            const primaryData = [];
            const secondaryData = [];
            const crumbId = child.getAttribute('crumb-id');

            let unknownCounter = 1;

            groupElementToParent(child, chartId);

            // fetch data from api/db
            request(url, 'get', undefined,
                (data) => {
                    if (data.code === data.negative || data.code === data.error) {
                        // showErrorMessage(data);
                    }
                    else {
                        // if (!dataKey && !data.data[dataKey]) {
                        //     dataKey = "dataKey";
                        //     data.data[dataKey] = data.data;
                        // }
                        data = getDataReady(data, dataKey);
                        if (data.data[dataKey]) {
                            const rows = data.data[dataKey];
                            // prepare data for graph use
                            rows.map((row, index) => {
                                if (row[dataLabelKey] === null) 
                                {
                                    labels.push("Unknown " + unknownCounter);
                                }
                                else {
                                    labels.push(row[dataLabelKey]);
                                }
                                
                                primaryData.push(parseFloat(row[primaryDataKey]).toFixed(2));
                            });

                            // renderChartistBar(chartId, labels, primaryData, secondaryData, primaryTitle, secondaryTitle);
                            renderChartPie(chartId, primaryData, labels, crumbId);
                        }
                    }
                },
                (xhr,status,error) => {
                    //fail silently
                    log(JSON.stringify(xhr), JSON.stringify(status), JSON.stringify(error));
                    // showErrorMessage(xhr.responseJSON);
                },
            ); 
        });
    }
}

// chart-table
function elementTypeChartTable(opts=undefined) {
    if (opts === undefined) {
        opts = {};
    }

    if (opts.elements === undefined) {
        opts.elements = $('[element-type="chart-table"]');
    }

    log("total_cus", "Chart Bat", opts.elements.length);
    if (opts.elements.length > 0 ) {
        opts.elements.map(function (index, child) {
            //default chart data
            let chartId = child.getAttribute("id");
            if (chartId === null || chartId === undefined) {
                chartId = "id-" + uuid();
                child.setAttribute("id", chartId);
            }

            // perform clean up if any
            let url = wrap_url(child);
            //replace on load
            $("#" + chartId).attr('url', url);
            if (opts.startEndDate) {
                url = wrap_url(child, {startDate: opts.startEndDate.start, endDate: opts.startEndDate.end});
                //replace if filtered
                $("#" + chartId).attr('url', url);
            }

            

            let dataKey = child.getAttribute('data-key');
            dataKey = getDataKeyReady(dataKey);
            
            let chartData = child.getAttribute('chart-data');
            
            if (chartData != null && chartData != undefined) {
                chartData = JSON.parse(chartData);
            }

            groupElementToParent(child, chartId);

            initDataTables(chartId);

            return;
        });
    }
}

// date range for chart data
function elementTypeChartDateRange() {
    
    console.log("child", $('[element-type="chart-btn-date-range"]'));
    if ($('[element-type="chart-btn-date-range"]').length > 0 ) {
        $('[element-type="chart-btn-date-range"]').map(function (index, child) {
            console.log("child", child);
            let chartClass = child.getAttribute("class");
            if (!chartClass.includes("input-daterange-datepicker")) {
                chartClass = chartClass + " input-daterange-datepicker";
                // child.setAttribute("class", chartClass);
            }

            let defaultDate = child.getAttribute("value");

            if (defaultDate === null || defaultDate === undefined ) {
                // value="01/01/2015 - 01/31/2015"
                defaultDate = moment(new Date()).format("MM/DD/YYYY") + " - " + moment(new Date()).format("MM/DD/YYYY");
                
                child.setAttribute("value", defaultDate);
            }
            
            //if no id, create
            let chartId = child.getAttribute("id");
            log("def chartId", chartId);
            if (chartId === null || chartId === undefined) {
                chartId = "id-" + uuid();
                log("chartId", chartId);
                child.setAttribute("id", chartId);
            }

            renderChartDateSelector(chartId);
        });
    }
}

function renderChartPie(chartId, chartData,labels, crumbId) {
    const reqData = chartData;
    
    let total = 0;
    const bgColor = reqData.map(data => {
        // calc data total
        total = parseFloat(total) + parseFloat(data);
        return getRandomColor();
    });
    const hoverBgColor = reqData.map(data => getRandomColor());

    const pieData = {
        defaultFontFamily: 'Poppins',
        datasets: [{
            data: reqData,
            borderWidth: 3,
            borderColor: "rgba(255, 255, 255, 1)",
            backgroundColor: bgColor,
            hoverBackgroundColor: hoverBgColor,
        }],
        labels: labels,
    };


    log("bar_pie","Generating Chart Pie", chartId);
    log("bar_pie", "generated", generatedCharts);
    if (generatedCharts[chartId] !== undefined) {
        log("bar_pie","Generated Chart Pie", generatedCharts[chartId].config);
        if (generatedCharts[chartId].config.type === "doughnut") {
            generatedCharts[chartId].data = pieData;
            generatedCharts[chartId].update();
        }
    }
    else {
        generatedCharts[chartId] = new Chart(chartId, {
            type: 'doughnut',
            data: pieData,
            options: {
                weight: 1,
                cutoutPercentage: 65,
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
            }
        });
    }
    //// print to pie-crumb element
    $("#" + crumbId).children().remove();
    reqData.map((data, index) => {
        $("#" + crumbId).append(`<li><i class="fa fa-circle text-primary mr-1" style="color:${bgColor[index]} !important;"></i> ${parseFloat((data/total) * 100).toFixed(4)}% ${labels[index]}</li>`);
    });
    $("#" + crumbId).append(`<li><i class="fa fa-circle text-info mr-1"></i> Total:  ${numberWithCommas(Math.round(parseFloat((total))))}</li>`);
}

function renderChartistBar (chartId, labels, primaryData, secondaryData, primaryTitle, secondaryTitle) {
    let barChartData = {
        defaultFontFamily: 'Poppins',
        labels: labels,
        datasets: [{
            label: primaryTitle,
            backgroundColor: '#fff',
            hoverBackgroundColor: '#eee', 
            data: primaryData
        }, {
            label: secondaryTitle,
            backgroundColor: 'rgba(255,255,255,0.1)',
            hoverBackgroundColor: 'rgba(255,255,255,0.15)', 
            data: secondaryData
        }]

    };

    log("total_cus","Generated Chart", generatedCharts[chartId]);
    if (generatedCharts[chartId] !== undefined) {
        log("total_cus","Generated Chart", generatedCharts[chartId].config);
        if (generatedCharts[chartId].config.type === "bar") {
                generatedCharts[chartId].data = barChartData;
                generatedCharts[chartId].update();
        }
    }
    else {
        log("total_cus", "generated", generatedCharts);
        generatedCharts[chartId] = new Chart(chartId, {
            type: 'bar',
            data: barChartData,
            options: {
                legend: {
                    display: false
                },
                title: {
                    display: true
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            var value = data.datasets[0].data[tooltipItem.index];
                            if(parseInt(value) >= 1000){
                                       return '' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    } else {
                                       return '' + value;
                                    }
                        }
                  }
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        display: false,
                        stacked: true,
                        barPercentage: 0.2,
                        ticks: {
                            display: true
                        },
                        gridLines: {
                            display: false,
                            drawBorder: false
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            userCallback: function(value, index, values) {
                                return value.toLocaleString();   // this is all we need
                            }
                        }
                    }]
                }
            }
        });
    }



}

function renderChart(chartData, chartType, chartId,renderOn, contentType) {
    let chartConfig = {
        labels: chartData.labels,
        series: [
            chartData.series
        ]
    };


    let chartOptions = {
        lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0
        }),
        low: 0,
        high: chartData.high,
        chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
    };

    if (chartType === "bar")
    {
        chartOptions = {
            axisX: {
                showGrid: false
            },
            low: 0,
            high: chartData.high,
            chartPadding: {
                top: 0,
                right: 5,
                bottom: 0,
                left: 0
            }
        };
    }


    chartId = "#" + chartId;
    let chart = undefined;
    if (chartType === "bar") {
        chart = new Chartist.Bar(chartId,
            chartConfig,
            chartOptions, [
                ['screen and (max-width: 640px)', {
                    seriesBarDistance: 5,
                    axisX: {
                        labelInterpolationFnc: function(value) {
                            return value[0];
                        }
                    }
                }]
            ]);
    }
    else {
        chart = new Chartist.Line(chartId, chartConfig, chartOptions);
    }

    if (generatedCharts[chartId] === undefined) {
        generatedCharts[chartId] = chart;
    }

    if (contentType !== null && contentType !== undefined) {
        if (renderOn !== undefined) {
            let data = "";
            chartData.series.map(label => data = data + label +",");
            
            if(data.endsWith(",")) {
                data = data.substr(0, (data.length - 1));
            }

            $(`#${renderOn}`).html(data);
        }
    }
    else {
        //start animation for the chart
        md.startAnimationForLineChart(chart);
    }

}

function renderChartDateSelector(dateRangeId) {
    log("total_cus","render dates");
    log("total_cus","render dates",$(`#${dateRangeId}`));
    const dateRangeIdElem = $(`#${dateRangeId}`);
    log("date_range_button", "render Date", dateRangeId, dateRangeIdElem);

    dateRangeIdElem.daterangepicker({
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-danger',
        cancelClass: 'btn-inverse',
        maxDate: moment(new Date()).format("MM/DD/YYYY"),
    },
    function(start, end, label) {

        log("total_cus","render A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        //trigger date range query
        let ids = $(`#${dateRangeId}`).attr('ids');
        // convert back to json
        ids = JSON.parse(ids);
        ids.map(id => {
            log("date_range_button","Triggering Update");
            // handle calling respective function i.e elementTypeChartBar for bar and [PIE] for pie
            if (generatedCharts[id] !== undefined && generatedCharts[id].config.type === "bar") {
                // trigger bar chart to update data
                elementTypeChartBar(
                {
                    startEndDate: {
                        start: start.format("YYYY-MM-DD"), end: end.format("YYYY-MM-DD")
                    },
                    elements:$(`#${id}`)
                });
            }
            else if (generatedCharts[id] !== undefined && generatedCharts[id].config.type === "doughnut") 
            {
                // trigger pie chart to update data
                elementTypeChartPie({
                    startEndDate: {
                        start: start.format("YYYY-MM-DD"), end: end.format("YYYY-MM-DD")
                    },
                    elements:$(`#${id}`)
                });
            }
            
        });

      }
    );
}

function myListener(event) {
    // element' which need a click trigger
    const element = event.target;

    // if (element.getAttribute("element-type") === "post") {
    //     event.stopPropagation();
    //     event.preventDefault();
    //
    //     post(event, element);
    // }

}

$(document).ready(function () {
    document.addEventListener( "click", myListener );
    initChart();
})