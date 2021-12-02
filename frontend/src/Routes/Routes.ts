import Documentation from "@src/views/documentation/Documentation";
import Modality from "@src/views/modality/Modality";
import Organization from "@src/views/organization/Organization";
import User from "@src/views/user/User";
import Vfse from "@src/views/vfse/Vfse";
import Home from "@src/views/home/Home";
import { routeItem } from "@src/helpers/interfaces";
export const Routes : routeItem[] = [
    {   name : "Home",
        path :'/',
        component : Home
    },
    {   name : "3rd party administration",
        path : '/organizations/',
        component : Organization,
    },
    {   name : "Users",
        path : '/users/',
        component : User
    },
    {   name : "Modality",
        path : '/modality/',
        component : Modality
    }
     ,
    {  name : "Documentation",
       path : '/documentation/',
       component : Documentation
    },
    {   name : "vFSE",
        path :'/vfse/',
        component : Vfse
    },

]