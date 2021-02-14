const express = require('express');
const router = express.Router();
router.use(express.json());
const {Genre , validateGenre} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.get('/' , async(req , res) => {
    //throw new Error('could not get genres.');
    const genres = await Genre.find().sort({name: 1}); 
    res.send(genres);
});


router.get('/:id' , async (req , res) => {
    const genreId = req.params.id;
    const genre = await Genre.findById(genreId);
    if(!genre) return res.status(404).send('genre not found!');
    res.send(genre);
});

router.post('/', auth , async (req , res) => {
    const {error} = validateGenre(req.body);

    if(error) return res.status(400).send(error.details[0].message);
        
    let genre = new Genre({name: req.body.name});
    
    genre =  await genre.save();
    res.send(genre);
});

router.put('/:id' , [auth , admin] ,async (req , res) =>{
    const {error} = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id , {name: req.body.name})
    
    if(!genre) return res.status(404).send('The genre with a given id not found!');
    res.send(genre);
});

router.delete('/:id' , [auth , admin] ,async (req , res) =>{
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if(!genre) res.status(404).send('The genre with a given id not found!');
    res.send(genre);
});


module.exports = router;