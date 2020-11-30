const axios = require('axios').default;

class Api 
{
    constructor() 
    {
        try 
        {
            if (location.hostname === "localhost") 
                this.domain = 'http://localhost:8080/api/';
            else 
                this.domain = 'https://shavesandfades.com/api/';
        }   
        catch(e)
        {
            this.domain = 'http://localhost:8080/api/';
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

    async post(uri, body)
    {
        try 
        {
            const response = await axios.post(this.domain + uri, body, {
                headers: {
                  // Overwrite Axios's automatically set Content-Type
                  'Content-Type': 'application/json'
                }
              });

            return response.status;
        }
        catch (error)
        {
            console.log(error);
            
            return error.status;
        }
    }
}

module.exports = Api;