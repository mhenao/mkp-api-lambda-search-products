import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Context } from './interfaces';
import DbServerless from './database/dbServerless';
import config from './config';
import { searchProductsBy } from './domain/searchProducts';
import { LoggerService } from './common/logger/logger.service';

const logger = new LoggerService();

export const handler = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
  
  context.databaseCredentials = {
    host: config.host.trim(),
    database: config.database.trim(),
    username: config.user.trim(),
    password: config.password.trim(),
  };
  
  logger.log(JSON.stringify(event));
  
  const dbServerless = new DbServerless(logger, context);

  try {
    const rows = await searchProductsBy(dbServerless, event?.body);

    return {
      statusCode: rows?.statusCode,
      body: rows?.body,
    };
    
  } catch (error) {
    logger.error(`Error querying database: ${error}`);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error querying database', error }),
    };
  }
};


const event = {
  body: '{\r\n' +
  '    "fields": [\r\n' +
  '        "stock_quantity",\r\n' +
  '        "name"\r\n' +
  '    ],\r\n' +
  '    "filters": {\r\n' +
  '        "stock_quantity": 100,\r\n' +
  '        "security_stock_quantity": 10\r\n' +
  '    }\r\n' +
  '}',
} as APIGatewayProxyEvent;
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
