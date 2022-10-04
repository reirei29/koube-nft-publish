import {body} from "express-validator"

const addPostValidator = () => {
    return [
        body('name', 'name doesn\'t exists').exists(),
        body('description', 'description doesn\'t exists').exists(),
    ]
}

export default {addPostValidator}
