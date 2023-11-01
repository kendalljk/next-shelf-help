export function setCorsHeaders(res) {
    res.setHeader("Access-Control-Allow-Origin", `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
