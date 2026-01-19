import {TableHead} from "@mui/material";
import LotHeadingRow from "./LotHeadingRow";


const LotTableHeader=(props)=>{
       const {process}=props

    return(

        <>
            
             <TableHead style={{ position: 'sticky', top: "0px", zIndex: 10, backgroundColor: '#d8e3e6', }}  >
                     <LotHeadingRow process={process}/>
            </TableHead>
        </>
    )
}

export default LotTableHeader