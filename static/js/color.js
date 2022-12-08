const prod_hosts = getAllTeamlessHosts().filter(d => getSubnet(`t-${d}`) === "prod");
prod_hosts.sort()

const auto_hosts = getAllTeamlessHosts().filter(d => getSubnet(`t-${d}`) === "auto");
auto_hosts.sort()

const corp_hosts = getAllTeamlessHosts().filter(d => getSubnet(`t-${d}`) === "corp");
corp_hosts.sort()

const vdi_hosts = getAllTeamlessHosts().filter(d => getSubnet(`t-${d}`) === "vdi");
vdi_hosts.sort()

const prod_color = d3.scaleOrdinal()
    .domain(prod_hosts)
    .range(d3.schemeReds[9])

const auto_color = d3.scaleOrdinal()
    .domain(auto_hosts)
    .range(d3[`schemePurples`][9])

const corp_color = d3.scaleOrdinal()
    .domain(corp_hosts)
    .range(d3[`schemeOranges`][9])


const vdi_color = d3.scaleOrdinal()
    .domain(vdi_hosts)
    .range(d3[`schemeBlues`][9])



function getColor(hostOrIp) {
    const host = isIP(hostOrIp) ? getHost(hostOrIp) : hostOrIp;
    const subnet = getSubnet(host);
    const teamlessHost = getTeamlessHost(host)

    switch (subnet) {
        case "prod": {
            return prod_color(teamlessHost)
        }
        case "auto": {
            return auto_color(teamlessHost)
        }
        case "vdi": {
            return vdi_color(teamlessHost)
        }
        case "corp": {
            return corp_color(teamlessHost)
        }
        default: {
            return "black"
        }
    }
}


