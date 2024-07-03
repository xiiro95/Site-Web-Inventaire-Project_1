const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

// Configuration de multer pour le téléchargement de fichiers
const upload = multer({ dest: 'uploads/' });




const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Créer une connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'inventaire2'
});

// Connectez-vous à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.stack);
    return;
  }
  console.log('Connecté en tant que ID ' + connection.threadId);
});

app.post('/importCSV', upload.single('csv_file'), (req, res) => {
  const filePath = req.file.path;

  // Lecture du fichier CSV
  const results = [];
  fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
          // Insertion des données dans la base de données
          console.log(results);
          results.forEach(person => {
              const name = Object.values(person)[0]; // Première colonne pour le nom
              const email = Object.values(person)[1] || null; // Deuxième colonne pour l'email, ou null si absent
              const query = 'INSERT INTO persons (name, email) VALUES (?, ?)';
              connection.execute(query, [name, email], (err, results) => {
                  if (err) {
                      console.error('Erreur lors de l\'insertion de données:', err);
                  }
              });
          });

          // Suppression du fichier temporaire
          fs.unlinkSync(filePath);

          res.status(200).send('Importation réussie');
      });
});




// Endpoint pour insérer des données
app.post('/addUser', (req, res) => {
  const { name, email } = req.body;
  const insertQuery = 'INSERT INTO users (name, email) VALUES (?, ?)';
  connection.execute(insertQuery, [name, email], (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de l\'insertion de données');
      return;
    }
    res.status(200).send(`Ligne insérée, ID: ${results.insertId}`);
  });
});

app.post('/updateitemtracking', (req, res) => {
  console.log(req.body);
  const { item_id, person_id } = req.body;
  console.log(item_id + " " + person_id);

  // Appel de la procédure stockée pour attribuer un item à une personne
  const query = 'CALL assign_item_to_person(?, ?)';
  connection.execute(query, [item_id, person_id], (err, results) => {
      if (err) {
          console.log("Je suis la");
          console.error(err); // Il est utile de logger l'erreur pour le débogage
          res.status(500).send('Erreur lors de la mise à jour des données');
          return;
      }
      console.log("Tout se passe bien");
      res.status(200).json({ message: 'Ligne mise à jour, affectée: ' + results.affectedRows });
  });
});

app.post('/updateprofil', (req, res) => {
  console.log(req.body);
  const { person_id, name, email} = req.body;
 
  // Requête SQL avec des placeholders pour les paramètres
  const updateQuery = `UPDATE persons SET name = ?, email = ? WHERE person_id = ?;`;

  // Exécution de la requête avec les paramètres fournis de manière sécurisée
  connection.execute(updateQuery, [name, email, person_id], (err, results) => {
    if (err) {
      console.log("Je suis la");
      console.error(err); // Il est utile de logger l'erreur pour le débogage
      res.status(500).send('Erreur lors de la mise à jour des données');
      return;
    }
    console.log("Tout ce passe bien");
    res.status(200).json({ message: 'Ligne mise à jour, affectée: ' + results.affectedRows });
  });
});

app.post('/updateitem', (req, res) => {
  console.log(req.body);
  const { location_id, numero_de_serie, description, item_id } = req.body;
 
  // Requête SQL avec des placeholders pour les paramètres
  const updateQuery = `UPDATE items SET location_id = ?, serial_number = ?, description = ? WHERE item_id = ?;`;

  // Exécution de la requête avec les paramètres fournis de manière sécurisée
  connection.execute(updateQuery, [location_id, numero_de_serie, description, item_id], (err, results) => {
    if (err) {
      console.log("Erreur lors de la mise à jour des données de l'item");
      console.error(err); // Il est utile de logger l'erreur pour le débogage
      res.status(500).send('Erreur lors de la mise à jour des données');
      return;
    }
    console.log("Mise à jour de l'item réussie");
    res.status(200).json({ message: 'Item mis à jour, lignes affectées: ' + results.affectedRows });
  });
});




