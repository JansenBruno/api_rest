const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./database.db');
const cors = require('cors')
const express = require('express'); //Biblioteca express
const app = express();
const bodyParser = require('express')


app.use(bodyParser.json());
app.use(cors());




//Rotas

//lista todoas as tarefas 

app.get("/tarefas", (req, resp) => {
    db.all(`SELECT * FROM TAREFAS`, (err, rows) => {
        resp.send(JSON.stringify({ results: rows }));
    })
})

//lista tarefas por ID
app.get('/tarefas/:id', (req, resp) => {
    db.get('SELECT * FROM TAREFAS WHERE id=?', [req.params.id], (err, rows) => {
        if (err) {
            console.log(err)
        }
        resp.send(JSON.stringify({ result: rows }));
    })
})


// Criar nova tarefa 
app.post("/tarefas", (req, resp) => {

    db.run(`INSERT into TAREFAS (titulo,descricao,status) VALUES (?, ? ,?)`,
        [req.body.titulo, req.body.descricao, req.body.status]);
        resp.status(200).send('Nova Tarefa Inserida');
        
    })


//Deletar tarefa 
app.delete("/tarefas/:id", (req, resp) => {
    db.run("DELETE FROM TAREFAS WHERE id = ?", [req.params.id], (err) => {
        if (err) {
            resp.send(err);
        } else {
            resp.send(`Tarefa ${req.params.id} foi deletada com sucesso`);
        }
    });
});


//atualizar tarefa
app.put("/tarefas/:id/", (req, resp) => {
    

    db.run("UPDATE tarefas SET titulo=?, descricao=?, status=? WHERE id=?",
        [req.body.titulo, req.body.descricao, req.body.status, req.params.id],
        (err) => {
            if (err) {
                resp.send(err);
            } else {
                resp.send(`Tarefa ${req.params.id} foi alterada com sucesso`);
            }
        }
    );
});




app.listen(8080, () => {
    console.log(`Servidor start `);

})


process.on('SIGTERM', () => {
    db.close((err) => {
        console.log("Banco encerrado com sucesso!");
        process.exit(0);
    })
})




