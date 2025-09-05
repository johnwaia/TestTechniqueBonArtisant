const express = require('express')
const router = express.Router()

const  { 
    getusers,
    getuser,
    createuser,
    updateuser,
    deleteuser 
} = require('../controllers/users.js')

router.get('/', getusers)

router.get('/:userID', getuser)

router.post('/', createuser) 

router.put('/:userID', updateuser) 

router.delete('/:userID', deleteuser)

module.exports = router
