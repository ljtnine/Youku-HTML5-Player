let reqOrigin={};

chrome.webRequest.onBeforeSendHeaders.addListener(function(detail){
    for(let i of detail.requestHeaders){
        if(i.name.toLowerCase() == 'origin'){
            reqOrigin[detail.requestId] = i.value;
            return;
        }
    }
},{urls:[
    '*://ups.youku.com/ups/get.json*'
]},[
    'requestHeaders'
])

chrome.webRequest.onHeadersReceived.addListener(function(detail){
    if(!reqOrigin[detail.requestId])
        return;
    detail.responseHeaders.push({
        name:'Access-Control-Allow-Origin',
        value:reqOrigin[detail.requestId]
    });
    detail.responseHeaders.push({
        name:'Access-Control-Allow-Credentials',
        value:'true'
    });
    delete reqOrigin[detail.requestId];
    return {
        responseHeaders:detail.responseHeaders
    }
},{urls:[
    '*://ups.youku.com/ups/get.json*'
]},[
    'blocking',
    'responseHeaders'
])