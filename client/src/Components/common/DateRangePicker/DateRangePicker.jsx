import {TextField, Button,}from '@mui/material'

const DateRangePicker= ({fromDate,toDate,setFromDate,setToDate,handleDateWiseFilter,handlePrintPDF,page,print})=>{
     return(
          <>
                 <div style={{ padding: 20 }}>
                          <div style={{ display: "flex", gap: "10px", marginBottom: 0, position: 'relative' }}>
                         <TextField
                           label="From Date"
                           type="date"
                           InputLabelProps={{ shrink: true }}
                           value={fromDate}
                           onChange={(e) => setFromDate(e.target.value)}
                         />
                         <TextField
                           label="To Date"
                           type="date"
                           InputLabelProps={{ shrink: true }}
                           value={toDate}
                           onChange={(e) => setToDate(e.target.value)}
                         />
                         <Button variant="contained" onClick={() => { handleDateWiseFilter() }}>Filter</Button>
                       </div>
                      
                     </div>
                      {page==='report' ? ( 
                        <div>
                            <Button disabled={print} sx={{marginLeft:"2rem"}}variant="contained" onClick={handlePrintPDF}>
                                {print ? "Pdf Downloading..." :"Pdf Download"}
                            </Button>
                        </div>):(null)}
          
          </>
    )
}

export default DateRangePicker