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
  // console.log("connected as id " + connection.threadId);
});


function processOrder(itemNum,ordQty){
  connection.query('SELECT * FROM products WHERE item_id = ' + itemNum, function(err, res){
    if(err) console.log(err);

    
    menu.prompt([
            {
              type: "confirm",
              message: res[0].stock_quantity+" in stock. Order "+ordQty+"? [y/n] : ",
              name: "yesOrno",
              default: true
            }]).then(function(user)
                      {
                        if(user.yesOrno){
                            var updateQty = res[0].stock_quantity + ordQty;  // Arrive at the value to be updated
                            connection.query("UPDATE products SET ? WHERE ?",
                            [{stock_quantity: updateQty}, {item_id: itemNum}],
                            function(err,res) {
                              if (err) throw err;
                              console.log("Order processed");
                                              });
                        }
                      });
          }); // End Enquiry Read

}// Process the Order. 


function dispHeader(title)
{
if (!title) title="Bamazon Products";
process.stdout.write('\033c'); 
console.log("***************************************************");
console.log(title,"\n");
console.log("***************************************************");
console.log("\n\n");
} // Clears screen and displays a header




function tableOps(oper)  {
//Function either displays ALL items or items at re-order qty 

var sqlString="SELECT * FROM products";  // Default  - read all items
var title = "All Bamazon products"; 

              if  (oper==="low") {
                    sqlString="SELECT * FROM products WHERE stock_quantity <=5"; // When Items are low
                    title = "Items with low quantities";
                  }

            connection.query(sqlString, function(err, res){
          			if(err) throw err;		
                if(res.length === 0) { // No items found 
                    dispHeader("Sorry. No products meet that criteria");
                    return;
                }
                    	var t = new Table;
                      dispHeader(title);
                      res.forEach(function(product){
                      		t.cell('Item ID', product.item_id);
                              t.cell('Product Name', product.product_name);
                              t.cell('Department ', product.department_name);
                              t.cell('Qty in stock ', product.stock_quantity);
                              t.cell('Price', product.price, Table.number(2));
                              t.newRow();
                      }); console.log(t.toString());   
                      // console.log("anything");          
              }); //connection.query
console.log("anything");    
mainMenu();
}// Table Ops


function itemOps(oper){
  var title="";

           if (oper==="addTo") { // Add to existing item's stock
                          title="Add to Existing Item's Stock";
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
                                                  if (user.confirm) processOrder(user.itemNumber,user.orderAmount);
                                          }); // Inquirer then
                              }                              

                  else if (oper==="addNew" ) {
                              title="Add New Item";
                              dispHeader(title);
                              menu.prompt ([
                                              {
                                                type: "input",
                                                message: "Enter item number: ",
                                                name: "itemNumber"
                                              },

                                              {
                                                type: "input",
                                                message: "Enter product name: ",
                                                name: "productName"
                                              },

                                               {
                                                type: "input",
                                                message: "Enter department: ",
                                                name: "departmentName"
                                              },

                                              {
                                                type: "input",
                                                message: "Enter Price: ",
                                                name: "itemPrice"
                                              },

                                              {
                                                type: "input",
                                                message: "Enter stock quantity: ",
                                                name: "stockQuantity"
                                               },
                                               {
                                                type: "confirm",
                                                message: "Is this correct? Y/N",
                                                name: "continue",
                                                default: true
                                              }
                                              ]).then(function(user) {
                                                      if (user.confirm) {
                                                          connection.query("INSERT INTO products SET ?", {
                                                          item_id: menu.itemNumber,
                                                          product_name: menu.productName,
                                                          department_name: menu.departmentName,
                                                          price: menu.itemPrice,
                                                          stock_quantity: menu.stockQuantity
                                                        }, function(err) {
                                                          if (err) throw err;
                                                          title="Your item was created successfully!";
                                                          dispHeader(title);
                                                            });
                                                          }
                                                      }); // Inquirer then
                         }   // Add new item   
mainMenu();          
} // Item Ops

function mainMenu()
{
                menu.prompt([
                  // Here we give the user a list to choose from.
                  {
                    type: "list",
                    message: "Which option?",
                    choices: ["View for sale", "Low Inventory", "Add stock","Add new Item", "Quit"],
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
                                        mainMenu();
                                        break;

                                        case 'Low Inventory':
                                        tableOps("low");
                                        break;
                          
                                        case 'Add stock':
                                        itemOps("addTo");
                                        break;

                                        case 'Add new Item':
                                        itemOps("addNew");    
                                        break;

                                        case 'Quit':
                                        console.log('Exitting...');
                                        process.exit(-1); // process.exit(-1);
                                        break; 

                                        default:
                                        console.log('I did not understand that.');
                                    } // Switch code block
                          } // user confirm Block
            }); // Main Menu  Prompt

} // Main Menu 

mainMenu();


