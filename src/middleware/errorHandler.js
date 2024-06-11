const errorHandler = (err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        message: "Something went wrong!",
        errror: err.message
    })
}

export default errorHandler