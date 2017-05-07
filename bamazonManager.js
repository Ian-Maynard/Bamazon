var mysql = require("mysql");
var mPrompt=require("inquirer");
var Table = require("easy-table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "MY4QLP244W31rd#",
  database: "Bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});

function dispTable (){
connection.query("SELECT * FROM products", function(err, res){
			if(err) throw err;		
          	var t = new Table;
            res.forEach(function(product){
            		t.cell('Item ID', product.item_id)
                    t.cell('Product Name', product.product_name)
                    t.cell('Department ', product.department_name)
                    t.cell('Price', product.price, Table.number(2))
                    t.newRow()
            }); console.log(t.toString());              
    }); //connection.query

}// 


function mainMenu(){

mPrompt.prompt([

  // Here we give the user a list to choose from.
  {
    type: "list",
    message: "Which Pokemon do you choose?",
    choices: ["Bulbasaur", "Squirtle", "Charmander"],
    name: "pokemon"
  },

  // Here we ask the user to confirm.
  {
    type: "confirm",
    message: "Are you sure:",
    name: "confirm",
    default: true

  }

]).then(function(user) {

  if (user.confirm) {

 
  }

  else {


  }

});


} // Main Menu 





