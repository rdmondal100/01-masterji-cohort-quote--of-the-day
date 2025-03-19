import { secrects } from "../utils/secrects.js"


export const getRandomImageFromApi = async ()=>{
    try {
        const response = await axios.get(`https://api.unsplash.com/photos/random?client_id=${secrects?.ACCESS_KEY}&orientation=landscape`)
        
        if(response?.status === 200){
            return response?.data?.urls?.regular
        }
        
        return null
    } catch (error) {
        console.log("Failed to get random image::: ",error)
        return null
    }
}