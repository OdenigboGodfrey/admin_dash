String.prototype.replaceAllTxt = function replaceAll(search, replace) { return this.split(search).join(replace); }

function escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceAll(str, term, replacement) {
    return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
}

function renderHelper(rowKeys, config, row, render) {
    // let render = "";

    rowKeys.map((key, index) => {

        // data type of key == "string" e.g {deleted_at: DATE}

        if (config && Object.keys(config).includes(key)) {
            // replace a key value with custom value

            if (config[key] === "moment") {
                try {
                    render = render.replaceAll(`[${key}]`, moment(row[key]).fromNow() );
                }
                catch (e) {
                    render = render.replace(`[${key}]`, moment(row[key]).fromNow() );
                }

            }
            else if (config[key] === "status_toggle") {

                if (row[key]) {
                    // deleted

                    try {
                        render = render.replaceAll(`[${key}]`, false);
                        render = render.replaceAll(`[${config[key]}]`, "Activate");
                    }
                    catch (e) {
                        render = replaceAll(render, `[${key}]`, false);
                        render = replaceAll(render, `[${config[key]}]`, "Activate");
                        // render = render.replace(`[${key}]`, false);
                        // render = render.replace(`[${config[key]}]`, "Activate");
                    }
                }
                else {
                    try {
                        // column value == null i.e not deleted still active
                        render = render.replaceAll(`[${key}]`, true);
                        render = render.replaceAll(`[${config[key]}]`, "Deactivate");
                    }
                    catch (e) {

                        render = replaceAll(render, `[${key}]`, true);
                        render = replaceAll(render, `[${config[key]}]`, "Deactivate");

                        // render = render.replace(`[${key}]`, true);
                        // render = render.replace(`[${config[key]}]`, "Deactivate");
                    }

                }
            }
            else if (config[key] === "count") {
                try {
                    // column value == null i.e not deleted still active
                    render = render.replaceAll(`[${key}]`, (row[key]).length);
                }
                catch (e) {
                    render = render.replace(`[${key}]`, (row[key]).length);
                }
            }
        }
        else {
            try {
                render = render.replaceAll(`[${key}]`, row[key]);
            }
            catch (e) {
                render = replaceAll(render, `[${key}]`, row[key]);
            }

        }

        // prioritize arrays before objects
        if (Array.isArray(row[key])) {
            // if child data is an array
            // access children content to pull data
            // data type of key == "Array" e.g {data: []}
            const innerRows = row[key];
            innerRows.map((innerRow, index) => {
                //access array data
                if (typeof innerRow === 'object')
                {
                    const innerRowKeys = Object.keys(innerRow);
                    //keys of array objects
                    innerRowKeys.map(innerRowKey => {
                        try {
                            // column value == null i.e not deleted still active
                            render = render.replaceAll(`[${key}.${innerRowKey}]`, innerRow[innerRowKey]);
                        }
                        catch (e) {
                            // render = render.replace(`[${key}.${innerRowKey}]`, innerRow[innerRowKey]);
                            render = replaceAll(render, `[${key}.${innerRowKey}]`, innerRow[innerRowKey]);
                        }

                    });
                }
                else if (Array.isArray(innerRow)) {}
            });
        }
        else if (row[key] && typeof row[key] === 'object') {
            const innerRowKeys = Object.keys(row[key]);
            //keys of array objects
            innerRowKeys.map(innerRowKey => {
                try {
                    // column value == null i.e not deleted still active
                    render = render.replaceAll(`[${key}.${innerRowKey}]`, row[key][innerRowKey]);
                }
                catch (e) {
                    // render = render.replace(`[${key}.${innerRowKey}]`, row[key][innerRowKey]);
                    render = replaceAll(render ,`[${key}.${innerRowKey}]`, row[key][innerRowKey]);
                }
            });
        }
    });

    return render;
}

