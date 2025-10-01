const app = require('../src/index')
const chai = require('chai')
const chaiHttp = require('chai-http')
const db = require('../src/dbClient')

chai.use(chaiHttp)

describe('User REST API', () => {
  
    beforeEach(() => {
      // Clean DB before each test
      db.flushdb()
    })
    
    after(() => {
      app.close()
      db.quit()
    })

  describe('POST /user', () => {

    it('create a new user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(201)
          chai.expect(res.body.status).to.equal('success')
          chai.expect(res).to.be.json
          done()
        })
        .catch((err) => {
           throw err
        })
    })
    
    it('pass wrong parameters', (done) => {
      const user = {
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(400)
          chai.expect(res.body.status).to.equal('error')
          chai.expect(res).to.be.json
          done()
        })
        .catch((err) => {
           throw err
        })
    })
  })

// 2 API tests for the GET /user/:username
  describe('GET /user/:username', () => {

// First test for successfully retriev an existing user
  it('successfully gets an existing user', (done) => {
    const user = {
      username: 'Micky',
      firstname: 'Michael',
      lastname: 'Adda'
    }

    // create a user with POST /user so we can fetch it afterwards
    chai.request(app)
      .post('/user')
      .send(user)
      .then(() => {
        
        //  request the same user with GET /user/Micky
        return chai.request(app)
          .get('/user/Micky')
      })
      .then((res) => {
        chai.expect(res).to.have.status(200)
        chai.expect(res).to.be.json
        chai.expect(res.body.username).to.equal('Micky')
        chai.expect(res.body.firstname).to.equal('Michael')
        chai.expect(res.body.lastname).to.equal('Adda')
        done()
      })
      .catch(err => { throw err })
  })

// Second test should return 404 when the user does not exist 
  it('returns 404 when user does not exist', (done) => {
    chai.request(app)
      .get('/user/ghost')
      .then((res) => {
        chai.expect(res).to.have.status(404)
        chai.expect(res.body.status).to.equal('error')
        done()
      })
      .catch(err => { throw err })
  })

})

})
