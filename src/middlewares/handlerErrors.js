const handlerErrors = (error, req, res, next) => {

        try {
            const errorStatus = error.status || 500
            const errorMessage = error.message || "Algo salió mal";

            res.status(errorStatus).json({
                success: false,
                status: errorStatus,
                message: errorMessage,
                stack: error.stack
            })
            next()
        } catch (error) {
            return error
        }
        

        
}

export default handlerErrors;