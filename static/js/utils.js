let hostToIP = {
        "prod-postgres-00": "10.0.1.51",
        "prod-routing-00": "10.0.1.42",
        "prod-money-00": "10.0.1.44",
        "prod-memcache-13": "10.0.1.54",
        "prod-dapi-00": "10.0.1.40",
        "prod-geo-04": "10.0.1.52",
        "prod-geo-05": "10.0.1.53",
        "prod-safety-00": "10.0.1.43",
        "prod-frontend-00": "10.0.1.5",
        "prod-lapi-00": "10.0.1.41",
        "prod-trackdash-00": "10.0.1.46",


        "vdi-kali01": "10.0.254.201",
        "vdi-kali02": "10.0.254.202",
        "vdi-kali03": "10.0.254.203",
        "vdi-kali04": "10.0.254.204",
        "vdi-kali05": "10.0.254.205",
        "vdi-kali06": "10.0.254.206",
        "vdi-win01": "10.0.254.101",
        "vdi-win02": "10.0.254.102",
        "vdi-win03": "10.0.254.103",
        "vdi-win04": "10.0.254.104",
        "vdi-win05": "10.0.254.105",
        "vdi-win06": "10.0.254.106",

        "auto-car-114": "10.0.2.114",
        "auto-car-128": "10.0.2.128",
        "auto-car-135": "10.0.2.135",
        "auto-car-136": "10.0.2.136",
        "auto-car-177": "10.0.2.177",
        "auto-car-190": "10.0.2.190",
        "auto-car-18": "10.0.2.18",
        "auto-car-21": "10.0.2.21",
        "auto-car-33": "10.0.2.33",
        "auto-car-87": "10.0.2.87",

        "corp-mail-00": "10.0.0.22",
        "corp-people-00": "10.0.0.21",
        "corp-audit-00": "10.0.0.23",
        "corp-wiki-00": "10.0.0.12",
        "corp-helpdesk-00": "10.0.0.11",
        "corp-onramp-00": "10.0.0.176",
        "corp-security-00": "10.0.0.24",
        "corp-talk-00": "10.0.0.20",
        "corp-ad-00": "10.0.0.10",
        "corp-employee-00": "10.0.0.240",
        "corp-employee-01": "10.0.0.241",
        "corp-employee-03": "10.0.0.243",
        "corp-employee-04": "10.0.0.244",

}

let ipToHost = {}
let _k = Object.keys(hostToIP)
for(var i = 0; i < _k.length; i++ ) {
    const ip = hostToIP[_k[i]]
    ipToHost[ip] = _k[i]
}

const isIP = x => {
    const arr = x.split(".");
    return arr.length === 4;
};
const getIP = (host) => {
    const arr = host.split("-")
    const new_arr = arr.splice(1);
    const teamlessHost = new_arr.join("-");
    return hostToIP[teamlessHost];
}

const getHost = (ip) => {
    const team = getTeam();
        const teamlessHost = ipToHost[ip];
    return `${team}-${teamlessHost}`
}

const getTeam = () => {
    //todo @adithya
    return document.getElementById("team");
}

const getSubnet = (host) => {
    if (host === undefined || host === null) {
        return null;
    }
    const arr = host.split("-");
    if(arr.length < 2){
        return null
    }
    return arr[1]
}

const getAllTeamlessHosts = () => {
    const teamlessHosts = Object.keys(hostToIP).filter(hostOrIP => hostOrIP.split(".").length !== 3).map(d => d);
    return [...new Set(teamlessHosts)]
}

const getTeamlessHost = (host) => {
    const arr = host.split("-")
    const new_arr = arr.splice(1);
    return new_arr.join("-");
}

function get_ip_or_host(x) {
    let ip = hostToIP[x.slice(3)]
    let host = ""
    if (ip == null) {
        host = Object.keys(hostToIP).find(key => hostToIP[key] === x);
        return host
    }
    return ip
}

