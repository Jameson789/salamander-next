import {Button, Box } from "@mui/material"

export default function StartProcess(){

    const start = () => {
        console.log("starting JAR");
    }
    return (
        <Box sx={{display: "flex", justifyContent:"center"}}>
            <Button sx={{backgroundColor: "lightblue", color: "black", textAlign: "center"}}onClick={start}>Start Process</Button>
        </Box>
    )
}