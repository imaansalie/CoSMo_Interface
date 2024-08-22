import React, {useState, useEffect} from "react";

const languages = [
    {code: 'en', name: 'English'},
    {code: 'sp', name: 'Spanish'},
    {code: 'ba', name: 'Basque'},
    {code: 'ar', name: 'Arabic'}
]

export const Settings = ({selectedLanguage, setSelectedLanguage}) =>{

    const handleChange = (event) =>{
        const newLanguage= event.target.value;
        setSelectedLanguage(newLanguage);
        // console.log("in settings: ", selectedLanguage);
    }

    useEffect(() => {
        console.log("Updated selectedLanguage after render: ", selectedLanguage);
    }, [selectedLanguage]);

    return(
        <div className="settings">
            <select 
                className="language-dropdown"
                id="language-dd"
                value={selectedLanguage}
                onChange={handleChange}
            >
                {languages.map((language) => (
                <option key= {language.code} value ={language.name}>
                    {language.name}
                </option>
            ))}</select>
        </div>
    )
}