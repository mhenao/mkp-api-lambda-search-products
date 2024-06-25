import { LoggerService } from "../common/logger/logger.service";
import { DbServerless,APIGatewayProxyEvent } from '../interfaces/'

const logger = new LoggerService();

export const searchProductsBy = async (dbServerless: DbServerless, body: string) => {
  try {
    
    const { fields, filters } = JSON.parse(body);
    
    let query;
    let queryParams: any[] = [];
    
    const selectFields = fields && Array.isArray(fields) && fields.length > 0 ? 
      fields.join(', ') : 
      '*';
    
    if (!filters || Object.keys(filters).length === 0 ) {
      query = `SELECT ${selectFields} FROM products`;
    } else {
      query = `SELECT ${selectFields} FROM products WHERE 1=1`;
      
      for (const [key, value] of Object.entries(filters)) {
        query += ` AND ${key} = ?`;
        queryParams.push(value);
      }
    }
    
    const rows = await dbServerless.execQuery(query, queryParams);

    return {
      statusCode: 200,
      body: JSON.stringify({ rows }),
    };
  } catch (error) {
    logger.error(`Error querying database: ${error}`);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error querying database', error }),
    };
  }
};
