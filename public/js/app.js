document.addEventListener('click', e =>{
    if(e.target.dataset.short){
        console.log("existe")
        const url = `${window.location.origin}/${e.target.dataset.short}`;

        navigator.clipboard
            .writeText(url)
            .then(() => {
                console.log("texto copiado")
            })
            .catch((err) => {
                console.log("algo fallo", err)
            })
    
    }
} )