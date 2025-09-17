const express = require('express')
const userController = require('../controllers/user')

const userRouter = express.Router()

userRouter
  .post('/', (req, resp) => {
    userController.create(req.body, (err, res) => {
      let respObj
      if(err) {
        respObj = {
          status: "error",
          msg: err.message
        }
        return resp.status(400).json(respObj)
      }
      respObj = {
        status: "success",
        msg: res
      }
      resp.status(201).json(respObj)
    })
  })
  // .get('/:username', (req, resp, next) => { // Express URL params - https://expressjs.com/en/guide/routing.html
  //   // TODO Create get method API
  //   const username = req.params.username
  // })

  .get('/:username', (req, resp) => {
    const username = req.params.username
  
    // Call the controller to retrieve the user from Redis
    userController.get(username, (err, user) => {
      if (err || !user) {
        return resp.status(404).json({
          status: 'error',
          msg: 'User not found'
        })
      }
      // if the user exists it will return it with HTTP 200
      resp.status(200).json(user)
    })
  })
  
module.exports = userRouter
