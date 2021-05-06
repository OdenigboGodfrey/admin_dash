// slightly modified for proejct
const originalBase = "http://74.208.145.137:8070";

function request(url, type, data, onSuccess=undefined, onError=undefined, baseUrl='', accessToken='', processData=undefined, contentType=undefined, useFetchApi=false) {    
    
    log("url", (originalBase + baseUrl + url));
    url = (originalBase + baseUrl + url);
    //create_date
    
    // ajax
    if (useFetchApi) {
        var myHeaders = new Headers();
        if (accessToken !== "") {
            myHeaders.append("Authorization", "Bearer " + accessToken);
        }
        
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
        method: type.toUpperCase(),
        headers: myHeaders,
        body: data,
        redirect: 'follow',
        };


        fetch(url, {...requestOptions})
        .then(response => response.json())
        .then(result => {
            log("total_cus", result, url);
            console.log("ero", result, url);
            if (onSuccess !== undefined) {
                result.positive = positive;
                result.neutral = neutral;
                result.negative = negative;
                result.error = error;
                onSuccess(result);
            }
        })
        .catch(error => {
            // log(error);
            log("total_cus", error);
            console.log("ero", error);
            if (onError !== undefined) {
                const xhr = {"responseJSON": {}};
                
                if (xhr.responseJSON !== undefined) {
                    xhr.responseJSON.positive = positive;
                    xhr.responseJSON.neutral = neutral;
                    xhr.responseJSON.negative = negative;
                    xhr.responseJSON.error = error;
                }

                onError(xhr, false, error);
            }
        });
    }
    else {
        let content  = {
            type: type.toUpperCase(),
            data: data,
            success: function(result){
                log(result, url);
                if (onSuccess !== undefined) {
                    result.positive = positive;
                    result.neutral = neutral;
                    result.negative = negative;
                    result.error = error;
                    onSuccess(result);
                }
            },
            error: function (xhr,status,error) {
                log("total_cus", xhr,status,error);
                if (onError !== undefined) {
                    if (xhr.responseJSON !== undefined) {


                        xhr.responseJSON.positive = positive;
                        xhr.responseJSON.neutral = neutral;
                        xhr.responseJSON.negative = negative;
                        xhr.responseJSON.error = error;
                    }

                    if(status === "timeout") {
                        // alert("got timeout");
                    }

                    onError(xhr,status,error);
                }

            },
            timeout: 120000
        };


        if (accessToken !== '') {
            if (content.headers === undefined) {
                content.headers = {};
            }
            content['headers']['Authorization'] = 'Bearer ' + accessToken;
        }
        else {
            if (accessToken !== false) {}
        }

        if (processData !== undefined) {
            content.processData = processData;
            
        }

        if (contentType !== undefined) {
            content.contentType = contentType;
        }

        $.ajax(url, content);
    }
}

function getParam(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

function fetchRequest(
    Url,
    Data,
    method = "POST",
    Base='/api/v1',
    accessToken='',
    contentType='multipart/form-data',

) {
    const token = accessToken;
    let headers = {};
    log("url", Base+Url, Data);

    headers["Content-Type"] = contentType;

    headers["Access-Control-Allow-Origin"] = "*";

    if (accessToken !== "") {
        headers["Authorization"] = "Bearer " + token;
    }

    return fetch(Base + Url, {
        method: method,
        headers: headers,
        body: Data,
    })
        .then((response) => {
            log("returned json", response);
            return response.json();
        })
        .then((data) => {

            log("returned data", data);
            return data
        })
        .catch((error) => {
            return error
        })
}