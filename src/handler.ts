
import DbServerless from './database/dbServerless';
import config from './config';



export const handler = async (event: any, context: any) => {
  
  context.databaseCredentials = {
    host: config.host,
    database: config.database,
    username: config.user,
    password: config.password,
  };
  
  const dbServerless = new DbServerless(console, context);

  try {
    const rows = await dbServerless.execQuery('SELECT * FROM products');
    console.info(`Query successful, retrieved ${rows.length} rows`);

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (error) {
    console.error(`Error querying database: ${error}`);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error querying database', error }),
    };
  }
};



/*const event = {
	  body: JSON.stringify({}),
};
const context = {
    databaseCredentials: {
          host: config.host,
          database: config.database,
          username: config.user,
          password: config.password,
        },
};

handler(event, context).then((response) => {
  console.log(response);
});
*/