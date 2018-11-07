
function activeValidate(){
    var btn;
    
    btn = document.getElementById("addAbono");    
	btn.addEventListener("click", function() { 
        
    });
    
    btn = document.getElementById("addCredit");    
	btn.addEventListener("click", function() { 
        
    });
    
     btn = document.getElementById("addClient");    
	btn.addEventListener("click", function() { 
        verificClient()
    });
    
    var inp = document.getElementById("searchCredito");    
    inp.addEventListener("change", function() { 
        findCredit();
    });
    
    //onchange
}

function verificClient(){
    
    
}

function findCredit(){
    
    
}