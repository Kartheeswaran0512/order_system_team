const express= require('express');
//const cros = require('cors');
const mysql=require('mysql2/promise');
const { error } = require('cros/common/logger');
require('dotenv').config();

const app=express();
app.use(express.json());
//app.use(cros());

const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.db_name,
    waitForConnections: true,
    connectionLimit: 10, // only limit=10 connection
});

app.post('/api/orders',async(req,res)=>{
    const {orderName}=req.body;
    try{
        await pool.query('INSERT INTO orders (order_name) VALUES (?)', [orderName]);
        res.json({message:"Order Created"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: error.message});
    }
    });

    app.get('/api/orders',async(req, res)=>{
        try{
            const [rows]=await pool.query('SELECT * FROM orders');
            res.json(rows);
        }
        catch(err){
            console.log(err);
            res.status(500).json({"Error": "Fetch Error"});
        }
        });

     app.put('/api/orders/:id', async(req,res)=>{
        try{
            const{orderName}=req.body;
            const[rows]=await pool.query('UPDATE orders SET order_name=? WHERE id=?',[orderName,req.params.id]);
            if(rows.affectedRows==0){
                return res.status(404).json({"Error": "Order not found"});
            }
            else{
                res.json({message:'Order updated Successfully'});
            }
            }
            catch(err){
                console.log(err);
                res.status(500).json({error:error.message});
           }
     });

     app.delete('/api/orders/:id', async(req,res)=>{
        try {
            const[rows]=await pool.query('DELETE FROM orders where id=?',[req.params.id]);
        
        if(rows.affectedRows==0){
            return res.status(404).json({"Error": "Order not found"});
        }
        else{
            res.json({message:"Order deleted Successfully"});
        }

        } 
        catch(err){
            console.log(err);
            res.status(500).json({error:error.message});
        }
     });
    
     const port= process.env.port || 4000;
     app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
     });
     