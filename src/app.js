import { getNewQuoteDataFromApi } from "./Services/getNewQuote.js"

document.addEventListener('DOMContentLoaded', () => {

    //get the random quote from api
    //extract the quote and author
    //disply it on the ui 
    //add functionality to get new quote after clicking the generate new and update the ui
    const QUOTE_KEY = "RIDAY_KEY"
    let today = new Date().toLocaleDateString()
    let currentQuote = null
    let currentAuthor = null
    let savedQuoteDate = null


    // Fetch a random quote from the API.
    const getNewQuote = async () => {
        try {
            let { data } = await getNewQuoteDataFromApi()
            if (data) {
                console.log(data)
                currentQuote = data.content
                currentAuthor = data.author
                const savedQuoteDate = new Date().toLocaleDateString()
                data = { ...data, savedQuoteDate }
                localStorage.setItem(QUOTE_KEY, JSON.stringify(data))
            }
            console.log(currentQuote)
            console.log(currentAuthor)
        } catch (error) {
            console.log("Failed to get the quote:::", error)
        }
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
        try {
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
                quoteElement.innerText =`❝ ${currentQuote} ❞` 
            }
            if (quoteAuthorElement && currentAuthor) {
                quoteAuthorElement.innerText = `-${currentAuthor}`
            }
        } catch (error) {
            console.log("Something went wrong:::", error)
        }
    }


    // Render the quotes from local storage on every reload
    displyNewQuoteOnTheUi(false)


    //generate new quote while click on button
    const generateQuateBtn = document.getElementById("generate-new-quote")
    if (generateQuateBtn) {
        generateQuateBtn.addEventListener("click", () => {
            displyNewQuoteOnTheUi(true)
        })
    }


    //render one new quote everyday automatically
    if (today > savedQuoteDate) {
        displyNewQuoteOnTheUi(true)
    }


    //copy the quote 
    const copyQuoteBtn = document.getElementById("copy-quote")
    const quoteContainer = document.getElementById("quote-content-id")
    // console.log(copyQuoteBtn)
    if (copyQuoteBtn && quoteContainer) {
        copyQuoteBtn.addEventListener('click', async () => {
            try {
                const quoteContent = quoteContainer.innerText
                await navigator.clipboard.writeText(quoteContent);

                copyQuoteBtn.innerHTML="&#10004 copied"
                copyQuoteBtn.classList.add("copied")

                setTimeout(() => {
                    copyQuoteBtn.innerHTML="&#10064"
                    copyQuoteBtn.classList.remove("copied")

                }, 3*1000);

                console.log("copied")
            } catch (error) {
                console.log("Failed to copy::: ", error)
                copyQuoteBtn.style.color="red"


            }
        })
    }


    //share on twitter
    const shareOnTwitterBtn =  document.getElementById("share-on-twitter")
    if(shareOnTwitterBtn && quoteContainer){
        shareOnTwitterBtn.addEventListener('click',()=>{
            const content = encodeURIComponent( quoteContainer.innerText)
            if(content){
                const formatedAuthorName = String(currentAuthor).replaceAll(" ","_")
                console.log(formatedAuthorName)
                const hashtags = [formatedAuthorName, "quote", "todays_quote","masterji_assignment","chai_aur_code"].map((hastag)=>(encodeURIComponent(hastag))).join(",")
console.log(hashtags)
                shareOnTwitterBtn.href = `https://x.com/intent/post?text=${content}%0A%0A&hashtags=${hashtags}`
            }

            // console.log(content)
        })
    }

})