function getConfig(config) {
    if (config) {
        try {
            if (typeof config === "string") config = JSON.parse(config);
            Object.keys(config).map(key => {
                if (!Array.isArray(config[key])) {
                    // configs are of type array
                    config[key] = [config[key]];
                }
            });
        }
        catch
        {
            config = undefined;
        }
    }
    return config;
}

/**
 * 
 * @param {{Object || Undefined}} row 
 * @param {{Object}} config 
 * @param {{String}} key 
 * @param {{Boolean}} replaceValue 
 * @param {{String || Any}} valueToEdit 
 */
function useConfig(row, config, key, replaceValue=false ,valueToEdit=undefined) {
    // log("total_cus", "505 config used", replaceValue, typeof replaceValue);
    if (replaceValue && valueToEdit === undefined) {
        // supply valueToEdit must be provided if value is to be replaced
        const message = "Provide valueToEdit";
        return message;
    }
    else if (replaceValue && valueToEdit === undefined && row !=undefined) {
        valueToEdit = row[key];
    }


    
log("total_cus", "configuration", row, config, key, replaceValue ,valueToEdit);
    config[key].map(configuration => {
        // log("total_cus", "configuration", configuration);
    
        if (configuration === "moment") {
            if (replaceValue == true) {
                try {
                    valueToEdit = valueToEdit.replaceAll(`[${key}]`, moment(valueToEdit).fromNow() );
                }
                catch(ex) {
                    if (ex.message.includes("valueToEdit.replaceAll")) {
                        valueToEdit = valueToEdit.replace(`[${key}]`, moment(valueToEdit).fromNow() );
                    }
                }
            }
            else {
                valueToEdit = moment(valueToEdit).fromNow();
            }
            
        }
        else if (configuration === "status_toggle") {
            if (valueToEdit) {
                // deleted
                if (replaceValue == true) {
                    try {
                        valueToEdit = valueToEdit.replaceAll(`[${key}]`, false);
                        valueToEdit = valueToEdit.replaceAll(`[${configuration}]`, "Activate");
                    }
                    catch(ex) {
                        if (ex.message.includes("valueToEdit.replaceAll")) {
                            valueToEdit = valueToEdit.replace(`[${key}]`, false);
                            valueToEdit = valueToEdit.replace(`[${configuration}]`, "Activate");
                        }
                    }
                }
                else {
                    valueToEdit = {[key]: false, [configuration]: "Activate"};
                }
            }
            else {
                // column value == null i.e not deleted still active
                // valueToEdit = valueToEdit.replaceAll(`[${key}]`, true);
                // valueToEdit = valueToEdit.replaceAll(`[${config[key]}]`, "Deactivate");
                
                if (replaceValue == true) {
                    try {
                        valueToEdit = valueToEdit.replaceAll(`[${key}]`, true);
                        valueToEdit = valueToEdit.replaceAll(`[${configuration}]`, "Deactivate");
                    }
                    catch(ex) {
                        if (ex.message.includes("valueToEdit.replaceAll")) {
                            valueToEdit = valueToEdit.replace(`[${key}]`, true);
                            valueToEdit = valueToEdit.replace(`[${configuration}]`, "Deactivate");
                        }
                    }
                    
                }
                else {
                    valueToEdit = {[key]: true, [configuration]: "Deactivate"};
                }
            }
        }
        else if (configuration=== "count") {
            if (replaceValue == true) {
                try {
                    valueToEdit = valueToEdit.replaceAll(`[${key}]`, (valueToEdit).length);
                }
                catch(ex)
                {
                    if (ex.message.includes("valueToEdit.replaceAll")) {
                        valueToEdit = valueToEdit.replace(`[${key}]`, (valueToEdit).length);
                    }
                    
                }
                
            }
            else {
                valueToEdit = (valueToEdit).length;
            }   
        }
        else if (configuration === "year_format") {
            if (replaceValue == true) {
                try {
                    // valueToEdit = valueToEdit.replaceAll(`[${key}]`, moment(row[key]).format("MM-DD"));
                    valueToEdit = valueToEdit.replaceAll(`[${key}]`, moment(valueToEdit).format("YYYY-MM-DD"));
                }
                catch(ex) {
                    if (ex.message.includes("valueToEdit.replaceAll")) {
                        valueToEdit = valueToEdit.replace(`[${key}]`, moment(valueToEdit).format("YYYY-MM-DD"));
                        // if (typeof valueToEdit === "number") {
                        //     valueToEdit = moment(row[key]).format("YYYY-MM-DD");
                        // }
                    }
                }
                // valueToEdit = valueToEdit.replaceAll(`[${key}]`, moment(row[key]).format("YYYY-MM-DD"));
            }
            else {
                valueToEdit = moment(row[key]).format("YYYY-MM-DD");
            }
            
        }
        else if (configuration === "month_format") {
            if (replaceValue == true) {
                try {
                    valueToEdit = valueToEdit.replaceAll(`[${key}]`, moment(valueToEdit).format("MM-DD"));
                }
                catch(ex) {
                    if (ex.message.includes("valueToEdit.replaceAll")) {
                        valueToEdit = valueToEdit.replace(`[${key}]`, moment(valueToEdit).format("MM-DD"));
                    //     if (typeof valueToEdit === "number") {
                    //         valueToEdit = moment(row[key]).format("MM-DD");
                    //     }
                    }
                }
            }
            else {
                valueToEdit = moment(valueToEdit).format("MM-DD");
            }
            
        }
        else if (configuration === "start_date") {
            if (replaceValue == true) {
                try {
                    valueToEdit = valueToEdit.replaceAll(`[${key}]`, moment((valueToEdit || new Date())).format("YYYY-MM-DD"));
                }
                catch(ex) {
                    if (ex.message.includes("valueToEdit.replaceAll")) {
                        valueToEdit = valueToEdit.replace(`[${key}]`, moment((valueToEdit || new Date())).format("YYYY-MM-DD"));
                    //     if (typeof valueToEdit === "number") {
                    //         valueToEdit = moment(row[key]).format("MM-DD");
                    //     }
                    }
                }
            }
            else {
                valueToEdit = moment((valueToEdit || new Date())).format("YYYY-MM-DD");
            }   
        }
        else if (configuration === "end_date") {
            if (replaceValue == true) {
                try {
                    //
                    // valueToEdit = valueToEdit.replace(new RegExp(`//[${key}]//`, 'g'), moment((valueToEdit || new Date())).format("YYYY-MM-DD"));
                    log("total_cus", "configurationI", valueToEdit, `[${key}]`);
                    valueToEdit = valueToEdit.replaceAll(`[${key}]`, moment((valueToEdit || new Date())).format("YYYY-MM-DD"));
                }
                catch(ex) {
                    
                    if (ex.message.includes("valueToEdit.replaceAll")) {
                        valueToEdit = valueToEdit.replace(`[${key}]`, moment((valueToEdit || new Date())).format("YYYY-MM-DD"));
                    //     if (typeof valueToEdit === "number") {
                    //         valueToEdit = moment(row[key]).format("MM-DD");
                    //     }
                    }
                }
            }
            else {
                valueToEdit = moment((valueToEdit || new Date())).format("YYYY-MM-DD");
            }
            
        }
        // else if (configuration === "current_year") {
            
        //     if (replaceValue == true) {
        //         try {
        //             console.log("current_year config", valueToEdit);
        //             valueToEdit = valueToEdit.replaceAll(`[${key}]`, moment((new Date())).format("YYYY"));
        //             console.log("current_year config 2", `[${key}]`, moment((new Date())).format("YYYY"), valueToEdit);
        //         }
        //         catch(ex) {
        //             valueToEdit = valueToEdit.replace(`[${key}]`, moment((new Date())).format("YYYY"));
        //             console.error("ex", ex);
        //             // if (ex.message.includes("valueToEdit.replaceAll")) {
        //             //     if (typeof valueToEdit === "number") {
        //             //         valueToEdit = moment(row[key]).format("MM-DD");
        //             //     }
        //             // }
        //         }
        //     }
        //     else {
        //         valueToEdit = moment((new Date())).format("YYYY");
        //     }
            
        // }
        else if (configuration === "current_year") {
            
            if (replaceValue == true) {
                try {
                    console.log("current_year config", valueToEdit);
                    valueToEdit = valueToEdit.replaceAll(`[${key}]`, moment((new Date())).format("YYYY") + "-01-01");
                    console.log("current_year config 2", `[${key}]`, moment((new Date())).format("YYYY") + "-01-01", valueToEdit);
                }
                catch(ex) {
                    valueToEdit = valueToEdit.replace(`[${key}]`, moment((new Date())).format("YYYY") + "-01-01");
                    // if (ex.message.includes("valueToEdit.replaceAll")) {
                    //     if (typeof valueToEdit === "number") {
                    //         valueToEdit = moment(row[key]).format("MM-DD");
                    //     }
                    // }
                }
            }
            else {
                valueToEdit = moment((new Date())).format("YYYY") + "-01-01";
            }
            
        }
        else if (configuration === "cast_float") {
            if (replaceValue == true) {
                try {
                    valueToEdit = valueToEdit.replaceAll(`[${key}]`, parseFloat(valueToEdit));
                }
                catch(ex) {
                    if (ex.message.includes("valueToEdit.replaceAll")) {
                        valueToEdit = valueToEdit.replace(`[${key}]`, parseFloat(valueToEdit));
                        // if (typeof valueToEdit === "number") {
                        //     valueToEdit = parseFloat(valueToEdit)
                        // }
                    }
                }
                
            }
            else {
                valueToEdit = parseFloat(valueToEdit);
            }
            log("total_cus", "float", valueToEdit);
        }
        else if (configuration === "comma_number") {
            log("total_cus", "in comma", configuration);
            if (replaceValue == true) {
                try {
                    valueToEdit = valueToEdit.replaceAll(`[${key}]`, numberWithCommas(valueToEdit));
                    log("total_cus", "in comma good", configuration, typeof valueToEdit, valueToEdit);
                }
                catch(ex) {
                    log("total_cus", "in comma error", configuration, typeof valueToEdit, ex.message.includes("valueToEdit.replaceAll"));
                    
                    if (ex.message.includes("valueToEdit.replaceAll")) {
                        valueToEdit = valueToEdit.replace(`[${key}]`, numberWithCommas(valueToEdit));
                        // if (typeof valueToEdit === "number") {
                        //     log("total_cus", "in comma error ok", configuration, typeof valueToEdit);
                        //     valueToEdit = numberWithCommas(valueToEdit)
                        // }
                    }
                }
            }
            else {
                valueToEdit = numberWithCommas(valueToEdit);
            }
            
        }
        else if (configuration.includes("toFix")) {
            let fixValue = configuration.split("_")[1];
            if (!fixValue) {
                //default toFixed(2)
                fixValue = 2;
            }
            
            if (replaceValue == true) {
                try {
                    valueToEdit = valueToEdit.replaceAll(`[${key}]`, parseFloat(valueToEdit).toFixed(fixValue));
                }
                catch(ex) {
                    if (ex.message.includes("valueToEdit.replaceAll")) {
                        valueToEdit = valueToEdit.replace(`[${key}]`, parseFloat(valueToEdit).toFixed(fixValue));
                        // if (typeof valueToEdit === "number") {
                        //     valueToEdit = parseFloat(valueToEdit).toFixed(fixValue)
                        // }
                    }
                }
            }
            else {
                log("total_cus", "toFixed", fixValue, typeof valueToEdit, valueToEdit);
                valueToEdit = parseFloat(valueToEdit).toFixed(fixValue);
            }
            
            
        }
    });

    log("total_cus", "config used", valueToEdit);

    return valueToEdit;
}

