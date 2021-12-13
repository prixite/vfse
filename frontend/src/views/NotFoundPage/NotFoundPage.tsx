import React from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import "@src/views/NotFoundPage/NotFoundPage.scss";
import Logo404 from "@src/assets/images/Frame404.png";
const NotFoundPage = () => {
    const history = useHistory();
    return (
        <Box component="div" className="Page404">
            <img src={Logo404}/>
            <div className="Page404__content">
                <h3 className="title">URL doesn't exist</h3>
                <p className="description">Looks like you're followed a broken link or entered a URL that doesn't exist on this site.</p>
                <Button className="Backbtn" onClick={()=>history.push("/")}>Go Back</Button>
            </div>
        </Box>
    )
}

export default NotFoundPage
