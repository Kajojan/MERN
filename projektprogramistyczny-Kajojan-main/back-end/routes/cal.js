const express = require('express')
const auth = require('../auth')
const {
    createUser,
    getCallendars,
    getAllEvents,
    deleteEvent,
    addEvent,
    login,
    addCal,
    deleteCal,
    editevent,
    logout,
    loggedIn,
    deluser,
    changerole,
    raport,
    file,upload,
} = require('../controllers/calControllers')

const router = express.Router()

router.put('/:user_id', auth ,addCal)

router.get('/:user_id',auth ,getCallendars)

router.get('/:user_id/:cal_id',auth ,getAllEvents)

router.post('/', createUser)

router.post('/:login', login)

router.get("/", logout)

router.get("/if/logged/in", loggedIn)

router.put('/:user_id/:cal_id/:month_id/:day_id/',auth , addEvent)

router.delete('/:user_id/:cal_id/:month_id/:day_id/:event_id',auth ,deleteEvent)

router.delete('/:user_id/:cal_id',auth , deleteCal)

router.put('/:user_id/:cal_id/:month_id/:day_id/:event_id',auth ,editevent)

router.delete(`/:user_id/:cal_id/:role/:index`,auth , deluser)

router.put(`/change/role/:user_id/:cal_id/:role/:index` , changerole)

router.get('/do/a/raport/:user_id', raport)

router.post('/upload/file', upload.single("file"), file)



module.exports = router