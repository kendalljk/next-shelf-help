export function setCorsHeaders(res) {
    res.setHeader("Access-Control-Allow-Origin", `*`);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