function initHelperLoad() {
    log("GET", $('[element-type="get"]').children().length);
    if ($('[element-type="get"]').length > 0 ) {
        $('[element-type="get"]').map(function (index, child) {
            const url = child.getAttribute('url');
            let dataKey = child.getAttribute('data-key');
            let spinnerGif = $("div[id='spinner_loader']");
            let tableDiv = $("#table_div");
            let config = getConfig(child.getAttribute('element-config'));

            request(url, 'get', undefined,
                (data) => {
                    log(data);
                    if (data.code === data.negative || data.code === data.error) {
                        showErrorMessage(data);
                    }
                    else {
                        showPositiveMessage(data);
                        if (data.data[dataKey]) {
                            const rows = data.data[dataKey];
                            rows.map(row => {
                                let rowKeys = Object.keys(row);
                                let render = child.getAttribute('render');
                                render = renderHelper(rowKeys, config, row, render);
                                $(child.getAttribute('element-target')).append(render);
                            });
                        }

                    }
                    tableDiv.css('display', 'block');
                    spinnerGif.css('display', 'none');

                },
                (xhr,status,error) => {
                    //fail silently
                    log(JSON.stringify(xhr), JSON.stringify(status), JSON.stringify(error));
                    showErrorMessage(xhr.responseJSON);
                    tableDiv.css('display', 'block');
                    spinnerGif.css('display', 'none');
                },
            );
        });
    }

    if ($('[element-type="get-single"]').children().length > 0 ) {
        const child = $('[element-type="get-single"]')[0];
        let url = child.getAttribute('url');
        let dataKey = child.getAttribute('data-key');
        dataKey = getDataKeyReady(dataKey);
        let elementRender = child.getAttribute('element-render');
        let spinnerGif = $("div[id='spinner_loader']");
        let tableDiv = $("#table_div");
        let config = getConfig(child.getAttribute('element-config'));

        if (url.includes("[__me]")) {
            if (adminData !== undefined && adminData.token) {
                url = url.replace("[__me]", adminData.id);

            }
            else if (userData !== undefined && userData.token) {
                url = url.replace("[__me]", userData.id);
            }

        }

        log(url, dataKey);

        request(url, 'get', undefined,
            (data) => {
                log(data);
                if (data.code === data.negative || data.code === data.error) {
                    showErrorMessage(data);
                }
                else {
                    showPositiveMessage(data);
                    const elementData = $("[element-data]");
                    if (data.data[dataKey]) {
                        const rows = data.data[dataKey];

                        // loop thru all gotten children with selected attr
                        if (elementData.length > 0) {
                            elementData.map((index, child) => {

                                const key = child.getAttribute('element-data');
                                // log("child", child, index, key, rows[key]);
                                if (child.getAttribute('type') === "radio") {
                                //    radio button
                                }

                                let changedValue = rows[key];
                                
                                if (config && Object.keys(config).includes(key)) {
                                    // if (elementRender === "val") {
                                        
                                        if (config[key] === "year_format") {
                                            changedValue = moment(rows[key]).format("YYYY-MM-DD");
                                        }
                                        else if (config[key] === "moment") {
                                            changedValue = moment(rows[key]).fromNow();
                                        }
                                    // }
                                    // else if (elementRender === "html") {
                                    // }
                                }
                                else {
                                    changedValue = rows[key];
                                }


                                if (elementRender === "val") {

                                    if (child.getAttribute('type') === 'radio' && changedValue === child.value) {
                                        child.checked = true;
                                    }
                                    if (child.getAttribute('type') === 'checkbox' && changedValue === child.value) {
                                        child.checked = true;
                                    }
                                    child.value = changedValue;
                                }
                                else {
                                    child.innerText = changedValue;
                                }
                            });
                        }
                    }

                }
                tableDiv.css('display', 'block');
                spinnerGif.css('display', 'none');

            },
            (xhr,status,error) => {
                //fail silently
                log(JSON.stringify(xhr), JSON.stringify(status), JSON.stringify(error));
                showErrorMessage(xhr.responseJSON);
                tableDiv.css('display', 'block');
                spinnerGif.css('display', 'none');
            },
        );
    }

    helperElementSingle();
}

