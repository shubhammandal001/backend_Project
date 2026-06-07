class apiError extends Error {
    constructor(
        statuscode,
        message = "something went wrong",
        stack="",
        error = []
    ){
        super(message)
        this.statuscode = statuscode
        this.message= message
        this.data = null
        this.error = error
        this.success = false

        if (stack) {
             this.stack = stack
        } else {
            Error.captureStackTrace(this,this.constructor)
        }

    }

    
}

export {apiError}