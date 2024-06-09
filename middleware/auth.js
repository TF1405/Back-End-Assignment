import jwt from "jsonwebtoken";

const midAuthenticator = function(req, res, next) {

    //mendapatkan token dari header
    const token = req.header("x-auth-token")
    

    //cek apakah token sudah sesuai
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' })
    }

    //verifikasi token
    try {
        const decoded = jwt.verify(token, "kode_rahasia");
        req.user = decoded.user;
        next()
    }

    catch (err) {
        res.status(401).json({msg: "Token is not valid"})
    }
};

export default midAuthenticator;