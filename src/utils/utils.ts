export function getQueryVariable(constiable) {
    const query = window.location.search.substring(1);
    const consts = query.split("&");
    for (let i=0;i<consts.length; i++) {
        const pair = consts[i].split("=");
        if(pair[0] === constiable){return pair[1];}
    }
    return false;
}
