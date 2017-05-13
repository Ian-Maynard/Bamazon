var mysql = require("mysql");
var menu=require("inquirer");
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

function mainMenu() {

    var proMenu=true;

    if (proMenu){

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
                  type: "input",
                  message: "Is this correct? Y/N or enter Q to Quit",
                  name: "continue"
                }
                
        ]).then(function(user) {
          
                if (user.continue=== 'Q'|| user.continue=== 'q') {
                    proMenu=false;
                    console.log("Exitting.....");
                    return;
                }

                if (user.continue === 'N'|| user.continue=== 'n') {
                   dispTable();
                }

                if (user.continue === 'Y'|| user.continue=== 'y') {
                  processOrder(user.itemNumber,user.orderAmount);
                  dispTable();
                }
                }); // Inquirer then
          } // Pro Menu Boolean if 
  } // Main Menu 


function dispTable(){
  process.stdout.write('\033c'); // Clear the screen
  connection.query("SELECT * FROM products", function(err, res){
			if(err) throw err;		
          	var t = new Table;
            var tread = res;
            res.forEach(function(product){
            		t.cell('Item ID', product.item_id);
                    t.cell('Product Name', product.product_name);
                    t.cell('Department ', product.department_name);
                    t.cell('Price', product.price, Table.number(2));
                    t.newRow();
            }); 
            console.log(t.toString());
            mainMenu();    
    }); //connection.query
}// End disPTable


function processUpdate(itemNum,ordQty) {

  connection.query('SELECT * FROM products WHERE item_id = ' + itemNum, function(err, res) { 
      if(err) console.log(err);

      if (res[0].stock_quantity < ordQty || 0 < res[0].stock_quantity) {
              menu.prompt ([
                       {
                        type: "confirm",
                        message: "Only "+res[0].stock_quantity+" in stock. Order this amount? [y/n] : ",
                        name: "yesOrno",
                        default: true
                       }
                        ]).then(function(user) {
                                if (user.confirm) {
                                   processUpdate(itemNum,res[0].stock_quantity);
                                    return;  
                                   }   
                                else return; 
                        }
          }  // Less than order quantity and greater than zero;


      if (res[0].stock_quantity === 0) {

          console.log("ERROR Amount is Zero. Cannot continue");
          return;
      }

      var updateQty = res[0].stock_quantity - ordQty;
          connection.query("UPDATE products SET ? WHERE ?",
          [{stock_quantity: updateQty}, {item_id: itemNum}],
          function(err,res) {
            if (err)throw err;
          console.log("Order processed");
          return;
          });

  });// Process the Order. 

}  // Function 
