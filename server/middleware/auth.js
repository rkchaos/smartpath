
const jwt = require("jsonwebtoken")
const Client = require("../models/Clients")

const auth = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken;
        if (!accessToken) return res.status(402).json({ message: "Unauthorized access" });

        try {
            const decodedData = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const client = await Client.findById(decodedData?._id).select("-password -refreshToken");
            if (!client) return res.status(409).json({ message: "Invalid token credentials." });

            req.client = client;
        } catch (error) {
            const incomingRefreshToken = req.cookies?.refreshToken;
            if (!incomingRefreshToken) return res.sendStatus(401, "Unauthorized access err");

            const decodedData = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
            const client = await Client.findById(decodedData?._id).select("-password");
            if (!client) return res.status(409).json({ message: "Invalid token credentials." });

            if (incomingRefreshToken !== client.refreshToken) return res.status(401).json({ message: "Refresh token has expired" });

            req.client = client;
            req.refreshedAccessToken = true;
        }
        next();
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}
module.exports = {
    auth
}