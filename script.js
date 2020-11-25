const resultNav=document.getElementById('resultsNav')
const favoratesNav=document.getElementById('favoratesNav')
const imagesContainer=document.querySelector('.images-container')
const saveConfirmed=document.querySelector('.save-confirmed')
const loader=document.querySelector('.loader')

//NASA API
const count=10
const apiKey='DEMO_KEY'
const apiUrl=`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`

let resultsArray=[]
let favorates={}

function showContent(page){
    window.scrollTo({
        top:0,
        behavior:'instant'
    })
    if(page==='results'){
        resultNav.classList.remove('hidden')
        favoratesNav.classList.add('hidden')
    }else{
        resultNav.classList.add('hidden')
        favoratesNav.classList.remove('hidden')
    }
    loader.classList.add('hidden')
}

function createDOM(page){
    const currentArray=page==='results'?resultsArray:Object.values(favorates)
    currentArray.forEach((result)=>{
        //card container
        const card=document.createElement('div')
        card.classList.add('card')
        //link
        const link=document.createElement('a')
        link.href=result.hdurl
        link.title='View Full Image'
        link.target='_blank'
        //image
        const image=document.createElement('img')
        image.src=result.url
        image.alt='NASA Picture of day'
        image.loading='lazy'
        image.classList.add('card-img-top')
        //card body
        const cardBody=document.createElement('div')
        cardBody.classList.add('card-body')
        //card title
        const cardTitle=document.createElement('h5')
        cardTitle.classList.add('card-title')
        cardTitle.textContent=result.title
        //save text
        const saveText=document.createElement('p')
        saveText.classList.add('clickable')
        if(page==='results'){
            saveText.textContent='💎Add to favorates'
        saveText.setAttribute('onclick',`saveFavorate('${result.url}')`)
        }else{
            saveText.textContent='Remove favorates'
        saveText.setAttribute('onclick',`removeFavorate('${result.url}')`)
        }
        //card text
        const cardText=document.createElement('p')
        cardText.textContent=result.explanation
        //footer container
        const footer=document.createElement('small')
        footer.classList.add('text-muted')
        //date
        const date=document.createElement('strong')
        date.textContent=result.date
        //copyright
        const copyrightResult=result.copyright===undefined?'':result.copyright
        const copyright=document.createElement('span')
        copyright.textContent=`  ${copyrightResult}`
        //append
        footer.append(date,copyright)
        cardBody.append(cardTitle,saveText,cardText,footer)
        link.appendChild(image)
        card.append(link,cardBody)
        imagesContainer.appendChild(card)
    })
}

function updateDOM(page){
    //get fav from localstorage
    if(localStorage.getItem('nasaFavorates')){
        favorates=JSON.parse(localStorage.getItem('nasaFavorates'))
    }
    imagesContainer.textContent=''    
    createDOM(page)
    showContent(page)
}

//get 10 images from api
async function getNasaPictures(){
    //show loader
    loader.classList.remove('hidden')
    try {
        const response=await fetch(apiUrl)
        resultsArray=await response.json()
        console.log(resultsArray)
        updateDOM('results')
    }catch(error){
        //catche error here
    }
}

//add result to fav
function saveFavorate(itemUrl){
    //loop
    resultsArray.forEach((item)=>{
        if(item.url.includes(itemUrl)&&!favorates[itemUrl]){
            favorates[itemUrl]=item
            console.log(favorates)
            //show save confirmation for 2 seconds
            saveConfirmed.hidden=false
            setTimeout(()=>{
                saveConfirmed.hidden=true
            },2000)
            //set favorate in localStorage
            localStorage.setItem('nasaFavorates',JSON.stringify(favorates))
        }
    })
}

//remove result from fav
function removeFavorate(itemUrl){
    if(favorates[itemUrl]){
        delete favorates[itemUrl]
    //set favorate in localStorage
    localStorage.setItem('nasaFavorates',JSON.stringify(favorates)) 
    updateDOM('favorates')       
    }
}

//onload
getNasaPictures()