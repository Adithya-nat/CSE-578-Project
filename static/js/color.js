const prod_hosts = getAllTeamlessHosts().filter(d => getSubnet(d) === "prod");
prod_hosts.sort()

const auto_hosts = getAllTeamlessHosts().filter(d => getSubnet(d) === "auto");
auto_hosts.sort()

const corp_hosts = getAllTeamlessHosts().filter(d => getSubnet(d) === "corp");
corp_hosts.sort()

const vdi_hosts = getAllTeamlessHosts().filter(d => getSubnet(d) === "vdi");
vdi_hosts.sort()

const prod_color = d3.scaleOrdinal()
    .domain(prod_hosts)
    .range(d3[`schemeReds`][15])

const auto_color = d3.scaleOrdinal()
    .domain(prod_hosts)
    .range(d3[`schemePurples`][15])

const corp_color = d3.scaleOrdinal()
    .domain(prod_hosts)
    .range(d3[`schemeOranges`][15])

const vdi_color = d3.scaleOrdinal()
    .domain(prod_hosts)
    .range(d3[`schemeBlues`][15])



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


