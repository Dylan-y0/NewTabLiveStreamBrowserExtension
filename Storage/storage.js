export function userBackgrounds() {
    function getAll() {
        return new Promise( function(resolve) {
            chrome.storage.local.get('userBackgrounds',function (data) {
                resolve(data.userBackgrounds);
            })
        });
    }
    function getRandom(saveAsPrevious){
        return new Promise((resolve)=>{
            getAll().then((data)=> {
                resolve(data[Math.floor(Math.random() * data.length)])
            });
            
        });

    }
    function set(id,name,type,videoID) {
        return new Promise( function(resolve,reject) {
            getAll().then((data)=>{
                console.log(parseInt(id));
                data[id]['name'] = name;
                data[id]['type'] = type;
                data[id]['videoID'] = videoID;

                chrome.storage.local.set({'userBackgrounds':data},(e)=>{
                    resolve(data[id]);
                });

                
            })
        });
 
    }
    function newEntry(name,type,videoID){
        return new Promise((resolve,reject)=>{
            let newItem = {
                'name':name,
                'type':type,
                'videoID':videoID
            }
            getAll().then((result)=>{
               
                result.push(newItem);
                console.log(result);
                chrome.storage.local.set({'userBackgrounds':result}, (d)=>{
                    resolve(d);
                })
                

            })
        })
    }
    function deleteEntry(id) {
        console.log("iD")
        console.log(id);
        return new Promise((resolve,reject) =>{
            getAll().then((data)=>{
                id > data.length -1 ? reject():null;
                data.splice(id,1);
                console.log(data);
              
                chrome.storage.local.set({'userBackgrounds':data},(res)=>{
                    resolve(data);
                })
               
            })
        });
    }

    return {
        getAll,
        getRandom,
        set,
        deleteEntry,
        newEntry
    }
}

