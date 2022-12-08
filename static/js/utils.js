let dictionary = {
        "prod-postgres-00": "10.0.1.51",
        "prod-routing-00": "10.0.1.42",
        "prod-money-00": "10.0.1.44",
        "prod-memcache-13": "10.0.1.54",
        "prod-dapi-00": "10.0.1.40",
        "prod-geo-04": "10.0.1.52",
        "prod-safety-00": "10.0.1.43",
        "prod-frontend-00": "10.0.1.5",
        "prod-lapi-00": "10.0.1.41",

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

        "cars-car-114": "10.0.2.114",
        "cars-car-128": "10.0.2.128",
        "cars-car-135": "10.0.2.135",
        "cars-car-136": "10.0.2.136",
        "cars-car-177": "10.0.2.177",
        "cars-car-190": "10.0.2.190",
        "cars-car-18": "10.0.2.18",
        "cars-car-21": "10.0.2.21",
        "cars-car-33": "10.0.2.33",
        "cars-car-87": "10.0.2.87",

        "corp-mail-00": "10.0.0.22",
        "corp-people-00": "10.0.0.21",
        "corp-audit-00": "10.0.0.23",
        "corp-wiki-00": "10.0.0.12",
        "corp-helpdesk-00": "10.0.0.11",
        "corp-onramp-00": "10.0.0.176",
        "corp-security-00": "10.0.0.24",
        "corp-talk-00": "10.0.0.20",
        "corp-ad-00": "10.0.0.10",
        "corp-employee-00": "10.0.0.240"
}

const isIP = x => {
    const arr = x.split(".");
    return arr.length === 4;
};
const getIP = (host) => {
    const arr = host.split("-")
    const new_arr = arr.splice(1);
    const teamlessHost = new_arr.join("-");
    return dictionary[teamlessHost];
}

const getHost = (ip) => {
    const team = getTeam();
    const teamlessHost = dictionary[ip];
    return `${team}-${teamlessHost}`
}

const getTeam = () => {
    //todo @adithya
}

const getSubnet = (host) => {
    if (host === undefined && host === null) {
        return null;
    }
    const arr = host.split("-");
    if(arr.length < 4){
        return null
    }
    return arr[1]
}

function get_ip_or_host(x) {
    let ip = dictionary[x.slice(3)]
    let host = ""
    if (ip == null) {
        host = Object.keys(dictionary).find(key => dictionary[key] === x);
        return host
    }
    return ip
}

