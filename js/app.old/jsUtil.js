function getDataReady(data, dataKey) {
    if ( !data.data[dataKey]) {
        // const oldData = Object.assign({}, data.data);
        // data.data = {};
        // data.data[dataKey] = oldData;

        data.data[dataKey] = data.data;
    }
    return Object.assign({}, data);
}

function getDataKeyReady(dataKey) {
    if (dataKey === null) {
        dataKey = "dataKey";
    }
    return dataKey;
}

function wrapUrlWithDates(child, dates) {

    // log("total_cus", "dates url", dates);
    let url = child.getAttribute('url');
    // log("total_cus", "dates url", url);
    if (url !== null && dates && dates.startDate !== undefined) {
        url = (url.replace("[start_date]",  dates.startDate)).replace("[end_date]", (dates.endDate || new Date().getFullYear()));
    }
    else if (url  !== null) {
    //    url no start or end date, use this month
        const startOfMonth = moment().clone().startOf('month').format('YYYY-MM-DD');
        const endOfMonth   = moment().clone().endOf('month').format('YYYY-MM-DD');

        url = (url.replace("[start_date]",  startOfMonth)).replace("[end_date]", (endOfMonth));
    }

    return url;
}