function helperElementSingle(opts=undefined) {
    if (opts === undefined) {
        opts = {};
    }

    if (opts.element === undefined) {
        opts.element = $('[element-type="single-element"]');
    }

    if (opts.element.length > 0 ) {
        opts.element.map(function (index, child) {
            // let url = child.getAttribute('url');
            let url = wrapUrlWithDates(child);
            let dataKey = child.getAttribute('data-key');
            dataKey = getDataKeyReady(dataKey);
            let elementRender = child.getAttribute('element-render');
            let spinnerGif = $("div[id='spinner_loader']");
            let tableDiv = $("#table_div");
            let config = getConfig(child.getAttribute('element-config'));
            let useReplace = child.getAttribute('use-replace');


            log(url, dataKey);

            request(url, 'get', undefined,
                (data) => {
                    log(data);
                    if (data.code === data.negative || data.code === data.error) {
                        // showErrorMessage(data);
                    }
                    else {
                        // showPositiveMessage(data);

                        // getDataReady(data, dataKey);
                        if (!data.data[dataKey]) {
                            const oldData = Object.assign({}, data.data);
                            data.data = {};
                            data.data[dataKey] = oldData;
                        }

                        if (data.data[dataKey]) {
                            const rows = data.data[dataKey];
                            const rowKeys = Object.keys(rows);

                            // loop thru all gotten children with selected attr
                            if (rowKeys.length > 0) {
                                rowKeys.map((index, innerChild) => {
                                    const key = child.getAttribute('element-data');

                                    let changedValue = rows[index][key];
                                    log("total_cus","let changedValue", changedValue);
                                    if (config && Object.keys(config).includes(key)) {

                                        // if (elementRender === "val") {
                                            changedValue = useConfig(rows[index], config, key, useReplace || false, changedValue);
                                            // if (config[key] === "year_format") {
                                            //     changedValue = moment(rows[index][key]).format("YYYY-MM-DD");
                                            // }
                                            // else if (config[key] === "moment") {
                                            //     changedValue = moment(rows[index][key]).fromNow();
                                            // }
                                        // }
                                    }
                                    else {
                                        changedValue = rows[index][key];
                                    }

                                    /*** changedValue = parseFloat(changedValue).toFixed(2); **/


                                    if (elementRender === "val") {

                                        if (child.getAttribute('type') === 'radio' && changedValue === child.value) {
                                            log("radio", changedValue === child.value, child.value, changedValue);
                                            child.checked = true;
                                        }
                                        if (child.getAttribute('type') === 'checkbox' && changedValue === child.value) {
                                            log("radio", changedValue === child.value, child.value, changedValue);
                                            child.checked = true;
                                        }
                                        
                                        child.value = changedValue;
                                    }
                                    else {
                                        child.innerText = changedValue;
                                    }
                                });
                            }
                        }

                    }
                    tableDiv.css('display', 'block');
                    spinnerGif.css('display', 'none');

                },
                (xhr,status,error) => {
                    //fail silently
                    log(JSON.stringify(xhr), JSON.stringify(status), JSON.stringify(error));
                    // showErrorMessage(xhr.responseJSON);
                    tableDiv.css('display', 'block');
                    spinnerGif.css('display', 'none');
                },
            );
        });
    }
}

