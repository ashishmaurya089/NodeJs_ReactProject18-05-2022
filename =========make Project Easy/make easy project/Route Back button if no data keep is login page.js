import React from 'react'
import { Redirect,Route } from "react-router-dom";

const ProtectedRoute = ({component:Component,...rest}) => {
    
    let isAuthenticated = localStorage.getItem('BID')
    console.log(isAuthenticated)
    return (
        <>
            <Route
            {...rest}
            render={(props)=>{
                if(!isAuthenticated){
                    return <Redirect to="/"/>
                }
                return <Component {...props}/>
            }}
            />
        </>
    )
}
export default ProtectedRoute