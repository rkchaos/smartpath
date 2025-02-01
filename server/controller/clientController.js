
const jwt = require("jsonwebtoken")
const Client = require("../models/Clients")
// set cokkies for 7days

const cookiesOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000
};
// Client info
const condenseClientInfo = (client) => {
    const clientSessionObj = {
        _id: client._id,
        name: client.name,
        email: client.email,
    };
    return clientSessionObj;
}
const generateAccessAndRefreshTokens = async (client) => {
    try {
        const accessToken = await client.generateAccessToken();
        const refreshToken = await client.generateRefreshToken();

        client.refreshToken = refreshToken;
        await client.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) { return null }
}
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            const missingFields = [];
            if (!name) missingFields.push("name")
            if (!email) missingFields.push("email")
            if (!password) missingFields.push("password")
            return res.status(400).json({
                message: `The following fields are required: ${missingFields.join(", ")}`,
            });
        }

        const isClientEmailUnique = await Client.findOne({ email });
        if (isClientEmailUnique) return res.status(400).json({ message: 'Email already registered. Login again' });

        const newClient = await Client.create({
            name: name,
            email: email,
            password: password
        });

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(newClient);
        const clientInfo = condenseClientInfo(newClient);

        res.status(200)
            .cookie('accessToken', accessToken, cookiesOptions)
            .cookie('refreshToken', refreshToken, cookiesOptions)
            .json(clientInfo);
    } catch (error) {
        console.error(error);
        res.status(503).json({ message: 'Network error. Try agin' });
    }
}
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;
    
        if (!email || !password) {
            const missingFields = []
            if (!email) missingFields.push("email")
            if (!password) missingFields.push("password")
            return res.status(400).json({
                message: `The following fields are required: ${missingFields.join(", ")}`,
            });
        }
       
        const checkForEmail = await Client.findOne({ email });
        if (!checkForEmail) return res.status(404).json({ message: 'No such client found' });

        let existingClient;
        if (checkForEmail) existingClient = checkForEmail;
        // isPasswordCorrect define in Client.js model
        const isPasswordCorrect = await existingClient.isPasswordCorrect(password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(existingClient);
        const clientInfo = condenseClientInfo(existingClient);

        res.status(200)
            .cookie('accessToken', accessToken, cookiesOptions)
            .cookie('refreshToken', refreshToken, cookiesOptions)
            .json(clientInfo);
    }
    catch (error) {
        console.error(error);
        res.status(503).json({ message: 'Network error. Try agin' });
    }
}
exports.logout = async (req, res) => {
    try {
        await Client.findByIdAndUpdate(
            req.client._id,
            {
                $set: { refreshToken: null }
            }
        );
        res.status(200)
        .clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'None' }) 
        .clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'None' }) 
            .json({ message: 'Successfully logged out' });
    } catch (error) {
        console.error(error);
        res.status(503).json({ message: 'Network error. Try again' });
    }
};
exports.alluser = async (req, res) => {
    try {
        const allUser = await Client.find({}).select("name email")
        // console.log(req.client) -> to get current user 
        res.status(200).json(allUser)
    }
    catch (err) {
        console.error(err);
        res.status(503).json({ message: 'Network error. Try again' });

    }
}