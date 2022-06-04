const router = require('express').Router()
//const places = require('../models/places.js')
const Places = require('../models/places.js')
const oldPlaces = require('../models/old_places.js')

// INDEX page
router.get('/', async (req, res) => {
  try {
    const places = await Places.find()
    //Right here is a problem
    res.render('index', {
      place: places,
      name: 'name',
      city: 'city',
      state: 'state',
      cuisines: 'cuisines',
      pic: 'pic'
    })
  } catch (error) {
    console.log(error)
    res.render('error404')
  }
})

// Add new Place page
router.get('/new', (req, res) => {
  res.render('places/new')
})

// Seed DB
router.get('/seed', async (req, res) => {
  try {
    await Places.insertMany(oldPlaces)
    res.redirect('./')
  } catch (error) {
    console.log(error)
    res.render('error404')
  }
})

// Show page 
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const places = await Places.findById(id)
    .populate('places')
    .then(foundPlaces => {
      res.render('index', {
        places: foundPlaces
      })
    })
  } catch (error) {
    console.log(error)
    res.render('error404')
  }
})

router.post('/', (req, res) => {
  if (!req.body.pic) {
    // Default image if one is not provided
    req.body.pic = "./public/images/IMG_20191125_184836031.jpg"
  }
  if (!req.body.city) {
    req.body.city = 'Anytown'
  }
  if (!req.body.state) {
    req.body.state = 'USA'
  }
  Places.push(req.body)
  res.redirect('/places')
})

router.get('/places/:id', (req, res) => {
  const { id } = req.params.id
  res.render('show', {
    places: Places[id],
    index: id
  })
})

router.delete('/:id', (req, res) => {
  let id = Number(req.params.id)
  if (isNaN(id)) {
    res.render('error404')
  }
  else if (!Places[id]) {
    res.render('error404')
  }
  else {
    Places.splice(id, 1)
    res.redirect('/places')
  }
})

router.get('/:id/edit', (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    console.log("why?", id)
    res.render('error404')
  } else if (!Places[id]) {
    console.log(id)
    res.render('error404')
  } else {
    res.render('places/edit', { place: Places[id], id })
  }
})

router.put('/id', (req, res) => {
  const id = req.params
    res.render('edit', {
      places: Places[id],
      index: id
    })
})

module.exports = router
