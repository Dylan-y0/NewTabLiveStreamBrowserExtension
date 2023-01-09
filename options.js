import './css/options.css';
import { userBackgrounds } from './Storage/storage';

window.onload = () => {
    StreamsTable();
}

function StreamsTable() {
    let streamsTable = document.getElementById("streamsTable");
    let tableBody = document.querySelector("#streamsTable tbody");
    let rowTemplate = document.getElementById("rowTemplate");
    let btnNewEntry = document.getElementById("btnNewEntry");
    let overlay = streamOverlay();
    console.log(streamsTable.tBodies);

    populateTable();

    function populateTable() {
        btnNewEntry.onclick = (e) => newEntryClick(e);
        userBackgrounds().getAll().then((res) => {
            console.log(res);
            //for (let element of res) {
            res.forEach((element, index) => {
                let row = streamsTable.insertRow();
                let idcell = row.insertCell();
                idcell.appendChild(document.createTextNode(index));
                for (let key in element) {
                    console.log(key);
                    let cell = row.insertCell();
                    let text = document.createTextNode(element[key]);
                    cell.appendChild(text);
                }
                row.onclick = (e) => rowOnClick(e, element, index);
            });
        })
        /* chrome.storage.local.get(["userBackgrounds"],(res)=>{
 
           
         });*/

    }
    function rowOnClick(e, element, index) {
        overlay.openOverlay(element, index,closedOverlayCallback);
        console.log(overlay.isOpen());
    }
    function newEntryClick(e) {
        overlay.openOverlay(null, null,closedOverlayCallback);
    }
   async function closedOverlayCallback(e) {
     
       let stRows = streamsTable.rows;
        for(let i = 1;i < stRows.length; i++) {
            stRows[i].innerHTML = null;
        }
       
        populateTable();
    }

}

function streamOverlay() {

    let overlayDiv = document.getElementById("newStreamOverlay")
    let form = document.getElementById("frmNewStream");

    let formID = document.getElementById('id'),
        formName = document.getElementById("name"),
        formSourceType = document.getElementById("sourceType"),
        formYTID = document.getElementById("ytID"),
        closeButton = document.getElementById("closeOverlay"),
        deleteButton = document.getElementById("deleteEntry");

    let closedOverlayCB;


    function openOverlay(element, index,closedCB) {

        if (element !== null) {
            console.log(element);
            formID.value = index;
            formName.value = element['name'];
            formSourceType.value = element['type'];
            formYTID.value = element['videoID'];
        } else {
            formID.value = "new"
            formSourceType.value = "youtube"
        }
        overlayDiv.style.display = "block";
        form.addEventListener('submit', saveFormData);
        closeButton.onclick = (e) => closeOverlay(e);
        deleteButton.onclick = (e) => deleteFormData(e);

        closedOverlayCB = closedCB;

    }
    function deleteFormData(e) {
        let conf = confirm(`You sure about this bud? ${formID.value}`);

        if (conf) {
            userBackgrounds().deleteEntry(formID.value);
            closeOverlay();
        } else {

        }

    }
    async function closeOverlay(e) {
        overlayDiv.style.display = "none";
        formID.value = null;
        formName.value = null;
        formSourceType.value = null;
        formYTID.value = null;
        closedOverlayCB();

        console.log(await userBackgrounds().getRandom(false));
    }
    function saveFormData(e) {
        e.preventDefault();
        form.removeEventListener('submit', saveFormData);
        if (formID.value !== "new") {
            console.log("Whhhyyhyhyhyhyhyhyhy");
            userBackgrounds().set(formID.value, formName.value, formSourceType.value, formYTID.value).then((data) => {
                console.log(data);
                closeOverlay();

            });

        } else {
            userBackgrounds().newEntry(formName.value,formSourceType.value,formYTID.value).then(
                (res)=>{
                    console.log(res);
                    closeOverlay();
                    
            })
        }
    }
    function isOpen() {
        return overlayDiv.style.display === "none" ? true : false;
    }

    return {
        openOverlay,
        closeOverlay,
        isOpen

    }
}