function helperDelete(e, elem) {
    e.cancelBubble = true;
    e.preventDefault();
    e.stopPropagation();


    let toggle = elem.getAttribute('active') !== undefined;
    let  url = elem.getAttribute('url');
    log(url, toggle, "info");

    request(url, 'get', undefined,
        (data) => {
            log(data);
            if (data.code === data.negative || data.code === data.error) {
                showErrorMessage(data);
            }
            else {
                showPositiveMessage(data);

                elem.setAttribute("active", elem.getAttribute("active") === "true" ? "false" : "true");
                elem.innerText = (elem.getAttribute("active") === "true" ? "Deactivate" : "Activate");

            }
            tableDiv.css('display', 'block');
            spinnerGif.css('display', 'none');

        },
        (xhr,status,error) => {
            //fail silently
            log(JSON.stringify(xhr), JSON.stringify(status), JSON.stringify(error));
            showErrorMessage(xhr.responseJSON);
            tableDiv.css('display', 'block');
            spinnerGif.css('display', 'none');
        },
    );
}

function postWithImage(e, element) {
    const elementData = $("[element-data]");

    let data = {};
    let  url = element.getAttribute('url');

    let postData = new FormData();
    postData.append("a", "a");

    for(let i = 0; i < elementData.length; i++) {
        const childElement = elementData[i];

        log("Elem Data", childElement.getAttribute("element-data"));

        if (childElement.getAttribute('type') === "radio" && !childElement.checked) {
            continue;
        }
        else if (childElement.getAttribute('type') === "file") {
            log(childElement.files, childElement.files.length);
            // image
            if(childElement.files.length !== 0) postData.append(childElement.getAttribute("element-data"), childElement.files[0]);
        }
        else {
            log(typeof  postData, JSON.stringify(postData.keys()));
            if (childElement.getAttribute('type') === "radio" && !childElement.checked) {
                continue;
            }
            postData.append(childElement.getAttribute("element-data"), childElement.value);
        }
    }

    request(url,
        'post',
        postData,
        (data) => {
            log(data);
            if (data.code === data.negative || data.code === data.error) {
                showErrorMessage(data);
            }
            else {showPositiveMessage(data);}

        },
        (xhr,status,error) => {
            //fail silently
            log(JSON.stringify(xhr), JSON.stringify(status), JSON.stringify(error));
            showErrorMessage(xhr.responseJSON);
        },
        undefined,
        "",
        false,
        false,
        ""

    );
}

