const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const express = require('express');
const bodyParser = require('body-parser')
app = express();

const port = 2016;
const connectionString = 'mongodb://localhost:27020/People';

app.use( bodyParser.urlencoded({ extended: false }))
app.use( bodyParser.json())

mongo.connect(connectionString, function(err, dbParent)
{
   
    if(err) console.log('cannot connect ' + err.message);
    else
    {
         // get reference to db collection
        const myDb = dbParent.db('People');
        const contacts = myDb.collection('contacts');
        
        // insert
        app.post('/api/contacts', function(req, res)
        {
            let contact = req.body;
    
            contacts.insert(contact, function(err, result){
                if(!err) res.send(contact);
                else throw(err)
    
            })
            
        });

        // get
        app.get('/api/contacts', function(req, res){
            contacts.find().toArray( function(err, result){
                res.send(result)
            })
        })

         // delete
        app.delete('/api/contacts/:id', function(req, res)
        {        
            var id = new ObjectId( req.params.id);
            
            try 
            {
                // let deleteResult = 
                contacts.deleteOne({_id: id}, function(err, results) 
                {
                    if(err)
                    {
                        console.log('error on delete: ' + err)
                        throw err;
                    }
                    console.log(results.result);
                    res.send(results.result);
                    // +' ' + results.result.writeErrors
                });
                
            } catch (e) 
            {
                console.log('exception: ' + e);
            }
            
        })

     // update
     app.put('/api/contacts/:id', function(req, res)
     {        
         try 
         { 
            var id = new ObjectId( req.params.id);
            var newContact = req.body;
            
            contacts.update({_id: id}, { $set: newContact }, function(err, results) 
            {
                 if(err)
                 {
                     console.log('error on delete: ' + err);
                     throw err;
                 }
                 console.log(results.result);
                 res.send( newContact );
                
            });
             
         }catch (e) 
         {
             console.log('exception: ' + e);
         }

    });


        

    }
});

// file serving
// var cwd = process.cwd();

// // static file serving
// app.use(express.static('public'));

// // api that receives the requests

// app.get('/home', function(req, res){
//     res.sendFile( cwd + '/public/index.html');
// });




// app.get('/:name', function(req, res){
//     let name = req.params.name;
//     res.send('name: ' + name);
// });

// app.get('/about', function(req, res){
//     res.send('hello from about');
// });

app.listen(port, () => {
    console.log(`Server started on port `+ port);
});

