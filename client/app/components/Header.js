import React from "react";

export class Header extends React.Component {
    render() {
        console.log("Header Child");
        return (
            <div style={{ marginBottom: '25px' }}>
                Welcome To Online E-Book Store
            </div>
        );
    }
}