app.post('/updatelocation', (req, res) => {
  console.log(req.body);
  const { name, location_id } = req.body;
 
  // Requête SQL avec des placeholders pour les paramètres
  const updateQuery = `UPDATE locations SET location_name = ? WHERE location_id = ?;`;
  
  // Exécution de la requête avec les paramètres fournis de manière sécurisée
  connection.execute(updateQuery, [name, location_id], (err, results) => {
    if (err) {
      console.log("Je suis la");
      console.error(err); // Il est utile de logger l'erreur pour le débogage
      res.status(500).send('Erreur lors de la mise à jour des données');
      return;
    }
    console.log("Tout ce passe bien");
    res.status(200).json({ message: 'Ligne mise à jour, affectée: ' + results.affectedRows });
  });
});

app.post('/updatecategorie', (req, res) => {
  console.log(req.body);
  const { name, category_id } = req.body;
 
  // Requête SQL avec des placeholders pour les paramètres
  const updateQuery = `UPDATE categories SET name = ? WHERE category_id = ?;`;
  
  // Exécution de la requête avec les paramètres fournis de manière sécurisée
  connection.execute(updateQuery, [name, category_id], (err, results) => {
    if (err) {
      console.log("Je suis la");
      console.error(err); // Il est utile de logger l'erreur pour le débogage
      res.status(500).send('Erreur lors de la mise à jour des données');
      return;
    }
    console.log("Tout ce passe bien");
    res.status(200).json({ message: 'Ligne mise à jour, affectée: ' + results.affectedRows });
  });
});

app.post('/updateremoveItemperson', (req, res) => {
  console.log(req.body);
  const {item_id} = req.body;
  console.log("Je suis dans le remove");
  console.log(item_id);
  // Appell d'une procedure sql (Bien déclarer)
  const updateQuery = 'CALL return_item_to_stock(?)';

  // Exécution de la requête avec les paramètres fournis de manière sécurisée
  connection.execute(updateQuery, [item_id], (err, results) => {
    if (err) {
      console.log("Je suis la");
      console.error(err); // Il est utile de logger l'erreur pour le débogage
      res.status(500).send('Erreur lors de la mise à jour des données');
      return;
    }

    console.log("Tout ce passe bien");
    res.status(200).json({ message: 'Ligne mise à jour, affectée: ' + results.affectedRows });
  });
});


app.post('/addprofil', (req, res) => {
  console.log(req.body);
  const { name, email } = req.body;

  // Appel de la procédure stockée pour ajouter un profil
  const query = 'CALL AddProfile(?, ?)';
  connection.execute(query, [name, email], (err, results) => {
    if (err) {
      console.error(err); // Logger l'erreur pour le débogage
      res.status(500).json({ error: err.sqlMessage || 'Erreur lors de l\'ajout du profil' });
      return;
    }
    console.log("Tout se passe bien");
    res.status(200).json({ message: 'Profil ajouté avec succès' });
  });
});


app.post('/addCategory', (req, res) => {
  const { name } = req.body;
  const query = 'INSERT INTO categories (name) VALUES (?)';
  connection.execute(query, [name], (err, results) => {
      if (err) {
          res.status(500).send('Erreur lors de l\'ajout de la catégorie');
          return;
      }
      
      res.status(200).json({ message: `Catégorie ajoutée, ID: ${results.insertId}` });
      //res.status(200).send(`Catégorie ajoutée, ID: ${results.insertId}`);
  });
});

app.post('/editCategory', (req, res) => {
  const { id, name } = req.body;
  const query = 'UPDATE categories SET name = ? WHERE id = ?';
  connection.execute(query, [name, id], (err, results) => {
      if (err) {
          res.status(500).send('Erreur lors de la mise à jour de la catégorie');
          return;
      }
      res.status(200).json({ message: 'Catégorie mise à jour' });
     // res.status(200).send('Catégorie mise à jour');
  });
});

app.post('/deleteCategory', (req, res) => {
  const { id } = req.body;
  const query = 'DELETE FROM categories WHERE id = ?';
  connection.execute(query, [id], (err, results) => {
      if (err) {
          res.status(500).send('Erreur lors de la suppression de la catégorie');
          return;
      }
      res.status(200).json({ message: 'Catégorie supprimée' });
      //res.status(200).send('Catégorie supprimée');
  });
});

app.post('/addLocation', (req, res) => {
  const { name } = req.body;
  const query = 'INSERT INTO locations (location_name) VALUES (?)';
  connection.execute(query, [name], (err, results) => {
      if (err) {
          res.status(500).send('Erreur lors de l\'ajout du lieu');
          return;
      }
      res.status(200).json({ message: `Lieu ajouté, ID: ${results.insertId}` });
      //res.status(200).send(`Lieu ajouté, ID: ${results.insertId}`);
  });
});

