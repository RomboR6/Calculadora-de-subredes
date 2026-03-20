document.getElementById("subnetForm").addEventListener("submit", function(e) {
e.preventDefault();

const ip = document.getElementById("ip").value;
const prefix = parseInt(document.getElementById("prefix").value);
const subnets = parseInt(document.getElementById("subnets").value);

const extraBits = Math.ceil(Math.log2(subnets));
const newPrefix = prefix + extraBits;
const mask = prefixToMask(newPrefix);

const ipParts = ip.split(".").map(Number);
let ipNum = (ipParts[0]<<24) | (ipParts[1]<<16) | (ipParts[2]<<8) | ipParts[3];

const blockSize = Math.pow(2, 32 - newPrefix);

const tbody = document.getElementById("resultBody");
tbody.innerHTML = "";

for (let i = 0; i < subnets; i++) {
    const netAddr = ipNum + (i * blockSize);
    const broadcast = netAddr + blockSize - 1;
    const firstHost = netAddr + 1;
    const lastHost = broadcast - 1;

    tbody.innerHTML += `
    <tr>
        <td>${i+1}</td>
        <td>${numToIp(netAddr)}</td>
        <td>${numToIp(firstHost)}</td>
        <td>${numToIp(lastHost)}</td>
        <td>${numToIp(broadcast)}</td>
        <td>${mask}</td>
        <td>/${newPrefix}</td>
    </tr>
    `;
}
});

function prefixToMask(prefix) {
let mask = [];
for (let i = 0; i < 4; i++) {
    const bits = Math.min(8, prefix);
    mask.push(bits === 0 ? 0 : 256 - Math.pow(2, 8 - bits));
    prefix -= bits;
}
return mask.join(".");
}

function numToIp(num) {
return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255
].join(".");
}
