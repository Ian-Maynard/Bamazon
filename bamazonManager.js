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

function processOrder(itemNum,ordQty){

  connection.query('SELECT * FROM products WHERE item_id = ' + itemNum, function(err, res){
      if(err) console.log(err);

              menu.prompt ([
                       {
                        type: "confirm",
                        message: res[0].stock_quantity+" in stock. Order "+ordQty+"? [y/n] : ",
                        name: "yesOrno",
                        default: true
                       }
                          ]).then(function(user) {
                          var updateQty = res[0].stock_quantity + ordQty;  // Arrive at the value to be updated
                          connection.query("UPDATE products SET ? WHERE ?",
                          [{stock_quantity: updateQty}, {item_id: itemNum}],
                          function(err,res) {
                            if (err) throw err;
                            console.log("Order processed");
                            });
                          });
      }); // End Enquiry Read 

        
}// Process the Order. 


function dispHeader(title){
if (!title) var title="Bamazon Products"
process.stdout.write('\033c'); 
console.log("***************************************************");
console.log(title,"\n");
console.log("***************************************************");
console.log("\n\n");
}

function tableOps(oper){
process.stdout.write('\033c'); // Clear the screen
var sqlString="SELECT * FROM products";  // Default  - read all items
var title = "All Bamazon products"; // assumes all producxts

if  (oper==="low") {
      sqlString="SELECT * FROM products WHERE stock_quantity <=5"; // When Items are low
      title = "Items with low quantities";
    }
    connection.query(sqlString, function(err, res){
    			if(err) throw err;		
              	var t = new Table;
                dispHeader(title);
                res.forEach(function(product){
                		t.cell('Item ID', product.item_id)
                        t.cell('Product Name', product.product_name)
                        t.cell('Department ', product.department_name)
                        t.cell('Qty in stock ', product.stock_quantity)
                        t.cell('Price', product.price, Table.number(2))
                        t.newRow()
                }); console.log(t.toString());              
        }); //connection.query

}// Table Ops



function itemOps(oper){
var title="Add to Stock";
dispHeader(title);

        menu.prompt ([
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
                {
                  type: "confirm",
                  message: "Is this correct? Y/N",
                  name: "continue",
                  default: true
                }
        ]).then(function(user) {
          
                if (user.confirm) {
                processOrder(itemNumber,orderAmount);

                }
        }); // Inquirer then

}// Item Ops





function mainMenu(){

dispHeader("Amazon Products - Main Menu");


mPrompt.prompt([
  // Here we give the user a list to choose from.
  {
    type: "list",
    message: "Which option?",
    choices: ["View for sale", "Low Inventory", "Add stock","Add new Item"],
    name: "options"
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

            switch(user.options) {

                          case 'View for sale':
                          tableOps("all");
                          break;

                          case 'Low Inventory':
                          tableOps("low");
                          break;

                          case 'Add stock':
                          tableOps("addTo");
                          break;

                          case 'Add new Item':
                          tableOps("addNew");    
                          break;

                          default:
                          console.log('I did not understand that ',commAnd);
                        }
                  }
}); // Core Prompt

} // Main Menu 


mainMenu();


