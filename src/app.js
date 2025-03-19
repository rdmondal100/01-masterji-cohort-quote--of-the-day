import { getNewQuoteDataFromApi } from "./Services/getNewQuote.js"

document.addEventListener('DOMContentLoaded', () => {

    //get the random quote from api
    //extract the quote and author
    //disply it on the ui 
    //add functionality to get new quote after clicking the generate new and update the ui
    const QUOTE_KEY = "RIDAY_KEY"
    let today =  new Date().toLocaleDateString()
    let currentQuote = null
    let currentAuthor = null
    let savedQuoteDate = null

    // Fetch a random quote from the API.
    const getNewQuote = async () => {
        let { data } = await getNewQuoteDataFromApi()
        if (data) {
            console.log(data)
            currentQuote = data.content
            currentAuthor = data.author
            const savedQuoteDate = new Date().toLocaleDateString()
            data = {...data, savedQuoteDate}
            localStorage.setItem(QUOTE_KEY, JSON.stringify(data))
        }
        console.log(currentQuote)
        console.log(currentAuthor)
    }

    //get todays saved quote from local storage
    const getLocalQuote = () => {
        const data = JSON.parse(localStorage.getItem(QUOTE_KEY)) || {}

        if (data) {
            // console.log(data)
            currentQuote = data.content
            currentAuthor = data.author
            savedQuoteDate = data.savedQuoteDate


        }
    }

    // Display the quote and author on the page.
    const displyNewQuoteOnTheUi = async (newQuote = false) => {
        // set the new quote 
        if (newQuote) {
            await getNewQuote()
        } else {
            getLocalQuote()
        }


        // select the quote and author element on the ui 
        const quoteElement = document.getElementById("today-quote")
        const quoteAuthorElement = document.getElementById("today-author-id")

        //set the new quote and author 
        if (quoteElement && currentQuote) {
            quoteElement.innerText = currentQuote
        }
        if (quoteAuthorElement && currentAuthor) {
            quoteAuthorElement.innerText = currentAuthor
        }
    }

    //generate new quote while click on button
    const generateQuateBtn = document.getElementById("generate-new-quote")
    generateQuateBtn.addEventListener("click",()=>{
        displyNewQuoteOnTheUi(true)
    })

    displyNewQuoteOnTheUi(false)


    //render one new quote everyday automatically
    if(today>savedQuoteDate){
        displyNewQuoteOnTheUi(true)
    }


})