app.post('/editLocation', (req, res) => {
  const { id, name } = req.body;
  const query = 'UPDATE locations SET location_name = ? WHERE id = ?';
  connection.execute(query, [name, id], (err, results) => {
      if (err) {
          res.status(500).send('Erreur lors de la mise à jour du lieu');
          return;
      }
      res.status(200).json({ message: 'Lieu mis à jour' });
      //res.status(200).send('Lieu mis à jour');
  });
});

app.post('/deleteLocation', (req, res) => {
  const { id } = req.body;
  const query = 'DELETE FROM locations WHERE id = ?';
  connection.execute(query, [id], (err, results) => {
      if (err) {
          res.status(500).send('Erreur lors de la suppression du lieu');
          return;
      }
      res.status(200).json({ message: 'Lieu supprimé' });
      //res.status(200).send('Lieu supprimé');
  });
});


app.post('/addItems', (req, res) => {
  console.log("Je suis dans ADD ITEMS");
  const { category_id, serial_number, description, quantity, location_id } = req.body;

  // Appel de la procédure stockée
  const query = 'CALL AddNewItem(?, ?, ?, ?, ?)';

  connection.execute(query, [category_id, serial_number, description, quantity, location_id], (err, results) => {
      if (err) {
          console.log("Je suis aps du tout passé");
          console.error('Erreur lors de l\'ajout des items:', err);
          res.status(500).send('Erreur lors de l\'ajout des items');
          return;
      }
      console.log("Je suis passé");
      res.status(200).json({ message: 'mis à jour' });
  });
});

app.post('/updateItem', (req, res) => {
  const { item_id, category_id, serial, description } = req.body;

  const query = 'UPDATE items SET category_id = ?, serial_number = ?, description = ? WHERE item_id = ?';
  connection.execute(query, [category_id, serial, description, item_id], (err, results) => {
      if (err) {
          res.status(500).send('Erreur lors de la mise à jour de l\'item');
          return;
      }
      res.status(200).json({ message: 'mis à jour' });
  });
});

app.post('/deleteItem', (req, res) => {
  const { item_id } = req.body;

  // Call the stored procedure to delete the item
  const query = 'CALL DeleteItem(?)';
  connection.execute(query, [item_id], (err, results) => {
      if (err) {
          console.error(err);
          res.status(500).send('Erreur lors de la suppression de l\'item');
          return;
      }
      res.status(200).json({ message: 'Item supprimé avec succès' });
  });
});

app.post('/deleteprofil', (req, res) => {
  const { person_id } = req.body;

  const query = 'CALL DeleteProfile(?)';
  connection.execute(query, [person_id], (err, results) => {
      if (err) {
          console.error(err);
          res.status(500).send('Erreur lors de la suppression du profil');
          return;
      }
      res.status(200).json({ message: 'Profil supprimé avec succès' });
  });
});

app.post('/deletelocation', (req, res) => {
  const { location_id } = req.body;

  const query = 'CALL DeleteLocation(?)';
  connection.execute(query, [location_id], (err, results) => {
      if (err) {
          console.error(err);
          res.status(500).send('Erreur lors de la suppression de la location');
          return;
      }
      res.status(200).json({ message: 'Location supprimée avec succès' });
  });
});

app.post('/deletecategorie', (req, res) => {
  const { category_id } = req.body;

  const query = 'CALL DeleteCategory(?)';
  connection.execute(query, [category_id], (err, results) => {
      if (err) {
          console.error(err);
          res.status(500).send('Erreur lors de la suppression de la catégorie');
          return;
      }
      res.status(200).json({ message: 'Catégorie supprimée avec succès' });
  });
});


app.post('/addSubCategory', (req, res) => {
  const { name, category_id } = req.body;
  const query = 'INSERT INTO subcategories (subcategory_name, category_id) VALUES (?, ?)';
  connection.execute(query, [name, category_id], (err, results) => {
      if (err) {
          res.status(500).send('Erreur lors de l\'ajout de la sous-catégorie');
          return;
      }
      res.status(200).json({ message: `Sous-Catégorie ajoutée, ID: ${results.insertId}` });
  });
});

