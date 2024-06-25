import {LoggerService} from "../common/logger/logger.service";

const logger=new LoggerService();

export const searchProductsBy=async (dbServerless: any,req: any) => {
	try {

		const filters=req?.queryStringParameters;
		
		let query;
		let queryParams: any[]=[];
		
		if(!filters) {
			query='SELECT * FROM products';
		} else {
			query='SELECT * FROM products WHERE 1=1';
			
			for(const [key,value] of Object.entries(filters)) {
				query+=` AND ${key} = ?`;
				queryParams.push(value);
			}
		}

		const rows=await dbServerless.execQuery(query,queryParams);

		return {
			statusCode: 200,
			body: JSON.stringify({rows}),
		};
	}
	catch(error) {
		logger.error(`Error querying database: ${error}`);

		return {
			statusCode: 500,
			body: JSON.stringify({message: 'Error querying database',error}),
		};
	}
};
