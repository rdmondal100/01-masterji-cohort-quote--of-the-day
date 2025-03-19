// the axios is used with the cdn applied on the html header 
export const getNewQuoteDataFromApi = async () => {
    try {
        const response = await axios.get("https://api.freeapi.app/api/v1/public/quotes/quote/random")


        if(response?.data?.success){
            console.log(response.data)
            return response.data
        }else{
            throw new Error("Failed to Get New Quote")
        }

    } catch (error) {
        console.log(error)
        return null
    }
}