function post(e, element) {
    const elementData = $("[element-data]");

    let data = {};
    let  url = element.getAttribute('url');

    log("list", elementData, elementData.length);

    for(let i = 0; i < elementData.length; i++) {
        const childElement = elementData[i];

        if (childElement.getAttribute('type') === "radio" && !childElement.checked) {
            continue;
        }
        log("Elem Data", childElement.getAttribute("element-data"));

        data[childElement.getAttribute("element-data")] = childElement.value;
    }
    log("element data", data);

    request(url, 'post',
        data,
        (data) => {
            log(data);
            if (data.code === data.negative || data.code === data.error) {
                showErrorMessage(data);
            }
            else {
                showPositiveMessage(data);

            }
        },
        (xhr,status,error) => {
            //fail silently
            log(JSON.stringify(xhr), JSON.stringify(status), JSON.stringify(error));
            showErrorMessage(xhr.responseJSON);
        },
    );
}

function myListener(event) {
    const element = event.target;

    if (element.getAttribute("element-type") === "post") {
        event.stopPropagation();
        event.preventDefault();

        post(event, element);
    }
    else if (element.getAttribute("element-type") === "post-file") {
        event.stopPropagation();
        event.preventDefault();
        postWithImage(event, element);
    }
    else if (element.getAttribute("element-type") === "delete") {
        event.stopPropagation();
        event.preventDefault();
        helperDelete(event, element);
    }

}

$(document).ready(function () {
    document.addEventListener( "click", myListener );
    initHelperLoad();
});