
import DocumentView from '../layout/DocumentView.jsx'

var rootRoutes = [
  { 
    path: "/document/:name/:id", 
    name: "Documents", 
    component: DocumentView,
  },
  { 
    path: "/document", 
    name: "Documents", 
    component: DocumentView,
  },
];
export default rootRoutes;