app.post('/editSubCategory', (req, res) => {
  const { subcategory_id, subcategory_name } = req.body;
  const query = 'UPDATE subcategories SET subcategory_name = ? WHERE subcategory_id = ?';
  console.log("ICI");
  connection.execute(query, [subcategory_name, subcategory_id], (err, results) => {
      if (err) {
          console.log(err);
          res.status(500).send('Erreur lors de la mise à jour de la sous-catégorie');
          return;
      }
      res.status(200).json({ message: 'Sous-Catégorie mise à jour' });
  });
});

app.post('/deleteSubCategory', (req, res) => {
  const { subcategory_id } = req.body;
  const query = 'DELETE FROM subcategories WHERE subcategory_id = ?';
  connection.execute(query, [subcategory_id], (err, results) => {
      if (err) {
          res.status(500).send('Erreur lors de la suppression de la sous-catégorie');
          return;
      }
      res.status(200).json({ message: 'Sous-Catégorie supprimée' });
  });
});

app.get('/subcategories', (req, res) => {
  const query = `
      SELECT subcategories.subcategory_id, subcategories.subcategory_name	, categories.name AS category_name
      FROM subcategories
      JOIN categories ON subcategories.category_id = categories.category_id
  `;
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error fetching data:', error);
          res.status(500).send('Internal Server Error');
          return;
      }
      res.json(results);
  });
});




app.get('/item_history', (req, res) => {
  const query = 'SELECT * FROM item_history';
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error fetching data:', error);
          res.status(500).send('Internal Server Error');
          return;
      }
      res.json(results);
  });
});

app.get('/categories', (req, res) => {
  const query = 'SELECT * FROM categories';
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error fetching data:', error);
          res.status(500).send('Internal Server Error');
          return;
      }
      res.json(results);
  });
});

app.get('/locations', (req, res) => {
  const query = 'SELECT * FROM locations';
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error fetching data:', error);
          res.status(500).send('Internal Server Error');
          return;
      }
      res.json(results);
  });
});

app.get('/status', (req, res) => {
  const query = 'SELECT * FROM status';
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error fetching data:', error);
          res.status(500).send('Internal Server Error');
          return;
      }
      res.json(results);
  });
});

app.get('/items', (req, res) => {
  const query = `
    SELECT items.item_id,name AS category_name, items.serial_number, items.description, location_name
    FROM items
    JOIN categories ON items.category_id = categories.category_id
    JOIN locations ON items.location_id = locations.location_id;
  `;
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error fetching data:', error);
          res.status(500).send('Internal Server Error');
          return;
      }
      res.json(results);
  });
});

app.get('/items2', (req, res) => {
  const query = 'SELECT * FROM items';
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error fetching data:', error);
          res.status(500).send('Internal Server Error');
          return;
      }
      res.json(results);
  });
});



app.get('/itemtracking', (req, res) => {
  const query = 'SELECT * FROM item_tracking';
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error fetching data:', error);
          res.status(500).send('Internal Server Error');
          return;
      }
      res.json(results);
  });
});

// Endpoint pour récupérer des données
app.get('/users', (req, res) => {
  const selectQuery = 'SELECT * FROM materiel';
  connection.execute(selectQuery, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des données'); 
      return;
    }
    res.status(200).json(results);
  });
});

app.get('/itemsdispo', (req, res) => {
    const selectQuery = "SELECT Items.item_id, Items.category_id, Items.serial_number, Items.description FROM Items JOIN Item_Tracking ON Items.item_id = Item_Tracking.item_id JOIN Status ON Item_Tracking.status_id = Status.status_id WHERE Status.status_description = 'En Stock'";
    connection.execute(selectQuery, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des données'); 
        return;
      }
      res.status(200).json(results);
    });
  });

  app.get('/itemsattribuer', (req, res) => {
    const selectQuery = "SELECT items.item_id, items.description, items.serial_number,persons.name, persons.email FROM items JOIN item_tracking ON items.item_id = item_tracking.item_id JOIN persons ON item_tracking.person_id = persons.person_id WHERE item_tracking.status_id = 2;";
    connection.execute(selectQuery, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des données'); 
        return;
      }
      res.status(200).json(results);
    });
  });

  app.get('/personne', (req, res) => {
    const selectQuery = 'SELECT * FROM persons';
    connection.execute(selectQuery, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des données'); 
        return;
      }
      res.status(200).json(results);
    });
  });

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur exécuté sur http://localhost:${port}`);
});