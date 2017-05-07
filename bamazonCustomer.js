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

function dispTable(){
console.log('\x1Bc');

connection.query("SELECT * FROM products", function(err, res){
			if(err) throw err;		
          	var t = new Table;
            res.forEach(function(product){
            		t.cell('Item ID', product.item_id)
                    t.cell('Product Name', product.product_name)
                    t.cell('Department ', product.department_name)
                    t.cell('Price', product.price, Table.number(2))
                    t.newRow()
            }); 
            console.log(t.toString());
            mainMenu();
    }); //connection.query




}// End disPTable


function mainMenu(){


mPrompt.prompt([
   {
    type: "input",
    message: "Enter the item number: ",
    name: "itemNumber"
  },

  {
    type: "input",
    message: "Enter the item amount: ",
    name: "orderAmount"
  },

  // Here we ask the user to confirm.
  {
    type: "input",
    message: "Is this correct? Y/N or enter Q to Quit",
    name: "continue"
  }

]).then(function(user) {

  if (user.continue === 'y' ||  user.continue === 'Y') {
    // Yes 

 
  }

  else if (user.continue ===  'n' ||  user.continue === 'N'){


  } //No 


if (user.continue === 'q' || user.continue === 'Q' ) {

}


});
} // Main Menu 

dispTable();

