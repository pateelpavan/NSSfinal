import supabase from "../config/supabaseClient"

// Insert rows into "sales" table
const insertSales = async () => {
  const { data, error } = await supabase
    .from("sales")
    .insert([
      { item: 'abc', price: 10, quantity: 2, date: '2014-03-01T08:00:00Z' },
      { item: 'jkl', price: 20, quantity: 1, date: '2014-03-01T09:00:00Z' },
      { item: 'xyz', price: 5, quantity: 10, date: '2014-03-15T09:00:00Z' },
      { item: 'xyz', price: 5, quantity: 20, date: '2014-04-04T11:21:39.736Z' },
      { item: 'abc', price: 10, quantity: 10, date: '2014-04-04T21:23:13.331Z' },
      { item: 'def', price: 7.5, quantity: 5, date: '2015-06-04T05:08:13Z' },
      { item: 'def', price: 7.5, quantity: 10, date: '2015-09-10T08:43:00Z' },
      { item: 'abc', price: 10, quantity: 5, date: '2016-02-06T20:20:13Z' },
    ]);

  if (error) console.error("Insert error:", error);
  else console.log("Inserted:", data);
};

// Query sales on April 4, 2014
const salesOnApril4th = async () => {
  const { data, error } = await supabase
    .from("sales")
    .select("*", { count: "exact" })
    .gte("date", "2014-04-04")
    .lt("date", "2014-04-05");

  if (error) console.error("Query error:", error);
  else console.log(`${data.length} sales occurred on April 4, 2014.`);
};

// Aggregate total sales by product in 2014
const totalSales2014 = async () => {
  const { data, error } = await supabase
    .rpc("total_sales_2014"); // 👈 we’ll need a Postgres function for aggregation

  if (error) console.error("Aggregation error:", error);
  else console.log("Total sales in 2014 by product:", data);
};

// Run functions
insertSales();
salesOnApril4th();
totalSales2014();
