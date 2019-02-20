
import uuid4 from "uuid"


/**
 * Initialise storage requirements
 */
const setupLocalStorage = () => {
  let filenames = localStorage.getItem('userFilenames')
  if(filenames === null) {
    localStorage.setItem('userFilenames', JSON.stringify([]));
  }
}
setupLocalStorage();


/**
 *  File meta data management
 * 
 * Array 'documentFilenames' loaded at startup an maintained through app lifecycle.
 * 
 */
let documentFilenames = [];
const loadFileMetaFromStorage = () => {
  documentFilenames = JSON.parse(localStorage.getItem('userFilenames'));
}
loadFileMetaFromStorage();


/**
 * @param {*} fileid 
 * 
 * find a file in 'documentFilenames'
 * return array containing fileitem if found with index into documentFilenames array
 * return empty array if not found.
 */
const findFileOnUuid = (fileid) => {
  let fileIndex = -1;
  const arr = documentFilenames.filter((item, index) => {
    if(fileid === item.uuid) {
      fileIndex = index; 
      return item;
    }
  })
  return { arr: arr, index: fileIndex }
}


/**
 * Save document
 * @param {*} uuid 
 * @param {*} data 
 * 
 * if uuid already exists document is updated, otherwise new document is created and saved
 * updates documentFilenames to reflect changes
 */
export const saveDocument = function(newDocument) {

  const upsertFileDataToStorage = (uuid, data) => {
    localStorage.setItem(uuid, JSON.stringify(data));
  }

  const saveFileMetaToStorage = () => {
    localStorage.setItem('userFilenames', JSON.stringify(documentFilenames));
  }
  
  const fileMetaData = findFileOnUuid(newDocument.docId)
  if(fileMetaData.arr.length > 0) {
    // edit file meta
    documentFilenames[fileMetaData.index].name = newDocument.docName;
  }
  else {
    // add file meta
    documentFilenames.push({ name: newDocument.docName, uuid: newDocument.docId})
  }

  saveFileMetaToStorage();
  upsertFileDataToStorage(newDocument.docId, newDocument.docData)

  // call event listeners
  setTimeout(() => {
    eventListeners.forEach((cb) => {
      cb('saved', documentFilenames, newDocument)
    })
  }, 0)
}

/**
 * get called when something happens to storage
 * 
 * callback(activity, 'list of available document's meta data', 'saved document details', )
 */
let eventListeners = [];
export const addEventListener = (cb) => {
  eventListeners.push(cb);
}

/**
 * 
 * @param {*} docId 
 * @param {*} docName 
 * 
 * Return either document data matching docId or a get new document empty document with new uuid 
 */
export const findDocument = (docId, docName) => {
  
  if(docId === undefined) {
    return undefined;
  }

  let fileData = { data: {} };
  let fileMetaItem = findFileOnUuid(docId);
  if(fileMetaItem.arr.length > 0) {
    fileData.name = fileMetaItem.arr[0].name;
    fileData.uuid = fileMetaItem.arr[0].uuid;
  
    const docData = localStorage.getItem(docId);
    if(docData !== null) {
      fileData.data = JSON.parse(docData);
    }
  }
  else {
    // No document found - caller recv new document uuid
    fileData.name = docName || 'untitled';
    fileData.uuid = uuid4.v4();
  }

  return fileData;
}

export const getStorageDocuments = () => {
  return documentFilenames;
}

