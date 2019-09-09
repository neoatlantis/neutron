function changeResponseHeader(originalHeader){
    // original header is an array of objects like
    //  {name: "name", value: "value"}
    const mapping = {
        "Content-Security-Policy": CSP,
    };
    var output = [];
    for(var i in originalHeader){
        if(mapping[originalHeader[i].name] != undefined){
            output.push({
                "name": originalHeader[i].name,
                "value": mapping[originalHeader[i].name],
            });
        } else {
            output.push(originalHeader[i]);
        }
    }
    return output;
}
