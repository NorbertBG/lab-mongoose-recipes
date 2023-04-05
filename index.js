const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany()
  })
  .then(() => {
    // Run your code here, after you have insured that the connection was made
    const firstRecipe = {title: "Omelette", level: "Easy Peasy", ingredients: ["eggs", "oil", "salt", "pepper"], cuisine: "french", dishType: "breakfast", duration: 4, creator: "Norbert" }
    Recipe.create(firstRecipe)
      .then(Recipe => console.log("The recipe is saved, and the title is:", Recipe.title))
      .catch(error => console.log ('An error happened while saving a new recipe:', error))

    return Recipe.insertMany(data)
      .then(data => {
         data.forEach( element => {
          console.log("All documents have been inserted and their titles are:", element.title)
          })
        })
      
      .catch(error => console.log("An error happened while saving all the recipies", error))
  })
  
  .then (()=>{
    Recipe.findOneAndUpdate({title: "Rigatoni alla Genovese"}, {duration: 100})
    .then( () => console.log("Updated"))
  })

  .then (() => {
    Recipe.deleteOne({title: "Carrot Cake"})
      .then( () => console.log("deleted"))
  })

  .catch(error => {
    console.error('Error connecting to the database', error);
  });

  process.on('SIGINT', () => {
    mongoose.connection.close().then(() => {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });
