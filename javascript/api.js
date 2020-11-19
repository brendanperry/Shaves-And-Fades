const axios = require('axios').default;

class Api 
{
    constructor() 
    {
        if (location.hostname === "localhost") 
        {
            this.domain = 'http://localhost:8080/api/';
        }
        else 
        {
            this.domain = 'https://shavesandfades.com/api/'
        }
    }

    async get(uri) 
    {
        try 
        {
            const response = await axios.get(this.domain + uri);

            return [response.status, response.data];
        }
        catch (error) 
        {
            console.log(error);
            
            return [error.status, error.response];
        }
    }
}

module.exports = Api;