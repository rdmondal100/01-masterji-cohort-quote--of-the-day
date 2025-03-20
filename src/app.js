import { getNewQuoteDataFromApi } from "./Services/getNewQuote.js"
import { getRandomImageFromApi } from "./Services/getRandomImage.js"

//apply the js after dom content loaded 
document.addEventListener('DOMContentLoaded', () => {

    //local storage key
    const QUOTE_KEY = "RIDAY_KEY"
    const RANDOM_IMAGE_ARRAY = 'RANDOM_IMG_ARRAY'

    // initialize the variables
    const mainElement = document.getElementById('main-id')
    let today = new Date().toLocaleDateString()
    let currentQuote = null
    let currentAuthor = null
    let savedQuoteDate = null
    const defaultImage = 'https://www.riday.tech/assets/aboutImg-yN3zcSZ9.jpeg'

    //get the saved images to use if failed to get image from api
    const localImageArray = JSON.parse(localStorage.getItem(RANDOM_IMAGE_ARRAY)) || []



    //get saved images form local storage
    //passing true it will give random img else it will give the last one
    const getLocalRandomImage = (random = false) => {
        //if random is false it will set the last image of the array else choose a rnadom image from the local storage
        localStorage.setItem(RANDOM_IMAGE_ARRAY, JSON.stringify(localImageArray))

        const lengthOfLocalArray = localImageArray.length
        //generate a random index
        const randomIndex = Math.floor(Math.random() * (lengthOfLocalArray))
        //choose random or last image
        const index = random ? randomIndex : localImageArray.length - 1;
        const imageUrl = localImageArray[index]
        if (imageUrl) {
            //set the background image
            mainElement.style.background = `url("${imageUrl}")`;
            //removed the used image and push it to the last so that we can get the same image when we reload the page
            const lastImage = localImageArray.splice(index, 1)[0]
            localImageArray.push(lastImage)
            localStorage.setItem(RANDOM_IMAGE_ARRAY, JSON.stringify(localImageArray))

        } else {
            //if failed to get image from local storage load the default image
            mainElement.style.background = `url("${defaultImage}")`;
        }
    }

    //get the new image from api
    const getNewRandomImage = async () => {
        try {
            //image url from apiservice 
            const imageUrl = await getRandomImageFromApi()

            if (imageUrl) {
                //set the background image
                mainElement.style.background = `url("${imageUrl}")`;

                //limit the local storage image to 20
                if (localImageArray.length < 20) {
                    localImageArray.push(imageUrl)
                } else {
                    localImageArray.shift()
                    localImageArray.push(imageUrl)
                }
                localStorage.setItem(RANDOM_IMAGE_ARRAY, JSON.stringify(localImageArray))
            } else {
                getLocalRandomImage(true)
            }
        } catch (error) {
            console.log("Failed to get random image form api::: ", error)
        }
    }


    // Fetch a random quote from the API.
    const getNewQuote = async () => {
        try {
            //quote from apiservice
            let { data } = await getNewQuoteDataFromApi()
            if (data) {
                currentQuote = data.content
                currentAuthor = data.author
                const savedQuoteDate = new Date().toLocaleDateString()
                data = { ...data, savedQuoteDate }
                localStorage.setItem(QUOTE_KEY, JSON.stringify(data))
            }
        } catch (error) {
            console.log("Failed to get the quote:::", error)
        }
    }

    //get todays saved quote from local storage
    const getLocalQuote = () => {
        const data = JSON.parse(localStorage.getItem(QUOTE_KEY)) || {}

        if (data) {
            currentQuote = data.content
            currentAuthor = data.author
            savedQuoteDate = data.savedQuoteDate
        }
    }


    // Display the quote and author on the page.
    const displyNewQuoteandImageOnTheUi = async (newQuote = false) => {
        try {
            // set the new quote and image
            if (newQuote) {
                await getNewQuote()
                await getNewRandomImage()

            } else {
                // get quote and image from local storage 
                getLocalQuote()
                getLocalRandomImage()
            }
            //set the main element styled
            mainElement.style.backgroundSize = "cover";
            mainElement.style.backgroundPosition = "center";
            mainElement.style.backgroundRepeat = "no-repeat";

            // select the quote and author element on the ui 
            const quoteElement = document.getElementById("today-quote")
            const quoteAuthorElement = document.getElementById("today-author-id")

            //set the new quote and author 
            if (quoteElement && currentQuote) {
                quoteElement.innerText = `❝ ${currentQuote} ❞`
            }
            if (quoteAuthorElement && currentAuthor) {
                quoteAuthorElement.innerText = `-${currentAuthor}`
            }
        } catch (error) {
            console.log("Something went wrong:::", error)
        }
    }


    // Render the same quotes and img from local storage on every reload
    getLocalRandomImage()
    displyNewQuoteandImageOnTheUi(false)


    //generate new quote while click on button
    const generateQuateBtn = document.getElementById("generate-new-quote")
    if (generateQuateBtn) {
        generateQuateBtn.addEventListener("click", () => {
            displyNewQuoteandImageOnTheUi(true)
        })
    }


    //render one new quote everyday automatically
    if (today > savedQuoteDate) {
        displyNewQuoteandImageOnTheUi(true)
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

                copyQuoteBtn.innerHTML = "&#10004 copied"
                copyQuoteBtn.classList.add("copied")

                setTimeout(() => {
                    copyQuoteBtn.innerHTML = "&#10064"
                    copyQuoteBtn.classList.remove("copied")

                }, 3 * 1000);

            } catch (error) {
                console.log("Failed to copy::: ", error)
                copyQuoteBtn.style.color = "red"


            }
        })
    }


    //share on twitter
    const shareOnTwitterBtn = document.getElementById("share-on-twitter")
    if (shareOnTwitterBtn && quoteContainer) {
        shareOnTwitterBtn.addEventListener('click', () => {
            const content = encodeURIComponent(quoteContainer.innerText)
            if (content) {
                const formatedAuthorName = String(currentAuthor).replaceAll(" ", "_")
                //set the hastags on twitter automatically when sharing, aditional feature not asked
                const hashtags = [formatedAuthorName, "quote", "todays_quote", "masterji_assignment", "chai_aur_code"].map((hastag) => (encodeURIComponent(hastag))).join(",")
                shareOnTwitterBtn.href = `https://x.com/intent/post?text=${content}%0A%0A&hashtags=${hashtags}`
            }
        })
    }


    //save the quote image to local computer
    const exportBtn = document.getElementById("export-id")
    const saveQuoteImageToLocalComputer = async () => {
        const quoteContainer = document.getElementById("quote-container-id")

        if (quoteContainer) {
            const canvas = await html2canvas(quoteContainer)
            if (canvas) {
                //convert it to bage64 image
                const image = canvas.toDataURL("image/png")
                //creating the downloading features
                const downloadLink = document.createElement('a')
                if (downloadLink) {
                    downloadLink.href = image
                    downloadLink.download = "quote.png";
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                }
            }
        }


    }
    if (exportBtn) {
        exportBtn.addEventListener('click', saveQuoteImageToLocalComputer)
    }



})