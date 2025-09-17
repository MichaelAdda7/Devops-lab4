const { expect } = require('chai')
const userController = require('../src/controllers/user')
const db = require('../src/dbClient')

describe('User', () => {

  beforeEach(() => {
    // Clean DB before each test
    db.flushdb()
  })

  describe('Create', () => {

    it('create a new user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null)
        expect(result).to.be.equal('OK')
        done()
      })
    })

    it('passing wrong user parameters', (done) => {
      const user = {
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      userController.create(user, (err, result) => {
        expect(err).to.not.be.equal(null)
        expect(result).to.be.equal(null)
        done()
      })
    })

    it('avoid creating an existing user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      // First create the user
      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null)
        expect(result).to.be.equal('OK')

        // Try to create again
        userController.create(user, (err2, result2) => {
          expect(err2).to.not.be.equal(null)
          expect(err2.message).to.equal('User already exists')
          expect(result2).to.be.equal(null)
          done()
        })
      })
    })

    // Create test for the get method
    describe('Get', () => {

      it('get a user by username', (done) => {
        const user = {
          username: 'sergkudinov',
          firstname: 'Sergei',
          lastname: 'Kudinov'
        }

        // First, create a user
        userController.create(user, (err, result) => {
          expect(err).to.be.equal(null)
          expect(result).to.be.equal('OK')

          // Then, get the user
          userController.get('sergkudinov', (err2, result2) => {
            expect(err2).to.be.equal(null)
            expect(result2).to.deep.equal(user)
            done()
          })
        })
      })

      it('cannot get a user when it does not exist', (done) => {
        userController.get('unknownuser', (err, result) => {
          expect(err).to.not.be.equal(null)
          expect(err.message).to.equal('User not found')
          expect(result).to.be.equal(null)
          done()
        })
      })

    })
  })
})
